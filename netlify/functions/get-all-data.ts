import { db } from '../../db/client';
import * as schema from '../../db/schema';
import { AppBackupState, PointsEntry, PointsState } from '../../types';
import {
  INITIAL_USERS,
  INITIAL_ACTIVITIES,
  INITIAL_COUNTRIES_DATA,
  INITIAL_LANDING_PAGE_CONTENT,
  INITIAL_VOTING_SETTINGS,
} from '../../constants';

// A helper type for Netlify's Handler
type Handler = (event: any, context: any) => Promise<{ statusCode: number; body: string; headers?: any }>;

export const handler: Handler = async (event, context) => {
  try {
    // Check if data exists. If not, seed it.
    const existingUsers = await db.select().from(schema.users).limit(1);
    if (existingUsers.length === 0) {
      console.log('Database is empty. Seeding initial data...');
      await db.transaction(async (tx) => {
        // Seed Countries
        for (const country of INITIAL_COUNTRIES_DATA) {
          const { players, ...countryData } = country;
          await tx.insert(schema.countries).values(countryData);
          if (players.length > 0) {
            await tx.insert(schema.players).values(players.map(p => ({ ...p, countryName: country.name })));
          }
        }
        // Seed Users
        await tx.insert(schema.users).values(INITIAL_USERS);
        // Seed Activities & Criteria
        for (const activity of INITIAL_ACTIVITIES) {
          const { criteria, ...activityData } = activity;
          await tx.insert(schema.activities).values(activityData);
          if (criteria && criteria.length > 0) {
            await tx.insert(schema.criteria).values(criteria.map(c => ({ ...c, activityId: activity.id })));
          }
        }
        // Seed Settings
        await tx.insert(schema.appSettings).values({
            id: 1,
            headerLogoUrl: null,
            landingPageContent: INITIAL_LANDING_PAGE_CONTENT,
            votingSettings: INITIAL_VOTING_SETTINGS,
        });
      });
      console.log('Seeding complete.');
    }

    // Fetch all data
    const [
      users,
      countries,
      players,
      activities,
      criteriaData,
      mentorScoresData,
      directorScores,
      negativeMarkings,
      bonusPoints,
      votingSessions,
      students,
      publicVotes,
      settingsData,
    ] = await Promise.all([
      db.select({ id: schema.users.id, username: schema.users.username, role: schema.users.role, country: schema.users.country }).from(schema.users),
      db.select().from(schema.countries),
      db.select().from(schema.players),
      db.select().from(schema.activities),
      db.select().from(schema.criteria),
      db.select().from(schema.mentorScores),
      db.select().from(schema.directorScores),
      db.select().from(schema.negativeMarkings),
      db.select().from(schema.bonusPoints),
      db.select().from(schema.votingSessions),
      db.select().from(schema.students),
      db.select().from(schema.publicVotes),
      db.select().from(schema.appSettings).limit(1), // Changed to limit(1) as there's only one row
    ]);

    // Reconstruct data to match frontend state shape
    const countriesData = countries.map(c => ({
        ...c,
        players: players.filter(p => p.countryName === c.name),
    }));

    const activitiesData = activities.map(a => ({
        ...a,
        criteria: criteriaData.filter(c => c.activityId === a.id),
    }));
    
    const mentorScores = mentorScoresData.map(s => {
        const pointsState = s.pointsState as PointsState;
        return {
            ...s,
            ...pointsState,
            id: s.id, // ensure id is not overwritten by pointsState
        } as unknown as PointsEntry;
    });

    const settings = settingsData[0] || { headerLogoUrl: null, landingPageContent: INITIAL_LANDING_PAGE_CONTENT, votingSettings: INITIAL_VOTING_SETTINGS };

    // FIX: Add missing jsonBinApiKey and jsonBinId to satisfy AppBackupState type
    const responsePayload: AppBackupState = {
      headerLogoUrl: settings.headerLogoUrl,
      landingPageContent: settings.landingPageContent,
      users,
      activities: activitiesData,
      mentorScores,
      directorScores,
      countriesData,
      negativeMarkings,
      bonusPoints,
      votingSessions,
      votingSettings: settings.votingSettings,
      students,
      publicVotes,
      jsonBinApiKey: null,
      jsonBinId: null,
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responsePayload),
    };
  } catch (error) {
    console.error('Error in get-all-data function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from the database.' }),
    };
  }
};
