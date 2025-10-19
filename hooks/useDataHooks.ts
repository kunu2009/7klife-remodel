import useLocalStorage from './useLocalStorage';
import { Habit, JournalEntry, Project, ProjectStatus, ProjectTask } from '../types';
import { useEffect } from 'react';

// --- Habit Hook ---
export function useHabits() {
    const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updatedHabits = habits.map(habit => {
            const newHabit = { ...habit };
            if (!newHabit.lastCompleted) {
                return newHabit;
            }

            const lastCompletedDate = new Date(newHabit.lastCompleted);
            lastCompletedDate.setHours(0, 0, 0, 0);

            const diffTime = today.getTime() - lastCompletedDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 0) { // If it wasn't completed today
                newHabit.current = 0;
                
                const newHistory = [...(newHabit.history || Array(7).fill(false))];
                for (let i = 0; i < Math.min(diffDays, 7); i++) {
                    newHistory.shift();
                    newHistory.push(false);
                }
                newHabit.history = newHistory;
            }
            
            if (diffDays > 1) { // If streak was broken
                newHabit.streak = 0;
            }
            
            return newHabit;
        });

        if (JSON.stringify(updatedHabits) !== JSON.stringify(habits)) {
            setHabits(updatedHabits);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addHabit = (newHabitData: Omit<Habit, 'id' | 'streak' | 'history' | 'current'>) => {
        const newHabit: Habit = {
            ...newHabitData,
            id: crypto.randomUUID(),
            streak: 0,
            history: Array(7).fill(false),
            current: 0
        };
        setHabits(prev => [...prev, newHabit]);
    };

    const incrementHabit = (habitId: string) => {
        setHabits(prev => prev.map(habit => {
            if (habit.id === habitId) {
                const newHabit = { ...habit };
                const isAlreadyCompletedToday = newHabit.current >= newHabit.goal;

                if (isAlreadyCompletedToday) return newHabit;

                newHabit.current += 1;

                const isNowCompleted = newHabit.current >= newHabit.goal;

                if (isNowCompleted) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1);

                    const lastCompletedDate = newHabit.lastCompleted ? new Date(newHabit.lastCompleted) : null;
                    if(lastCompletedDate) lastCompletedDate.setHours(0,0,0,0);

                    if (lastCompletedDate && lastCompletedDate.getTime() === yesterday.getTime()) {
                        newHabit.streak += 1;
                    } else if (!lastCompletedDate || lastCompletedDate.getTime() !== today.getTime()) {
                        newHabit.streak = 1;
                    }
                    
                    newHabit.lastCompleted = new Date().toISOString();
                    const newHistory = [...newHabit.history];
                    newHistory[6] = true; // Mark today as completed
                    newHabit.history = newHistory;
                }
                return newHabit;
            }
            return habit;
        }));
    };
    
    return { habits, addHabit, incrementHabit };
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

    return { entries, addEntry };
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
