import React, { useState, useEffect } from 'react';
import { Activity, Criterion, PointsEntry, DirectorScore } from '../../../types';

interface ManageActivitiesProps {
    activities: Activity[];
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
    mentorScores: PointsEntry[];
    directorScores: DirectorScore[];
}

const initialCriterion: Criterion = { id: `c-${Date.now()}`, name: '', maxPoints: 10 };
const initialFormState = {
    name: '',
    type: 'judged' as 'judged' | 'direct',
    criteria: [initialCriterion],
    maxPoints: 10,
};

const ManageActivities: React.FC<ManageActivitiesProps> = ({ activities, setActivities, mentorScores, directorScores }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
    const [formState, setFormState] = useState(initialFormState);

    useEffect(() => {
        if (editingActivity) {
            setFormState({
                name: editingActivity.name,
                type: editingActivity.type,
                criteria: editingActivity.criteria || [initialCriterion],
                maxPoints: editingActivity.maxPoints || 10,
            });
            setIsFormVisible(true);
        } else {
            setFormState(initialFormState);
        }
    }, [editingActivity]);

    const resetForm = () => {
        setFormState(initialFormState);
        setEditingActivity(null);
        setIsFormVisible(false);
    };

    const handleFormChange = (field: keyof typeof formState, value: any) => {
        setFormState(prev => ({...prev, [field]: value }));
    };

    const handleCriterionChange = (index: number, field: keyof Omit<Criterion, 'id'>, value: string | number) => {
        const newCriteria = [...formState.criteria];
        if (field === 'maxPoints' && typeof value === 'string') {
            newCriteria[index][field] = parseInt(value) || 0;
        } else {
            (newCriteria[index] as any)[field] = value;
        }
        handleFormChange('criteria', newCriteria);
    };

    const addCriterion = () => {
        handleFormChange('criteria', [...formState.criteria, { id: `c-${Date.now()}`, name: '', maxPoints: 10 }]);
    };

    const removeCriterion = (index: number) => {
        handleFormChange('criteria', formState.criteria.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.name.trim()) {
            alert('Activity Name is required.');
            return;
        }
        if (formState.type === 'judged' && formState.criteria.some(c => !c.name.trim() || c.maxPoints <= 0)) {
            alert('All Criteria must have a name and a valid Max Points value.');
            return;
        }
        if (formState.type === 'direct' && formState.maxPoints <= 0) {
            alert('Max Points must be a positive number for direct awards.');
            return;
        }

        if (editingActivity) {
            const updatedActivity: Activity = {
                ...editingActivity,
                name: formState.name,
                type: formState.type,
                criteria: formState.type === 'judged' ? formState.criteria : undefined,
                maxPoints: formState.type === 'direct' ? formState.maxPoints : undefined,
            };
            setActivities(prev => prev.map(act => act.id === editingActivity.id ? updatedActivity : act));
        } else {
            const newActivity: Activity = {
                id: `activity-${Date.now()}`,
                name: formState.name,
                type: formState.type,
                createdBy: 'admin',
                criteria: formState.type === 'judged' ? formState.criteria : undefined,
                maxPoints: formState.type === 'direct' ? formState.maxPoints : undefined,
            };
            setActivities(prev => [...prev, newActivity]);
        }
        
        resetForm();
    };

    const handleDelete = (id: string) => {
        const isUsedByMentor = mentorScores.some(score => score.activityId === id);
        const isUsedByDirector = directorScores.some(score => score.activityId === id);

        if(isUsedByMentor || isUsedByDirector) {
            alert("Cannot delete this activity because it has scores associated with it. Please delete the scores first from the 'Manage Scores' tab.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this activity? This action cannot be undone.")) {
            setActivities(prev => prev.filter(act => act.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {!isFormVisible && (
                 <button onClick={() => { setEditingActivity(null); setIsFormVisible(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    + Create New Activity
                </button>
            )}

            {isFormVisible && (
                 <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700">{editingActivity ? 'Edit' : 'Create'} Activity</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Activity Type</label>
                        <select value={formState.type} onChange={e => handleFormChange('type', e.target.value)} className="mt-1 p-2 border rounded w-full md:w-1/2 bg-white">
                            <option value="judged">Judged</option>
                            <option value="direct">Direct Award</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="activityName" className="block text-sm font-medium text-gray-700">Activity Name</label>
                        <input id="activityName" type="text" value={formState.name} onChange={e => handleFormChange('name', e.target.value)} className="mt-1 p-2 border rounded w-full md:w-1/2" required/>
                    </div>

                    {formState.type === 'judged' ? (
                        <div>
                            <h4 className="text-lg font-semibold text-gray-700 mb-2">Criteria</h4>
                            <div className="space-y-2">
                            {formState.criteria.map((crit, index) => (
                                <div key={crit.id} className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center">
                                    <input type="text" placeholder="Criterion Name" value={crit.name} onChange={e => handleCriterionChange(index, 'name', e.target.value)} className="p-2 border rounded md:col-span-4" required/>
                                    <input type="number" placeholder="Max Points" value={crit.maxPoints} onChange={e => handleCriterionChange(index, 'maxPoints', e.target.value)} className="p-2 border rounded md:col-span-2" required min="1" />
                                    <div className="md:col-span-2">
                                        <button type="button" onClick={() => removeCriterion(index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                                    </div>
                                </div>
                            ))}
                            </div>
                            <button type="button" onClick={addCriterion} className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Criterion</button>
                        </div>
                    ) : (
                         <div>
                            <label htmlFor="maxPoints" className="block text-sm font-medium text-gray-700">Max Points</label>
                            <input id="maxPoints" type="number" value={formState.maxPoints} onChange={e => handleFormChange('maxPoints', parseInt(e.target.value) || 0)} className="mt-1 p-2 border rounded w-full md:w-1/4" required min="1"/>
                        </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">{editingActivity ? 'Update' : 'Save'} Activity</button>
                        <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancel</button>
                    </div>
                </form>
            )}
            
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Activities</h3>
                <div className="space-y-4">
                {activities.map(act => (
                    <div key={act.id} className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-lg text-gray-800">{act.name}</h4>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${act.type === 'judged' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                                    {act.type === 'judged' ? 'Judged' : 'Direct Award'}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">(Created by: {act.createdBy})</span>
                            </div>
                            <div>
                                <button onClick={() => setEditingActivity(act)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4">Edit</button>
                                <button onClick={() => handleDelete(act.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                            </div>
                        </div>
                        {act.type === 'judged' && act.criteria && (
                            <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
                                {act.criteria.map(c => <li key={c.id}>{c.name}: <span className="font-semibold">{c.maxPoints} pts</span></li>)}
                            </ul>
                        )}
                        {act.type === 'direct' && (
                             <p className="mt-3 text-sm text-gray-600">Max Points: <span className="font-semibold">{act.maxPoints} pts</span></p>
                        )}
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default ManageActivities;