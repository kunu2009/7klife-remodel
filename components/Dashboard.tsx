import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useModal } from '../contexts/ModalContext';
import { Habit, Project, JournalEntry, View } from '../types';

// TODO: These forms should be created as separate components for better organization
const AddJournalEntryForm = () => <div className="text-black dark:text-white">Add Journal Form Placeholder</div>;
const AddTaskForm = () => <div className="text-black dark:text-white">Add Task Form Placeholder</div>;

const CircularProgress: React.FC<{
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
}> = ({ progress, size, strokeWidth, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
      <circle
        className="text-gray-200 dark:text-neutral-700"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </g>
  );
};

const DailyProgressChart: React.FC<{ habits: Habit[]; projects: Project[]; entries: JournalEntry[] }> = ({ habits, projects, entries }) => {
    const size = 220;
    const strokeWidth = 24;

    const habitsCompleted = habits.filter(h => h.current >= h.goal).length;
    const habitsProgress = habits.length > 0 ? (habitsCompleted / habits.length) * 100 : 0;
    
    const tasksCompleted = projects.flatMap(p => p.tasks).filter(t => t.completed).length;
    const totalTasks = projects.flatMap(p => p.tasks).length;
    const projectsProgress = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;
    
    const journalProgress = entries.some(e => new Date(e.date).toDateString() === new Date().toDateString()) ? 100 : 0;

    const totalProgress = (habitsProgress + projectsProgress + journalProgress) / 3;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="absolute inset-0" width={size} height={size}>
                <CircularProgress progress={habitsProgress} size={size} strokeWidth={strokeWidth} color="text-purple-500" />
                {/* Could add more circles for projects/journal, but might get cluttered.
                    A single overall progress might be better. Let's use totalProgress for the text. */}
            </svg>
            <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Today's Progress</p>
                <p className="text-4xl font-bold text-gray-800 dark:text-neutral-100">{Math.round(totalProgress)}%</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Great work!</p>
            </div>
        </div>
    );
};

interface DashboardProps {
  setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  const { openModal } = useModal();
  const [habits] = useLocalStorage<Habit[]>('habits', []);
  const [projects] = useLocalStorage<Project[]>('projects', []);
  const [entries] = useLocalStorage<JournalEntry[]>('journal_entries', []);
  
  const habitsCompleted = habits.filter(h => h.current >= h.goal).length;
  const tasksToday = projects.flatMap(p => p.tasks).filter(t => !t.completed).length; // Simplified
  const journaledToday = entries.some(e => new Date(e.date).toDateString() === new Date().toDateString());

  return (
    <div className="space-y-8">
      <header>
        <p className="text-gray-500 dark:text-gray-400">Good morning,</p>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">Emmanuel</h1>
      </header>
      
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 flex flex-col items-center">
        <DailyProgressChart habits={habits} projects={projects} entries={entries} />
        <div className="w-full grid grid-cols-3 gap-4 mt-6 text-center">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Habits</p>
                <p className="font-bold text-lg text-purple-600 dark:text-purple-400">{habitsCompleted}/{habits.length}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Projects</p>
                <p className="font-bold text-lg text-sky-500 dark:text-sky-400">{tasksToday} tasks</p>
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Journal</p>
                <p className={`font-bold text-lg ${journaledToday ? 'text-amber-500 dark:text-amber-400' : 'text-gray-500'}`}>{journaledToday ? 'Done' : 'No Entry'}</p>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => { openModal(<AddJournalEntryForm />); setActiveView('journal'); }} className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 p-4 rounded-xl text-left space-y-2 hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors">
                <span className="text-2xl">✍️</span>
                <p className="font-semibold">New Journal Entry</p>
            </button>
             <button onClick={() => setActiveView('habits')} className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 p-4 rounded-xl text-left space-y-2 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors">
                <span className="text-2xl">💧</span>
                <p className="font-semibold">Log Water Intake</p>
            </button>
             <button onClick={() => setActiveView('habits')} className="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 p-4 rounded-xl text-left space-y-2 hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors">
                <span className="text-2xl">💪</span>
                <p className="font-semibold">Complete Workout</p>
            </button>
             <button onClick={() => { openModal(<AddTaskForm />); setActiveView('projects'); }} className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 p-4 rounded-xl text-left space-y-2 hover:bg-orange-200 dark:hover:bg-orange-900 transition-colors">
                <span className="text-2xl">🚀</span>
                <p className="font-semibold">Add New Task</p>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
