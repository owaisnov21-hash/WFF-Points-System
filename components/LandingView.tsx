import React, { useState, useMemo } from 'react';
import { PointsEntry, DirectorScore, Activity, Country, User, LandingPageContent, NegativeMarking, BonusPoint, VotingSession, VotingSettings, Student, PublicVote, AggregatedResult } from '../types';
import PublicView from './PublicView';
import Login from './Login';
import VotingModal from './VotingModal';
import TopThreePodium from './TopThreePodium';

interface LandingViewProps {
  mentorScores: PointsEntry[];
  directorScores: DirectorScore[];
  activities: Activity[];
  countriesData: Country[];
  users: (User & { password?: string })[]; // Kept for prototype compatibility, but login logic is now server-side.
  onLogin: (username: string, password: string) => Promise<{success: boolean, message?: string}>;
  landingPageContent: LandingPageContent;
  negativeMarkings: NegativeMarking[];
  bonusPoints: BonusPoint[];
  votingSessions: VotingSession[];
  // Live Voting Props
  votingSettings: VotingSettings;
  students: Student[];
  publicVotes: PublicVote[];
  setPublicVotes: React.Dispatch<React.SetStateAction<PublicVote[]>>;
}

const LandingView: React.FC<LandingViewProps> = (props) => {
  const { 
      mentorScores, directorScores, activities, countriesData, onLogin, landingPageContent, negativeMarkings, bonusPoints, votingSessions,
      votingSettings, students, publicVotes, setPublicVotes
  } = props;
  const [showLogin, setShowLogin] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showVoting, setShowVoting] = useState(false);

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

  const topThree = sortedData.slice(0, 3);

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const handleVoteSubmit = (team_country: string, voterIdentifier: string) => {
    if (!votingSettings.id) {
        console.error("Attempted to vote without an active session ID.");
        return;
    }
    const newVote: PublicVote = {
      id: Date.now(),
      sessionId: votingSettings.id,
      team_country,
      voterIdentifier,
      timestamp: new Date().toISOString(),
    };
    setPublicVotes(prev => [...prev, newVote]);
    if (votingSettings.type === 'public') {
      localStorage.setItem(`wff-public-vote-cast-${votingSettings.id}`, 'true');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div 
        className="relative h-[calc(100vh-69px)] flex items-center justify-center text-white bg-gray-900 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: landingPageContent.backgroundUrl ? `url(${landingPageContent.backgroundUrl})` : undefined }}
      >
        {/* Animated Background or solid color overlay if image exists */}
        <div className={`absolute inset-0 ${landingPageContent.backgroundUrl ? 'bg-black bg-opacity-50' : 'bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600'}`}></div>
        {!landingPageContent.backgroundUrl && <>
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-yellow-400 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-glow"></div>
            <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-teal-400 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-glow animation-delay-2000"></div>
            <div className="absolute -top-16 right-16 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-glow animation-delay-4000"></div>
        </>}
        
        <div className="z-10 text-center p-4">
           {landingPageContent.mainLogoUrl ? (
                <img src={landingPageContent.mainLogoUrl} alt="World Fusion Fest Logo" className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-6 object-contain" />
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-6 text-white opacity-80" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.998 5.998 0 0116 10c0 .343-.011.683-.033 1.014a.75.75 0 01-1.465-.389A4.498 4.498 0 0013 10a1 1 0 10-2 0v.5a3.5 3.5 0 01-3.5 3.5 3.5 3.5 0 01-3.5-3.5v-2.027c0-.265-.105-.52-.293-.707a6.004 6.004 0 01-2.375-2.265z" clipRule="evenodd" />
                </svg>
            )}

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
            {landingPageContent.mainHeading}
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto">
            {landingPageContent.description}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            {votingSettings.isOpen && (
                 <button 
                    onClick={() => setShowVoting(true)} 
                    className="px-8 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 animate-pulse"
                >
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a2 2 0 00-1.8 2.4z" /></svg>
                        <span>Live Voting is Open!</span>
                    </div>
                </button>
            )}
            <button 
                onClick={handleShowLeaderboard} 
                className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
                View Leaderboard
            </button>
            <button 
                onClick={() => setShowLogin(true)} 
                className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 border border-pink-500"
            >
                Participant Login
            </button>
          </div>
        </div>
      </div>
      
       {/* Top 3 Podium Section */}
      {topThree.length >= 3 && (
        <div className="py-16 lg:py-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Current Top 3
                    </h2>
                    <p className="mt-2 text-lg text-gray-500">
                        The competition is heating up! Here are the current leaders.
                    </p>
                </div>
                <TopThreePodium topTeams={topThree} countriesData={countriesData} />
            </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
         <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={() => setShowLeaderboard(false)}>
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-gray-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={() => setShowLeaderboard(false)} 
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
                    aria-label="Close leaderboard"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="overflow-y-auto">
                    <div className="p-4 md:p-8">
                        <PublicView {...{ mentorScores, directorScores, activities, countriesData, negativeMarkings, bonusPoints, votingSessions, publicVotes, votingSettings }} />
                    </div>
                </div>
            </div>
        </div>
      )}
      
      {/* Login Modal */}
      {showLogin && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300" 
            onClick={() => setShowLogin(false)}
        >
          <div onClick={e => e.stopPropagation()} className="transform transition-transform duration-300 scale-100">
            <Login onLogin={onLogin} />
          </div>
        </div>
      )}
      
      {/* Voting Modal */}
      {showVoting && (
        <VotingModal 
            onClose={() => setShowVoting(false)}
            onSubmit={handleVoteSubmit}
            settings={votingSettings}
            students={students}
            countries={countriesData}
            existingVotes={publicVotes}
        />
      )}
    </>
  );
};

export default LandingView;
