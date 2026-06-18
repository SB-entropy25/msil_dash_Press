import React, { useState, useEffect, useCallback } from 'react';
import PlantLanding from './components/PlantLanding';
import PlantAuth from './components/PlantAuth';
import MaterialInspection from './index';
import { fetchPlants, getStoredPlantInfo, isAuthenticated, clearSession } from './api/client';

const App = () => {
    const [view, setView] = useState('landing');
    const [plants, setPlants] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [plantInfo, setPlantInfo] = useState(null);

    useEffect(() => {
        fetchPlants().then(setPlants).catch(() => setPlants([]));
    }, []);

    useEffect(() => {
        if (isAuthenticated()) {
            const stored = getStoredPlantInfo();
            if (stored) {
                setPlantInfo(stored);
                setView('dashboard');
            }
        }
    }, []);

    const handleAuthExpired = useCallback(() => {
        setPlantInfo(null);
        setSelectedPlant(null);
        setView('landing');
    }, []);

    useEffect(() => {
        window.addEventListener('mi-auth-expired', handleAuthExpired);
        return () => window.removeEventListener('mi-auth-expired', handleAuthExpired);
    }, [handleAuthExpired]);

    const handleSelectPlant = (plant) => {
        setSelectedPlant(plant);
        setView('auth');
    };

    const handleLoginSuccess = (data) => {
        setPlantInfo({
            plant: data.plant,
            display_name: data.display_name,
            master_file: data.master_file,
        });
        setView('dashboard');
    };

    const handleLogout = () => {
        clearSession();
        setPlantInfo(null);
        setSelectedPlant(null);
        setView('landing');
    };

    if (view === 'landing') {
        return <PlantLanding plants={plants} onSelectPlant={handleSelectPlant} />;
    }

    if (view === 'auth' && selectedPlant) {
        return (
            <PlantAuth
                plant={selectedPlant}
                onSuccess={handleLoginSuccess}
                onBack={() => { setSelectedPlant(null); setView('landing'); }}
            />
        );
    }

    if (view === 'dashboard' && plantInfo) {
        return <MaterialInspection plantInfo={plantInfo} onLogout={handleLogout} />;
    }

    return <PlantLanding plants={plants} onSelectPlant={handleSelectPlant} />;
};

export default App;
