export type View = 'dashboard' | 'habits' | 'journal' | 'projects' | 'more' | 'inventory' | 'goals';

export interface HabitCompletion {
  date: string; // ISO string date YYYY-MM-DD
  note?: string;
  value?: number; // For measurable habits
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  archived: boolean;
  type: 'measurable' | 'yes-no';
  schedule: number[]; // 0-6 for Sunday-Saturday
  goal?: number; // For 'measurable' type
  unit?: string; // For 'measurable' type
  completions: HabitCompletion[];
}


export interface LogItem {
  id: string;
  timestamp: string; // Full ISO string for precise time
  content: string;
}

export interface JournalEntry {
  id: string; // YYYY-MM-DD date string
  date: string; // YYYY-MM-DD date string
  title: string;
  mood: string;
  logs: LogItem[];
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

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}