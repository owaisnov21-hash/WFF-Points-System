import React, { useState, useCallback, useEffect } from 'react';
import { User, PointsEntry, Activity, DirectorScore, Country, LandingPageContent, NegativeMarking, BonusPoint, VotingSession, VotingSettings, Student, PublicVote, AppBackupState } from './types';
import { INITIAL_USERS, INITIAL_ACTIVITIES, INITIAL_MENTOR_SCORES, INITIAL_COUNTRIES_DATA, INITIAL_LANDING_PAGE_CONTENT, INITIAL_VOTING_SETTINGS, INITIAL_STUDENTS, INITIAL_PUBLIC_VOTES, INITIAL_BONUS_POINTS, INITIAL_VOTING_SESSIONS, INITIAL_DIRECTOR_SCORES, INITIAL_HEADER_LOGO_URL } from './constants';

import Header from './components/Header';
import LandingView from './components/LandingView';
import AdminDashboard from './components/dashboards/AdminDashboard';
import DirectorDashboard from './components/dashboards/DirectorDashboard';
import MentorDashboard from './components/dashboards/MentorDashboard';
import CountryDashboard from './components/dashboards/CountryDashboard';

const LOCAL_STORAGE_KEY = 'worldFusionFestData';

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize state from constants first
  const [headerLogoUrl, setHeaderLogoUrl] = useState<string | null>(INITIAL_HEADER_LOGO_URL);
  const [landingPageContent, setLandingPageContent] = useState<LandingPageContent>(INITIAL_LANDING_PAGE_CONTENT);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [mentorScores, setMentorScores] = useState<PointsEntry[]>(INITIAL_MENTOR_SCORES);
  const [directorScores, setDirectorScores] = useState<DirectorScore[]>(INITIAL_DIRECTOR_SCORES);
  const [countriesData, setCountriesData] = useState<Country[]>(INITIAL_COUNTRIES_DATA);
  const [negativeMarkings, setNegativeMarkings] = useState<NegativeMarking[]>([]);
  const [bonusPoints, setBonusPoints] = useState<BonusPoint[]>(INITIAL_BONUS_POINTS);
  const [votingSessions, setVotingSessions] = useState<VotingSession[]>(INITIAL_VOTING_SESSIONS);
  const [votingSettings, setVotingSettings] = useState<VotingSettings>(INITIAL_VOTING_SETTINGS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [publicVotes, setPublicVotes] = useState<PublicVote[]>(INITIAL_PUBLIC_VOTES);
  
  // State for JSONBin.io Integration
  const [jsonBinApiKey, setJsonBinApiKey] = useState<string | null>(null);
  const [jsonBinId, setJsonBinId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const setStateFromData = (data: AppBackupState) => {
      setHeaderLogoUrl(data.headerLogoUrl ?? INITIAL_HEADER_LOGO_URL);
      setLandingPageContent(data.landingPageContent ?? INITIAL_LANDING_PAGE_CONTENT);
      setUsers(data.users ?? INITIAL_USERS);
      setActivities(data.activities ?? INITIAL_ACTIVITIES);
      setMentorScores(data.mentorScores ?? INITIAL_MENTOR_SCORES);
      setDirectorScores(data.directorScores ?? INITIAL_DIRECTOR_SCORES);
      setCountriesData(data.countriesData ?? INITIAL_COUNTRIES_DATA);
      setNegativeMarkings(data.negativeMarkings ?? []);
      setBonusPoints(data.bonusPoints ?? INITIAL_BONUS_POINTS);
      setVotingSessions(data.votingSessions ?? INITIAL_VOTING_SESSIONS);
      setVotingSettings(data.votingSettings ?? INITIAL_VOTING_SETTINGS);
      setStudents(data.students ?? INITIAL_STUDENTS);
      setPublicVotes(data.publicVotes ?? INITIAL_PUBLIC_VOTES);
      setJsonBinApiKey(data.jsonBinApiKey ?? null);
      setJsonBinId(data.jsonBinId ?? null);
  };

  // --- DATA HYDRATION ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const localDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
        const localData: AppBackupState | null = localDataString ? JSON.parse(localDataString) : null;
        
        let remoteData: AppBackupState | null = null;
        const apiKey = localData?.jsonBinApiKey ?? null;
        const binId = localData?.jsonBinId ?? null;
        
        if (apiKey && binId) {
          console.log("Attempting to fetch data from JSONBin.io...");
          const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
            headers: { 'X-Access-Key': apiKey }
          });
          if (response.ok) {
            const jsonData = await response.json();
            remoteData = jsonData.record;
            console.log("Data successfully loaded from JSONBin.io.");
          } else {
            console.warn(`Failed to fetch from JSONBin.io (status: ${response.status}), falling back to local storage.`);
          }
        }
        
        if (remoteData) {
            setStateFromData(remoteData);
        } else if (localData) {
            console.log("Loading data from local storage.");
            setStateFromData(localData);
        }
      } catch (error) {
        console.error("Could not load data. Proceeding with initial state.", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // --- PERSISTENCE ---
  const appState: AppBackupState = { headerLogoUrl, landingPageContent, users, activities, mentorScores, directorScores, countriesData, negativeMarkings, bonusPoints, votingSessions, votingSettings, students, publicVotes, jsonBinApiKey, jsonBinId };
  
  useEffect(() => {
    if (isLoading) return;

    const saveData = async () => {
      setSaveStatus('saving');
      try {
        const fullStateJson = JSON.stringify(appState);
        // Always save the complete data to local storage as a backup
        localStorage.setItem(LOCAL_STORAGE_KEY, fullStateJson);

        if (jsonBinApiKey && jsonBinId) {
          console.log("Saving full data to JSONBin.io...");
          
          const response = await fetch(`https://api.jsonbin.io/v3/b/${jsonBinId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Access-Key': jsonBinApiKey
            },
            body: fullStateJson,
          });

          if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`JSONBin API Error: ${response.statusText} - ${errorBody}`);
          }
        }
        setSaveStatus('saved');
      } catch (error) {
        console.error("Failed to save state", error);
        setSaveStatus('error');
      }
    };

    const handler = setTimeout(saveData, 1500);
    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(appState), isLoading, jsonBinApiKey, jsonBinId]);


  // --- HANDLERS ---
  const handleLogin = async (username: string, password: string): Promise<{success: boolean, message?: string}> => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        setCurrentUser(user);
        return { success: true };
    } else {
        return { success: false, message: "Invalid username or password." };
    }
  };

  const handleLogout = () => setCurrentUser(null);
  
  const handleMentorSubmission = useCallback((newScores: Omit<PointsEntry, 'id' | 'timestamp'>[]) => {
    if (!currentUser || newScores.length === 0) return;
    
    const activityId = newScores[0].activityId;
    const otherScores = mentorScores.filter(s => !(s.mentor_name === currentUser.username && s.activityId === activityId));
    
    const newScoresWithIds = newScores.map(score => ({
        ...score,
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
    }));

    setMentorScores([...otherScores, ...newScoresWithIds]);
  }, [currentUser, mentorScores]);

  const handleResetData = useCallback(async () => {
    if (window.confirm("WARNING: This will delete ALL data from your browser's local storage and reset it to its initial state. This cannot be undone. Are you sure you want to proceed?")) {
        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            window.location.reload(); // Reload to re-initialize from constants
        } catch (error) {
            console.error("Failed to reset data", error);
            alert("An error occurred while trying to reset data.");
        }
    }
  }, []);

  // --- VIEW RENDERING ---
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xl font-semibold">Loading World Fusion Fest...</p>
            </div>
        </div>
    );
  }

  const renderDashboardContent = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard 
                    users={users} 
                    setUsers={setUsers}
                    activities={activities}
                    setActivities={setActivities}
                    mentorScores={mentorScores}
                    setMentorScores={setMentorScores}
                    directorScores={directorScores}
                    setDirectorScores={setDirectorScores}
                    headerLogoUrl={headerLogoUrl}
                    setHeaderLogoUrl={setHeaderLogoUrl}
                    landingPageContent={landingPageContent}
                    setLandingPageContent={setLandingPageContent}
                    onResetData={handleResetData}
                    countriesData={countriesData}
                    setCountriesData={setCountriesData}
                    negativeMarkings={negativeMarkings}
                    setNegativeMarkings={setNegativeMarkings}
                    bonusPoints={bonusPoints}
                    setBonusPoints={setBonusPoints}
                    votingSessions={votingSessions}
                    setVotingSessions={setVotingSessions}
                    votingSettings={votingSettings}
                    setVotingSettings={setVotingSettings}
                    students={students}
                    setStudents={setStudents}
                    publicVotes={publicVotes}
                    setPublicVotes={setPublicVotes}
                    jsonBinApiKey={jsonBinApiKey}
                    setJsonBinApiKey={setJsonBinApiKey}
                    jsonBinId={jsonBinId}
                    setJsonBinId={setJsonBinId}
                />;
      case 'director':
        return <DirectorDashboard 
                    activities={activities}
                    directorScores={directorScores}
                    setDirectorScores={setDirectorScores}
                    currentUser={currentUser}
                    mentorScores={mentorScores}
                    countriesData={countriesData}
                    negativeMarkings={negativeMarkings}
                    setNegativeMarkings={setNegativeMarkings}
                    bonusPoints={bonusPoints}
                    setBonusPoints={setBonusPoints}
                    votingSessions={votingSessions}
                    setVotingSessions={setVotingSessions}
                    publicVotes={publicVotes}
                    votingSettings={votingSettings}
               />;
      case 'mentor':
      case 'judge':
        return <MentorDashboard 
                    currentUser={currentUser} 
                    activities={activities}
                    myScores={mentorScores.filter(s => s.mentor_name === currentUser.username)}
                    onFormSubmit={handleMentorSubmission}
                    countriesData={countriesData}
                    mentorScores={mentorScores}
                    directorScores={directorScores}
                    negativeMarkings={negativeMarkings}
                    setNegativeMarkings={setNegativeMarkings}
                    bonusPoints={bonusPoints}
                    setBonusPoints={setBonusPoints}
                    votingSessions={votingSessions}
                    publicVotes={publicVotes}
                    votingSettings={votingSettings}
                />;
      case 'country':
        const userCountryName = currentUser.country;
        if (!userCountryName) return <p className="text-center text-red-500">Error: This user account is not associated with a country.</p>;
        
        const countryData = countriesData.find(c => c.name === userCountryName);
        if (!countryData) return <p className="text-center text-red-500">Error: Country data for "{userCountryName}" could not be found.</p>;

        return <CountryDashboard
                    countryData={countryData}
                    mentorScores={mentorScores}
                    directorScores={directorScores}
                    activities={activities}
                    countriesData={countriesData}
                    negativeMarkings={negativeMarkings}
                    bonusPoints={bonusPoints}
                    votingSessions={votingSessions}
                    publicVotes={publicVotes}
                    votingSettings={votingSettings}
                />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen font-sans text-gray-800 ${currentUser ? 'bg-gray-50' : 'bg-gray-900'}`}>
      <Header currentUser={currentUser} onLogout={handleLogout} headerLogoUrl={headerLogoUrl} saveStatus={saveStatus} />
      
      {currentUser ? (
          <main className="container mx-auto p-4 md:p-8">
            {renderDashboardContent()}
          </main>
        ) : (
          <LandingView
            mentorScores={mentorScores}
            directorScores={directorScores}
            activities={activities}
            countriesData={countriesData}
            users={users}
            onLogin={handleLogin}
            landingPageContent={landingPageContent}
            negativeMarkings={negativeMarkings}
            bonusPoints={bonusPoints}
            votingSessions={votingSessions}
            votingSettings={votingSettings}
            students={students}
            publicVotes={publicVotes}
            setPublicVotes={setPublicVotes}
          />
        )}
    </div>
  );
};

export default App;