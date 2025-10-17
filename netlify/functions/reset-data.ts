import { db } from '../../db/client';
import * as schema from '../../db/schema';
import {
  INITIAL_USERS,
  INITIAL_ACTIVITIES,
  INITIAL_COUNTRIES_DATA,
  INITIAL_LANDING_PAGE_CONTENT,
  INITIAL_VOTING_SETTINGS,
} from '../../constants';

type Handler = (event: any, context: any) => Promise<{ statusCode: number; body: string; headers?: any }>;

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        console.log('Resetting database...');
        await db.transaction(async (tx) => {
            // Order of deletion matters due to foreign key constraints
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

            // Reseed data
            for (const country of INITIAL_COUNTRIES_DATA) {
                const { players, ...countryData } = country;
                await tx.insert(schema.countries).values(countryData);
                if (players.length > 0) {
                    await tx.insert(schema.players).values(players.map(p => ({ ...p, countryName: country.name })));
                }
            }
            await tx.insert(schema.users).values(INITIAL_USERS);
            for (const activity of INITIAL_ACTIVITIES) {
                const { criteria, ...activityData } = activity;
                await tx.insert(schema.activities).values(activityData);
                if (criteria && criteria.length > 0) {
                    await tx.insert(schema.criteria).values(criteria.map(c => ({ ...c, activityId: activity.id })));
                }
            }
            await tx.insert(schema.appSettings).values({
                id: 1,
                headerLogoUrl: null,
                landingPageContent: INITIAL_LANDING_PAGE_CONTENT,
                votingSettings: INITIAL_VOTING_SETTINGS,
            });
        });
        console.log('Database reset complete.');

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Database reset successfully.' }),
        };

    } catch (error) {
        console.error('Error resetting database:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to reset database.' }),
        };
    }
};
