// This code is designed to run in a Netlify Functions environment,
// where 'drizzle-orm' is expected to be available.
// @ts-ignore
import { pgTable, serial, text, integer, varchar, timestamp, jsonb, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 256 }).unique().notNull(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'director', 'mentor', 'judge', 'country'] }).notNull(),
  country: varchar('country', { length: 256 }),
});

export const countries = pgTable('countries', {
  name: varchar('name', { length: 256 }).primaryKey(),
  flag: varchar('flag', { length: 16 }).notNull(),
  imageUrl: text('image_url'),
  leaderNames: text('leader_names').array().notNull(),
  assignedMentors: text('assigned_mentors').array().notNull(),
  courseName: varchar('course_name', { length: 256 }).notNull(),
  color: varchar('color', { length: 16 }).notNull(),
});

export const players = pgTable('players', {
  id: varchar('id', { length: 256 }).primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  countryName: varchar('country_name', { length: 256 }).references(() => countries.name, { onDelete: 'cascade' }).notNull(),
});

export const activities = pgTable('activities', {
  id: varchar('id', { length: 256 }).primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  type: text('type', { enum: ['judged', 'direct'] }).notNull(),
  maxPoints: integer('max_points'),
  createdBy: varchar('created_by', { length: 256 }).notNull(),
});

export const criteria = pgTable('criteria', {
  id: varchar('id', { length: 256 }).primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  maxPoints: integer('max_points').notNull(),
  activityId: varchar('activity_id', { length: 256 }).references(() => activities.id, { onDelete: 'cascade' }).notNull(),
});

export const mentorScores = pgTable('mentor_scores', {
    id: serial('id').primaryKey(),
    activityId: varchar('activity_id', { length: 256 }).references(() => activities.id).notNull(),
    mentorName: varchar('mentor_name', { length: 256 }).notNull(),
    teamCountry: varchar('team_country', { length: 256 }).references(() => countries.name).notNull(),
    totalPoints: integer('total_points').notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
    pointsState: jsonb('points_state').notNull().$type<Record<string, number>>()
});

export const directorScores = pgTable('director_scores', {
  id: serial('id').primaryKey(),
  activityId: varchar('activity_id', { length: 256 }).references(() => activities.id).notNull(),
  teamCountry: varchar('team_country', { length: 256 }).references(() => countries.name).notNull(),
  points: integer('points').notNull(),
  awardedBy: varchar('awarded_by', { length: 256 }).notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});

export const negativeMarkings = pgTable('negative_markings', {
    id: serial('id').primaryKey(),
    teamCountry: varchar('team_country', { length: 256 }).references(() => countries.name).notNull(),
    points: integer('points').notNull(),
    reason: text('reason').notNull(),
    awardedBy: varchar('awarded_by', { length: 256 }).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
    status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull(),
});

export const bonusPoints = pgTable('bonus_points', {
    id: serial('id').primaryKey(),
    teamCountry: varchar('team_country', { length: 256 }).references(() => countries.name).notNull(),
    points: integer('points').notNull(),
    reason: text('reason').notNull(),
    awardedBy: varchar('awarded_by', { length: 256 }).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
    status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull(),
});

export const votingSessions = pgTable('voting_sessions', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    date: varchar('date', { length: 64 }).notNull(),
    teamCountry: varchar('team_country', { length: 256 }).references(() => countries.name).notNull(),
    points: integer('points').notNull(),
    awardedBy: varchar('awarded_by', { length: 256 }).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});

export const students = pgTable('students', {
    id: varchar('id', { length: 256 }).primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
});

export const publicVotes = pgTable('public_votes', {
    id: serial('id').primaryKey(),
    sessionId: varchar('session_id', { length: 256 }).notNull(),
    teamCountry: varchar('team_country', { length: 256 }).references(() => countries.name).notNull(),
    voterIdentifier: varchar('voter_identifier', { length: 256 }).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});

export const appSettings = pgTable('app_settings', {
    id: integer('id').primaryKey().default(1),
    headerLogoUrl: text('header_logo_url'),
    landingPageContent: jsonb('landing_page_content').notNull(),
    votingSettings: jsonb('voting_settings').notNull(),
});
