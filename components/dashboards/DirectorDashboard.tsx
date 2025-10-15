import React, { useState } from 'react';
import { Activity, DirectorScore, User } from '../../types';
import { COUNTRIES } from '../../constants';

interface DirectorDashboardProps {
    activities: Activity[];
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
    directorScores: DirectorScore[];
    setDirectorScores: React.Dispatch<React.SetStateAction<DirectorScore[]>>;
    currentUser: User;
}

const DirectorDashboard: React.FC<DirectorDashboardProps> = ({ activities, setActivities, directorScores, setDirectorScores, currentUser }) => {
    const [view, setView] = useState('award');
    
    const [newActivity, setNewActivity] = useState({ name: '', maxPoints: 10 });
    const [scoreAward, setScoreAward] = useState({ team: '', activityId: '', points: 0 });
    
    const directAwardActivities = activities.filter(a => a.type === 'direct');

    const handleAddActivity = () => {
        if (!newActivity.name || newActivity.maxPoints <= 0) {
            alert('Activity Name and valid Max Points are required.');
            return;
        }
        setActivities(prev => [...prev, { 
            ...newActivity, 
            id: `activity-${Date.now()}`, 
            type: 'direct',
            createdBy: currentUser.username 
        }]);
        setNewActivity({ name: '', maxPoints: 10 });
    };
    
    const handleAwardScore = () => {
        const activity = activities.find(a => a.id === scoreAward.activityId);
        if (!scoreAward.team || !activity || !activity.maxPoints) {
            alert('Please select a team and a valid activity.');
            return;
        }
        const points = Math.max(0, Math.min(scoreAward.points, activity.maxPoints));
        
        setDirectorScores(prev => [...prev, {
            id: Date.now(),
            activityId: activity.id,
            team_country: scoreAward.team,
            points,
            awardedBy: currentUser.username,
            timestamp: new Date().toISOString()
        }]);

        alert(`Awarded ${points} points to ${scoreAward.team} for ${activity.name}.`);
        setScoreAward({ team: '', activityId: '', points: 0 });
    };

    const linkClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white shadow";
    const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Director Dashboard</h2>
                 <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setView('award')} className={`${linkClasses} ${view === 'award' ? activeClasses : inactiveClasses}`}>Award Points</button>
                    <button onClick={() => setView('manage')} className={`${linkClasses} ${view === 'manage' ? activeClasses : inactiveClasses}`}>Manage Activities</button>
                </div>
            </div>

            {view === 'manage' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Create New Direct Award Activity</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                            <input type="text" placeholder="Activity Name" value={newActivity.name} onChange={e => setNewActivity(p => ({...p, name: e.target.value}))} className="p-2 border rounded"/>
                            <input type="number" placeholder="Max Points" value={newActivity.maxPoints} onChange={e => setNewActivity(p => ({...p, maxPoints: parseInt(e.target.value) || 0}))} className="p-2 border rounded"/>
                            <button onClick={handleAddActivity} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add Activity</button>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Existing Direct Award Activities</h3>
                        <ul className="space-y-2">
                            {directAwardActivities.map(act => (
                                <li key={act.id} className="flex justify-between items-center p-3 bg-white rounded-md border">
                                    <span className="font-semibold">{act.name}</span>
                                    <span className="text-sm text-gray-600 font-bold">{act.maxPoints} pts</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {view === 'award' && (
                <div>
                     <h3 className="text-xl font-semibold mb-3 text-gray-700">Award Points for Activity Completion</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                        <select value={scoreAward.team} onChange={e => setScoreAward(p => ({...p, team: e.target.value}))} className="p-2 border rounded bg-white">
                            <option value="">Select Team</option>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                         <select value={scoreAward.activityId} onChange={e => setScoreAward(p => ({...p, activityId: e.target.value, points: 0}))} className="p-2 border rounded bg-white">
                            <option value="">Select Activity</option>
                            {directAwardActivities.map(t => <option key={t.id} value={t.id}>{t.name} ({t.maxPoints} pts)</option>)}
                        </select>
                        <input 
                            type="number"
                            placeholder="Points"
                            value={scoreAward.points}
                            onChange={e => setScoreAward(p => ({...p, points: parseInt(e.target.value) || 0}))}
                            className="p-2 border rounded"
                            max={activities.find(t => t.id === scoreAward.activityId)?.maxPoints}
                            min={0}
                        />
                     </div>
                     <div className="mt-4 flex justify-end">
                        <button onClick={handleAwardScore} className="bg-green-600 text-white p-2 px-6 rounded hover:bg-green-700 font-semibold" disabled={!scoreAward.team || !scoreAward.activityId}>Award Points</button>
                     </div>
                </div>
            )}
        </div>
    );
};

export default DirectorDashboard;