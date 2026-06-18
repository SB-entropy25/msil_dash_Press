"""One-time script to generate plant_credentials.xlsx in backend/data/."""
import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

credentials = pd.DataFrame([
    {"Plant ID": "manesar", "Plant Display Name": "Press Manesar", "Password": "Manesar@2026"},
    {"Plant ID": "gurgaon", "Plant Display Name": "Press Gurgaon", "Password": "Gurgaon@2026"},
    {"Plant ID": "kadkhoda", "Plant Display Name": "Press Kadkhoda", "Password": "Kadkhoda@2026"},
    {"Plant ID": "gujarat", "Plant Display Name": "Press Gujarat", "Password": "Gujarat@2026"},
])

out_path = os.path.join(DATA_DIR, "plant_credentials.xlsx")
credentials.to_excel(out_path, index=False)
print(f"Created {out_path}")
