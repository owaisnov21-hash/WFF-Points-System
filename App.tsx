import React, { useState, useCallback } from 'react';
import { User, PointsEntry, Activity, DirectorScore } from './types';
import { INITIAL_USERS, INITIAL_ACTIVITIES, INITIAL_MENTOR_SCORES } from './constants';

import Header from './components/Header';
import Login from './components/Login';
import PublicView from './components/PublicView';
import AdminDashboard from './components/dashboards/AdminDashboard';
import DirectorDashboard from './components/dashboards/DirectorDashboard';
import MentorDashboard from './components/dashboards/MentorDashboard';

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [mentorScores, setMentorScores] = useState<PointsEntry[]>(INITIAL_MENTOR_SCORES);
  const [directorScores, setDirectorScores] = useState<DirectorScore[]>([]);

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
                    setLogoUrl={setLogoUrl}
                />;
      case 'director':
        return <DirectorDashboard 
                    activities={activities}
                    setActivities={setActivities}
                    directorScores={directorScores}
                    setDirectorScores={setDirectorScores}
                    currentUser={currentUser}
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
      <Header currentUser={currentUser} onLogout={handleLogout} logoUrl={logoUrl} />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;