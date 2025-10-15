import React, { useState } from 'react';
import { User, Activity, PointsEntry, DirectorScore, UserRole, CriteriaKey, PointsState } from '../../types';
import ManageActivities from './admin/ManageActivities';

// --- SUB-COMPONENT: Manage Users ---
const ManageUsers: React.FC<{ users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>> }> = ({ users, setUsers }) => {
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'mentor' as UserRole });

    const handleUpdateUser = (id: number, field: keyof User, value: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
    };
    
    const handleDeleteUser = (id: number) => {
        if (id === 1) { alert("Cannot delete the root admin account."); return; }
        if (window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.username.trim() || !newUser.password.trim()) {
            alert('Username and password are required.');
            return;
        }
        if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase().trim())) {
            alert('A user with this username already exists.');
            return;
        }
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        setUsers(prev => [...prev, { ...newUser, id: newId, username: newUser.username.trim() }]);
        setNewUser({ username: '', password: '', role: 'mentor' });
    };

    return (
        <div className="space-y-6">
             <form onSubmit={handleAddUser} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                <h3 className="text-xl font-semibold text-gray-700">Add New User</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser(p => ({...p, username: e.target.value}))} className="p-2 border rounded" required />
                    <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser(p => ({...p, password: e.target.value}))} className="p-2 border rounded" required />
                    <select value={newUser.role} onChange={e => setNewUser(p => ({...p, role: e.target.value as UserRole}))} className="p-2 border rounded bg-white">
                        <option value="mentor">Mentor</option>
                        <option value="director">Director</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold">+ Add User</button>
                </div>
            </form>
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Manage Existing Users</h3>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Password</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-4 py-2"><input type="text" value={user.username} onChange={e => handleUpdateUser(user.id, 'username', e.target.value)} className="p-1 border rounded w-full" disabled={user.id === 1}/></td>
                                <td className="px-4 py-2"><input type="text" value={user.password} onChange={e => handleUpdateUser(user.id, 'password', e.target.value)} className="p-1 border rounded w-full" /></td>
                                <td className="px-4 py-2">
                                    <select value={user.role} onChange={e => handleUpdateUser(user.id, 'role', e.target.value)} className="p-1 border rounded w-full bg-white" disabled={user.id === 1}>
                                        <option value="mentor">Mentor</option>
                                        <option value="director">Director</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-4 py-2">
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50" disabled={user.id === 1}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: Score Edit Modal ---
const ScoreEditModal: React.FC<{
    score: PointsEntry;
    activity: Activity;
    onClose: () => void;
    onSave: (updatedScore: PointsEntry) => void;
}> = ({ score, activity, onClose, onSave }) => {
    
    const [currentPoints, setCurrentPoints] = useState<PointsState>(() => {
        if (activity.type !== 'judged' || !activity.criteria) return {} as PointsState;
        return activity.criteria.reduce((acc, crit) => {
            const key = crit.name.toLowerCase().replace(/ /g, '_') as CriteriaKey;
            acc[key] = score[key] || 0;
            return acc;
        }, {} as PointsState);
    });

    const handlePointChange = (key: CriteriaKey, value: number) => {
        setCurrentPoints(prev => ({ ...prev, [key]: value }));
    };

    const totalPoints = Object.values(currentPoints).reduce((sum: number, val: number) => sum + val, 0);

    const handleSave = () => {
        const updatedScore = { ...score, ...currentPoints, total_points: totalPoints };
        onSave(updatedScore);
    };

    if (activity.type !== 'judged' || !activity.criteria) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h4 className="font-bold text-lg mb-2">Editing Score for {score.team_country}</h4>
                <p className="text-sm text-gray-600 mb-4">Mentor: {score.mentor_name}</p>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {activity.criteria.map(crit => {
                        const key = crit.name.toLowerCase().replace(/ /g, '_') as CriteriaKey;
                        return (
                            <div key={crit.id} className="grid grid-cols-3 items-center gap-2">
                                <label className="font-semibold">{crit.name}</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    max={crit.maxPoints}
                                    value={currentPoints[key] ?? 0}
                                    onChange={e => handlePointChange(key, Math.max(0, Math.min(parseInt(e.target.value) || 0, crit.maxPoints)))}
                                    className="p-1 border rounded w-24 text-center"
                                />
                            </div>
                        )
                    })}
                </div>
                <div className="mt-4 pt-4 border-t text-right font-bold text-lg">
                    Total: {totalPoints}
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: Manage Scores ---
const ManageScores: React.FC<{ 
    mentorScores: PointsEntry[], 
    setMentorScores: React.Dispatch<React.SetStateAction<PointsEntry[]>>,
    activities: Activity[]
}> = ({ mentorScores, setMentorScores, activities }) => {
    const [editingScore, setEditingScore] = useState<PointsEntry | null>(null);
    
    const handleDeleteScore = (id: number) => {
        if (window.confirm("Delete this score entry permanently?")) {
            setMentorScores(prev => prev.filter(s => s.id !== id));
        }
    }
    
    const handleSaveScore = (updatedEntry: PointsEntry) => {
        setMentorScores(prev => prev.map(s => s.id === updatedEntry.id ? updatedEntry : s));
        setEditingScore(null);
    };

    const scoresByCountry = mentorScores.reduce((acc, score) => {
        if (!acc[score.team_country]) {
            acc[score.team_country] = [];
        }
        acc[score.team_country].push(score);
        return acc;
    }, {} as Record<string, PointsEntry[]>);

    const activityForEditing = editingScore ? activities.find(a => a.id === editingScore.activityId) : null;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Manage Mentor Scores</h3>
            <div className="space-y-2">
                {Object.keys(scoresByCountry).sort().map(country => (
                    <details key={country} className="bg-white border rounded-lg">
                        <summary className="font-semibold p-3 cursor-pointer">{country}</summary>
                        <div className="p-2 border-t">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mentor</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {scoresByCountry[country].map(score => (
                                        <tr key={score.id}>
                                            <td className="px-3 py-2">{score.mentor_name}</td>
                                            <td className="px-3 py-2 text-gray-600">{activities.find(a => a.id === score.activityId)?.name}</td>
                                            <td className="px-3 py-2 font-bold">{score.total_points}</td>
                                            <td className="px-3 py-2 space-x-2">
                                                <button onClick={() => setEditingScore(score)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                                                <button onClick={() => handleDeleteScore(score.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                ))}
            </div>
            {editingScore && activityForEditing && (
                 <ScoreEditModal 
                    score={editingScore}
                    activity={activityForEditing}
                    onClose={() => setEditingScore(null)}
                    onSave={handleSaveScore}
                />
            )}
        </div>
    )
}

// --- SUB-COMPONENT: Manage Settings ---
const ManageSettings: React.FC<{ setLogoUrl: (url: string | null) => void }> = ({ setLogoUrl }) => {
    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Branding</h3>
            <div className="p-4 border rounded-lg bg-gray-50">
                <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700">Upload Event Logo</label>
                <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                <p className="text-xs text-gray-500 mt-1">This logo will appear in the header on the public leaderboard.</p>
            </div>
        </div>
    )
}

// --- SUB-COMPONENT: Manage Data (NEW) ---
type AppState = {
    users: User[];
    activities: Activity[];
    mentorScores: PointsEntry[];
    directorScores: DirectorScore[];
    logoUrl: string | null;
}
const ManageData: React.FC<{
    appState: AppState;
    setUsers: (users: User[]) => void;
    setActivities: (activities: Activity[]) => void;
    setMentorScores: (scores: PointsEntry[]) => void;
    setDirectorScores: (scores: DirectorScore[]) => void;
    setLogoUrl: (url: string | null) => void;
    onResetData: () => void;
}> = ({ appState, setUsers, setActivities, setMentorScores, setDirectorScores, setLogoUrl, onResetData }) => {

    const handleExport = () => {
        try {
            const dataStr = JSON.stringify(appState, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `wff-backup-${new Date().toISOString().slice(0,10)}.json`;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            linkElement.remove();
        } catch (error) {
            console.error("Error exporting data:", error);
            alert("An error occurred while exporting the data.");
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File content is not readable.");
                const importedState = JSON.parse(text);

                // Basic validation to ensure it's a valid backup file
                if (!importedState.users || !importedState.activities || !importedState.mentorScores || !('directorScores' in importedState)) {
                    throw new Error("Invalid or corrupted backup file structure.");
                }

                if (window.confirm("Are you sure you want to overwrite all current data with the contents of this backup file? This action cannot be undone.")) {
                    setUsers(importedState.users || []);
                    setActivities(importedState.activities || []);
                    setMentorScores(importedState.mentorScores || []);
                    setDirectorScores(importedState.directorScores || []);
                    setLogoUrl(importedState.logoUrl || null);
                    alert("Data imported successfully!");
                }
            } catch (error: any) {
                console.error("Error importing file:", error);
                alert(`Failed to import data. Please make sure you selected a valid JSON backup file. Error: ${error.message}`);
            } finally {
                event.target.value = ''; // Reset file input
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8">
            <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">Export Data</h3>
                <p className="text-sm text-gray-600 mt-1 mb-3">Save a backup of all users, activities, scores, and settings to a JSON file on your computer. Keep this file safe!</p>
                <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold">
                    Export All Data
                </button>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">Import Data</h3>
                <p className="text-sm text-gray-600 mt-1 mb-3">Restore the application state from a previously exported backup file. This will overwrite all existing data.</p>
                <input type="file" accept=".json" onChange={handleImport} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
            </div>
             <div className="p-4 border-2 border-red-300 rounded-lg bg-red-50">
                <h3 className="text-lg font-semibold text-red-800">Reset Application Data</h3>
                <p className="text-sm text-red-600 mt-1 mb-3">Permanently delete all data stored in this browser and reset the application to its original, default state. This action cannot be undone.</p>
                <button onClick={onResetData} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold">
                    Reset All Data
                </button>
            </div>
        </div>
    );
};


// --- MAIN DASHBOARD COMPONENT ---
interface AdminDashboardProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    activities: Activity[];
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
    mentorScores: PointsEntry[];
    setMentorScores: React.Dispatch<React.SetStateAction<PointsEntry[]>>;
    directorScores: DirectorScore[];
    setDirectorScores: React.Dispatch<React.SetStateAction<DirectorScore[]>>;
    logoUrl: string | null;
    setLogoUrl: (url: string | null) => void;
    onResetData: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [view, setView] = useState('users');

    const renderView = () => {
        const { users, setUsers, activities, setActivities, mentorScores, setMentorScores, directorScores, setDirectorScores, logoUrl, setLogoUrl, onResetData } = props;
        
        switch(view) {
            case 'users':
                return <ManageUsers users={users} setUsers={setUsers} />;
            case 'activities':
                return <ManageActivities 
                            activities={activities} 
                            setActivities={setActivities} 
                            mentorScores={mentorScores} 
                            directorScores={directorScores} 
                        />;
            case 'scores':
                return <ManageScores mentorScores={mentorScores} setMentorScores={setMentorScores} activities={activities} />;
            case 'settings':
                return <ManageSettings setLogoUrl={setLogoUrl} />
            case 'data':
                return <ManageData 
                    appState={{ users, activities, mentorScores, directorScores, logoUrl }}
                    setUsers={setUsers}
                    setActivities={setActivities}
                    setMentorScores={setMentorScores}
                    setDirectorScores={setDirectorScores}
                    setLogoUrl={setLogoUrl}
                    onResetData={onResetData}
                />;
            default:
                return <p>Select a management category.</p>;
        }
    };

    const linkClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white shadow";
    const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h2>
                <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setView('users')} className={`${linkClasses} ${view === 'users' ? activeClasses : inactiveClasses}`}>Manage Users</button>
                    <button onClick={() => setView('activities')} className={`${linkClasses} ${view === 'activities' ? activeClasses : inactiveClasses}`}>Manage Activities</button>
                    <button onClick={() => setView('scores')} className={`${linkClasses} ${view === 'scores' ? activeClasses : inactiveClasses}`}>Manage Scores</button>
                    <button onClick={() => setView('settings')} className={`${linkClasses} ${view === 'settings' ? activeClasses : inactiveClasses}`}>Settings</button>
                    <button onClick={() => setView('data')} className={`${linkClasses} ${view === 'data' ? activeClasses : inactiveClasses}`}>Data</button>
                </div>
            </div>
            {renderView()}
        </div>
    );
};

export default AdminDashboard;