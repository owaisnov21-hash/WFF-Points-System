import React from 'react';
import { Country, AggregatedResult } from '../types';


interface TopThreePodiumProps {
    topTeams: AggregatedResult[];
    countriesData: Country[];
}

const PodiumCard: React.FC<{ team: AggregatedResult, country: Country | undefined, rank: number }> = ({ team, country, rank }) => {
    const rankStyles = [
        { // Rank 1
            bgColor: 'bg-yellow-400',
            textColor: 'text-yellow-800',
            borderColor: 'border-yellow-500',
            shadow: 'shadow-lg shadow-yellow-500/30',
        },
        { // Rank 2
            bgColor: 'bg-gray-300',
            textColor: 'text-gray-700',
            borderColor: 'border-gray-400',
            shadow: 'shadow-md',
        },
        { // Rank 3
            bgColor: 'bg-orange-400',
            textColor: 'text-orange-800',
            borderColor: 'border-orange-500',
            shadow: 'shadow-md',
        }
    ];

    const style = rankStyles[rank - 1];

    return (
        <div className={`relative flex flex-col items-center p-6 bg-white rounded-xl border-4 ${style.borderColor} ${style.shadow} transform transition-transform duration-300 hover:scale-105 ${rank === 1 ? 'md:scale-110 md:hover:scale-115 z-10' : ''}`}>
            <div className={`absolute -top-6 px-4 py-2 ${style.bgColor} rounded-full text-2xl font-extrabold ${style.textColor}`}>
                #{rank}
            </div>
            <div className="mt-8 w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-4 shadow-lg" style={{ borderColor: country?.color || '#e5e7eb' }}>
                {country?.imageUrl ? (
                    <img src={country.imageUrl} alt={country.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-5xl">{country?.flag}</span>
                )}
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-800 text-center">{team.team_country}</h3>
            <p className={`mt-2 text-4xl font-black ${style.textColor} tabular-nums`}>{team.total_points}</p>
        </div>
    );
};


const TopThreePodium: React.FC<TopThreePodiumProps> = ({ topTeams, countriesData }) => {
    if (topTeams.length < 3) return (
        <p className="text-center text-gray-500">The leaderboard is being calculated. Check back soon for the top performers!</p>
    );

    const [first, second, third] = topTeams;
    const firstCountry = countriesData.find(c => c.name === first.team_country);
    const secondCountry = countriesData.find(c => c.name === second.team_country);
    const thirdCountry = countriesData.find(c => c.name === third.team_country);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-end max-w-4xl mx-auto">
            {/* Rank 2 */}
            <div className="md:mt-8">
                {second && <PodiumCard team={second} country={secondCountry} rank={2} />}
            </div>
            {/* Rank 1 */}
            <div>
                {first && <PodiumCard team={first} country={firstCountry} rank={1} />}
            </div>
            {/* Rank 3 */}
            <div className="md:mt-8">
                {third && <PodiumCard team={third} country={thirdCountry} rank={3} />}
            </div>
        </div>
    );
};

export default TopThreePodium;
