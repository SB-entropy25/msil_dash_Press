import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
BACKUP_DIR = os.path.join(BASE_DIR, "backups")

PLANTS = {
    "manesar": {
        "id": "manesar",
        "name": "Press Manesar",
        "master_file": "master_file_manesar.xlsx",
        "transaction_log": "transaction_log_manesar.xlsx",
    },
    "gurgaon": {
        "id": "gurgaon",
        "name": "Press Gurgaon",
        "master_file": "master_file_ggn.xlsx",
        "transaction_log": "transaction_log_ggn.xlsx",
    },
    "kadhkhoda": {
        "id": "kadhkhoda",
        "name": "Press Kadkhoda",
        "master_file": "master_file_kadhkhoda.xlsx",
        "transaction_log": "transaction_log_kadhkhoda.xlsx",
    },
}


def get_plant(plant_id: str) -> dict:
    if plant_id not in PLANTS:
        raise ValueError(f"Unknown plant: {plant_id}")
    return PLANTS[plant_id]


def get_plant_paths(plant_id: str) -> dict:
    plant = get_plant(plant_id)
    plant_data_dir = os.path.join(DATA_DIR, plant_id)
    plant_backup_dir = os.path.join(BACKUP_DIR, plant_id)
    master_filename = plant["master_file"]

    os.makedirs(plant_data_dir, exist_ok=True)
    os.makedirs(plant_backup_dir, exist_ok=True)

    return {
        "plant": plant,
        "data_dir": plant_data_dir,
        "backup_dir": plant_backup_dir,
        "master_file": os.path.join(plant_data_dir, master_filename),
        "lock_file": os.path.join(plant_data_dir, f"{master_filename}.lock"),
        "log_file": os.path.join(plant_data_dir, plant["transaction_log"]),
    }
