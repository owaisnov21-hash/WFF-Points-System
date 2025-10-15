export const CRITERIA_KEYS = [
  'creativity',
  'recycling',
  'synchronization',
  'mentor_performance',
  'leader_action',
  'boys_performance',
  'props',
  'rally',
  'discipline',
  'mentors_teamwork'
] as const;

export type CriteriaKey = typeof CRITERIA_KEYS[number];

export interface PointsState extends Record<CriteriaKey, number> {}

export interface PointsEntry extends PointsState {
  id: number;
  activityId: string;
  mentor_name: string;
  team_country: string;
  total_points: number;
  timestamp: string;
}

export interface Criterion {
  id: string;
  name: string;
  maxPoints: number;
}

// --- NEW TYPES FOR ROLE-BASED SYSTEM ---

export type UserRole = 'admin' | 'director' | 'mentor';

export interface User {
    id: number;
    username: string;
    password?: string; // This is used for authentication and management
    role: UserRole;
}

export interface Activity {
    id: string;
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