import React, { useState, useEffect } from 'react';
import { Country, PublicVote, Student, VotingSettings } from '../types';

interface VotingModalProps {
    onClose: () => void;
    onSubmit: (team_country: string, voterIdentifier: string) => void;
    settings: VotingSettings;
    students: Student[];
    countries: Country[];
    existingVotes: PublicVote[];
}

type VotingStep = 'identifier' | 'voting' | 'voted' | 'error' | 'loading';

const VotingModal: React.FC<VotingModalProps> = ({ onClose, onSubmit, settings, students, countries, existingVotes }) => {
    const [step, setStep] = useState<VotingStep>('loading');
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState('');
    const [verifiedStudent, setVerifiedStudent] = useState<Student | null>(null);

    // Effect to check if user has already voted
    useEffect(() => {
        if (settings.type === 'public') {
            if (settings.id) {
                const hasVoted = localStorage.getItem(`wff-public-vote-cast-${settings.id}`) === 'true';
                if (hasVoted) {
                    setStep('voted');
                } else {
                    setStep('voting');
                }
            } else {
                setError("There is no active voting session.");
                setStep('error');
            }
        } else { // internal
            setStep('identifier');
        }
    }, [settings.type, settings.id]);
    
    const handleIdVerification = () => {
        const id = studentId.trim();
        if (!id) {
            setError('Please enter your Student ID.');
            return;
        }

        if (!settings.id) {
            setError("There is no active voting session.");
            setStep('error');
            return;
        }

        const student = students.find(s => s.id.toLowerCase() === id.toLowerCase());
        if (!student) {
            setError('Invalid Student ID. Please try again.');
            return;
        }

        const hasVoted = existingVotes.some(v => v.sessionId === settings.id && v.voterIdentifier.toLowerCase() === id.toLowerCase());
        if (hasVoted) {
            setError('This Student ID has already been used to vote in this session.');
            setStep('error');
            return;
        }
        
        setError('');
        setVerifiedStudent(student);
        setStep('voting');
    };

    const handleVote = (countryName: string) => {
        const identifier = settings.type === 'internal' ? verifiedStudent!.id : 'public_user';
        onSubmit(countryName, identifier);
        setStep('voted');
    };

    const renderContent = () => {
        switch(step) {
            case 'loading':
                return <p className="text-center p-8">Loading...</p>;
            
            case 'identifier':
                return (
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-center mb-2">Student Verification</h3>
                        <p className="text-center text-gray-600 mb-4">Please enter your ILMA Student ID to proceed.</p>
                        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4">{error}</p>}
                        <div className="flex gap-2">
                             <input 
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="e.g., 2021-IU-123456"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <button onClick={handleIdVerification} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Verify</button>
                        </div>
                    </div>
                );

            case 'voting':
                return (
                    <div className="p-6">
                         <h3 className="text-xl font-bold text-center mb-2">{settings.name}</h3>
                         {settings.type === 'internal' && verifiedStudent && (
                             <p className="text-center text-green-700 mb-4">Welcome, <strong>{verifiedStudent.name}</strong>! Please cast your vote.</p>
                         )}
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 max-h-[60vh] overflow-y-auto p-2 bg-gray-100 rounded-lg">
                             {countries.map(country => (
                                 <button key={country.name} onClick={() => handleVote(country.name)} className="p-3 border rounded-lg flex flex-col items-center justify-center space-y-2 hover:shadow-lg hover:border-blue-500 transition-all duration-200 bg-white">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden text-4xl border-4" style={{ borderColor: country.color }}>
                                        {country.imageUrl ? <img src={country.imageUrl} alt={country.name} className="w-full h-full object-cover" /> : <span>{country.flag}</span>}
                                    </div>
                                    <div className="font-semibold text-gray-800 text-center truncate w-full">{country.name}</div>
                                </button>
                             ))}
                         </div>
                    </div>
                );
            
            case 'voted':
                 return (
                    <div className="p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-2xl font-bold text-gray-800">Thank You!</h3>
                        <p className="text-gray-600 mt-2">Your vote has been counted.</p>
                        <button onClick={onClose} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Close</button>
                    </div>
                 );
            
            case 'error':
                 return (
                    <div className="p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-2xl font-bold text-gray-800">Error</h3>
                        <p className="text-gray-600 mt-2">{error}</p>
                        <button onClick={onClose} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Close</button>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
                    aria-label="Close voting"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {renderContent()}
            </div>
        </div>
    );
};

export default VotingModal;