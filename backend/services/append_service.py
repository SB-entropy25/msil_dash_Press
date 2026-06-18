import pandas as pd
import os
import shutil
from datetime import datetime
from filelock import FileLock, Timeout

from services.plant_config import get_master_path, get_log_path, get_lock_path, get_backup_dir

# Strips whitespace and .0 from numbers so duplicate matching is 100% accurate
def normalize_value(x):
    if pd.isna(x): return ""
    try:
        num = float(x)
        return str(int(num)) if num.is_integer() else str(x).strip()
    except: return str(x).strip()

def load_excel(file_content):
    if hasattr(file_content, "seek"): file_content.seek(0)
    raw = pd.read_excel(file_content, header=None)
    header_row = None
    for idx in range(len(raw)):
        row = raw.iloc[idx].astype(str)
        if row.str.contains("Inspection Lot", case=False, na=False).any():
            header_row = idx
            break
    if header_row is None: raise ValueError("Could not find Inspection Lot column.")
    if hasattr(file_content, "seek"): file_content.seek(0)
    df = pd.read_excel(file_content, header=header_row)
    df = df.dropna(how="all")
    df.columns = df.columns.astype(str).str.strip()
    return df

def preview_append(file_bytes, plant_id: str):
    master_file = get_master_path(plant_id)
    if not os.path.exists(master_file): return {"error": "Master file not found"}
    master_df = load_excel(master_file)
    monthly_df = load_excel(file_bytes)

    for df in [master_df, monthly_df]:
        df["Inspection Lot"] = df["Inspection Lot"].apply(normalize_value)
        df["Check Item"] = df["Check Item"].apply(normalize_value)

    monthly_df = monthly_df.drop_duplicates(subset=["Inspection Lot", "Check Item"])
    master_df["UNIQUE_KEY"] = master_df["Inspection Lot"] + "_" + master_df["Check Item"]
    monthly_df["UNIQUE_KEY"] = monthly_df["Inspection Lot"] + "_" + monthly_df["Check Item"]

    new_rows = monthly_df[~monthly_df["UNIQUE_KEY"].isin(master_df["UNIQUE_KEY"])].copy()
    ignored_rows = monthly_df[monthly_df["UNIQUE_KEY"].isin(master_df["UNIQUE_KEY"])].copy()

    if "UNIQUE_KEY" in new_rows.columns: new_rows.drop(columns=["UNIQUE_KEY"], inplace=True)
    if "UNIQUE_KEY" in ignored_rows.columns: ignored_rows.drop(columns=["UNIQUE_KEY"], inplace=True)

    return {
        "master_before": int(len(master_df)),
        "monthly_rows": int(len(monthly_df)),
        "rows_added": int(len(new_rows)),
        "rows_ignored": int(len(ignored_rows)),
        "master_after": int(len(master_df) + len(new_rows)),
        "preview_added": new_rows.head(100).fillna("").astype(str).to_dict(orient="records")
    }

def commit_append(file_bytes, filename, plant_id: str):
    master_file = get_master_path(plant_id)
    log_file = get_log_path(plant_id)
    lock_file = get_lock_path(plant_id)
    backup_folder = get_backup_dir(plant_id)

    master_df = load_excel(master_file)
    monthly_df = load_excel(file_bytes)

    for df in [master_df, monthly_df]:
        df["Inspection Lot"] = df["Inspection Lot"].apply(normalize_value)
        df["Check Item"] = df["Check Item"].apply(normalize_value)

    monthly_df = monthly_df.drop_duplicates(subset=["Inspection Lot", "Check Item"])
    master_df["UNIQUE_KEY"] = master_df["Inspection Lot"] + "_" + master_df["Check Item"]
    monthly_df["UNIQUE_KEY"] = monthly_df["Inspection Lot"] + "_" + monthly_df["Check Item"]

    new_rows = monthly_df[~monthly_df["UNIQUE_KEY"].isin(master_df["UNIQUE_KEY"])].copy()
    ignored_rows = monthly_df[monthly_df["UNIQUE_KEY"].isin(master_df["UNIQUE_KEY"])].copy()
    master_before = len(master_df)

    updated_master = pd.concat([master_df, new_rows], ignore_index=True)
    master_after = len(updated_master)

    if "UNIQUE_KEY" in updated_master.columns: updated_master.drop(columns=["UNIQUE_KEY"], inplace=True)

    lock = FileLock(lock_file, timeout=45)
    try:
        with lock:
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = os.path.join(backup_folder, f"master_backup_{ts}.xlsx")

            if os.path.exists(master_file): shutil.copy(master_file, backup_file)

            try:
                updated_master.to_excel(master_file, index=False)
            except PermissionError:
                return {"error": "PERMISSION ERROR: Please close the Master File in Excel before appending!"}

            if os.path.exists(log_file): log_df = pd.read_excel(log_file)
            else: log_df = pd.DataFrame(columns=["Transaction No","Timestamp","User","Monthly File","Rows Added","Rows Ignored","Master Before","Master After","Backup File"])

            trx = "TRN000001" if len(log_df) == 0 else f"TRN{int(str(log_df.iloc[-1]['Transaction No']).replace('TRN',''))+1:06d}"

            log_df.loc[len(log_df)] = [
                trx, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "admin", filename,
                len(new_rows), len(ignored_rows), master_before, master_after, os.path.basename(backup_file)
            ]
            log_df.to_excel(log_file, index=False)

            return {"transaction": trx, "rows_added": int(len(new_rows)), "rows_ignored": int(len(ignored_rows)), "backup_file": os.path.basename(backup_file)}

    except Timeout:
        return {"error": "System is busy processing another user's upload. Please wait."}

def get_history(plant_id: str):
    log_file = get_log_path(plant_id)
    if not os.path.exists(log_file): return []
    df = pd.read_excel(log_file)
    return df.tail(10).fillna("").astype(str).to_dict(orient="records")

def restore_latest(plant_id: str):
    backup_folder = get_backup_dir(plant_id)
    master_file = get_master_path(plant_id)
    lock_file = get_lock_path(plant_id)

    backups = sorted([f for f in os.listdir(backup_folder) if f.endswith(".xlsx")], reverse=True)
    if not backups: return {"error": "No backups found."}
    latest = os.path.join(backup_folder, backups[0])

    lock = FileLock(lock_file, timeout=45)
    try:
        with lock:
            try:
                shutil.copy(latest, master_file)
                return {"success": f"Restored {backups[0]}"}
            except PermissionError:
                return {"error": "PERMISSION ERROR: Close the Master File in Excel first!"}
    except Timeout:
        return {"error": "System is busy processing another update."}

def get_log_download_path(plant_id: str) -> str:
    return get_log_path(plant_id)
