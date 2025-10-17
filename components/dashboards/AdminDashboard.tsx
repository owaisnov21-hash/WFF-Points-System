import React, { useState, useEffect } from 'react';
import { User, Activity, PointsEntry, DirectorScore, LandingPageContent, Country, NegativeMarking, BonusPoint, VotingSession, AppBackupState, PointsState, CriteriaKey, VotingSettings, Student, PublicVote, Player } from '../../types';
import ManageActivities from './admin/ManageActivities';
import { CRITERIA_KEYS } from '../../constants';
import VotingResultsGraph from '../VotingResultsGraph';
import ManageJsonBin from './admin/ManageJsonBin';


interface AdminDashboardProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    activities: Activity[];
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
    mentorScores: PointsEntry[];
    setMentorScores: React.Dispatch<React.SetStateAction<PointsEntry[]>>;
    directorScores: DirectorScore[];
    setDirectorScores: React.Dispatch<React.SetStateAction<DirectorScore[]>>;
    headerLogoUrl: string | null;
    setHeaderLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
    landingPageContent: LandingPageContent;
    setLandingPageContent: React.Dispatch<React.SetStateAction<LandingPageContent>>;
    onResetData: () => void;
    countriesData: Country[];
    setCountriesData: React.Dispatch<React.SetStateAction<Country[]>>;
    negativeMarkings: NegativeMarking[];
    setNegativeMarkings: React.Dispatch<React.SetStateAction<NegativeMarking[]>>;
    bonusPoints: BonusPoint[];
    setBonusPoints: React.Dispatch<React.SetStateAction<BonusPoint[]>>;
    votingSessions: VotingSession[];
    setVotingSessions: React.Dispatch<React.SetStateAction<VotingSession[]>>;
    // Live Voting Props
    votingSettings: VotingSettings;
    setVotingSettings: React.Dispatch<React.SetStateAction<VotingSettings>>;
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
    publicVotes: PublicVote[];
    // FIX: Added missing setPublicVotes prop to resolve type error in ManageSystemData.
    setPublicVotes: React.Dispatch<React.SetStateAction<PublicVote[]>>;
    // JSONBin Props
    jsonBinApiKey: string | null;
    setJsonBinApiKey: React.Dispatch<React.SetStateAction<string | null>>;
    jsonBinId: string | null;
    setJsonBinId: React.Dispatch<React.SetStateAction<string | null>>;
}

// --- Helper Components ---
const handleFileRead = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target?.result as string);
    reader.readAsDataURL(file);
};

const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string; }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
    </div>
);


// --- Management Sub-Components ---

const ManageUsers: React.FC<Pick<AdminDashboardProps, 'users' | 'setUsers' | 'countriesData'>> = ({ users, setUsers, countriesData }) => {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form, setForm] = useState<Partial<User>>({ username: '', password: '', role: 'mentor' });

    useEffect(() => {
        if (editingUser) setForm(editingUser);
        else setForm({ username: '', password: '', role: 'mentor', country: '' });
    }, [editingUser]);

    const handleSave = () => {
        if (!form.username || !form.role) return alert('Username and Role are required.');
        if (!editingUser && !form.password) return alert('Password is required for new users.');

        setUsers(prev => editingUser
            ? prev.map(u => u.id === editingUser.id ? { ...u, ...form } : u)
            : [...prev, { ...form, id: Date.now() } as User]
        );
        setEditingUser(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    };

    return (
        <div className="space-y-4">
            <button onClick={() => setEditingUser({} as User)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add User</button>
            {editingUser && (
                <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                    <h3 className="font-semibold">{form.id ? 'Edit User' : 'New User'}</h3>
                    <input type="text" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="p-2 border rounded w-full" />
                    <input type="text" placeholder="Password (leave blank to keep)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="p-2 border rounded w-full" />
                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as User['role'] })} className="p-2 border rounded w-full bg-white">
                        <option value="admin">Admin</option>
                        <option value="director">Director</option>
                        <option value="judge">Judge</option>
                        <option value="mentor">Mentor</option>
                        <option value="country">Country</option>
                    </select>
                    {form.role === 'country' && (
                         <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="p-2 border rounded w-full bg-white">
                            <option value="">-- Select Country --</option>
                            {countriesData.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                    )}
                    <div className="space-x-2">
                        <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
                        <button onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    </div>
                </div>
            )}
            <div className="overflow-x-auto border rounded-lg"><table className="min-w-full bg-white">
                <thead className="bg-gray-50"><tr>
                    <th className="px-4 py-2 text-left">Username</th><th className="px-4 py-2 text-left">Role</th><th className="px-4 py-2 text-left">Actions</th>
                </tr></thead>
                <tbody>
                    {users.map(u => <tr key={u.id}>
                        <td className="border-t px-4 py-2">{u.username}</td><td className="border-t px-4 py-2 capitalize">{u.role}</td>
                        <td className="border-t px-4 py-2 space-x-2"><button onClick={() => setEditingUser(u)} className="text-blue-600">Edit</button><button onClick={() => handleDelete(u.id)} className="text-red-600">Delete</button></td>
                    </tr>)}
                </tbody>
            </table></div>
        </div>
    );
};

