import React, { useMemo, useState } from 'react';
import { PointsEntry, DirectorScore, Activity, Country, NegativeMarking, BonusPoint, VotingSession, PublicVote, AggregatedResult, VotingSettings } from '../types';

// --- Detailed Score Breakdown Modal ---
const ScoreBreakdownModal: React.FC<{
    teamCountry: string;
    mentorScores: PointsEntry[];
    directorScores: DirectorScore[];
    activities: Activity[];
    countriesData: Country[];
    negativeMarkings: NegativeMarking[];
    bonusPoints: BonusPoint[];
    votingSessions: VotingSession[];
    onClose: () => void;
}> = (props) => {
    const { teamCountry, mentorScores, directorScores, activities, countriesData, negativeMarkings, bonusPoints, votingSessions, onClose } = props;
    
    const country = countriesData.find(c => c.name === teamCountry);
    const countryMentorScores = mentorScores.filter(e => e.team_country === teamCountry).sort((a,b) => b.total_points - a.total_points);
    const judgedActivity = activities.find(a => a.id === (countryMentorScores[0]?.activityId || ''));
    
    const countryDirectorScores = directorScores.filter(s => s.team_country === teamCountry).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const countryPenalties = negativeMarkings.filter(p => p.team_country === teamCountry).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const countryBonuses = bonusPoints.filter(p => p.team_country === teamCountry).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const countryVoting = votingSessions.filter(v => v.team_country === teamCountry).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    const statusColors: Record<NegativeMarking['status'], string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        {country?.imageUrl ? (
                            <img src={country.imageUrl} alt={country.name} className="w-10 h-10 rounded-full object-cover"/>
                        ) : (
                            <span className="text-3xl">{country?.flag}</span>
                        )}
                        {teamCountry}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Team Members Section */}
                    {country?.players && country.players.length > 0 && (
                        <div>
                            <h4 className="font-bold text-gray-700 text-lg">Team Members</h4>
                            <div className="overflow-x-auto mt-2 border rounded-lg max-h-48">
                                <table className="min-w-full bg-white text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {country.players.map(player => (
                                            <tr key={player.id}>
                                                <td className="px-3 py-2 font-mono">{player.id}</td>
                                                <td className="px-3 py-2 font-medium">{player.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Judged Activity Section */}
                    {judgedActivity && judgedActivity.type === 'judged' && judgedActivity.criteria && (
                        <div>
                            <h4 className="font-bold text-blue-700 text-lg">{judgedActivity.name} (Mentor/Judge Scores)</h4>
                            <div className="overflow-x-auto mt-2 border rounded-lg">
                                <table className="min-w-full bg-white text-sm">
                                    <thead className="bg-blue-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-blue-900 uppercase">Mentor/Judge</th>
                                        {judgedActivity.criteria.map(c => <th key={c.id} title={c.name} className="px-2 py-2 text-center text-xs font-medium text-blue-900 uppercase">{c.name.substring(0,3)}.</th>)}
                                        <th className="px-3 py-2 text-left text-xs font-medium text-blue-900 uppercase">Total</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-blue-100">
                                    {countryMentorScores.map(entry => (
                                        <tr key={entry.id}>
                                        <td className="px-3 py-2 font-medium">{entry.mentor_name}</td>
                                        {judgedActivity.criteria!.map(c => <td key={c.id} className="px-2 py-2 text-center tabular-nums">{entry[c.name.toLowerCase().replace(/ /g, '_') as keyof PointsEntry] as number}</td>)}
                                        <td className="px-3 py-2 font-bold tabular-nums">{entry.total_points}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Direct Award Section */}
                    {countryDirectorScores.length > 0 && (
                        <div>
                            <h4 className="font-bold text-green-700 text-lg">Direct & Special Awards</h4>
                            <div className="overflow-x-auto mt-2 border rounded-lg">
                                <table className="min-w-full bg-white text-sm">
                                    <thead className="bg-green-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-green-900 uppercase">Award Name</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-green-900 uppercase">Awarded By</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-green-900 uppercase">Points</th>
                                        </tr>
                                    </thead>
                                     <tbody className="divide-y divide-green-100">
                                        {countryDirectorScores.map(score => (
                                            <tr key={score.id}>
                                                <td className="px-3 py-2 font-medium">{activities.find(a => a.id === score.activityId)?.name || 'Unknown Award'}</td>
                                                <td className="px-3 py-2 text-gray-600">{score.awardedBy}</td>
                                                <td className="px-3 py-2 font-bold tabular-nums">+{score.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Voting Section */}
                    {countryVoting.length > 0 && (
                        <div>
                            <h4 className="font-bold text-purple-700 text-lg">Voting Results</h4>
                            <div className="overflow-x-auto mt-2 border rounded-lg">
                                <table className="min-w-full bg-white text-sm">
                                    <thead className="bg-purple-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-purple-900 uppercase">Event</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-purple-900 uppercase">Date</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-purple-900 uppercase">Points</th>
                                        </tr>
                                    </thead>
                                     <tbody className="divide-y divide-purple-100">
                                        {countryVoting.map(vote => (
                                            <tr key={vote.id}>
                                                <td className="px-3 py-2 font-medium">{vote.name}</td>
                                                <td className="px-3 py-2 text-gray-600">{vote.date}</td>
                                                <td className="px-3 py-2 font-bold tabular-nums">+{vote.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Bonus Section */}
                    {countryBonuses.length > 0 && (
                        <div>
                            <h4 className="font-bold text-yellow-700 text-lg">Bonus Points</h4>
                            <div className="overflow-x-auto mt-2 border rounded-lg">
                                <table className="min-w-full bg-white text-sm">
                                    <thead className="bg-yellow-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-yellow-900 uppercase">Reason</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-yellow-900 uppercase">Issued By</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-yellow-900 uppercase">Points</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-yellow-900 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                     <tbody className="divide-y divide-yellow-100">
                                        {countryBonuses.map(bonus => (
                                            <tr key={bonus.id}>
                                                <td className="px-3 py-2 font-medium">{bonus.reason}</td>
                                                <td className="px-3 py-2 text-gray-600">{bonus.awardedBy}</td>
                                                <td className="px-3 py-2 font-bold tabular-nums text-yellow-800">+{bonus.points}</td>
                                                <td className="px-3 py-2 text-center">
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

                     {/* Penalties Section */}
                    {countryPenalties.length > 0 && (
                        <div>
                            <h4 className="font-bold text-red-700 text-lg">Penalties (Point Deductions)</h4>
                            <div className="overflow-x-auto mt-2 border rounded-lg">
                                <table className="min-w-full bg-white text-sm">
                                    <thead className="bg-red-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-red-900 uppercase">Reason</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-red-900 uppercase">Issued By</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-red-900 uppercase">Points Deducted</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-red-900 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                     <tbody className="divide-y divide-red-100">
                                        {countryPenalties.map(penalty => (
                                            <tr key={penalty.id}>
                                                <td className="px-3 py-2 font-medium">{penalty.reason}</td>
                                                <td className="px-3 py-2 text-gray-600">{penalty.awardedBy}</td>
                                                <td className="px-3 py-2 font-bold tabular-nums text-red-600">-{penalty.points}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[penalty.status]}`}>
                                                        {penalty.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {countryMentorScores.length === 0 && countryDirectorScores.length === 0 && countryPenalties.length === 0 && countryBonuses.length === 0 && countryVoting.length === 0 && (
                         <p className="text-center text-gray-500 italic py-6">No scores have been submitted for this team yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

interface LiveScoresViewProps {
  mentorScores: PointsEntry[];
  directorScores: DirectorScore[];
  activities: Activity[];
  countriesData: Country[];
  negativeMarkings: NegativeMarking[];
  bonusPoints: BonusPoint[];
  votingSessions: VotingSession[];
  publicVotes: PublicVote[];
  votingSettings?: VotingSettings;
  isPublicView?: boolean;
}

const LiveScoresView: React.FC<LiveScoresViewProps> = (props) => {
  const { mentorScores, directorScores, activities, countriesData, negativeMarkings, bonusPoints, votingSessions, isPublicView } = props;
  const [selectedTeamCountry, setSelectedTeamCountry] = useState<string | null>(null);

  const sortedData = useMemo<AggregatedResult[]>(() => {
    const countryNames = countriesData.map(c => c.name);
    
    const aggregatedData = countryNames.map(country => {
        const activityScores: Record<string, number> = {};
        let grandTotal = 0;

        activities.forEach(activity => {
            let activityTotal = 0;
            if (activity.type === 'judged') {
                const scoresForActivity = mentorScores.filter(s => s.team_country === country && s.activityId === activity.id);
                if (scoresForActivity.length > 0) {
                    const sum = scoresForActivity.reduce((acc, s) => acc + s.total_points, 0);
                    activityTotal = sum / scoresForActivity.length;
                }
            }
            const directorScoresForActivity = directorScores.filter(s => s.team_country === country && s.activityId === activity.id);
            const directorTotal = directorScoresForActivity.reduce((acc, s) => acc + s.points, 0);
            
            activityScores[activity.id] = parseFloat((activityTotal + directorTotal).toFixed(2));
            grandTotal += activityScores[activity.id];
        });

        const bonusTotal = bonusPoints
            .filter(p => p.team_country === country && p.status === 'approved')
            .reduce((sum, p) => sum + p.points, 0);
        
        const penaltyTotal = negativeMarkings
            .filter(p => p.team_country === country && p.status === 'approved')
            .reduce((sum, p) => sum + p.points, 0);

        const votingTotal = votingSessions
            .filter(v => v.team_country === country)
            .reduce((sum, v) => sum + v.points, 0);

        grandTotal += bonusTotal + votingTotal - penaltyTotal;

      return {
        team_country: country,
        total_points: parseFloat(grandTotal.toFixed(2)),
        activityScores,
        bonusTotal,
        penaltyTotal,
        votingTotal,
      };
    });
    
    return aggregatedData.sort((a, b) => b.total_points - a.total_points);
  }, [mentorScores, directorScores, countriesData, negativeMarkings, bonusPoints, votingSessions, activities]);
  
  // --- RENDER LOGIC ---

  return (
    <div>
      <div className="space-y-3">
        {sortedData.map((team, index) => {
            const country = countriesData.find(c => c.name === team.team_country);
            const rank = index + 1;
            const rankColors = rank === 1 ? 'bg-yellow-400 text-yellow-800' : rank === 2 ? 'bg-gray-300 text-gray-700' : rank === 3 ? 'bg-orange-400 text-orange-800' : 'bg-gray-100 text-gray-600';

            return (
             <div 
                key={team.team_country} 
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 border border-gray-200"
            >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${rankColors}`}>
                    {rank}
                </div>

                <div className="ml-4 flex-shrink-0 w-16 h-12 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                    {country?.imageUrl ? (
                        <img src={country.imageUrl} alt={country.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-3xl">{country?.flag}</span>
                    )}
                </div>

                <div className="flex-grow ml-4">
                    <p className="font-bold text-lg text-gray-800">{team.team_country}</p>
                </div>

                <div className="text-blue-600 font-black text-2xl tabular-nums tracking-tight pr-4">
                    {team.total_points.toFixed(2)}
                </div>
                
                {!isPublicView && (
                    <button 
                        onClick={() => setSelectedTeamCountry(team.team_country)}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
                    >
                        Details
                    </button>
                )}
            </div>
             )
        })}
      </div>

      {selectedTeamCountry && (
        <ScoreBreakdownModal 
            teamCountry={selectedTeamCountry}
            mentorScores={mentorScores}
            directorScores={directorScores}
            activities={activities}
            countriesData={countriesData}
            negativeMarkings={negativeMarkings}
            bonusPoints={bonusPoints}
            votingSessions={votingSessions}
            onClose={() => setSelectedTeamCountry(null)}
        />
      )}
    </div>
  );
};

export default LiveScoresView;