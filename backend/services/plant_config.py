import os
import shutil

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

PLANTS = {
    "manesar": {
        "id": "manesar",
        "display_name": "Press Manesar",
        "master_file": "master_file_manesar.xlsx",
        "transaction_log": "transaction_log_manesar.xlsx",
        "backup_subdir": "manesar",
        "lock_file": "master_file_manesar.lock",
        "accent": "#0ea5e9",
    },
    "gurgaon": {
        "id": "gurgaon",
        "display_name": "Press Gurgaon",
        "master_file": "master_file_ggn.xlsx",
        "transaction_log": "transaction_log_ggn.xlsx",
        "backup_subdir": "gurgaon",
        "lock_file": "master_file_ggn.lock",
        "accent": "#6366f1",
    },
    "kharkhoda": {
        "id": "kharkhoda",
        "display_name": "Press Kharkhoda",
        "master_file": "master_file_kharkhoda.xlsx",
        "transaction_log": "transaction_log_kharkhoda.xlsx",
        "backup_subdir": "kharkhoda",
        "lock_file": "master_file_kharkhoda.lock",
        "accent": "#f59e0b",
    },
    "hansalpur": {
        "id": "hansalpur",
        "display_name": "Press Hansalpur",
        "master_file": "master_file_hansalpur.xlsx",
        "transaction_log": "transaction_log_hansalpur.xlsx",
        "backup_subdir": "hansalpur",
        "lock_file": "master_file_hansalpur.lock",
        "accent": "#10b981",
    },
}
#
CREDENTIALS_FILE = os.path.join(DATA_DIR, "plant_credentials.xlsx")

# Legacy single-file names migrated on first access
_LEGACY_MASTER = os.path.join(DATA_DIR, "Master_File.xlsx")
_LEGACY_MASTER_ALT = os.path.join(DATA_DIR, "master.xlsx")


def get_plant(plant_id: str):
    if plant_id not in PLANTS:
        return None
    return PLANTS[plant_id]


def list_plants():
    return [
        {
            "id": p["id"],
            "display_name": p["display_name"],
            "accent": p["accent"],
            "master_file": p["master_file"],
        }
        for p in PLANTS.values()
    ]


def _migrate_legacy_master(target_path: str):
    """Copy legacy Master_File.xlsx to master_file_ggn.xlsx if needed."""
    if os.path.exists(target_path):
        return
    for legacy in (_LEGACY_MASTER, _LEGACY_MASTER_ALT):
        if os.path.exists(legacy):
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            shutil.copy(legacy, target_path)
            return


def get_master_path(plant_id: str) -> str:
    plant = get_plant(plant_id)
    if not plant:
        raise ValueError(f"Unknown plant: {plant_id}")
    path = os.path.join(DATA_DIR, plant["master_file"])
    if plant_id == "gurgaon":
        _migrate_legacy_master(path)
    return path


def get_log_path(plant_id: str) -> str:
    plant = get_plant(plant_id)
    return os.path.join(DATA_DIR, plant["transaction_log"])


def get_lock_path(plant_id: str) -> str:
    plant = get_plant(plant_id)
    return os.path.join(DATA_DIR, plant["lock_file"])


def get_backup_dir(plant_id: str) -> str:
    plant = get_plant(plant_id)
    path = os.path.join(BASE_DIR, "backups", plant["backup_subdir"])
    os.makedirs(path, exist_ok=True)
    return path
