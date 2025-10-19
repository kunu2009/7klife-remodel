
export type View = 'dashboard' | 'habits' | 'journal' | 'projects' | 'more';

export interface Habit {
  id: number;
  name: string;
  icon: string;
  goal: number;
  current: number;
  unit: string;
  color: string;
  streak: number;
  history: boolean[]; // last 7 days
}

export interface JournalEntry {
  id: number;
  date: Date;
  title: string;
  excerpt: string;
  mood: string;
}

export enum ProjectStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed'
}

export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  progress: number;
  tasks: { name: string; completed: boolean }[];
}

export interface Subscription {
  id: number;
  name: string;
  iconUrl: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  nextBilling: Date;
}
