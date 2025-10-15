import React, { useState, useCallback, useEffect } from 'react';
import { User, PointsEntry, Activity, DirectorScore } from './types';
import { INITIAL_USERS, INITIAL_ACTIVITIES, INITIAL_MENTOR_SCORES } from './constants';

import Header from './components/Header';
import Login from './components/Login';
import PublicView from './components/PublicView';
import AdminDashboard from './components/dashboards/AdminDashboard';
import DirectorDashboard from './components/dashboards/DirectorDashboard';
import MentorDashboard from './components/dashboards/MentorDashboard';

// Helper function to safely get and parse data from localStorage
const getStoredState = <T,>(key: string, fallback: T): T => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch (error) {
        console.error(`Error parsing ${key} from localStorage`, error);
        return fallback;
    }
};

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(() => getStoredState('wff-logo', null));
  const [users, setUsers] = useState<User[]>(() => getStoredState('wff-users', INITIAL_USERS));
  const [activities, setActivities] = useState<Activity[]>(() => getStoredState('wff-activities', INITIAL_ACTIVITIES));
  const [mentorScores, setMentorScores] = useState<PointsEntry[]>(() => getStoredState('wff-mentorScores', INITIAL_MENTOR_SCORES));
  const [directorScores, setDirectorScores] = useState<DirectorScore[]>(() => getStoredState('wff-directorScores', []));
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');


  // --- PERSISTENCE TO LOCALSTORAGE ---
  // A single debounced effect to save all state changes automatically.
  const appState = { logoUrl, users, activities, mentorScores, directorScores };
  useEffect(() => {
    setSaveStatus('saving');
    const handler = setTimeout(() => {
        try {
            localStorage.setItem('wff-logo', JSON.stringify(appState.logoUrl));
            localStorage.setItem('wff-users', JSON.stringify(appState.users));
            localStorage.setItem('wff-activities', JSON.stringify(appState.activities));
            localStorage.setItem('wff-mentorScores', JSON.stringify(appState.mentorScores));
            localStorage.setItem('wff-directorScores', JSON.stringify(appState.directorScores));
            setSaveStatus('saved');
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, 1000); // Debounce saving by 1 second to avoid excessive writes

    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(appState)]); // Use stringify to deep-compare the state


  // --- HANDLERS ---
  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);
  
  const handleMentorSubmission = useCallback((newScores: Omit<PointsEntry, 'id' | 'timestamp'>[]) => {
    if (!currentUser || newScores.length === 0) return;
    
    const activityId = newScores[0].activityId;
    const otherScores = mentorScores.filter(s => !(s.mentor_name === currentUser.username && s.activityId === activityId));
    
    const newScoresWithIds = newScores.map(score => ({
        ...score,
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
    }));

    setMentorScores([...otherScores, ...newScoresWithIds]);
  }, [currentUser, mentorScores]);

  const handleResetData = useCallback(() => {
    if (window.confirm("WARNING: This will delete ALL users, activities, scores, and settings from this browser. The application will be reset to its initial state. This cannot be undone. Are you sure you want to proceed?")) {
        try {
            localStorage.removeItem('wff-logo');
            localStorage.removeItem('wff-users');
            localStorage.removeItem('wff-activities');
            localStorage.removeItem('wff-mentorScores');
            localStorage.removeItem('wff-directorScores');
            window.location.reload(); // Reload to re-initialize state from constants
        } catch (error) {
            console.error("Failed to clear localStorage", error);
            alert("An error occurred while trying to reset data.");
        }
    }
  }, []);

  // --- VIEW RENDERING ---
  const renderContent = () => {
    if (!currentUser) {
        return (
            <>
                <PublicView mentorScores={mentorScores} directorScores={directorScores} activities={activities} />
                <Login users={users} onLogin={handleLogin} />
            </>
        )
    }

    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard 
                    users={users} 
                    setUsers={setUsers}
                    activities={activities}
                    setActivities={setActivities}
                    mentorScores={mentorScores}
                    setMentorScores={setMentorScores}
                    directorScores={directorScores}
                    setDirectorScores={setDirectorScores}
                    logoUrl={logoUrl}
                    setLogoUrl={setLogoUrl}
                    onResetData={handleResetData}
                />;
      case 'director':
        return <DirectorDashboard 
                    activities={activities}
                    directorScores={directorScores}
                    setDirectorScores={setDirectorScores}
                    currentUser={currentUser}
                    mentorScores={mentorScores}
               />;
      case 'mentor':
        return <MentorDashboard 
                    currentUser={currentUser} 
                    activities={activities}
                    myScores={mentorScores.filter(s => s.mentor_name === currentUser.username)}
                    onFormSubmit={handleMentorSubmission}
                />;
      default:
        return <PublicView mentorScores={mentorScores} directorScores={directorScores} activities={activities} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header currentUser={currentUser} onLogout={handleLogout} logoUrl={logoUrl} saveStatus={saveStatus} />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;