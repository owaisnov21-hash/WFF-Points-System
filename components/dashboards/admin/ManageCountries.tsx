import React, { useState, useEffect } from 'react';
import { Country, Player } from '../../../types';
import { convertToDirectGoogleDriveUrl } from '../../../utils';

interface ManageCountriesProps {
    countriesData: Country[];
    setCountriesData: React.Dispatch<React.SetStateAction<Country[]>>;
}

const ManageCountries: React.FC<ManageCountriesProps> = ({ countriesData, setCountriesData }) => {
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);
    const [form, setForm] = useState<Partial<Country>>({ name: '', flag: '', imageUrl: null, leaderNames: [], assignedMentors: [], courseName: '', color: '#000000', players: [] });
    
    // Local state to manage the URL input field without affecting the main state on every keystroke
    const [tempImageUrl, setTempImageUrl] = useState('');

    useEffect(() => {
        if (editingCountry) {
            setForm({...editingCountry, players: editingCountry.players || [] });
            setTempImageUrl(editingCountry.imageUrl || '');
        }
        else {
            setForm({ name: '', flag: '', imageUrl: null, leaderNames: [], assignedMentors: [], courseName: '', color: '#000000', players: [] });
            setTempImageUrl('');
        }
    }, [editingCountry]);

    const handleSave = () => {
        if (!form.name || !form.flag) return alert('Country Name and Flag are required.');
        const cleanedPlayers = (form.players || []).filter(p => p.id.trim() !== '' && p.name.trim() !== '');
        
        // Ensure the final converted URL is saved
        const finalForm = { ...form, players: cleanedPlayers, imageUrl: convertToDirectGoogleDriveUrl(tempImageUrl) };

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
            {editingCountry && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={() => setEditingCountry(null)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-semibold">{form.name ? `Edit ${form.name}` : 'Add New Country'}</h3>
                            <button onClick={() => setEditingCountry(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <div className="p-4 max-h-[80vh] overflow-y-auto">
                             <div className="p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2"><label className="font-semibold">Country Name</label><input type="text" placeholder="Country Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="p-2 border rounded w-full" /></div>
                                <div><label className="font-semibold">Flag Emoji</label><input type="text" placeholder="e.g., 🇲🇾" value={form.flag} onChange={e => setForm({ ...form, flag: e.target.value })} className="p-2 border rounded w-full" /></div>
                                <div><label className="font-semibold">Flag Color</label><input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="p-1 h-10 w-full border rounded" /></div>
                                <div className="md:col-span-2"><label className="font-semibold">Leaders (comma separated)</label><input type="text" placeholder="Leader 1, Leader 2" value={form.leaderNames?.join(', ')} onChange={e => setForm({ ...form, leaderNames: e.target.value.split(',').map(s => s.trim()) })} className="p-2 border rounded w-full" /></div>
                                <div className="md:col-span-2"><label className="font-semibold">Mentors (comma separated)</label><input type="text" value={form.assignedMentors?.join(', ')} onChange={e => setForm({ ...form, assignedMentors: e.target.value.split(',').map(s => s.trim()) })} className="p-2 border rounded w-full" /></div>
                                <div className="md:col-span-2"><label className="font-semibold">Course Name</label><input type="text" placeholder="Course Name" value={form.courseName} onChange={e => setForm({ ...form, courseName: e.target.value })} className="p-2 border rounded w-full" /></div>
                                <div className="md:col-span-2">
                                    <label className="font-semibold">Team Image URL</label>
                                    <p className="text-xs text-gray-500 mb-1">Paste a public Google Drive share link.</p>
                                    <input 
                                        type="text"
                                        placeholder="https://drive.google.com/..."
                                        value={tempImageUrl}
                                        onChange={e => setTempImageUrl(e.target.value)}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                    {tempImageUrl && <div className="mt-2"><img src={convertToDirectGoogleDriveUrl(tempImageUrl) || ''} alt="preview" className="h-20 w-20 rounded-full object-cover"/><button onClick={() => setTempImageUrl('')} className="text-red-500 text-xs mt-1">Clear</button></div>}
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
                        </div>
                    </div>
                 </div>
            )}
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

export default ManageCountries;
