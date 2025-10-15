import { User, Activity, PointsEntry } from './types';

export const COUNTRIES: string[] = [
  "Malaysia", "Spain", "Turkey", "Italy", "Austria", "Russia", 
  "Indonesia", "Egypt", "Thailand", "Japan", "China", "Palestine", 
  "Mexico", "France", "Sri Lanka", "Korea", "Germany", "Brazil", 
  "UAE", "Iran"
];

// --- NEW DATA FOR ROLE-BASED SYSTEM ---

export const INITIAL_USERS: User[] = [
    { id: 1, username: 'admin', password: 'adminpassword', role: 'admin' },
    { id: 2, username: 'director_wff', password: 'directorpassword', role: 'director' },
    { id: 101, username: 'Abdullah', password: 'password', role: 'mentor' },
    { id: 102, username: 'Bilal Siddiqui', password: 'password', role: 'mentor' },
    { id: 103, username: 'Bisma', password: 'password', role: 'mentor' },
    { id: 104, username: 'Faisal', password: 'password', role: 'mentor' },
    { id: 105, username: 'Furqan/Aiman', password: 'password', role: 'mentor' },
    { id: 106, username: 'Kashaf/Faiz', password: 'password', role: 'mentor' },
    { id: 107, username: 'Mohiuddin', password: 'password', role: 'mentor' },
    { id: 108, username: 'Muskaan/Samie', password: 'password', role: 'mentor' },
    { id: 109, username: 'Usama/Ayesha', password: 'password', role: 'mentor' },
    { id: 110, username: 'Wajid', password: 'password', role: 'mentor' },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  { 
    id: 'wff-2024-main', 
    name: 'World Fusion Fest 2024 - Main Performance',
    type: 'judged',
    createdBy: 'admin',
    criteria: [
      { id: 'c1', name: 'Creativity', maxPoints: 10 },
      { id: 'c2', name: 'Recycling', maxPoints: 10 },
      { id: 'c3', name: 'Synchronization', maxPoints: 10 },
      { id: 'c4', name: 'Mentor Performance', maxPoints: 5 },
      { id: 'c5', name: 'Leader Action', maxPoints: 5 },
      { id: 'c6', name: 'Boys Performance', maxPoints: 5 },
      { id: 'c7', name: 'Props', maxPoints: 5 },
      { id: 'c8', name: 'Rally', maxPoints: 30 },
      { id: 'c9', name: 'Discipline', maxPoints: 10 },
      { id: 'c10', name: 'Mentors Team Work', maxPoints: 20 },
    ],
  },
  {
    id: 'booth-award-1',
    name: 'Best Booth Decoration',
    type: 'direct',
    maxPoints: 50,
    createdBy: 'director_wff'
  }
];

// Sample scores for initial view
export const INITIAL_MENTOR_SCORES: PointsEntry[] = [
    { id: 1, activityId: 'wff-2024-main', mentor_name: 'Abdullah', team_country: 'Malaysia', creativity: 8, recycling: 9, synchronization: 7, mentor_performance: 4, leader_action: 5, boys_performance: 4, props: 3, rally: 25, discipline: 9, mentors_teamwork: 18, total_points: 92, timestamp: new Date().toISOString() },
    { id: 2, activityId: 'wff-2024-main', mentor_name: 'Bisma', team_country: 'Malaysia', creativity: 9, recycling: 8, synchronization: 8, mentor_performance: 5, leader_action: 4, boys_performance: 5, props: 4, rally: 28, discipline: 10, mentors_teamwork: 17, total_points: 98, timestamp: new Date().toISOString() },
    { id: 3, activityId: 'wff-2024-main', mentor_name: 'Abdullah', team_country: 'Spain', creativity: 7, recycling: 7, synchronization: 9, mentor_performance: 5, leader_action: 3, boys_performance: 3, props: 5, rally: 22, discipline: 8, mentors_teamwork: 15, total_points: 84, timestamp: new Date().toISOString() }
];