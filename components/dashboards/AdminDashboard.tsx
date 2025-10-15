import React, { useState } from 'react';
import { User, Activity, PointsEntry, DirectorScore, UserRole, Criterion, CriteriaKey, PointsState } from '../../types';

// --- SUB-COMPONENT: Manage Users ---
const ManageUsers: React.FC<{ users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>> }> = ({ users, setUsers }) => {
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleUpdateUser = (id: number, field: keyof User, value: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
    };
    
    const handleDeleteUser = (id: number) => {
        if (id === 1) { alert("Cannot delete the root admin account."); return; }
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    };

    return (
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
    );
};

// --- SUB-COMPONENT: Manage Scores ---
const ManageScores: React.FC<{ 
    mentorScores: PointsEntry[], 
    setMentorScores: React.Dispatch<React.SetStateAction<PointsEntry[]>>,
    activities: Activity[]
}> = ({ mentorScores, setMentorScores, activities }) => {
    
    const handleDeleteScore = (id: number) => {
        if (window.confirm("Delete this score entry permanently?")) {
            setMentorScores(prev => prev.filter(s => s.id !== id));
        }
    }
    // A full edit modal would be complex. For now, we enable deletion.
    // To enable editing, you'd track an `editingScoreId`, show a modal with inputs for each criteria, and update state.

    return (
        <div className="space-y-4">
             <h3 className="text-xl font-semibold text-gray-700">Manage Mentor Scores</h3>
             <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mentor</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mentorScores.map(score => (
                            <tr key={score.id}>
                                <td className="px-3 py-2 font-medium">{score.team_country}</td>
                                <td className="px-3 py-2">{score.mentor_name}</td>
                                <td className="px-3 py-2 text-gray-600">{activities.find(a => a.id === score.activityId)?.name}</td>
                                <td className="px-3 py-2 font-bold">{score.total_points}</td>
                                <td className="px-3 py-2">
                                    <button disabled className="text-gray-400 cursor-not-allowed text-sm font-medium mr-2">Edit</button>
                                    <button onClick={() => handleDeleteScore(score.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    )
}

// --- SUB-COMPONENT: Manage Settings ---
const ManageSettings: React.FC<{ setLogoUrl: (url: string) => void }> = ({ setLogoUrl }) => {
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
    setLogoUrl: (url: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [view, setView] = useState('users');

    const renderView = () => {
        switch(view) {
            case 'users':
                return <ManageUsers users={props.users} setUsers={props.setUsers} />;
            case 'scores':
                return <ManageScores mentorScores={props.mentorScores} setMentorScores={props.setMentorScores} activities={props.activities} />;
            case 'settings':
                return <ManageSettings setLogoUrl={props.setLogoUrl} />
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
                <div className="flex flex-wrap space-x-2 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setView('users')} className={`${linkClasses} ${view === 'users' ? activeClasses : inactiveClasses}`}>Manage Users</button>
                    <button disabled className={`${linkClasses} ${inactiveClasses} cursor-not-allowed opacity-50`}>Manage Activities</button>
                    <button onClick={() => setView('scores')} className={`${linkClasses} ${view === 'scores' ? activeClasses : inactiveClasses}`}>Manage Scores</button>
                    <button onClick={() => setView('settings')} className={`${linkClasses} ${view === 'settings' ? activeClasses : inactiveClasses}`}>Settings</button>
                </div>
            </div>
            {renderView()}
        </div>
    );
};

export default AdminDashboard;