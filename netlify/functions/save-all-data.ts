import { db } from '../../db/client';
import * as schema from '../../db/schema';
import { AppBackupState, PointsEntry, PointsState } from '../../types';
import { CRITERIA_KEYS } from '../../constants';

type Handler = (event: any, context: any) => Promise<{ statusCode: number; body: string; headers?: any }>;

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data: AppBackupState = JSON.parse(event.body);

        await db.transaction(async (tx) => {
            // Clear existing data
            await tx.delete(schema.players);
            await tx.delete(schema.criteria);
            await tx.delete(schema.mentorScores);
            await tx.delete(schema.directorScores);
            await tx.delete(schema.negativeMarkings);
            await tx.delete(schema.bonusPoints);
            await tx.delete(schema.votingSessions);
            await tx.delete(schema.publicVotes);
            await tx.delete(schema.activities);
            await tx.delete(schema.users);
            await tx.delete(schema.countries);
            await tx.delete(schema.students);
            await tx.delete(schema.appSettings);

            // Insert new data
            if (data.countriesData.length) {
                await tx.insert(schema.countries).values(data.countriesData.map(c => ({
                    name: c.name, flag: c.flag, imageUrl: c.imageUrl, leaderNames: c.leaderNames, assignedMentors: c.assignedMentors, courseName: c.courseName, color: c.color
                })));
                const allPlayers = data.countriesData.flatMap(c => c.players.map(p => ({...p, countryName: c.name})));
                if(allPlayers.length) await tx.insert(schema.players).values(allPlayers);
            }
            if (data.users.length) await tx.insert(schema.users).values(data.users.map(u => ({...u, password: u.password || '123'}))); // Ensure password is not null
            if (data.activities.length) {
                await tx.insert(schema.activities).values(data.activities.map(a => ({ id: a.id, name: a.name, type: a.type, createdBy: a.createdBy, maxPoints: a.maxPoints })));
                const allCriteria = data.activities.flatMap(a => (a.criteria || []).map(c => ({ ...c, activityId: a.id })));
                if (allCriteria.length) await tx.insert(schema.criteria).values(allCriteria);
            }
             if (data.mentorScores.length) {
                const scoresToInsert = data.mentorScores.map(score => {
                    const {id, activityId, mentor_name, team_country, total_points, timestamp, ...pointsState} = score;
                    return {
                        activityId,
                        mentorName: mentor_name,
                        teamCountry: team_country,
                        totalPoints: total_points,
                        timestamp: new Date(timestamp),
                        pointsState: pointsState as PointsState,
                    };
                });
                await tx.insert(schema.mentorScores).values(scoresToInsert);
            }
            if (data.directorScores.length) await tx.insert(schema.directorScores).values(data.directorScores.map(({id, ...s}) => ({ ...s, teamCountry: s.team_country })));
            if (data.negativeMarkings.length) await tx.insert(schema.negativeMarkings).values(data.negativeMarkings.map(({id, ...s}) => ({ ...s, teamCountry: s.team_country })));
            if (data.bonusPoints.length) await tx.insert(schema.bonusPoints).values(data.bonusPoints.map(({id, ...s}) => ({ ...s, teamCountry: s.team_country })));
            if (data.votingSessions.length) await tx.insert(schema.votingSessions).values(data.votingSessions.map(({id, ...s}) => ({ ...s, teamCountry: s.team_country })));
            if (data.students.length) await tx.insert(schema.students).values(data.students);
            if (data.publicVotes.length) await tx.insert(schema.publicVotes).values(data.publicVotes.map(({id, ...s}) => ({ ...s, teamCountry: s.team_country })));

            await tx.insert(schema.appSettings).values({ id: 1, headerLogoUrl: data.headerLogoUrl, landingPageContent: data.landingPageContent, votingSettings: data.votingSettings });
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Data saved successfully.' }),
        };
    } catch (error) {
        console.error('Error saving data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save data.' }),
        };
    }
};
