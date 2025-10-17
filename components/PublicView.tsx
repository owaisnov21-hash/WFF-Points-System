import React from 'react';
import { PointsEntry, DirectorScore, Activity, Country, NegativeMarking, BonusPoint, VotingSession, PublicVote, VotingSettings } from '../types';
import LiveScoresView from './LiveScoresView';
import VotingResultsGraph from './VotingResultsGraph';

interface PublicViewProps {
  mentorScores: PointsEntry[];
  directorScores: DirectorScore[];
  activities: Activity[];
  countriesData: Country[];
  negativeMarkings: NegativeMarking[];
  bonusPoints: BonusPoint[];
  votingSessions: VotingSession[];
  publicVotes: PublicVote[];
  votingSettings: VotingSettings;
}

const PublicView: React.FC<PublicViewProps> = (props) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Live Leaderboard
            </h1>
            <p className="mt-2 text-base text-gray-500">
            Scores are updated in real-time as they are submitted.
            </p>
        </div>
        <LiveScoresView {...props} isPublicView />
      </div>

      {(props.votingSettings.isOpen || props.publicVotes.length > 0) && (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Live Voting Summary
                </h1>
                <p className="mt-2 text-base text-gray-500">
                    Current standings based on public votes.
                </p>
            </div>
            <VotingResultsGraph 
                publicVotes={props.publicVotes}
                countriesData={props.countriesData}
                showCounts={false}
            />
        </div>
      )}
    </div>
  );
};

export default PublicView;