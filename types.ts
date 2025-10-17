import { CRITERIA_KEYS } from "./constants";

export type CriteriaKey = typeof CRITERIA_KEYS[number];

// FIX: Changed from interface to type alias and refored PointsEntry to use an intersection type.
// This is a more robust way to combine a mapped type with other properties and avoids issues
// with interface extension that caused incorrect index signature errors.
export type PointsState = Record<CriteriaKey, number>;

export type PointsEntry = PointsState & {
  id: number;
  activityId: string;
  mentor_name: string;
  team_country: string;
  total_points: number;
  timestamp: string;
};

export interface Criterion {
  id: string;
  name: string;
  maxPoints: number;
}

// --- NEW TYPES FOR ROLE-BASED SYSTEM ---

export type UserRole = 'admin' | 'director' | 'mentor' | 'judge' | 'country';

export interface User {
    id: number;
    username: string;
    password?: string; // This is used for authentication and management
    role: UserRole;
    country?: string; // For 'country' role, specifies which country they represent
}

export interface Activity {
    id:string;
    name: string;
    type: 'judged' | 'direct';
    criteria?: Criterion[]; // For 'judged' type
    maxPoints?: number;     // For 'direct' type
    createdBy: string; // username of admin/director
}

export interface DirectorScore {
    id: number;
    activityId: string;
    team_country: string;
    points: number;
    awardedBy: string; // username of director/admin
    timestamp: string;
}

export interface Player {
    id: string; // Student ID
    name: string;
}

export interface Country {
    name: string;
    flag: string; // emoji
    imageUrl: string | null; // base64 data URL
    leaderNames: string[];
    assignedMentors: string[];
    courseName: string;
    color: string; // A representative color from the flag
    players: Player[];
}

export interface LandingPageContent {
    mainHeading: string;
    description: string;
    mainLogoUrl: string | null; // The big logo on the landing page
    backgroundUrl: string | null; // The background image for the landing page
}

export interface NegativeMarking {
    id: number;
    team_country: string;
    points: number; // A positive number representing the deduction
    reason: string;
    awardedBy: string; // username of mentor/director/admin
    timestamp: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface BonusPoint {
    id: number;
    team_country: string;
    points: number;
    reason: string;
    awardedBy: string;
    timestamp: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface VotingSession {
    id: number;
    name: string;
    date: string;
    team_country: string;
    points: number;
    awardedBy: string; // username of director/admin
    timestamp: string;
}

// --- NEW TYPES FOR PUBLIC VOTING SYSTEM ---

export interface VotingSettings {
    id: string | null; // A unique ID for the current voting session
    isOpen: boolean;
    type: 'public' | 'internal';
    name: string;
    deadline: string | null; // ISO string for the deadline
    pointsForWinner: number; // Points awarded to the winner
}

export interface Student {
    id: string;
    name: string;
}

export interface PublicVote {
    id: number;
    sessionId: string; // Link vote to a specific session
    team_country: string;
    voterIdentifier: string; // This can be a simulated IP hash for public, or student ID for internal
    timestamp: string;
}

// New type for comprehensive data backup/restore
export interface AppBackupState {
    headerLogoUrl: string | null;
    landingPageContent: LandingPageContent;
    users: User[];
    activities: Activity[];
    mentorScores: PointsEntry[];
    directorScores: DirectorScore[];
    countriesData: Country[];
    negativeMarkings: NegativeMarking[];
    bonusPoints: BonusPoint[];
    votingSessions: VotingSession[];
    // Live voting data
    votingSettings: VotingSettings;
    students: Student[];
    publicVotes: PublicVote[];
    // JSONBin.io settings
    jsonBinApiKey: string | null;
    jsonBinId: string | null;
}

export type AggregatedResult = {
  team_country: string;
  total_points: number;
  activityScores: Record<string, number>;
  bonusTotal: number;
  penaltyTotal: number;
  votingTotal: number;
};