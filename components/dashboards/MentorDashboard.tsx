import React, { useState } from 'react';
import { User, Activity, PointsEntry, Country, DirectorScore, NegativeMarking, BonusPoint, VotingSession, PublicVote, VotingSettings } from '../../types';
import MentorScoringForm from '../forms/MentorScoringForm';
import LiveScoresView from '../LiveScoresView';
import VotingResultsGraph from '../VotingResultsGraph';

interface MentorDashboardProps {
    currentUser: User;
    activities: Activity[];
    myScores: PointsEntry[];
    onFormSubmit: (newEntries: Omit<PointsEntry, 'id' | 'timestamp'>[]) => void;
    countriesData: Country[];
    mentorScores: PointsEntry[];
    directorScores: DirectorScore[];
    negativeMarkings: NegativeMarking[];
    setNegativeMarkings: React.Dispatch<React.SetStateAction<NegativeMarking[]>>;
    bonusPoints: BonusPoint[];
    setBonusPoints: React.Dispatch<React.SetStateAction<BonusPoint[]>>;
    votingSessions: VotingSession[];
    publicVotes: PublicVote[];
    votingSettings: VotingSettings;
}

const MentorDashboard: React.FC<MentorDashboardProps> = (props) => {
    const { 
        currentUser, activities, myScores, onFormSubmit, countriesData, mentorScores, 
        directorScores, negativeMarkings, setNegativeMarkings, bonusPoints, setBonusPoints,
        votingSessions, publicVotes, votingSettings
    } = props;
    
    const [selectedActivityId, setSelectedActivityId] = useState<string>('');
    const [view, setView] = useState<'score' | 'history' | 'penalties' | 'live-scores' | 'bonus' | 'live-voting'>('score');
    const [penaltyData, setPenaltyData] = useState({ team: '', points: 0, reason: '' });
    const [bonusData, setBonusData] = useState({ team: '', points: 0, reason: '' });

    
    const selectedActivity = activities.find(e => e.id === selectedActivityId);
    const judgedActivities = activities.filter(a => a.type === 'judged');

    const scoresForHistory: Record<string, PointsEntry[]> = myScores.reduce((acc, score) => {
        const activityName = activities.find(e => e.id === score.activityId)?.name || 'Unknown Activity';
        if (!acc[activityName]) {
            acc[activityName] = [];
        }
        acc[activityName].push(score);
        return acc;
    }, {} as Record<string, PointsEntry[]>);

    const handleAddPenalty = () => {
        if (!penaltyData.team || penaltyData.points <= 0 || !penaltyData.reason.trim()) {
            alert('Please select a team, enter a positive point value, and provide a reason for the penalty.');
            return;
        }

        if (window.confirm(`Are you sure you want to deduct ${penaltyData.points} points from ${penaltyData.team}? This will be sent for admin approval.`)) {
            const newPenalty: NegativeMarking = {
                id: Date.now(),
                team_country: penaltyData.team,
                points: penaltyData.points,
                reason: penaltyData.reason.trim(),
                awardedBy: currentUser.username,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            setNegativeMarkings(prev => [...prev, newPenalty]);
            alert('Penalty submitted for approval.');
            setPenaltyData({ team: '', points: 0, reason: '' });
        }
    };

    const handleAddBonus = () => {
        if (!bonusData.team || bonusData.points <= 0 || !bonusData.reason.trim()) {
            alert('Please select a team, enter a positive point value, and provide a reason for the bonus.');
            return;
        }

        if (window.confirm(`Are you sure you want to award ${bonusData.points} bonus points to ${bonusData.team}? This will be sent for admin approval.`)) {
            const newBonus: BonusPoint = {
                id: Date.now(),
                team_country: bonusData.team,
                points: bonusData.points,
                reason: bonusData.reason.trim(),
                awardedBy: currentUser.username,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            setBonusPoints(prev => [...prev, newBonus]);
            alert('Bonus points submitted for approval.');
            setBonusData({ team: '', points: 0, reason: '' });
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


    const renderContent = () => {
        if (view === 'live-scores') {
            return <LiveScoresView {...props} />;
        }

        if (view === 'live-voting') {
            return <LiveVotingView />;
        }
        
        if (view === 'history') {
            return (
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">My Past Submissions</h3>
                    {Object.keys(scoresForHistory).length > 0 ? (
                        <div className="space-y-4">
                            {Object.entries(scoresForHistory).map(([activityName, scores]) => (
                                <div key={activityName}>
                                    <h4 className="font-bold text-blue-700">{activityName}</h4>
                                    <ul className="list-disc list-inside text-gray-600 mt-2">
                                        {scores.map(s => (
                                            <li key={s.id}><strong>{s.team_country}</strong>: {s.total_points} points</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : <p>You have not submitted any scores yet.</p>}
                </div>
            );
        }

        if (view === 'bonus') {
            return (
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Award Bonus Points</h3>
                    <div className="p-4 border rounded-lg bg-green-50 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select value={bonusData.team} onChange={e => setBonusData(p => ({...p, team: e.target.value}))} className="p-2 border rounded bg-white border-green-200">
                                <option value="">-- Select Team --</option>
                                {countriesData.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                            </select>
                            <div>
                                <label className="block text-sm font-medium text-green-700">Points to Award</label>
                                <input 
                                    type="number"
                                    placeholder="e.g., 10"
                                    value={bonusData.points === 0 ? '' : bonusData.points}
                                    onChange={e => setBonusData(p => ({...p, points: parseInt(e.target.value) || 0}))}
                                    className="p-2 border rounded w-full mt-1 border-green-200"
                                    min={1}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-green-700">Reason for Bonus (Required)</label>
                            <textarea 
                                value={bonusData.reason}
                                onChange={e => setBonusData(p => ({...p, reason: e.target.value}))}
                                className="p-2 border rounded w-full mt-1 border-green-200"
                                rows={3}
                                placeholder="e.g., Exceptional teamwork, special contribution, etc."
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button onClick={handleAddBonus} className="bg-green-600 text-white p-2 px-6 rounded hover:bg-green-700 font-semibold" disabled={!bonusData.team || bonusData.points <= 0 || !bonusData.reason.trim()}>
                            Submit for Approval
                        </button>
                    </div>
                </div>
            );
        }

        if(view === 'penalties') {
             return (
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Apply Penalty / Negative Marking</h3>
                    <div className="p-4 border rounded-lg bg-red-50 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select value={penaltyData.team} onChange={e => setPenaltyData(p => ({...p, team: e.target.value}))} className="p-2 border rounded bg-white border-red-200">
                                <option value="">-- Select Team to Penalize --</option>
                                {countriesData.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                            </select>
                            <div>
                                <label className="block text-sm font-medium text-red-700">Points to Deduct</label>
                                <input 
                                    type="number"
                                    placeholder="e.g., 5"
                                    value={penaltyData.points === 0 ? '' : penaltyData.points}
                                    onChange={e => setPenaltyData(p => ({...p, points: parseInt(e.target.value) || 0}))}
                                    className="p-2 border rounded w-full mt-1 border-red-200"
                                    min={1}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-red-700">Reason for Deduction (Required)</label>
                            <textarea 
                                value={penaltyData.reason}
                                onChange={e => setPenaltyData(p => ({...p, reason: e.target.value}))}
                                className="p-2 border rounded w-full mt-1 border-red-200"
                                rows={3}
                                placeholder="e.g., Late for performance, rule violation, etc."
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button onClick={handleAddPenalty} className="bg-red-600 text-white p-2 px-6 rounded hover:bg-red-700 font-semibold" disabled={!penaltyData.team || penaltyData.points <= 0 || !penaltyData.reason.trim()}>
                            Submit for Approval
                        </button>
                    </div>
                </div>
            );
        }

        if (!selectedActivity) {
             return (
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Select an Activity to Score</h3>
                     <select 
                        value={selectedActivityId} 
                        onChange={e => setSelectedActivityId(e.target.value)}
                        className="mt-1 block w-full md:w-1/2 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                    >
                        <option value="">-- Select Judged Activity --</option>
                        {judgedActivities.map(act => <option key={act.id} value={act.id}>{act.name}</option>)}
                    </select>
                </div>
            );
        }

        return <MentorScoringForm activity={selectedActivity} mentorName={currentUser.username} onFormSubmit={onFormSubmit} countriesData={countriesData} />;
    }

    const linkClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white shadow";
    const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b pb-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Mentor / Judge Dashboard</h2>
                    <p className="text-gray-500">Welcome, {currentUser.username}!</p>
                </div>
                <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setView('score')} className={`${linkClasses} ${view === 'score' ? activeClasses : inactiveClasses}`}>Score Activity</button>
                    <button onClick={() => setView('history')} className={`${linkClasses} ${view === 'history' ? activeClasses : inactiveClasses}`}>My History</button>
                    <button onClick={() => setView('bonus')} className={`${linkClasses} ${view === 'bonus' ? 'bg-green-600 text-white shadow' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>Bonus</button>
                    <button onClick={() => setView('penalties')} className={`${linkClasses} ${view === 'penalties' ? 'bg-red-600 text-white shadow' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>Penalties</button>
                    <button onClick={() => setView('live-scores')} className={`${linkClasses} ${view === 'live-scores' ? activeClasses : inactiveClasses}`}>Live Scores</button>
                    <button onClick={() => setView('live-voting')} className={`${linkClasses} ${view === 'live-voting' ? 'bg-teal-500 text-white shadow' : 'bg-teal-100 text-teal-700 hover:bg-teal-200'}`}>Live Voting</button>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default MentorDashboard;