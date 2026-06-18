from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
import pandas as pd
import numpy as np
import io
import math
import os

from services.data_processor import load_and_clean_data, process_metrics_and_alerts
from services.append_service import preview_append, commit_append, get_history, restore_latest, get_log_download_path
from services.plant_config import get_master_path, get_plant, list_plants
from services.auth_service import login, verify_append_access, require_read, require_write

app = FastAPI(title="Prodigi Material Inspection API")

TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.1.50",
    "http://10.0.5.22"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=TRUSTED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class LoginRequest(BaseModel):
    plant: str
    password: str

class AppendAuthRequest(BaseModel):
    password: str

class DashboardFilters(BaseModel):
    startDate: str; endDate: str; materials: Optional[List[str]] = []; suppliers: Optional[List[str]] = []

class DailyMonitorRequest(BaseModel):
    date: str

def safe_json(val):
    if pd.isna(val) or val is None: return ""
    if isinstance(val, (int, float)):
        if math.isnan(val) or math.isinf(val): return ""
    if isinstance(val, (np.int64, np.int32)): return int(val)
    if isinstance(val, (np.float64, np.float32)):
        if np.isnan(val) or np.isinf(val): return ""
        return float(val)
    return str(val) if not isinstance(val, str) else val


# =========================================================
# PUBLIC ENDPOINTS
# =========================================================

@app.get("/api/plants")
def get_plants():
    return {"plants": list_plants()}

@app.post("/api/auth/login")
def auth_login(req: LoginRequest):
    return login(req.plant.strip().lower(), req.password)

@app.post("/api/auth/verify-append")
def auth_verify_append(req: AppendAuthRequest, auth=Depends(require_read)):
    return verify_append_access(auth["plant_id"], req.password)


# =========================================================
# PROTECTED DATA ENDPOINTS (read scope)
# =========================================================

@app.get("/api/options")
def get_options(auth=Depends(require_read)):
    plant_id = auth["plant_id"]
    filepath = get_master_path(plant_id)
    df = load_and_clean_data(filepath)
    if df.empty: return {"materials": [], "suppliers": []}
    return {
        "materials": sorted(df['Material_Display'].dropna().unique().tolist()),
        "suppliers": sorted(df['Supplier Name'].dropna().unique().tolist()) if 'Supplier Name' in df.columns else []
    }

@app.post("/api/dashboard")
def get_dashboard_data(filters: DashboardFilters, auth=Depends(require_read)):
    plant_id = auth["plant_id"]
    plant = get_plant(plant_id)
    try:
        filepath = get_master_path(plant_id)
        df_raw = load_and_clean_data(filepath)

        if df_raw.empty:
            return {"kpis": None, "alerts": [], "distributions": {}, "chart_data": [], "table_data": [], "db_info": {"plant": plant_id, "master_file": plant["master_file"], "total_lots": 0, "total_rows": 0}}

        total_db_lots = int(df_raw['Inspection Lot'].nunique())
        total_db_rows = int(len(df_raw))

        df = df_raw[(df_raw['Inspection Lot Date'] >= filters.startDate) & (df_raw['Inspection Lot Date'] <= filters.endDate)]

        if filters.materials: df = df[df['Material_Display'].isin(filters.materials)]
        elif filters.suppliers: df = df[df['Supplier Name'].isin(filters.suppliers)]

        if 'Inspection Lot' in df.columns: df = df.sort_values(by=['Inspection Lot'], ascending=True)

        analysis = process_metrics_and_alerts(df)

        cols = ['Inspection Lot Date', 'Inspection Lot', 'Supplier Name', 'Material_Display', 'Yield_Point', 'UTS', 'Elongation', 'Carbon_pct', 'TSYP', 'Yield_Point_LL', 'Yield_Point_UL', 'UTS_LL', 'UTS_UL', 'Elongation_LL', 'Carbon_pct_UL', 'is_OOS']
        existing_cols = [c for c in cols if c in df.columns]

        df_serialized = df.copy()
        df_serialized['Inspection Lot Date'] = df_serialized['Inspection Lot Date'].dt.strftime('%Y-%m-%d')

        data_dict = [{k: safe_json(v) for k, v in row.items()} for _, row in df_serialized[existing_cols].iterrows()]

        return {**analysis, "chart_data": data_dict, "table_data": data_dict, "db_info": {"plant": plant_id, "master_file": plant["master_file"], "total_lots": total_db_lots, "total_rows": total_db_rows}}
    except Exception:
        return {"kpis": None, "alerts": [], "distributions": {}, "chart_data": [], "table_data": [], "db_info": {"plant": plant_id, "master_file": plant["master_file"], "total_lots": 0, "total_rows": 0}}

