import React, { useState, useMemo } from 'react';
import { Activity, DirectorScore, User, PointsEntry } from '../../types';
import { COUNTRIES } from '../../constants';
import PublicView from '../PublicView';

interface DirectorDashboardProps {
    activities: Activity[];
    directorScores: DirectorScore[];
    setDirectorScores: React.Dispatch<React.SetStateAction<DirectorScore[]>>;
    currentUser: User;
    mentorScores: PointsEntry[];
}

const DirectorDashboard: React.FC<DirectorDashboardProps> = ({ activities, directorScores, setDirectorScores, currentUser, mentorScores }) => {
    const [view, setView] = useState<'award' | 'summary' | 'history'>('award');
    
    const [scoreData, setScoreData] = useState({
      team: '',
      activityId: '',
      points: 0,
      criteriaPoints: {} as Record<string, number>
    });
    
    const directAwardActivities = activities.filter(a => a.type === 'direct');
    const judgedActivities = activities.filter(a => a.type === 'judged');
    const selectedActivity = activities.find(a => a.id === scoreData.activityId);

    const myAwards = useMemo(() => {
        return directorScores
            .filter(s => s.awardedBy === currentUser.username)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [directorScores, currentUser.username]);

    const handleAwardScore = () => {
        if (!scoreData.team || !selectedActivity) {
            alert('Please select a team and a valid activity.');
            return;
        }

        let totalPoints = 0;
        if (selectedActivity.type === 'direct' && selectedActivity.maxPoints) {
            totalPoints = Math.max(0, Math.min(scoreData.points, selectedActivity.maxPoints));
        } else if (selectedActivity.type === 'judged' && selectedActivity.criteria) {
            totalPoints = selectedActivity.criteria.reduce((sum, crit) => {
                const awarded = scoreData.criteriaPoints[crit.id] || 0;
                return sum + Math.max(0, Math.min(awarded, crit.maxPoints));
            }, 0);
        } else {
            alert('Selected activity is not configured correctly for scoring.');
            return;
        }

        setDirectorScores(prev => [...prev, {
            id: Date.now(),
            activityId: selectedActivity.id,
            team_country: scoreData.team,
            points: totalPoints,
            awardedBy: currentUser.username,
            timestamp: new Date().toISOString()
        }]);

        alert(`Awarded ${totalPoints} points to ${scoreData.team} for ${selectedActivity.name}.`);
        setScoreData({ team: '', activityId: '', points: 0, criteriaPoints: {} });
    };
    
    const handleActivityChange = (activityId: string) => {
        setScoreData({
            team: scoreData.team,
            activityId,
            points: 0,
            criteriaPoints: {}
        });
    }

    const renderAwardForm = () => (
      <div>
           <h3 className="text-xl font-semibold mb-3 text-gray-700">Award Points</h3>
           <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
              {/* Row 1: Team and Activity Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select value={scoreData.team} onChange={e => setScoreData(p => ({...p, team: e.target.value}))} className="p-2 border rounded bg-white">
                      <option value="">-- Select Team --</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                   <select value={scoreData.activityId} onChange={e => handleActivityChange(e.target.value)} className="p-2 border rounded bg-white">
                      <option value="">-- Select Activity --</option>
                      {judgedActivities.length > 0 && <optgroup label="Judged Activities">
                          {judgedActivities.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </optgroup>}
                      {directAwardActivities.length > 0 && <optgroup label="Direct Awards">
                          {directAwardActivities.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </optgroup>}
                  </select>
              </div>

              {/* Row 2: Dynamic Points Input */}
              {selectedActivity?.type === 'direct' && (
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Points (Max: {selectedActivity.maxPoints})</label>
                      <input 
                          type="number"
                          placeholder="Points"
                          value={scoreData.points}
                          onChange={e => setScoreData(p => ({...p, points: parseInt(e.target.value) || 0}))}
                          className="p-2 border rounded w-full md:w-1/2 mt-1"
                          max={selectedActivity.maxPoints}
                          min={0}
                      />
                  </div>
              )}
              {selectedActivity?.type === 'judged' && selectedActivity.criteria && (
                  <div className="space-y-2 pt-2">
                      {selectedActivity.criteria.map(crit => (
                          <div key={crit.id} className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
                              <label className="font-medium">{crit.name}</label>
                              <input
                                  type="number"
                                  placeholder={`Points (Max ${crit.maxPoints})`}
                                  value={scoreData.criteriaPoints[crit.id] || ''}
                                  onChange={e => {
                                      const val = parseInt(e.target.value) || 0;
                                      setScoreData(p => ({ ...p, criteriaPoints: {...p.criteriaPoints, [crit.id]: val }}));
                                  }}
                                  className="p-2 border rounded text-center"
                                  max={crit.maxPoints}
                                  min={0}
                              />
                          </div>
                      ))}
                       <div className="text-right font-bold text-lg pt-2 border-t mt-2">
                          Total: {selectedActivity.criteria.reduce((sum, crit) => sum + (scoreData.criteriaPoints[crit.id] || 0), 0)}
                      </div>
                  </div>
              )}
           </div>
           <div className="mt-4 flex justify-end">
              <button onClick={handleAwardScore} className="bg-green-600 text-white p-2 px-6 rounded hover:bg-green-700 font-semibold" disabled={!scoreData.team || !scoreData.activityId}>Award Points</button>
           </div>
      </div>
    );
    
    const renderHistory = () => (
        <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">My Award History</h3>
            {myAwards.length === 0 ? (
                <p className="text-gray-500 italic">You have not awarded any points yet.</p>
            ) : (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {myAwards.map(score => (
                                <tr key={score.id}>
                                    <td className="px-4 py-2 font-medium">{score.team_country}</td>
                                    <td className="px-4 py-2 text-gray-600">{activities.find(a => a.id === score.activityId)?.name}</td>
                                    <td className="px-4 py-2 font-bold">{score.points}</td>
                                    <td className="px-4 py-2 text-sm text-gray-500">{new Date(score.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        switch (view) {
            case 'award': return renderAwardForm();
            case 'history': return renderHistory();
            case 'summary': return <PublicView mentorScores={mentorScores} directorScores={directorScores} activities={activities} />;
            default: return null;
        }
    };

    const linkClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white shadow";
    const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Director Dashboard</h2>
                 <div className="flex flex-wrap space-x-2 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setView('award')} className={`${linkClasses} ${view === 'award' ? activeClasses : inactiveClasses}`}>Award Points</button>
                    <button onClick={() => setView('history')} className={`${linkClasses} ${view === 'history' ? activeClasses : inactiveClasses}`}>My Awards</button>
                    <button onClick={() => setView('summary')} className={`${linkClasses} ${view === 'summary' ? activeClasses : inactiveClasses}`}>Overall Summary</button>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default DirectorDashboard;