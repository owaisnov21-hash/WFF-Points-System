import React, { useMemo, useState } from 'react';
import { PointsEntry, DirectorScore, Activity } from '../types';
import { COUNTRIES } from '../constants';

interface PublicViewProps {
  mentorScores: PointsEntry[];
  directorScores: DirectorScore[];
  activities: Activity[];
}

type AggregatedResult = {
  team_country: string;
  total_points: number;
  mentor_avg_points: number;
  director_total_points: number;
  rating_count: number;
};

type SortKey = keyof AggregatedResult;

const PublicView: React.FC<PublicViewProps> = ({ mentorScores, directorScores, activities }) => {
  const [sortKey, setSortKey] = useState<SortKey>('total_points');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  const teamData = useMemo<AggregatedResult[]>(() => {
    const mentorAverages = COUNTRIES.reduce<Record<string, { total: number; count: number }>>((acc, country) => {
      const scoresForCountry = mentorScores.filter(s => s.team_country === country);
      if (scoresForCountry.length > 0) {
        acc[country] = {
          total: scoresForCountry.reduce((sum, s) => sum + s.total_points, 0),
          count: scoresForCountry.length,
        };
      }
      return acc;
    }, {});
    
    const directorTotals = COUNTRIES.reduce<Record<string, number>>((acc, country) => {
      const scoresForCountry = directorScores.filter(s => s.team_country === country);
      if (scoresForCountry.length > 0) {
        acc[country] = scoresForCountry.reduce((sum, s) => sum + s.points, 0);
      }
      return acc;
    }, {});

    return COUNTRIES.map(country => {
      const mentorData = mentorAverages[country] || { total: 0, count: 0 };
      const directorData = directorTotals[country] || 0;
      const mentorAvg = mentorData.count > 0 ? mentorData.total / mentorData.count : 0;
      const total = mentorAvg + directorData;

      return {
        team_country: country,
        total_points: parseFloat(total.toFixed(2)),
        mentor_avg_points: parseFloat(mentorAvg.toFixed(2)),
        director_total_points: directorData,
        rating_count: mentorData.count,
      };
    });
  }, [mentorScores, directorScores]);

  const sortedData = useMemo(() => {
    return [...teamData].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
      return a.team_country.localeCompare(b.team_country);
    });
  }, [teamData, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };
  
  const getSortIcon = (key: SortKey) => {
    if (key !== sortKey) return <span className="opacity-30">↕️</span>;
    return sortDirection === 'desc' ? '🔽' : '🔼';
  };

  const TeamDetailView = ({ country }: { country: string }) => {
    const countryMentorScores = mentorScores.filter(e => e.team_country === country).sort((a, b) => b.total_points - a.total_points);
    const activity = activities.find(a => a.id === (countryMentorScores[0]?.activityId || ''));
    
    return (
        <td colSpan={5} className="p-4 bg-gray-50">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">Score Breakdown for {country}</h4>
            <div className="space-y-4">
                {countryMentorScores.length > 0 && activity && activity.type === 'judged' && activity.criteria && (
                    <div>
                        <h5 className="font-bold text-blue-700">{activity.name} (Mentor Scores)</h5>
                         <div className="overflow-x-auto mt-2">
                          <table className="min-w-full bg-white rounded-md shadow text-sm">
                            <thead className="bg-blue-100">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-blue-900 uppercase">Mentor</th>
                                {activity.criteria.map(c => <th key={c.id} title={c.name} className="px-2 py-2 text-center text-xs font-medium text-blue-900 uppercase">{c.name.substring(0,3)}.</th>)}
                                <th className="px-3 py-2 text-left text-xs font-medium text-blue-900 uppercase">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-100">
                              {countryMentorScores.map(entry => (
                                <tr key={entry.id}>
                                  <td className="px-3 py-2 font-medium">{entry.mentor_name}</td>
                                  {activity.criteria!.map(c => <td key={c.id} className="px-2 py-2 text-center tabular-nums">{entry[c.name.toLowerCase().replace(/ /g, '_') as keyof PointsEntry] as number}</td>)}
                                  <td className="px-3 py-2 font-bold tabular-nums">{entry.total_points}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                    </div>
                )}
                 {directorScores.filter(s => s.team_country === country).length === 0 && countryMentorScores.length === 0 && (
                    <p className="text-center text-gray-500 italic py-4">No scores have been submitted for this team yet.</p>
                )}
            </div>
        </td>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Public Leaderboard</h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Rank</th>
              <th onClick={() => handleSort('team_country')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Team {getSortIcon('team_country')}</th>
              <th onClick={() => handleSort('total_points')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Total Points {getSortIcon('total_points')}</th>
              <th onClick={() => handleSort('mentor_avg_points')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Mentor Avg {getSortIcon('mentor_avg_points')}</th>
              <th onClick={() => handleSort('rating_count')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Ratings {getSortIcon('rating_count')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, index) => (
              <React.Fragment key={row.team_country}>
                <tr onClick={() => setExpandedTeam(row.team_country === expandedTeam ? null : row.team_country)} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-600">{row.total_points > 0 ? index + 1 : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">{row.team_country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-blue-700 font-bold tabular-nums">{row.total_points}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 font-semibold tabular-nums">{row.mentor_avg_points}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600 tabular-nums">{row.rating_count}</td>
                </tr>
                {expandedTeam === row.team_country && (
                  <tr>
                    <TeamDetailView country={row.team_country} />
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PublicView;