const ManageCountries: React.FC<Pick<AdminDashboardProps, 'countriesData' | 'setCountriesData' | 'users'>> = ({ countriesData, setCountriesData, users }) => {
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);
    const [form, setForm] = useState<Partial<Country>>({ name: '', flag: '', imageUrl: null, leaderNames: [], assignedMentors: [], courseName: '', color: '#000000', players: [] });

    useEffect(() => {
        if (editingCountry) setForm({...editingCountry, players: editingCountry.players || [] });
        else setForm({ name: '', flag: '', imageUrl: null, leaderNames: [], assignedMentors: [], courseName: '', color: '#000000', players: [] });
    }, [editingCountry]);

    const handleSave = () => {
        if (!form.name || !form.flag) return alert('Country Name and Flag are required.');
        const cleanedPlayers = (form.players || []).filter(p => p.id.trim() !== '' && p.name.trim() !== '');
        const finalForm = { ...form, players: cleanedPlayers };

        setCountriesData(prev => editingCountry?.name
            ? prev.map(c => c.name === editingCountry.name ? finalForm as Country : c)
            : [...prev, finalForm as Country]
        );
        setEditingCountry(null);
    };

    const handlePlayerChange = (index: number, field: keyof Player, value: string) => {
        const updatedPlayers = [...(form.players || [])];
        updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
        setForm({ ...form, players: updatedPlayers });
    };

    const addPlayer = () => {
        const newPlayers = [...(form.players || []), { id: '', name: '' }];
        setForm({ ...form, players: newPlayers });
    };

    const removePlayer = (index: number) => {
        const newPlayers = (form.players || []).filter((_, i) => i !== index);
        setForm({ ...form, players: newPlayers });
    };
    
    return (
        <div className="space-y-4">
            <button onClick={() => setEditingCountry({} as Country)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Country</button>
            {editingCountry && <Modal title={form.name ? `Edit ${form.name}` : 'Add New Country'} onClose={() => setEditingCountry(null)}>
                <div className="p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><label className="font-semibold">Country Name</label><input type="text" placeholder="Country Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="p-2 border rounded w-full" /></div>
                    <div><label className="font-semibold">Flag Emoji</label><input type="text" placeholder="e.g., 🇲🇾" value={form.flag} onChange={e => setForm({ ...form, flag: e.target.value })} className="p-2 border rounded w-full" /></div>
                    <div><label className="font-semibold">Flag Color</label><input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="p-1 h-10 w-full border rounded" /></div>
                    <div className="md:col-span-2"><label className="font-semibold">Leaders (comma separated)</label><input type="text" placeholder="Leader 1, Leader 2" value={form.leaderNames?.join(', ')} onChange={e => setForm({ ...form, leaderNames: e.target.value.split(',').map(s => s.trim()) })} className="p-2 border rounded w-full" /></div>
                    <div className="md:col-span-2"><label className="font-semibold">Mentors (comma separated)</label><input type="text" value={form.assignedMentors?.join(', ')} onChange={e => setForm({ ...form, assignedMentors: e.target.value.split(',').map(s => s.trim()) })} className="p-2 border rounded w-full" /></div>
                    <div className="md:col-span-2"><label className="font-semibold">Course Name</label><input type="text" placeholder="Course Name" value={form.courseName} onChange={e => setForm({ ...form, courseName: e.target.value })} className="p-2 border rounded w-full" /></div>
                    <div className="md:col-span-2">
                        <label className="font-semibold">Team Image</label>
                        <input type="file" accept="image/*" onChange={e => e.target.files && handleFileRead(e.target.files[0], res => setForm({...form, imageUrl: res}))} className="mt-1 text-sm w-full"/>
                        {form.imageUrl && <div className="mt-2"><img src={form.imageUrl} alt="preview" className="h-20 w-20 rounded-full object-cover"/><button onClick={() => setForm({...form, imageUrl: null})} className="text-red-500 text-xs mt-1">Remove</button></div>}
                    </div>
                     <div className="md:col-span-2">
                        <label className="font-semibold">Team Players</label>
                        <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-2 bg-white p-2 border rounded-md">
                            {form.players?.map((player, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input type="text" placeholder="Student ID" value={player.id} onChange={e => handlePlayerChange(index, 'id', e.target.value)} className="p-2 border rounded w-1/3 text-sm" />
                                    <input type="text" placeholder="Student Name" value={player.name} onChange={e => handlePlayerChange(index, 'name', e.target.value)} className="p-2 border rounded flex-grow text-sm" />
                                    <button type="button" onClick={() => removePlayer(index)} className="text-red-500 hover:text-red-700 font-bold p-2 text-sm">X</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addPlayer} className="text-sm text-blue-600 hover:text-blue-800 mt-2 font-semibold">+ Add Player</button>
                    </div>
                    <div className="md:col-span-2 space-x-2">
                        <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
                        <button onClick={() => setEditingCountry(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    </div>
                </div>
            </Modal>}
            <div className="overflow-x-auto border rounded-lg"><table className="min-w-full bg-white">
                <thead className="bg-gray-50"><tr>
                    <th className="px-4 py-2 text-left">Flag</th><th className="px-4 py-2 text-left">Name</th><th className="px-4 py-2 text-left">Actions</th>
                </tr></thead>
                <tbody>
                    {countriesData.map(c => <tr key={c.name}>
                        <td className="border-t px-4 py-2">{c.flag}</td><td className="border-t px-4 py-2">{c.name}</td>
                        <td className="border-t px-4 py-2 space-x-2"><button onClick={() => setEditingCountry(c)} className="text-blue-600">Edit</button><button onClick={() => window.confirm('Delete?') && setCountriesData(p => p.filter(co => co.name !== c.name))} className="text-red-600">Delete</button></td>
                    </tr>)}
                </tbody>
            </table></div>
        </div>
    );
};

const ManageScoresByCountry: React.FC<Pick<AdminDashboardProps, 'mentorScores' | 'setMentorScores' | 'directorScores' | 'setDirectorScores' | 'countriesData' | 'activities'>> = (props) => {
    const { mentorScores, setMentorScores, directorScores, setDirectorScores, countriesData, activities } = props;
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [editingScore, setEditingScore] = useState<PointsEntry | DirectorScore | null>(null);

    const countryMentorScores = selectedCountry ? mentorScores.filter(s => s.team_country === selectedCountry.name) : [];
    const countryDirectorScores = selectedCountry ? directorScores.filter(s => s.team_country === selectedCountry.name) : [];
    
    const handleSave = () => {
        if (!editingScore) return;
        if ('mentor_name' in editingScore) { // It's a PointsEntry
            setMentorScores(prev => prev.map(s => s.id === editingScore.id ? editingScore : s));
        } else { // It's a DirectorScore
            setDirectorScores(prev => prev.map(s => s.id === editingScore.id ? editingScore : s));
        }
        setEditingScore(null);
    };

    const handleDelete = (score: PointsEntry | DirectorScore) => {
        if (!window.confirm("Are you sure you want to delete this score entry?")) return;
        if ('mentor_name' in score) {
            setMentorScores(prev => prev.filter(s => s.id !== score.id));
        } else {
            setDirectorScores(prev => prev.filter(s => s.id !== score.id));
        }
    };
    
    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-xl mb-2">Manage Scores by Country</h3>
            {editingScore && <Modal title={`Editing Score for ${editingScore.team_country}`} onClose={() => setEditingScore(null)}>
                <div className="space-y-3">
                    {'mentor_name' in editingScore ? (
                        <>
                            <p><strong>Mentor:</strong> {editingScore.mentor_name}</p>
                            {(activities.find(a=> a.id === editingScore.activityId)?.criteria || []).map(crit => {
                                const critKey = crit.name.toLowerCase().replace(/ /g, '_') as CriteriaKey;
                                return (<div key={crit.id}>
                                    <label>{crit.name} ({crit.maxPoints} pts)</label>
                                    <input type="number" max={crit.maxPoints} min={0} value={(editingScore as any)[critKey] ?? 0}
                                        onChange={e => {
                                            const newScore = {...editingScore, [critKey]: Number(e.target.value)};
                                            const total = CRITERIA_KEYS.reduce((sum, key) => sum + (newScore[key] || 0), 0);
                                            setEditingScore({...newScore, total_points: total});
                                        }}
                                        className="p-2 border rounded w-full"/>
                                </div>);
                            })}
                            <p className="font-bold">New Total: {editingScore.total_points}</p>
                        </>
                    ) : (
                        <div>
                             <label>Points</label>
                             <input type="number" value={editingScore.points} onChange={e => setEditingScore({...editingScore, points: Number(e.target.value)})} className="p-2 border rounded w-full"/>
                        </div>
                    )}
                    <div className="space-x-2"><button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded">Save</button><button onClick={() => setEditingScore(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button></div>
                </div>
            </Modal>}
            
            {!selectedCountry ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {countriesData.map(c => <button key={c.name} onClick={() => setSelectedCountry(c)} className="p-4 border rounded-lg text-center hover:bg-gray-100 hover:border-blue-500">
                        <span className="text-4xl">{c.flag}</span><p className="font-semibold">{c.name}</p></button>)}
                </div>
            ) : (
                <div>
                    <button onClick={() => setSelectedCountry(null)} className="mb-4 text-blue-600 font-semibold">&larr; Back to Country List</button>
                    <h4 className="text-2xl font-bold flex items-center gap-3 mb-4">{selectedCountry.flag} {selectedCountry.name}</h4>
                    <div className="space-y-6">
                        <div>
                            <h5 className="font-semibold text-lg">Mentor/Judge Scores</h5>
                            <div className="overflow-x-auto border rounded-lg mt-2"><table className="min-w-full bg-white text-sm">
                                <thead className="bg-gray-50"><tr><th className="p-2 text-left">Mentor</th><th className="p-2 text-left">Total Points</th><th className="p-2 text-left">Actions</th></tr></thead>
                                <tbody>{countryMentorScores.map(s => <tr key={s.id} className="border-t">
                                    <td className="p-2">{s.mentor_name}</td><td>{s.total_points}</td>
                                    <td className="space-x-2"><button onClick={() => setEditingScore(s)} className="text-blue-600">Edit</button><button onClick={() => handleDelete(s)} className="text-red-600">Delete</button></td>
                                </tr>)}</tbody>
                            </table></div>
                        </div>
                         <div>
                            <h5 className="font-semibold text-lg">Director Awards</h5>
                            <div className="overflow-x-auto border rounded-lg mt-2"><table className="min-w-full bg-white text-sm">
                                <thead className="bg-gray-50"><tr><th className="p-2 text-left">Activity</th><th className="p-2 text-left">Points</th><th className="p-2 text-left">Actions</th></tr></thead>
                                <tbody>{countryDirectorScores.map(s => <tr key={s.id} className="border-t">
                                    <td className="p-2">{activities.find(a=>a.id === s.activityId)?.name || 'Unknown'}</td><td>{s.points}</td>
                                    <td className="space-x-2"><button onClick={() => setEditingScore(s)} className="text-blue-600">Edit</button><button onClick={() => handleDelete(s)} className="text-red-600">Delete</button></td>
                                </tr>)}</tbody>
                            </table></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ManageManualVoting: React.FC<Pick<AdminDashboardProps, 'votingSessions' | 'setVotingSessions' | 'countriesData'>> = (props) => {
    const { votingSessions, setVotingSessions, countriesData } = props;
    const [editSession, setEditSession] = useState<VotingSession | Partial<VotingSession> | null>(null);
    
    const handleSave = () => {
        if(!editSession?.name || !editSession?.team_country || !editSession.points) return alert("All fields are required");
        const sessionToSave = { ...editSession, points: Number(editSession.points), timestamp: new Date().toISOString(), awardedBy: 'admin' };
        setVotingSessions(prev => 'id' in sessionToSave ? prev.map(s => s.id === sessionToSave.id ? sessionToSave as VotingSession : s) : [...prev, {...sessionToSave, id: Date.now()} as VotingSession]);
        setEditSession(null);
    };

    return (
        <div className="space-y-4">
            <button onClick={() => setEditSession({ name: '', date: new Date().toISOString().split('T')[0], team_country: '', points: 0})} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Voting Result</button>
            {editSession && <Modal title={ 'id' in editSession ? "Edit Voting Result" : "Add Voting Result"} onClose={() => setEditSession(null)}>
                <div className="space-y-3">
                    <input value={editSession.name} onChange={e => setEditSession({...editSession, name: e.target.value})} placeholder="Event Name" className="p-2 border rounded w-full"/>
                    <input type="date" value={editSession.date} onChange={e => setEditSession({...editSession, date: e.target.value})} className="p-2 border rounded w-full"/>
                    <select value={editSession.team_country} onChange={e => setEditSession({...editSession, team_country: e.target.value})} className="p-2 border rounded w-full bg-white">
                        <option value="">-- Select Team --</option>
                        {countriesData.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    <input type="number" value={editSession.points} onChange={e => setEditSession({...editSession, points: Number(e.target.value)})} placeholder="Points" className="p-2 border rounded w-full"/>
                    <div className="space-x-2"><button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded">Save</button><button onClick={() => setEditSession(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button></div>
                </div>
            </Modal>}
             <div className="overflow-x-auto border rounded-lg"><table className="min-w-full bg-white">
                <thead className="bg-gray-50"><tr><th>Event</th><th>Team</th><th>Points</th><th>Actions</th></tr></thead>
                <tbody>{votingSessions.map(s => <tr key={s.id} className="border-t">
                    <td className="p-2">{s.name}</td><td>{s.team_country}</td><td>{s.points}</td>
                    <td className="space-x-2"><button onClick={() => setEditSession(s)} className="text-blue-600">Edit</button><button onClick={() => window.confirm('Delete?') && setVotingSessions(p=>p.filter(v=>v.id!==s.id))} className="text-red-600">Delete</button></td>
                </tr>)}</tbody>
             </table></div>
        </div>
    );
}

const ManagePenaltiesAndBonuses: React.FC<Pick<AdminDashboardProps, 'negativeMarkings' | 'setNegativeMarkings' | 'bonusPoints' | 'setBonusPoints'>> = ({ negativeMarkings, setNegativeMarkings, bonusPoints, setBonusPoints }) => {
    
    const handleStatusChange = (type: 'penalty' | 'bonus', id: number, status: 'approved' | 'rejected') => {
        if (type === 'penalty') setNegativeMarkings(prev => prev.map(p => p.id === id ? { ...p, status } : p));
        else setBonusPoints(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    };

    const [editingItem, setEditingItem] = useState<{ type: 'penalty' | 'bonus', data: NegativeMarking | BonusPoint } | null>(null);

    const handleSaveEdit = () => {
        if (!editingItem) return;
        const { type, data } = editingItem;
        if (type === 'penalty') {
            setNegativeMarkings(prev => prev.map(p => p.id === data.id ? data as NegativeMarking : p));
        } else {
            setBonusPoints(prev => prev.map(p => p.id === data.id ? data as BonusPoint : p));
        }
        setEditingItem(null);
    };

    const handleDelete = (type: 'penalty' | 'bonus', id: number) => {
        if (!window.confirm("Are you sure?")) return;
        if (type === 'penalty') setNegativeMarkings(prev => prev.filter(p => p.id !== id));
        else setBonusPoints(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {editingItem && <Modal title="Edit Entry" onClose={() => setEditingItem(null)}>
                <div className="space-y-3">
                    <label>Reason</label>
                    <input value={editingItem.data.reason} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, reason: e.target.value } })} className="p-2 border rounded w-full" />
                    <label>Points</label>
                    <input type="number" value={editingItem.data.points} onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, points: Number(e.target.value) } })} className="p-2 border rounded w-full" />
                    <div className="space-x-2"><button onClick={handleSaveEdit} className="px-4 py-2 bg-green-500 text-white rounded">Save</button><button onClick={() => setEditingItem(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button></div>
                </div>
            </Modal>}
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Penalties</h3>
                <div className="space-y-3">
                    {negativeMarkings.map(p => (
                        <div key={p.id} className="p-3 border rounded-lg bg-red-50 text-sm">
                            <p><strong>Team:</strong> {p.team_country} ({p.status})</p>
                            <p><strong>Points:</strong> -{p.points}</p>
                            <p><strong>Reason:</strong> {p.reason}</p>
                            <div className="mt-2 space-x-2">
                                {p.status === 'pending' && <>
                                    <button onClick={() => handleStatusChange('penalty', p.id, 'approved')} className="px-2 py-1 text-xs bg-green-500 text-white rounded">Approve</button>
                                    <button onClick={() => handleStatusChange('penalty', p.id, 'rejected')} className="px-2 py-1 text-xs bg-red-500 text-white rounded">Reject</button>
                                </>}
                                <button onClick={() => setEditingItem({type: 'penalty', data: p})} className="px-2 py-1 text-xs bg-blue-500 text-white rounded">Edit</button>
                                <button onClick={() => handleDelete('penalty', p.id)} className="px-2 py-1 text-xs bg-gray-500 text-white rounded">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Bonus Points</h3>
                 <div className="space-y-3">
                    {bonusPoints.map(p => (
                        <div key={p.id} className="p-3 border rounded-lg bg-green-50 text-sm">
                            <p><strong>Team:</strong> {p.team_country} ({p.status})</p>
                            <p><strong>Points:</strong> +{p.points}</p>
                            <p><strong>Reason:</strong> {p.reason}</p>
                             <div className="mt-2 space-x-2">
                                {p.status === 'pending' && <>
                                    <button onClick={() => handleStatusChange('bonus', p.id, 'approved')} className="px-2 py-1 text-xs bg-green-500 text-white rounded">Approve</button>
                                    <button onClick={() => handleStatusChange('bonus', p.id, 'rejected')} className="px-2 py-1 text-xs bg-red-500 text-white rounded">Reject</button>
                                </>}
                                <button onClick={() => setEditingItem({type: 'bonus', data: p})} className="px-2 py-1 text-xs bg-blue-500 text-white rounded">Edit</button>
                                <button onClick={() => handleDelete('bonus', p.id)} className="px-2 py-1 text-xs bg-gray-500 text-white rounded">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ManageSite: React.FC<Pick<AdminDashboardProps, 'landingPageContent' | 'setLandingPageContent' | 'headerLogoUrl' | 'setHeaderLogoUrl'>> = (props) => {
    const { landingPageContent, setLandingPageContent, headerLogoUrl, setHeaderLogoUrl } = props;
    return (
         <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Site Content & Branding</h3>
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Main Heading</label>
                    <input type="text" value={landingPageContent.mainHeading} onChange={e => setLandingPageContent(c => ({...c, mainHeading: e.target.value}))} className="mt-1 p-2 border rounded w-full md:w-1/2"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea value={landingPageContent.description} onChange={e => setLandingPageContent(c => ({...c, description: e.target.value}))} className="mt-1 p-2 border rounded w-full" rows={3}/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Header Logo</label>
                    <input type="file" accept="image/*" onChange={e => e.target.files && handleFileRead(e.target.files[0], setHeaderLogoUrl)} className="mt-1 text-sm"/>
                    {headerLogoUrl && <img src={headerLogoUrl} alt="Header logo preview" className="h-10 mt-2 bg-gray-200 p-1 rounded"/>}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Landing Page Main Logo</label>
                    <input type="file" accept="image/*" onChange={e => e.target.files && handleFileRead(e.target.files[0], res => setLandingPageContent(c => ({...c, mainLogoUrl: res})))} className="mt-1 text-sm"/>
                    {landingPageContent.mainLogoUrl && <img src={landingPageContent.mainLogoUrl} alt="Main logo preview" className="h-20 mt-2 bg-gray-200 p-1 rounded"/>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Landing Page Background Image</label>
                    <input type="file" accept="image/*" onChange={e => e.target.files && handleFileRead(e.target.files[0], res => setLandingPageContent(c => ({...c, backgroundUrl: res})))} className="mt-1 text-sm"/>
                    {landingPageContent.backgroundUrl && <img src={landingPageContent.backgroundUrl} alt="BG preview" className="w-40 mt-2 bg-gray-200 p-1 rounded"/>}
                </div>
            </div>
        </div>
    );
};

const ManageSystemData: React.FC<Pick<AdminDashboardProps, 'onResetData' | 'headerLogoUrl' | 'landingPageContent' | 'users' | 'activities' | 'mentorScores' | 'directorScores' | 'countriesData' | 'negativeMarkings' | 'bonusPoints' | 'votingSessions' | 'setHeaderLogoUrl' | 'setLandingPageContent' | 'setUsers' | 'setActivities' | 'setMentorScores' | 'setDirectorScores' | 'setCountriesData' | 'setNegativeMarkings' | 'setBonusPoints' | 'setVotingSessions' | 'votingSettings' | 'students' | 'publicVotes' | 'setVotingSettings' | 'setStudents' | 'setPublicVotes' | 'jsonBinApiKey' | 'jsonBinId'>> = (props) => {
    const { onResetData, ...allData } = props;

    const handleExport = () => {
        const { setHeaderLogoUrl, setLandingPageContent, setUsers, setActivities, setMentorScores, setDirectorScores, setCountriesData, setNegativeMarkings, setBonusPoints, setVotingSessions, setVotingSettings, setStudents, setPublicVotes, setJsonBinApiKey, setJsonBinId, ...stateToExport } = allData;
        const jsonString = JSON.stringify(stateToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wff-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string) as AppBackupState;
                if (!importedData.users || !importedData.activities || !importedData.countriesData) {
                    throw new Error("Invalid backup file format.");
                }

                if (window.confirm("WARNING: This will overwrite ALL existing application data with the content from the selected file. This cannot be undone. Are you sure you want to proceed?")) {
                    allData.setHeaderLogoUrl(importedData.headerLogoUrl);
                    allData.setLandingPageContent(importedData.landingPageContent);
                    allData.setUsers(importedData.users);
                    allData.setActivities(importedData.activities);
                    allData.setMentorScores(importedData.mentorScores);
                    allData.setDirectorScores(importedData.directorScores);
                    allData.setCountriesData(importedData.countriesData);
                    allData.setNegativeMarkings(importedData.negativeMarkings);
                    allData.setBonusPoints(importedData.bonusPoints);
                    allData.setVotingSessions(importedData.votingSessions);
                    allData.setVotingSettings(importedData.votingSettings || { isOpen: false, type: 'public', name: 'Public Vote', id: null, deadline: null, pointsForWinner: 100 });
                    allData.setStudents(importedData.students || []);
                    allData.setPublicVotes(importedData.publicVotes || []);
                    alert("Data imported successfully!");
                }
            } catch (error) {
                console.error("Import failed:", error);
                alert("Import failed. Please make sure you are using a valid backup file.");
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };
    
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Backup & Restore</h3>
                <div className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50 space-y-4">
                    <div>
                        <h4 className="font-semibold">Export All Data</h4>
                        <p className="text-sm text-gray-600 mb-2">Download a JSON file containing all users, countries, activities, scores, and site settings. Keep this file in a safe place as a backup.</p>
                        <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Export All Data</button>
                    </div>
                     <hr/>
                     <div>
                        <h4 className="font-semibold">Import Data from Backup</h4>
                        <p className="text-sm text-gray-600 mb-2">Upload a previously exported JSON backup file. This will overwrite all current data.</p>
                        <input type="file" accept=".json" onChange={handleImport} className="text-sm" />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-red-700 mb-4">System Reset</h3>
                <div className="p-4 border-2 border-red-400 rounded-lg bg-red-50 space-y-3">
                    <p className="font-semibold">This is a destructive action.</p>
                    <p>Clicking this button will wipe all data from your browser's local storage. The application will be reset to its default state. This action is irreversible unless you have a backup.</p>
                    <button onClick={onResetData} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-800">Reset All Application Data</button>
                </div>
            </div>
        </div>
    );
};

const ManageLiveVoting: React.FC<Pick<AdminDashboardProps, 'votingSettings'|'setVotingSettings'|'students'|'setStudents'|'publicVotes'|'setPublicVotes'|'countriesData' | 'setVotingSessions'>> = (props) => {
    const { votingSettings, setVotingSettings, students, setStudents, publicVotes, setPublicVotes, countriesData, setVotingSessions } = props;

    const finalizeAndCloseVoting = React.useCallback(() => {
        if (!votingSettings.id || !votingSettings.isOpen) return;

        console.log("Finalizing and closing voting session...");

        const sessionVotes = publicVotes.filter(v => v.sessionId === votingSettings.id);
        if (sessionVotes.length > 0) {
            const votesByCountry = sessionVotes.reduce((acc, vote) => {
                acc[vote.team_country] = (acc[vote.team_country] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const winner = Object.entries(votesByCountry).sort((a, b) => b[1] - a[1])[0];
            const [winnerCountry, voteCount] = winner;
            
            const newVotingResult: VotingSession = {
                id: Date.now(),
                name: `${votingSettings.name} (Live Vote)`,
                date: new Date().toISOString().split('T')[0],
                team_country: winnerCountry,
                points: votingSettings.pointsForWinner,
                awardedBy: 'Public Vote',
                timestamp: new Date().toISOString()
            };

            setVotingSessions(prev => [...prev, newVotingResult]);
            alert(`Voting closed. ${winnerCountry} won with ${voteCount} votes and has been awarded ${votingSettings.pointsForWinner} points.`);
        } else {
            alert("Voting closed. No votes were cast.");
        }

        setVotingSettings(s => ({ ...s, isOpen: false, id: null, deadline: null }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [votingSettings.id, votingSettings.isOpen, votingSettings.name, votingSettings.pointsForWinner, publicVotes, setVotingSessions]);


    useEffect(() => {
        if (!votingSettings.isOpen || !votingSettings.deadline) return;

        const interval = setInterval(() => {
            // FIX: Convert Date object to number for valid comparison.
            if (new Date(votingSettings.deadline).getTime() <= Date.now()) {
                finalizeAndCloseVoting();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [votingSettings.isOpen, votingSettings.deadline, finalizeAndCloseVoting]);


    const handleOpenVoting = () => {
        if (!votingSettings.name.trim() || !votingSettings.deadline || votingSettings.pointsForWinner <= 0) {
            alert("Please set a session name, a future deadline, and a positive point value for the winner.");
            return;
        }
        if (new Date(votingSettings.deadline).getTime() <= new Date().getTime()) {
            alert("The deadline must be set in the future.");
            return;
        }
        if (window.confirm("This will start a new voting session and clear all current live votes. Are you sure?")) {
            const newSessionId = `wff-vote-${Date.now()}`;
            setVotingSettings(s => ({ ...s, isOpen: true, id: newSessionId }));
            setPublicVotes([]); // Reset votes for the new session
            alert(`Voting session '${votingSettings.name}' is now OPEN!`);
        }
    };


    const handleStudentCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                const newStudents: Student[] = lines.map(line => {
                    const [id, name] = line.split(',').map(s => s.trim());
                    if (!id || !name) throw new Error(`Invalid line in CSV: ${line}`);
                    return { id, name };
                });
                if (window.confirm(`Found ${newStudents.length} students. This will replace any existing student list. Continue?`)) {
                    setStudents(newStudents);
                    alert("Student list updated successfully.");
                }
            } catch (error) {
                console.error("CSV parsing failed:", error);
                alert("Failed to parse CSV. Please ensure the format is 'ID,Name' on each line.");
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    };

    const currentSessionVotes = publicVotes.filter(v => v.sessionId === votingSettings.id);

    return (
        <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Live Voting Controls</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Voting Session Name</label>
                        <input type="text" value={votingSettings.name} onChange={e => setVotingSettings(s => ({...s, name: e.target.value}))} className="mt-1 p-2 border rounded w-full" disabled={votingSettings.isOpen}/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Points for Winner</label>
                        <input type="number" value={votingSettings.pointsForWinner} onChange={e => setVotingSettings(s => ({...s, pointsForWinner: Number(e.target.value)}))} className="mt-1 p-2 border rounded w-full" disabled={votingSettings.isOpen} />
                    </div>
                </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700">Voting Deadline</label>
                    <input type="datetime-local" value={votingSettings.deadline || ''} onChange={e => setVotingSettings(s => ({...s, deadline: e.target.value}))} className="mt-1 p-2 border rounded w-full md:w-1/2" disabled={votingSettings.isOpen}/>
                </div>

                <div className="flex items-center space-x-4 pt-2">
                    <label className="font-medium text-gray-700">Voting Status:</label>
                    <button onClick={votingSettings.isOpen ? finalizeAndCloseVoting : handleOpenVoting} className={`px-4 py-2 rounded-md font-semibold text-white ${votingSettings.isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                        {votingSettings.isOpen ? 'Close Voting & Finalize' : 'Open Voting'}
                    </button>
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${votingSettings.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {votingSettings.isOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Voting Type</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center"><input type="radio" value="public" checked={votingSettings.type === 'public'} onChange={e => setVotingSettings(s => ({...s, type: e.target.value as 'public'}))} className="mr-2" disabled={votingSettings.isOpen}/> Public (1 vote per browser)</label>
                        <label className="flex items-center"><input type="radio" value="internal" checked={votingSettings.type === 'internal'} onChange={e => setVotingSettings(s => ({...s, type: e.target.value as 'internal'}))} className="mr-2" disabled={votingSettings.isOpen}/> Internal (Requires Student ID)</label>
                    </div>
                </div>
                
                {votingSettings.type === 'internal' && (
                    <div className="p-3 border-t">
                        <h4 className="font-semibold text-gray-700">Internal Voting Setup</h4>
                        <p className="text-sm text-gray-600 mb-2">Upload a CSV file with student data. The format must be `ID,Name` with each student on a new line.</p>
                        <input type="file" accept=".csv, .txt" onChange={handleStudentCSVUpload} className="text-sm" disabled={votingSettings.isOpen}/>
                        <p className="text-xs text-gray-500 mt-2">Currently loaded: {students.length} students.</p>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Live Results {votingSettings.isOpen ? `(Current Session: ${currentSessionVotes.length} votes)` : '(Voting Closed)'}</h3>
                <VotingResultsGraph publicVotes={votingSettings.isOpen ? currentSessionVotes : publicVotes} countriesData={countriesData} showCounts={true} />
            </div>
        </div>
    );
};


// --- Main Admin Dashboard Component ---
const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [activeTab, setActiveTab] = useState('activities');

    const renderTabContent = () => {
        switch(activeTab) {
            case 'activities': return <ManageActivities activities={props.activities} setActivities={props.setActivities} mentorScores={props.mentorScores} directorScores={props.directorScores} />;
            case 'users': return <ManageUsers users={props.users} setUsers={props.setUsers} countriesData={props.countriesData}/>;
            case 'countries': return <ManageCountries countriesData={props.countriesData} setCountriesData={props.setCountriesData} users={props.users} />;
            case 'scores': return <ManageScoresByCountry mentorScores={props.mentorScores} setMentorScores={props.setMentorScores} directorScores={props.directorScores} setDirectorScores={props.setDirectorScores} countriesData={props.countriesData} activities={props.activities} />;
            case 'penalties': return <ManagePenaltiesAndBonuses {...props} />;
            case 'manual_voting': return <ManageManualVoting votingSessions={props.votingSessions} setVotingSessions={props.setVotingSessions} countriesData={props.countriesData} />;
            case 'live_voting': return <ManageLiveVoting {...props} />;
            case 'settings': return <ManageSite {...props} />;
            case 'system': return <ManageSystemData {...props} />;
            case 'jsonbin': return <ManageJsonBin {...props} />;
            default: return null;
        }
    };

    const TabButton: React.FC<{ tabId: string; children: React.ReactNode }> = ({ tabId, children }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabId ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b pb-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Control Panel</h2>
                    <p className="text-gray-500">Full administrative access to the application.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6 bg-gray-100 p-2 rounded-lg">
                <TabButton tabId="activities">Activities</TabButton>
                <TabButton tabId="users">Users</TabButton>
                <TabButton tabId="countries">Countries</TabButton>
                <TabButton tabId="scores">Scores</TabButton>
                <TabButton tabId="penalties">Penalties & Bonuses</TabButton>
                <TabButton tabId="manual_voting">Manual Voting</TabButton>
                <TabButton tabId="live_voting">Live Voting</TabButton>
                <TabButton tabId="settings">Site Settings</TabButton>
                <TabButton tabId="system">System</TabButton>
                <TabButton tabId="jsonbin">JSONBin.io Sync</TabButton>
            </div>

            <div>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;