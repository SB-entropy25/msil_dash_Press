import pandas as pd
import numpy as np
from scipy import stats
import os
import threading
from functools import lru_cache
from filelock import FileLock, Timeout

_cache_lock = threading.Lock() # RAM Memory Lock

def _lock_path_for(filepath: str) -> str:
    base, _ = os.path.splitext(filepath)
    return base + ".lock"

# @lru_cache stores the cleaned data in RAM. It only reads the hard drive if 'modified_time' changes.
@lru_cache(maxsize=8)
def _cached_data_load(filepath: str, modified_time: float) -> pd.DataFrame:
    # 1. HARD DRIVE LOCK: If someone is uploading, wait up to 45 seconds before reading.
    file_lock = FileLock(_lock_path_for(filepath), timeout=45) 
    
    try:
        with file_lock:
            # 2. DYNAMIC HEADER SCANNER: Finds the exact row where data starts
            raw_check = pd.read_excel(filepath, engine='openpyxl', header=None, nrows=20)
            header_row = 0
            for idx in range(len(raw_check)):
                if raw_check.iloc[idx].astype(str).str.contains("Inspection Lot", case=False, na=False).any():
                    header_row = idx
                    break
            raw = pd.read_excel(filepath, engine='openpyxl', header=header_row)
    except Timeout:
        print("Read Error: Database locked by an active upload.")
        return pd.DataFrame()
    except Exception: 
        return pd.DataFrame()

    raw = raw.dropna(how="all")
    raw.columns = raw.columns.astype(str).str.strip()
    
    # 3. STRICT FORMATTING: Forcing Pandas to understand SAP date and number formats
    if "Inspection Lot Date" in raw.columns:
        raw["Inspection Lot Date"] = pd.to_datetime(raw["Inspection Lot Date"], dayfirst=True, errors="coerce")
    if "Result Recorded" in raw.columns:
        raw["Result Recorded"] = pd.to_numeric(raw["Result Recorded"], errors="coerce")
    if "Lower Limit" in raw.columns:
        raw["Lower Limit"]     = pd.to_numeric(raw["Lower Limit"],     errors="coerce")
    if "Upper Limit" in raw.columns:
        raw["Upper Limit"]     = pd.to_numeric(raw["Upper Limit"],     errors="coerce")
    if "Inspection Lot" in raw.columns:
        raw["Inspection Lot"]  = pd.to_numeric(raw["Inspection Lot"],  errors="coerce")

    # 4. WEIGHT EXTRACTION: Extracts numbers from "1,000 KG" strings
    exact_match = [c for c in raw.columns if str(c).lower() == "inspection lot qty"]
    if exact_match: weight_col = exact_match[0]
    else:
        fallback = [c for c in raw.columns if "qty" in str(c).lower()]
        weight_col = fallback[0] if fallback else None

    weight_map = pd.Series(dtype=float)
    if weight_col:
        clean_text = raw[weight_col].astype(str).str.replace(',', '', regex=False)
        extracted_nums = clean_text.str.extract(r'(\d+\.?\d*)')[0]
        raw["_Clean_Wt"] = pd.to_numeric(extracted_nums, errors="coerce")
        weight_map = raw.dropna(subset=["_Clean_Wt"]).drop_duplicates("Inspection Lot").set_index("Inspection Lot")["_Clean_Wt"]

    # 5. PIVOTING: Turning long vertical data into wide horizontal rows (1 row per lot)
    PARAMS = {"YIELD POINT": "Yield_Point", "% ELONGATION": "Elongation", "ULTIMATE TENSILE STRENGTH": "UTS", "% CARBON": "Carbon_pct"}
    dfs = []
    for raw_key, col_name in PARAMS.items():
        cols_to_keep = ["Inspection Lot","Inspection Lot Date","Material Number","Material Description","Supplier Name","Result Recorded","Lower Limit","Upper Limit"]
        cols_to_keep = [c for c in cols_to_keep if c in raw.columns]
        
        if "Check Point Desc" in raw.columns:
            sub = raw[raw["Check Point Desc"] == raw_key][cols_to_keep].rename(columns={"Result Recorded": col_name, "Lower Limit": f"{col_name}_LL", "Upper Limit": f"{col_name}_UL"})
            if not sub.empty: dfs.append(sub)

    if not dfs: return pd.DataFrame()

    pivot = dfs[0]
    for d in dfs[1:]:
        pivot = pivot.merge(d, on=["Inspection Lot","Inspection Lot Date","Material Number","Material Description","Supplier Name"], how="outer")

    # Mapping Weights and calculating TSYP
    if not weight_map.empty and "Inspection Lot" in pivot.columns:
        pivot["Inspection Lot Qty"] = pivot["Inspection Lot"].map(weight_map)
        pivot["Weight_Tons"] = pivot["Inspection Lot Qty"] / 1000.0
    else:
        pivot["Inspection Lot Qty"] = np.nan
        pivot["Weight_Tons"] = 0.0

    if "Yield_Point" in pivot.columns and "UTS" in pivot.columns:
        pivot["TSYP"] = np.where((pivot["Yield_Point"] > 0) & pivot["Yield_Point"].notna(), pivot["UTS"] / pivot["Yield_Point"], np.nan)
    else:
        pivot["TSYP"] = np.nan

    pivot = pivot.dropna(subset=["Inspection Lot Date"])
    pivot["Inspection Lot"] = pivot["Inspection Lot"].astype(str)
    
    if "Supplier Name" in pivot.columns: pivot["Supplier Name"] = pivot["Supplier Name"].astype(str).str.strip()
    if "Material Number" in pivot.columns and "Material Description" in pivot.columns:
        pivot["Material_Display"] = pivot["Material Number"].astype(str).str.strip() + " - " + pivot["Material Description"].astype(str).str.strip()
    else:
        pivot["Material_Display"] = "Unknown Material"

    # 6. ALERT GENERATION: Identify lots that failed specs
    pivot['OOS_Reasons'] = [[] for _ in range(len(pivot))]
    pivot['is_OOS'] = False

    for idx, row in pivot.iterrows():
        reasons = []
        if pd.notna(row.get('Yield_Point')) and pd.notna(row.get('Yield_Point_UL')) and row['Yield_Point'] >= row['Yield_Point_UL']: reasons.append("Yield >= UL")
        if pd.notna(row.get('Carbon_pct')) and pd.notna(row.get('Carbon_pct_UL')) and row['Carbon_pct'] >= row['Carbon_pct_UL']: reasons.append("Carbon >= UL")
        if pd.notna(row.get('Elongation')) and pd.notna(row.get('Elongation_LL')) and row['Elongation'] <= row['Elongation_LL']: reasons.append("Elongation <= LL")
        if pd.notna(row.get('UTS')):
            if pd.notna(row.get('UTS_LL')) and row['UTS'] <= row['UTS_LL']: reasons.append("UTS <= LL")
            if pd.notna(row.get('UTS_UL')) and row['UTS'] >= row['UTS_UL']: reasons.append("UTS >= UL")
        if pd.notna(row.get('TSYP')) and row['TSYP'] < 1.15: reasons.append("TSYP < 1.15")

        if reasons:
            pivot.at[idx, 'OOS_Reasons'] = reasons
            pivot.at[idx, 'is_OOS'] = True

    return pivot

