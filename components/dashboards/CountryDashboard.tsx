import React, { useState } from 'react';
import { Country, PointsEntry, DirectorScore, Activity, NegativeMarking, BonusPoint, VotingSession, PublicVote, VotingSettings } from '../../types';
import LiveScoresView from '../LiveScoresView';
import VotingResultsGraph from '../VotingResultsGraph';

interface CountryDashboardProps {
    countryData: Country;
    mentorScores: PointsEntry[];
    directorScores: DirectorScore[];
    activities: Activity[];
    countriesData: Country[];
    negativeMarking: NegativeMarking[];
    bonusPoints: BonusPoint[];
    votingSessions: VotingSession[];
    publicVotes: PublicVote[];
    votingSettings: VotingSettings;
}

const CountryDashboard: React.FC<CountryDashboardProps> = (props) => {
    const { countryData, mentorScores, directorScores, activities, countriesData, negativeMarkings, bonusPoints, votingSessions, publicVotes, votingSettings } = props;
    const [view, setView] = useState<'details' | 'scores' | 'live-voting'>('details');

    // Filter scores specifically for the details view
    const myMentorScores = mentorScores.filter(s => s.team_country === countryData.name);
    const myDirectorScores = directorScores.filter(s => s.team_country === countryData.name);
    const myBonusPoints = bonusPoints.filter(p => p.team_country === countryData.name);
    const myVotingSessions = votingSessions.filter(v => v.team_country === countryData.name);

    const judgedActivities = activities.filter(a => a.type === 'judged');

    const statusColors: Record<BonusPoint['status'], string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
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

    const renderDetailsView = () => (
         <div className="space-y-8">
            {/* Team Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Team Leaders</h3>
                    <p className="text-lg font-bold text-gray-800">{countryData.leaderNames.join(', ')}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Assigned Mentors</h3>
                    <p className="text-lg font-bold text-gray-800">{countryData.assignedMentors.join(', ')}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Course</h3>
                    <p className="text-lg font-bold text-gray-800">{countryData.courseName}</p>
                </div>
            </div>
            
            {/* Team Members Section */}
            <div>
                <h3 className="text-2xl font-bold text-gray-800">Team Members</h3>
                <div className="overflow-x-auto border rounded-lg mt-4 max-h-96">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {countryData.players.map((player) => (
                                <tr key={player.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-sm text-gray-600">{player.id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{player.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {countryData.players.length === 0 && <p className="text-center p-4 text-gray-500">No team members listed.</p>}
                </div>
            </div>


            {/* Scores Section */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">Detailed Score Report</h3>

                {/* Judged Activity Scores */}
                {judgedActivities.map(activity => {
                    const scoresForActivity = myMentorScores.filter(s => s.activityId === activity.id);
                    if (scoresForActivity.length === 0) return null; // Don't show activity if no scores yet
                    return (
                        <div key={activity.id}>
                            <h4 className="font-bold text-blue-700 text-xl mb-2">{activity.name}</h4>
                            <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-blue-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-900 uppercase">Mentor/Judge</th>
                                        {activity.criteria!.map(c => <th key={c.id} title={c.name} className="px-2 py-2 text-center text-xs font-medium text-blue-900 uppercase">{c.name} ({c.maxPoints})</th>)}
                                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-900 uppercase">Total</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-blue-100">
                                    {scoresForActivity.map(entry => (
                                        <tr key={entry.id}>
                                            <td className="px-4 py-3 font-medium">{entry.mentor_name}</td>
                                            {activity.criteria!.map(c => <td key={c.id} className="px-2 py-3 text-center tabular-nums">{entry[c.name.toLowerCase().replace(/ /g, '_') as keyof PointsEntry] as number}</td>)}
                                            <td className="px-4 py-3 font-bold text-blue-800 tabular-nums">{entry.total_points}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}

                {/* Direct Award Scores */}
                {myDirectorScores.length > 0 && (
                    <div>
                        <h4 className="font-bold text-green-700 text-xl mb-2">Direct & Special Awards</h4>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full bg-white">
                                <thead className="bg-green-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-900 uppercase">Award Name</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-900 uppercase">Awarded By</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-green-900 uppercase">Points</th>
                                    </tr>
                                </thead>
                                 <tbody className="divide-y divide-green-100">
                                    {myDirectorScores.map(score => (
                                        <tr key={score.id}>
                                            <td className="px-4 py-3 font-medium">{activities.find(a => a.id === score.activityId)?.name || 'Unknown Award'}</td>
                                            <td className="px-4 py-3 text-gray-600">{score.awardedBy}</td>
                                            <td className="px-4 py-3 font-bold text-green-800 tabular-nums">{score.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {/* Voting Scores */}
                {myVotingSessions.length > 0 && (
                    <div>
                        <h4 className="font-bold text-purple-700 text-xl mb-2">Voting Results</h4>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full bg-white">
                                <thead className="bg-purple-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-purple-900 uppercase">Voting Event</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-purple-900 uppercase">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-purple-900 uppercase">Points</th>
                                    </tr>
                                </thead>
                                 <tbody className="divide-y divide-purple-100">
                                    {myVotingSessions.map(vote => (
                                        <tr key={vote.id}>
                                            <td className="px-4 py-3 font-medium">{vote.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{vote.date}</td>
                                            <td className="px-4 py-3 font-bold text-purple-800 tabular-nums">+{vote.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Bonus Points */}
                {myBonusPoints.length > 0 && (
                     <div>
                        <h4 className="font-bold text-yellow-700 text-xl mb-2">Bonus Points</h4>
                         <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full bg-white">
                                <thead className="bg-yellow-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-yellow-900 uppercase">Reason</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-yellow-900 uppercase">Awarded By</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-yellow-900 uppercase">Points</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-yellow-900 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-yellow-100">
                                    {myBonusPoints.map(bonus => (
                                        <tr key={bonus.id}>
                                            <td className="px-4 py-3 font-medium">{bonus.reason}</td>
                                            <td className="px-4 py-3 text-gray-600">{bonus.awardedBy}</td>
                                            <td className="px-4 py-3 font-bold text-yellow-800 tabular-nums">+{bonus.points}</td>
                                            <td className="px-4 py-3">
                                                 <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[bonus.status]}`}>
                                                    {bonus.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


                {myMentorScores.length === 0 && myDirectorScores.length === 0 && myVotingSessions.length === 0 && myBonusPoints.length === 0 && (
                     <p className="text-center text-gray-500 italic py-8">No scores have been submitted for your team yet. Check back soon!</p>
                )}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (view) {
            case 'details': return renderDetailsView();
            case 'scores': return <LiveScoresView {...props} />;
            case 'live-voting': return <LiveVotingView />;
            default: return null;
        }
    };
    
    const linkClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white shadow";
    const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b">
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-4 shadow-lg" style={{ borderColor: countryData.color }}>
                        {countryData.imageUrl ? (
                            <img src={countryData.imageUrl} alt={countryData.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-5xl">{countryData.flag}</span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{countryData.name}</h2>
                        <p className="text-gray-500 text-lg">Team Dashboard</p>
                    </div>
                </div>
                 <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setView('details')} className={`${linkClasses} ${view === 'details' ? activeClasses : inactiveClasses}`}>My Details</button>
                    <button onClick={() => setView('scores')} className={`${linkClasses} ${view === 'scores' ? activeClasses : inactiveClasses}`}>Live Scores</button>
                    <button onClick={() => setView('live-voting')} className={`${linkClasses} ${view === 'live-voting' ? 'bg-teal-500 text-white shadow' : 'bg-teal-100 text-teal-700 hover:bg-teal-200'}`}>Live Voting</button>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

export default CountryDashboard;