import React, { useState, useCallback } from 'react';
import { Activity, PointsEntry, PointsState, CriteriaKey } from '../../types';
import { COUNTRIES } from '../../constants';
import StarRating from '../StarRating'; 

interface MentorScoringFormProps {
    activity: Activity;
    mentorName: string;
    onFormSubmit: (newEntries: Omit<PointsEntry, 'id' | 'timestamp'>[]) => void;
}

const MentorScoringForm: React.FC<MentorScoringFormProps> = ({ activity, mentorName, onFormSubmit }) => {
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
    const [scores, setScores] = useState<Record<string, Record<string, number>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const currentCountry = COUNTRIES[currentTeamIndex];

    const handlePointChange = useCallback((criterionId: string, value: number) => {
        setScores(prev => ({
            ...prev,
            [currentCountry]: {
                ...prev[currentCountry],
                [criterionId]: value
            }
        }));
    }, [currentCountry]);

    const calculateTotal = (country: string) => {
        const countryScores = scores[country] || {};
        return activity.criteria?.reduce((sum, crit) => sum + (countryScores[crit.id] || 0), 0) || 0;
    }
    
    const handleSubmit = () => {
        if (!activity.criteria) return;

        if (window.confirm("Are you sure you want to submit all scores for this activity? This will overwrite any previous submissions you made.")) {
            setIsSubmitting(true);
            const finalScores: Omit<PointsEntry, 'id' | 'timestamp'>[] = COUNTRIES.map(country => {
                const countryScores = scores[country] || {};
                
                const pointsData = activity.criteria!.reduce((acc, crit) => {
                    const key = crit.name.toLowerCase().replace(/ /g, '_') as CriteriaKey;
                    acc[key] = countryScores[crit.id] || 0;
                    return acc;
                }, {} as PointsState);

                return {
                    activityId: activity.id,
                    mentor_name: mentorName,
                    team_country: country,
                    ...pointsData,
                    total_points: calculateTotal(country)
                }
            });
            onFormSubmit(finalScores);
            alert("Scores submitted successfully!");
            setIsSubmitting(false);
        }
    };
    
    const progress = ((currentTeamIndex + 1) / COUNTRIES.length) * 100;

    if (activity.type !== 'judged' || !activity.criteria) {
        return <p className="text-red-500">This activity is not a judged activity and cannot be scored here.</p>;
    }

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Scoring: <span className="text-blue-600">{activity.name}</span></h3>
            <p className="text-gray-500 mb-4">You are scoring as: <strong>{mentorName}</strong></p>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-blue-700">Progress</span>
                    <span className="text-sm font-medium text-blue-700">{currentTeamIndex + 1} of {COUNTRIES.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Scoring Card */}
            <div className="bg-gray-50 p-6 rounded-lg border">
                <h4 className="text-2xl font-bold mb-4">Team: <span className="text-indigo-600">{currentCountry}</span></h4>
                <div className="space-y-4">
                    {activity.criteria.map(crit => (
                        <div key={crit.id} className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                            <label className="font-semibold text-gray-700">{crit.name} ({crit.maxPoints} pts)</label>
                            <div className="md:col-span-2 flex items-center gap-4">
                                <input
                                    type="number"
                                    min="0"
                                    max={crit.maxPoints}
                                    value={scores[currentCountry]?.[crit.id] ?? ''}
                                    onChange={(e) => handlePointChange(crit.id, Math.max(0, Math.min(parseInt(e.target.value) || 0, crit.maxPoints)))}
                                    className="w-20 p-2 text-center border-gray-300 rounded-md shadow-sm"
                                    placeholder="0"
                                />
                                <StarRating 
                                    maxStars={crit.maxPoints}
                                    currentRating={scores[currentCountry]?.[crit.id] ?? 0}
                                    onRatingChange={(rating) => handlePointChange(crit.id, rating)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="text-right mt-6 font-bold text-xl">
                    Total for {currentCountry}: <span className="text-blue-700 tabular-nums">{calculateTotal(currentCountry)}</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={() => setCurrentTeamIndex(i => i - 1)}
                    disabled={currentTeamIndex === 0}
                    className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous Team
                </button>
                
                {currentTeamIndex === COUNTRIES.length - 1 ? (
                    <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 text-lg">
                        {isSubmitting ? 'Submitting...' : 'Submit All Scores'}
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentTeamIndex(i => i + 1)}
                        disabled={currentTeamIndex === COUNTRIES.length - 1}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        Next Team
                    </button>
                )}
            </div>
        </div>
    );
};

export default MentorScoringForm;