export type View = 'dashboard' | 'habits' | 'journal' | 'projects' | 'more' | 'inventory' | 'goals';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  goal: number;
  current: number;
  unit: string;
  color: string;
  streak: number;
  history: boolean[]; // last 7 days, could be expanded
  lastCompleted?: string; // ISO string date
}

export interface JournalEntry {
  id: string;
  date: string; // Storing as ISO string
  title: string;
  content: string;
  mood: string;
}

export enum ProjectStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed'
}

export interface Recurrence {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface ProjectTask {
    id: string;
    name: string;
    completed: boolean;
    description?: string;
    dueDate?: string; // Storing as ISO string
    recurrence?: Recurrence;
}

export interface Project {
  id:string;
  name: string;
  status: ProjectStatus;
  tasks: ProjectTask[];
}

export interface Subscription {
  id: string;
  name: string;
  iconUrl: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  nextBilling: string; // Storing as ISO string
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  notes?: string;
}

export interface GoalMilestone {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  milestones: GoalMilestone[];
}