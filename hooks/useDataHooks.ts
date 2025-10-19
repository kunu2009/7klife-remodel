import useLocalStorage from './useLocalStorage';
import { Habit, HabitCompletion, JournalEntry, Project, ProjectStatus, ProjectTask } from '../types';
import { useEffect } from 'react';

// --- Date Helpers ---
export const getToday = (date: Date = new Date()): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

// --- Habit Hook Helpers ---
export const isDueOn = (habit: Habit, date: Date): boolean => {
    return habit.schedule.includes(date.getDay());
};

export const getCompletion = (habit: Habit, date: string): HabitCompletion | undefined => {
    return habit.completions.find(c => c.date === date);
};

export const isHabitCompleted = (habit: Habit, completion?: HabitCompletion): boolean => {
    if (!completion) return false;
    if (habit.type === 'yes-no') return true;
    return completion.value !== undefined && habit.goal !== undefined && completion.value >= habit.goal;
};

export const calculateCurrentStreak = (habit: Habit): number => {
    let streak = 0;
    const today = new Date();
    const completionsByDate = new Map(habit.completions.map(c => [c.date, c]));

    // Check if completed today if it was due
    const todayStr = getToday(today);
    if (isDueOn(habit, today)) {
        const todayCompletion = completionsByDate.get(todayStr);
        if (todayCompletion && isHabitCompleted(habit, todayCompletion)) {
            streak++;
        } else {
            // Not completed today, streak must be calculated from yesterday
            today.setDate(today.getDate() - 1);
        }
    } else {
        // Not due today, start check from yesterday
        today.setDate(today.getDate() - 1);
    }
    
    // Go backwards from yesterday
    for (let d = today; ; d.setDate(d.getDate() - 1)) {
        if (isDueOn(habit, d)) {
            const dateStr = getToday(d);
            const completion = completionsByDate.get(dateStr);
            if (completion && isHabitCompleted(habit, completion)) {
                streak++;
            } else {
                break; // Streak broken
            }
        }
        // If it's not a due day, we just skip it and the streak continues.
        if (streak > 365 * 5) break; // Safety break for perf
    }
    
    return streak;
};

export const calculateLongestStreak = (habit: Habit): number => {
    if (habit.completions.length === 0) return 0;
    
    let longestStreak = 0;
    let currentStreak = 0;
    
    const sortedCompletions = [...habit.completions].sort((a,b) => a.date.localeCompare(b.date));
    const completionsByDate = new Map(sortedCompletions.map(c => [c.date, c]));

    const firstDate = new Date(sortedCompletions[0].date);
    const lastDate = new Date(sortedCompletions[sortedCompletions.length - 1].date);
    
    for (let d = firstDate; d <= lastDate; d.setDate(d.getDate() + 1)) {
        if (isDueOn(habit, d)) {
            const dateStr = getToday(d);
            const completion = completionsByDate.get(dateStr);
            if (completion && isHabitCompleted(habit, completion)) {
                currentStreak++;
            } else {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 0;
            }
        }
    }
    
    longestStreak = Math.max(longestStreak, currentStreak);
    return longestStreak;
};


// --- Habit Hook ---
export function useHabits() {
    const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);

    const addHabit = (newHabitData: Partial<Habit>) => {
        const newHabit: Habit = {
            id: crypto.randomUUID(),
            name: newHabitData.name || 'New Habit',
            icon: newHabitData.icon || '🎯',
            color: newHabitData.color || 'purple',
            archived: false,
            type: newHabitData.type || 'yes-no',
            schedule: newHabitData.schedule || [0, 1, 2, 3, 4, 5, 6],
            goal: newHabitData.goal || 1,
            unit: newHabitData.unit || 'times',
            completions: [],
        };
        setHabits(prev => [...prev, newHabit]);
    };

    const updateHabit = (updatedHabitData: Habit) => {
        setHabits(prev => prev.map(h => h.id === updatedHabitData.id ? {...h, ...updatedHabitData} : h));
    };
    
    const deleteHabit = (habitId: string) => {
        setHabits(prev => prev.filter(h => h.id !== habitId));
    };

    const archiveHabit = (habitId: string, archive = true) => {
        setHabits(prev => prev.map(h => h.id === habitId ? { ...h, archived: archive } : h));
    };

    const logCompletion = (habitId: string, value: number, note?: string) => {
        const todayStr = getToday();
        setHabits(prev => prev.map(habit => {
            if (habit.id === habitId) {
                const newHabit = { ...habit };
                const existingCompletionIndex = newHabit.completions.findIndex(c => c.date === todayStr);
                
                if (existingCompletionIndex > -1) {
                    if (value > 0) {
                        // Update existing completion
                        newHabit.completions[existingCompletionIndex] = {
                            ...newHabit.completions[existingCompletionIndex],
                            value,
                            note: note || newHabit.completions[existingCompletionIndex].note,
                        };
                    } else {
                        // Remove completion if value is 0 or less
                        newHabit.completions.splice(existingCompletionIndex, 1);
                    }
                } else if (value > 0) {
                    // Add new completion
                    const newCompletion: HabitCompletion = { date: todayStr, value };
                    if (note) newCompletion.note = note;
                    newHabit.completions.push(newCompletion);
                }
                return newHabit;
            }
            return habit;
        }));
    };
    
    return { habits, addHabit, updateHabit, deleteHabit, archiveHabit, logCompletion };
}

// --- Journal Hook ---
export function useJournal() {
    const [entries, setEntries] = useLocalStorage<JournalEntry[]>('journal_entries', []);

    const addEntry = (newEntryData: Omit<JournalEntry, 'id'>) => {
        const newEntry: JournalEntry = {
            ...newEntryData,
            id: crypto.randomUUID(),
        };
        setEntries(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    const updateEntry = (updatedEntry: JournalEntry) => {
        setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
    };

    const deleteEntry = (entryId: string) => {
        setEntries(prev => prev.filter(e => e.id !== entryId));
    };

    return { entries, addEntry, updateEntry, deleteEntry };
}

// --- Projects Hook ---
export function useProjects() {
    const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);

    const addProject = (newProjectData: { name: string; tasks: string[] }) => {
        const newProject: Project = {
            name: newProjectData.name,
            id: crypto.randomUUID(),
            status: ProjectStatus.NotStarted,
            tasks: newProjectData.tasks.map(taskName => ({
                id: crypto.randomUUID(),
                name: taskName,
                completed: false,
            })),
        };
        setProjects(prev => [newProject, ...prev]);
    };

    const updateProject = (updatedProject: Project) => {
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    };

    const deleteProject = (projectId: string) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
    };
    
    const toggleTask = (projectId: string, taskId: string) => {
        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === projectId) {
                const updatedTasks = p.tasks.map(t => 
                    t.id === taskId ? { ...t, completed: !t.completed } : t
                );
                
                const allCompleted = updatedTasks.every(t => t.completed);
                const anyStarted = updatedTasks.some(t => t.completed);
                
                let newStatus = ProjectStatus.NotStarted;
                if (allCompleted && updatedTasks.length > 0) newStatus = ProjectStatus.Completed;
                else if (anyStarted) newStatus = ProjectStatus.InProgress;

                return { ...p, tasks: updatedTasks, status: newStatus };
            }
            return p;
        }));
    };

    return { projects, setProjects, addProject, updateProject, deleteProject, toggleTask };
}