import React from 'react';
import { useHabits } from '../../hooks/useDataHooks';
import { useProjects } from '../../hooks/useDataHooks';
import { BriefcaseIcon, FlameIcon, LightbulbIcon, CheckCircleIcon } from '../icons';
import { Habit, View } from '../../types';

interface WidgetProps {
    setActiveView: (view: View) => void;
}

// --- Today's Habits Widget ---

const HabitProgressButton: React.FC<{ habit: Habit, onIncrement: (id: string) => void }> = ({ habit, onIncrement }) => {
    const isCompleted = habit.current >= habit.goal;
    const progressPercentage = Math.min((habit.current / habit.goal) * 100, 100);

    const colorVariants = {
        purple: { ring: 'ring-purple-500', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500' },
        blue: { ring: 'ring-sky-500', text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500' },
        green: { ring: 'ring-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500' },
        rose: { ring: 'ring-rose-500', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500' },
        orange: { ring: 'ring-orange-500', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500' },
    };
    const colors = colorVariants[habit.color as keyof typeof colorVariants] || colorVariants.purple;

    return (
        <button
            onClick={() => onIncrement(habit.id)}
            disabled={isCompleted}
            className={`relative w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300
                ${isCompleted ? 'bg-green-100 dark:bg-green-900/50' : `bg-white dark:bg-neutral-700/50 ring-2 ring-inset ${colors.ring}`}`}
            aria-label={`Increment ${habit.name}. Current progress ${habit.current} of ${habit.goal}`}
        >
            <div
                className={`absolute inset-0 rounded-full opacity-20 ${colors.bg}`}
                style={{ clipPath: `inset(${100 - progressPercentage}% 0 0 0)` }}
            />
            <span className="text-2xl z-10">{habit.icon}</span>
            {isCompleted && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center z-20 shadow">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
            )}
        </button>
    );
}

export const TodaysHabitsWidget: React.FC<WidgetProps> = ({ setActiveView }) => {
    const { habits, incrementHabit } = useHabits();
    
    // Show up to 4 habits, prioritizing incomplete ones
    const habitsToShow = habits
        .sort((a, b) => ((a.current >= a.goal) ? 1 : 0) - ((b.current >= b.goal) ? 1 : 0))
        .slice(0, 4);

    const allHabitsCompleted = habits.length > 0 && habits.every(h => h.current >= h.goal);

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 space-y-4 border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="bg-rose-100 dark:bg-rose-900/50 p-2 rounded-full">
                        <FlameIcon className="w-6 h-6 text-rose-500 dark:text-rose-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100">Today's Habits</h2>
                </div>
                <button onClick={() => setActiveView('habits')} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All
                </button>
            </div>
            {habits.length === 0 ? (
                <div className="text-center py-4">
                    <FlameIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-neutral-600" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-800 dark:text-neutral-200">No habits yet</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">Tap 'View All' to add your first habit!</p>
                </div>
            ) : allHabitsCompleted ? (
                 <p className="text-center text-green-600 dark:text-green-400 font-semibold py-4">All habits completed for today!</p>
            ) : (
                <div className="grid grid-cols-4 gap-x-4 gap-y-5">
                    {habitsToShow.map(habit => (
                        <div key={habit.id} className="flex flex-col items-center space-y-2 text-center">
                            <HabitProgressButton habit={habit} onIncrement={incrementHabit} />
                            <p className="text-xs font-medium text-gray-600 dark:text-neutral-300 truncate w-16">{habit.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Journal Prompt Widget ---

const journalPrompts = [
    "What's one thing that made you smile today?",
    "Describe a challenge you overcame recently.",
    "What are you grateful for right now?",
    "If you could give your past self one piece of advice, what would it be?",
    "Write about a person who has positively influenced you.",
    "What is a skill you'd like to learn and why?",
    "Describe your ideal day from start to finish.",
    "What's something you're looking forward to?",
    "Write about a time you felt truly proud of yourself.",
    "What does 'success' mean to you at this moment in your life?",
];

const getDailyPrompt = () => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return journalPrompts[dayOfYear % journalPrompts.length];
};

export const JournalPromptWidget: React.FC<WidgetProps> = ({ setActiveView }) => {
    const prompt = getDailyPrompt();

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 space-y-4 border border-black/5 dark:border-white/5">
            <div className="flex items-center space-x-3">
                <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                    <LightbulbIcon className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100">Journal Prompt</h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-300 italic">"{prompt}"</p>
            <button
                onClick={() => setActiveView('journal')}
                className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
            >
                Write Entry
            </button>
        </div>
    );
};


// --- Focus Tasks Widget ---

export const FocusTasksWidget: React.FC<WidgetProps> = ({ setActiveView }) => {
    const { projects, toggleTask } = useProjects();

    const upcomingTasks = projects
        .flatMap(p => p.tasks.map(t => ({ ...t, projectId: p.id, projectName: p.name })))
        .filter(t => !t.completed)
        .sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        })
        .slice(0, 4);

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 space-y-4 border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="bg-sky-100 dark:bg-sky-900/50 p-2 rounded-full">
                        <BriefcaseIcon className="w-6 h-6 text-sky-500 dark:text-sky-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100">Focus Tasks</h2>
                </div>
                <button onClick={() => setActiveView('projects')} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All
                </button>
            </div>
            {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                    {upcomingTasks.map(task => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const parts = task.dueDate ? task.dueDate.split('-').map(p => parseInt(p, 10)) : null;
                        const dueDateObj = parts ? new Date(parts[0], parts[1] - 1, parts[2]) : null;
                        const isOverdue = !task.completed && dueDateObj && dueDateObj < today;

                        return (
                            <div key={task.id} className="flex items-center group transition-opacity duration-300">
                                <button aria-label={`Toggle task ${task.name}`} onClick={() => toggleTask(task.projectId, task.id)} className={`w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors border-gray-300 dark:border-neutral-500 hover:border-indigo-500`}>
                                </button>
                                <div className="ml-3 flex-1 min-w-0">
                                    <p className="text-gray-700 dark:text-neutral-200 truncate">{task.name}</p>
                                    <div className="flex items-center space-x-2 text-xs">
                                        <p className="text-gray-400 dark:text-neutral-500">{task.projectName}</p>
                                        {task.dueDate && <span className="text-gray-300 dark:text-neutral-600">&bull;</span>}
                                        {task.dueDate && (
                                            <p className={`font-medium ${isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-neutral-400'}`}>
                                                {new Date(task.dueDate).toLocaleDateString(undefined, { timeZone: 'UTC', month: 'short', day: 'numeric' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-4">
                    <CheckCircleIcon className="w-12 h-12 mx-auto text-green-400 dark:text-green-500" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-800 dark:text-neutral-200">All caught up!</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">You have no upcoming tasks.</p>
                </div>
            )}
        </div>
    );
};