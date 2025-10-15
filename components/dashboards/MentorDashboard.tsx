import React, { useState } from 'react';
import { User, Activity, PointsEntry } from '../../types';
import MentorScoringForm from '../forms/MentorScoringForm';

interface MentorDashboardProps {
    currentUser: User;
    activities: Activity[];
    myScores: PointsEntry[];
    onFormSubmit: (newEntries: Omit<PointsEntry, 'id' | 'timestamp'>[]) => void;
}

const MentorDashboard: React.FC<MentorDashboardProps> = ({ currentUser, activities, myScores, onFormSubmit }) => {
    const [selectedActivityId, setSelectedActivityId] = useState<string>('');
    const [view, setView] = useState<'score' | 'history'>('score');
    
    const selectedActivity = activities.find(e => e.id === selectedActivityId);
    const judgedActivities = activities.filter(a => a.type === 'judged');

    // FIX: The type of `scoresForHistory` was not being correctly inferred from the `reduce` method.
    // By explicitly typing the `scoresForHistory` constant, we ensure that the accumulator in the
    // reduce function is correctly typed, which resolves the error where `scores.map` was called on
    // a variable of type `unknown`.
    const scoresForHistory: Record<string, PointsEntry[]> = myScores.reduce((acc, score) => {
        const activityName = activities.find(e => e.id === score.activityId)?.name || 'Unknown Activity';
        if (!acc[activityName]) {
            acc[activityName] = [];
        }
        acc[activityName].push(score);
        return acc;
    }, {});

    const renderContent = () => {
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

        return <MentorScoringForm activity={selectedActivity} mentorName={currentUser.username} onFormSubmit={onFormSubmit} />;
    }

    const linkClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white shadow";
    const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b pb-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Mentor Dashboard</h2>
                    <p className="text-gray-500">Welcome, {currentUser.username}!</p>
                </div>
                <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setView('score')} className={`${linkClasses} ${view === 'score' ? activeClasses : inactiveClasses}`}>Score Activity</button>
                    <button onClick={() => setView('history')} className={`${linkClasses} ${view === 'history' ? activeClasses : inactiveClasses}`}>View My History</button>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default MentorDashboard;