import React, { useMemo } from 'react';
import { Country, PublicVote } from '../types';

interface VotingResultsGraphProps {
    publicVotes: PublicVote[];
    countriesData: Country[];
    showCounts: boolean;
}

const VotingResultsGraph: React.FC<VotingResultsGraphProps> = ({ publicVotes, countriesData, showCounts }) => {

    const results = useMemo(() => {
        const totalVotes = publicVotes.length;
        if (totalVotes === 0) return [];

        const votesByCountry: Record<string, number> = {};
        for (const vote of publicVotes) {
            votesByCountry[vote.team_country] = (votesByCountry[vote.team_country] || 0) + 1;
        }

        return countriesData
            .map(country => {
                const votes = votesByCountry[country.name] || 0;
                return {
                    ...country,
                    votes,
                    percentage: totalVotes > 0 ? (votes / totalVotes) * 100 : 0,
                };
            })
            .sort((a, b) => b.votes - a.votes);

    }, [publicVotes, countriesData]);

    if (results.length === 0) {
        return <p className="text-center text-gray-500 p-8">No votes have been cast yet.</p>;
    }

    const maxVotes = Math.max(...results.map(r => r.votes), 1); // Avoid division by zero

    return (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
            {results.map(country => (
                <div key={country.name} className="flex items-center gap-4">
                    <div className="w-24 sm:w-32 flex items-center gap-2 font-semibold text-sm text-gray-700">
                        <span className="text-xl">{country.flag}</span>
                        <span className="truncate hidden sm:inline">{country.name}</span>
                        <span className="truncate sm:hidden">{country.name.substring(0, 3)}.</span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8">
                        <div 
                            className="h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500 ease-out"
                            style={{ 
                                width: `${(country.votes / maxVotes) * 100}%`,
                                backgroundColor: country.color,
                                minWidth: '40px',
                            }}
                        >
                             <span className="text-white font-bold text-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.4)'}}>
                                {country.percentage.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                    {showCounts && (
                        <div className="w-24 text-right font-semibold text-gray-800 tabular-nums">
                            {country.votes} vote{country.votes !== 1 && 's'}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default VotingResultsGraph;