@app.post("/api/daily-monitor")
def get_daily_monitor(req: DailyMonitorRequest, auth=Depends(require_read)):
    plant_id = auth["plant_id"]
    try:
        filepath = get_master_path(plant_id)
        df = load_and_clean_data(filepath)
        empty_resp = {"total_lots": 0, "materials": 0, "suppliers": 0, "oos": 0, "supplier_chips": [], "material_list": [], "daily_lots": []}
        if df.empty: return empty_resp

        df['Date_Str'] = df['Inspection Lot Date'].dt.strftime('%Y-%m-%d')
        day_df = df[df['Date_Str'] == req.date].copy()
        if day_df.empty: return empty_resp

        warn_mask = pd.Series(False, index=day_df.index)
        if 'Yield_Point' in day_df and 'Yield_Point_UL' in day_df:
            warn_mask |= (pd.to_numeric(day_df['Yield_Point'], errors='coerce') >= 0.9 * pd.to_numeric(day_df['Yield_Point_UL'], errors='coerce')) & (pd.to_numeric(day_df['Yield_Point'], errors='coerce') < pd.to_numeric(day_df['Yield_Point_UL'], errors='coerce'))
        if 'Carbon_pct' in day_df and 'Carbon_pct_UL' in day_df:
            warn_mask |= (pd.to_numeric(day_df['Carbon_pct'], errors='coerce') >= 0.9 * pd.to_numeric(day_df['Carbon_pct_UL'], errors='coerce')) & (pd.to_numeric(day_df['Carbon_pct'], errors='coerce') < pd.to_numeric(day_df['Carbon_pct_UL'], errors='coerce'))
        if 'Elongation' in day_df and 'Elongation_LL' in day_df:
            warn_mask |= (pd.to_numeric(day_df['Elongation'], errors='coerce') <= 1.1 * pd.to_numeric(day_df['Elongation_LL'], errors='coerce')) & (pd.to_numeric(day_df['Elongation'], errors='coerce') > pd.to_numeric(day_df['Elongation_LL'], errors='coerce'))
        if 'TSYP' in day_df:
            warn_mask |= (pd.to_numeric(day_df['TSYP'], errors='coerce') <= 1.20) & (pd.to_numeric(day_df['TSYP'], errors='coerce') >= 1.15)

        day_df['is_Warn'] = warn_mask

        supplier_chips = []
        if 'Supplier Name' in day_df.columns:
            for sup, group in day_df.groupby('Supplier Name', dropna=False):
                sup_lots = int(group['Inspection Lot'].nunique())
                sup_oos = int(group[group['is_OOS'] == True]['Inspection Lot'].nunique()) if 'is_OOS' in group.columns else 0
                sup_warn = int(group[(group['is_Warn'] == True) & (group['is_OOS'] == False)]['Inspection Lot'].nunique()) if 'is_Warn' in group.columns else 0
                status = 'CRIT' if sup_oos > 0 else ('CAUT' if sup_warn > 0 else 'SAFE')
                supplier_chips.append({"name": str(sup), "lots": sup_lots, "oos": sup_oos, "warns": sup_warn, "status": status})

        daily_lots = [{"lot": str(r.get('Inspection Lot', 'N/A')), "material": str(r.get('Material_Display', 'N/A')), "supplier": str(r.get('Supplier Name', 'N/A')), "status": 'CRIT' if r.get('is_OOS') else ('CAUT' if r.get('is_Warn') else 'SAFE')} for _, r in day_df.iterrows()]

        return {
            "total_lots": int(day_df['Inspection Lot'].nunique()), "materials": int(day_df['Material_Display'].nunique()),
            "suppliers": int(day_df['Supplier Name'].nunique()) if 'Supplier Name' in day_df.columns else 0,
            "oos": int(day_df[day_df['is_OOS'] == True]['Inspection Lot'].nunique()) if 'is_OOS' in day_df.columns else 0,
            "supplier_chips": sorted(supplier_chips, key=lambda x: (x['status'] == 'CRIT', x['status'] == 'CAUT', x['lots']), reverse=True),
            "material_list": [], "daily_lots": sorted(daily_lots, key=lambda x: (x['status'] == 'CRIT', x['status'] == 'CAUT'), reverse=True)
        }
    except Exception:
        return {"total_lots": 0, "materials": 0, "suppliers": 0, "oos": 0, "supplier_chips": [], "material_list": [], "daily_lots": []}


# =========================================================
# PROTECTED APPEND ENDPOINTS (write scope)
# =========================================================

@app.post("/api/append/preview")
def api_preview_append(file: UploadFile = File(...), auth=Depends(require_write)):
    contents = file.file.read()
    return preview_append(io.BytesIO(contents), auth["plant_id"])

@app.post("/api/append/commit")
def api_commit_append(file: UploadFile = File(...), auth=Depends(require_write)):
    contents = file.file.read()
    return commit_append(io.BytesIO(contents), file.filename, auth["plant_id"])

@app.get("/api/append/history")
def api_get_history(auth=Depends(require_write)):
    return get_history(auth["plant_id"])

@app.post("/api/append/restore")
def api_restore(auth=Depends(require_write)):
    return restore_latest(auth["plant_id"])

@app.get("/api/append/download-log")
def api_download_log(auth=Depends(require_write)):
    log_path = get_log_download_path(auth["plant_id"])
    plant = get_plant(auth["plant_id"])
    if os.path.exists(log_path):
        return FileResponse(path=log_path, filename=plant["transaction_log"])
    raise HTTPException(status_code=404, detail="Log not found")
