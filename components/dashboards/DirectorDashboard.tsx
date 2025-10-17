import React, { useState } from 'react';
import { Activity, Country, DirectorScore, User, PointsEntry, NegativeMarking, BonusPoint, VotingSession, PublicVote, VotingSettings } from '../../types';
import LiveScoresView from '../LiveScoresView';
import VotingResultsGraph from '../VotingResultsGraph';

interface DirectorDashboardProps {
    activities: Activity[];
    directorScores: DirectorScore[];
    setDirectorScores: React.Dispatch<React.SetStateAction<DirectorScore[]>>;
    currentUser: User;
    mentorScores: PointsEntry[];
    countriesData: Country[];
    negativeMarkings: NegativeMarking[];
    setNegativeMarkings: React.Dispatch<React.SetStateAction<NegativeMarking[]>>;
    bonusPoints: BonusPoint[];
    setBonusPoints: React.Dispatch<React.SetStateAction<BonusPoint[]>>;
    votingSessions: VotingSession[];
    setVotingSessions: React.Dispatch<React.SetStateAction<VotingSession[]>>;
    publicVotes: PublicVote[];
    votingSettings: VotingSettings;
}

const DirectorDashboard: React.FC<DirectorDashboardProps> = (props) => {
    const { 
        activities, directorScores, setDirectorScores, currentUser, mentorScores, countriesData,
        negativeMarkings, setNegativeMarkings, bonusPoints, setBonusPoints, votingSessions, setVotingSessions, publicVotes, votingSettings
    } = props;

    const [view, setView] = useState<'awards' | 'penalties' | 'bonus' | 'voting' | 'live-scores' | 'live-voting'>('awards');
    
    // --- State for Forms ---
    const [awardData, setAwardData] = useState({ activityId: '', team_country: '', points: 0 });
    const [penaltyData, setPenaltyData] = useState({ team: '', points: 0, reason: '' });
    const [bonusData, setBonusData] = useState({ team: '', points: 0, reason: '' });
    
    // State for Voting Management
    const [editingVotingSession, setEditingVotingSession] = useState<VotingSession | Partial<VotingSession> | null>(null);
    
    // State for editing pending submissions
    const [editingPenalty, setEditingPenalty] = useState<NegativeMarking | null>(null);
    const [editingBonus, setEditingBonus] = useState<BonusPoint | null>(null);

    // --- Handlers ---
    const handleAwardSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const activity = activities.find(a => a.id === awardData.activityId);
        if (!activity || !awardData.team_country || awardData.points <= 0) return alert("Please select an activity, a team, and enter a positive point value.");
        
        const maxPoints = activity.type === 'judged' 
            ? activity.criteria?.reduce((sum, c) => sum + c.maxPoints, 0) ?? 0
            : activity.maxPoints ?? 0;

        if (awardData.points > maxPoints) return alert(`Points cannot exceed the maximum of ${maxPoints} for this activity.`);

        const newScore: DirectorScore = { id: Date.now(), activityId: awardData.activityId, team_country: awardData.team_country, points: awardData.points, awardedBy: currentUser.username, timestamp: new Date().toISOString() };
        setDirectorScores(prev => [...prev.filter(s => !(s.activityId === newScore.activityId && s.team_country === newScore.team_country)), newScore]);
        alert(`Awarded ${newScore.points} points to ${newScore.team_country} for ${activity.name}.`);
        setAwardData({ activityId: '', team_country: '', points: 0 });
    };

    const handleSavePenalty = (isEditing: boolean) => {
        const data = isEditing ? editingPenalty : penaltyData;
        const team = isEditing ? data?.team_country : penaltyData.team;

        if (!team || (data?.points ?? 0) <= 0 || !data?.reason.trim()) return alert('Please select a team, enter a positive point value, and provide a reason.');
        
        const penalty: NegativeMarking = { 
            id: isEditing ? data!.id : Date.now(), 
            team_country: team, 
            points: data!.points, 
            reason: data!.reason.trim(), 
            awardedBy: currentUser.username, 
            timestamp: new Date().toISOString(), 
            status: 'pending' 
        };
        
        if (window.confirm(`Are you sure you want to submit this penalty for ${team}? It requires admin approval.`)) {
            setNegativeMarkings(prev => isEditing ? prev.map(p => p.id === penalty.id ? penalty : p) : [...prev, penalty]);
            alert('Penalty submitted for approval.');
            if (isEditing) setEditingPenalty(null);
            else setPenaltyData({ team: '', points: 0, reason: '' });
        }
    };
    
    const handleSaveBonus = (isEditing: boolean) => {
        const data = isEditing ? editingBonus : bonusData;
        const team = isEditing ? data?.team_country : bonusData.team;

        if (!team || (data?.points ?? 0) <= 0 || !data?.reason.trim()) return alert('Please select a team, enter a positive point value, and provide a reason.');
        
        const bonus: BonusPoint = { 
            id: isEditing ? data!.id : Date.now(), 
            team_country: team, 
            points: data!.points, 
            reason: data!.reason.trim(), 
            awardedBy: currentUser.username, 
            timestamp: new Date().toISOString(), 
            status: 'pending' 
        };
        
        if (window.confirm(`Are you sure you want to submit this bonus for ${team}? It requires admin approval.`)) {
            setBonusPoints(prev => isEditing ? prev.map(p => p.id === bonus.id ? bonus : p) : [...prev, bonus]);
            alert('Bonus submitted for approval.');
            if(isEditing) setEditingBonus(null);
            else setBonusData({ team: '', points: 0, reason: '' });
        }
    };

    const handleDeletePending = (type: 'penalty' | 'bonus', id: number) => {
        if (!window.confirm("Are you sure you want to delete this pending submission?")) return;
        if(type === 'penalty') setNegativeMarkings(prev => prev.filter(p => p.id !== id));
        else setBonusPoints(prev => prev.filter(p => p.id !== id));
    };

    const handleSaveVoting = () => {
        if (!editingVotingSession?.name || !editingVotingSession?.team_country || (editingVotingSession.points ?? 0) <= 0) return alert("All fields are required for voting session.");
        
        const sessionToSave = { ...editingVotingSession, points: Number(editingVotingSession.points), timestamp: new Date().toISOString(), awardedBy: currentUser.username };

        setVotingSessions(prev => 'id' in sessionToSave 
            ? prev.map(s => s.id === sessionToSave.id ? sessionToSave as VotingSession : s) 
            : [...prev, {...sessionToSave, id: Date.now()} as VotingSession]
        );
        setEditingVotingSession(null);
    };

    const handleDeleteVoting = (id: number) => {
        if (window.confirm("Delete this voting record?")) {
            setVotingSessions(prev => prev.filter(v => v.id !== id));
        }
    };


    // --- Render Methods ---
    const renderContent = () => {
        switch (view) {
            case 'awards': return <AwardPointsView />;
            case 'penalties': return <ManageSubmissionsView type="penalty" />;
            case 'bonus': return <ManageSubmissionsView type="bonus" />;
            case 'voting': return <ManageVotingView />;
            case 'live-scores': return <LiveScoresView {...props} />;
            case 'live-voting': return <LiveVotingView />;
            default: return null;
        }
    };

    const LiveVotingView = () => (
        <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Live Public Voting Status</h3>
            {votingSettings.isOpen && votingSettings.deadline ? (
                <div className="p-4 border rounded-lg bg-green-50 space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-lg text-green-800">{votingSettings.name}</p>
                            <p className="text-sm text-gray-600">Voting is currently OPEN.</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Closes on:</p>
                            <p className="font-semibold text-green-800">{new Date(votingSettings.deadline).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Total Votes Cast in this Session</p>
                        <p className="text-4xl font-bold text-blue-600">{publicVotes.filter(v => v.sessionId === votingSettings.id).length}</p>
                    </div>
                    <div>
                         <h4 className="font-semibold text-gray-700 text-center mb-2">Current Standings</h4>
                         <VotingResultsGraph publicVotes={publicVotes.filter(v => v.sessionId === votingSettings.id)} countriesData={countriesData} showCounts={true} />
                    </div>
                </div>
            ) : (
                <div className="p-8 text-center border rounded-lg bg-gray-50">
                    <p className="font-semibold text-gray-700">Voting is currently CLOSED.</p>
                    <p className="text-gray-500 mt-2">Check back later for the next live voting session!</p>
                    {publicVotes.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold text-gray-700 mb-2">Results from the last session:</h4>
                            <VotingResultsGraph publicVotes={publicVotes} countriesData={countriesData} showCounts={true} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const AwardPointsView = () => {
        const selectedActivity = activities.find(a => a.id === awardData.activityId);
        const maxPointsForSelected = selectedActivity ? 
            (selectedActivity.type === 'judged' 
                ? selectedActivity.criteria?.reduce((sum, c) => sum + c.maxPoints, 0) ?? 0 
                : selectedActivity.maxPoints ?? 0)
            : 0;

        return (
            <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-700">Award Points for Activities</h3>
                <form onSubmit={handleAwardSubmit} className="p-4 border rounded-lg bg-gray-50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select value={awardData.activityId} onChange={e => setAwardData(p => ({...p, activityId: e.target.value, points: 0}))} className="p-2 border rounded bg-white">
                            <option value="">-- Select Award --</option>
                            {activities.map(a => {
                                const maxPts = a.type === 'judged' ? a.criteria?.reduce((s, c) => s + c.maxPoints, 0) : a.maxPoints;
                                return <option key={a.id} value={a.id}>{a.name} (Max: {maxPts} pts)</option>
                            })}
                        </select>
                        <select value={awardData.team_country} onChange={e => setAwardData(p => ({...p, team_country: e.target.value}))} className="p-2 border rounded bg-white">
                            <option value="">-- Select Team --</option>
                            {countriesData.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                        </select>
                        <input type="number" placeholder="Points" value={awardData.points === 0 ? '' : awardData.points} onChange={e => setAwardData(p => ({...p, points: Math.max(0, Math.min(parseInt(e.target.value) || 0, maxPointsForSelected)) }))} className="p-2 border rounded" min="1" max={maxPointsForSelected}/>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold" disabled={!awardData.activityId || !awardData.team_country || awardData.points <= 0}>Submit Award</button>
                    </div>
                </form>
            </div>
        );
    };

    const ManageSubmissionsView: React.FC<{type: 'penalty' | 'bonus'}> = ({ type }) => {
        const isPenalty = type === 'penalty';
        const title = isPenalty ? "Penalty / Negative Marking" : "Bonus Points";
        const formState = isPenalty ? penaltyData : bonusData;
        const setFormState = isPenalty ? setPenaltyData : setBonusData;
        const editingState = isPenalty ? editingPenalty : editingBonus;
        const setEditingState = isPenalty ? setEditingPenalty as any : setEditingBonus as any;
        const allItems = (isPenalty ? negativeMarkings : bonusPoints).filter(i => i.awardedBy === currentUser.username);
        const handleSave = isPenalty ? handleSavePenalty : handleSaveBonus;
        const bgColor = isPenalty ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
        const btnColor = isPenalty ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';

        const FormComponent: React.FC<{isEditing: boolean}> = ({ isEditing }) => {
            const data = isEditing ? editingState : formState;
            const team = isEditing ? data?.team_country : (data as typeof formState).team;
            const setData = isEditing ? setEditingState : setFormState;

            return (
                 <div className={`p-4 border rounded-lg ${bgColor} space-y-4`}>
                    <h4 className="font-semibold">{isEditing ? `Edit ${title}` : `Add New ${title}`}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select value={team} onChange={e => setData((p: any) => ({...p, [isEditing ? 'team_country' : 'team']: e.target.value}))} className="p-2 border rounded bg-white">
                            <option value="">-- Select Team --</option>
                            {countriesData.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                        </select>
                        <input type="number" placeholder="Points" value={data?.points === 0 ? '' : data?.points} onChange={e => setData((p: any) => ({...p, points: parseInt(e.target.value) || 0}))} className="p-2 border rounded" min={1} />
                    </div>
                    <textarea value={data?.reason} onChange={e => setData((p: any) => ({...p, reason: e.target.value}))} className="p-2 border rounded w-full" rows={3} placeholder="Reason (Required)" />
                    <div className="flex justify-end space-x-2">
                        {isEditing && <button onClick={() => setEditingState(null)} className="bg-gray-300 text-black px-6 py-2 rounded font-semibold">Cancel</button>}
                        <button onClick={() => handleSave(isEditing)} className={`${btnColor} text-white px-6 py-2 rounded font-semibold`} disabled={!team || (data?.points ?? 0) <= 0 || !data?.reason.trim()}>
                            {isEditing ? 'Save Changes' : 'Submit for Approval'}
                        </button>
                    </div>
                </div>
            )
        };
        
        return (
            <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-700">{`Manage ${title}`}</h3>
                {!editingState && <FormComponent isEditing={false} />}
                {editingState && <FormComponent isEditing={true} />}
                
                <div className="mt-6">
                    <h4 className="font-semibold">My Submissions</h4>
                    <div className="space-y-2 mt-2">
                        {allItems.length > 0 ? allItems.map(item => (
                            <div key={item.id} className={`p-3 border rounded-lg ${item.status === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                                <p><strong>{item.team_country}</strong>: {isPenalty ? '-' : '+'}{item.points} pts - <i>Status: <span className="capitalize font-semibold">{item.status}</span></i></p>
                                <p className="text-sm text-gray-600">{item.reason}</p>
                                {item.status === 'pending' && item.id !== editingState?.id && (
                                    <div className="text-right space-x-2">
                                        <button onClick={() => setEditingState(item)} className="text-blue-600 text-sm">Edit</button>
                                        <button onClick={() => handleDeletePending(type, item.id)} className="text-red-600 text-sm">Delete</button>
                                    </div>
                                )}
                            </div>
                        )) : <p className="text-gray-500">No submissions yet.</p>}
                    </div>
                </div>
            </div>
        );
    };

    const ManageVotingView = () => {
        const FormComponent = () => (
             <div className="p-4 border rounded-lg bg-purple-50 space-y-4">
                <h4 className="font-semibold">{editingVotingSession && 'id' in editingVotingSession ? 'Edit Voting Result' : 'Add Voting Result'}</h4>
                <input type="text" placeholder="Voting Session Name" value={editingVotingSession?.name} onChange={e => setEditingVotingSession(p => ({...p, name: e.target.value}))} className="p-2 border rounded w-full" required />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="date" value={editingVotingSession?.date} onChange={e => setEditingVotingSession(p => ({...p, date: e.target.value}))} className="p-2 border rounded w-full" required/>
                    <select value={editingVotingSession?.team_country} onChange={e => setEditingVotingSession(p => ({...p, team_country: e.target.value}))} className="p-2 border rounded bg-white" required>
                        <option value="">-- Select Team --</option>
                        {countriesData.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                    </select>
                    <input type="number" placeholder="Points" value={editingVotingSession?.points === 0 ? '' : editingVotingSession?.points} onChange={e => setEditingVotingSession(p => ({...p, points: parseInt(e.target.value) || 0}))} className="p-2 border rounded" min="1" required/>
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={() => setEditingVotingSession(null)} className="bg-gray-300 text-black px-6 py-2 rounded font-semibold">Cancel</button>
                    <button onClick={handleSaveVoting} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 font-semibold">Save Voting Result</button>
                </div>
            </div>
        );

        return (
             <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-700">Manage Voting Sessions</h3>
                {editingVotingSession ? <FormComponent /> : <button onClick={() => setEditingVotingSession({ name: '', date: new Date().toISOString().split('T')[0], team_country: '', points: 0 })} className="bg-purple-600 text-white p-2 px-4 rounded hover:bg-purple-700">+ Add New Result</button>}
                <div className="mt-6 space-y-2">
                    {votingSessions.map(v => (
                        <div key={v.id} className="p-3 border rounded-lg flex justify-between items-center">
                            <div><span className="font-bold">{v.name}</span> ({v.date}): <span className="font-semibold">{v.team_country}</span> got +{v.points} pts.</div>
                            <div className="space-x-2">
                                <button onClick={() => setEditingVotingSession(v)} className="text-blue-600 text-sm">Edit</button>
                                <button onClick={() => handleDeleteVoting(v.id)} className="text-red-600 text-sm">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    };
    
    const linkClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white shadow";
    const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b pb-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Director Dashboard</h2>
                    <p className="text-gray-500">Welcome, {currentUser.username}!</p>
                </div>
                <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setView('awards')} className={`${linkClasses} ${view === 'awards' ? activeClasses : inactiveClasses}`}>Awards</button>
                    <button onClick={() => setView('bonus')} className={`${linkClasses} ${view === 'bonus' ? 'bg-green-600 text-white shadow' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>Bonus</button>
                    <button onClick={() => setView('penalties')} className={`${linkClasses} ${view === 'penalties' ? 'bg-red-600 text-white shadow' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>Penalties</button>
                    <button onClick={() => setView('voting')} className={`${linkClasses} ${view === 'voting' ? 'bg-purple-600 text-white shadow' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>Voting</button>
                    <button onClick={() => setView('live-scores')} className={`${linkClasses} ${view === 'live-scores' ? activeClasses : inactiveClasses}`}>Live Scores</button>
                    <button onClick={() => setView('live-voting')} className={`${linkClasses} ${view === 'live-voting' ? 'bg-teal-500 text-white shadow' : 'bg-teal-100 text-teal-700 hover:bg-teal-200'}`}>Live Voting</button>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default DirectorDashboard;