def load_and_clean_data(filepath: str) -> pd.DataFrame:
    """Entry point: Checks file modification time and safely locks threads."""
    if not os.path.exists(filepath): 
        return pd.DataFrame()
    
    current_mtime = os.path.getmtime(filepath)
    
    # RAM MEMORY LOCK: Prevents multiple API calls from spiking CPU on boot
    with _cache_lock:
        return _cached_data_load(filepath, current_mtime)

def filter_outliers(series: pd.Series) -> pd.Series:
    clean_s = series.dropna()
    return clean_s if len(clean_s) < 3 else clean_s[np.abs(stats.zscore(clean_s)) < 3]

def process_metrics_and_alerts(df: pd.DataFrame):
    if df.empty: return {"kpis": {}, "alerts": [], "distributions": {}}

    kpis = {
        "avg_weight": round(df['Weight_Tons'].mean(), 2) if 'Weight_Tons' in df.columns else 0.0,
        "avg_tsyp": round(df['TSYP'].mean(), 2) if 'TSYP' in df.columns else 0.0,
        "std_tsyp": round(df['TSYP'].std(), 3) if 'TSYP' in df.columns and len(df) > 1 else 0.0,
        "avg_yield": round(df['Yield_Point'].mean(), 1) if 'Yield_Point' in df.columns else 0.0,
        "avg_uts": round(df['UTS'].mean(), 1) if 'UTS' in df.columns else 0.0,
        "avg_elongation": round(df['Elongation'].mean(), 1) if 'Elongation' in df.columns else 0.0,
        "avg_carbon": round(df['Carbon_pct'].mean(), 4) if 'Carbon_pct' in df.columns else 0.0,
        "total_oos": int(df['is_OOS'].sum())
    }
    for k, v in kpis.items():
        if pd.isna(v): kpis[k] = 0

    alerts_list = [{"lot": str(r['Inspection Lot']), "date": r['Inspection Lot Date'].strftime('%d-%b-%Y') if pd.notna(r['Inspection Lot Date']) else "", "material": r['Material_Display'], "supplier": str(r.get('Supplier Name', '')), "reasons": r['OOS_Reasons']} for _, r in df[df['is_OOS'] == True].iterrows()]

    distributions = {}
    for m in ['Yield_Point', 'UTS', 'Elongation', 'Carbon_pct', 'TSYP']:
        if m in df.columns:
            c = filter_outliers(df[m])
            if not c.empty and len(c) > 1: distributions[m] = {"mean": round(c.mean(), 4), "std": round(c.std(), 4)}

    return {"kpis": kpis, "alerts": alerts_list, "distributions": distributions}