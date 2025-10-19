import React from 'react';
import { FlameIcon, PlusIcon } from './icons';
import { Habit } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { useModal } from '../contexts/ModalContext';

const initialHabits: Habit[] = [
    { id: '1', name: 'Drink water', icon: '💧', streak: 119, color: 'blue', history: [true, true, true, true, true, true, true], goal: 8, current: 5, unit: 'glasses' },
    { id: '2', name: 'Meditating', icon: '🧘', streak: 28, color: 'rose', history: [true, false, true, true, true, true, true], goal: 10, current: 10, unit: 'mins' },
];

// This form can be extracted into its own file if it becomes more complex.
const AddHabitForm: React.FC<{ onAdd: (habit: Omit<Habit, 'id' | 'streak' | 'history' | 'current'>) => void }> = ({ onAdd }) => {
    // Basic form logic, can be expanded with more fields
    const [name, setName] = React.useState('');
    const [icon, setIcon] = React.useState('🎯');
    const [goal, setGoal] = React.useState(1);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ name, icon, goal, unit: 'times', color: 'purple' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New Habit</h2>
            <div>
                <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" id="habit-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            {/* Add more form fields for icon, goal, unit, color etc. */}
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">Add Habit</button>
        </form>
    );
}

const HabitItem: React.FC<{ habit: Habit, onUpdate: (habit: Habit) => void }> = ({ habit, onUpdate }) => {
    const colorVariants = {
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
        blue: { bg: 'bg-sky-100 dark:bg-sky-900/50', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500' },
        green: { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
        rose: { bg: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
        orange: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
    };
    const colors = colorVariants[habit.color as keyof typeof colorVariants] || colorVariants.purple;

    const handleComplete = () => {
        onUpdate({ ...habit, current: habit.current < habit.goal ? habit.current + 1 : habit.goal });
    };

    return (
        <div className={`${colors.bg} p-4 rounded-xl flex items-center space-x-4`}>
            <div className="text-3xl">{habit.icon}</div>
            <div className="flex-1">
                <p className={`font-bold ${colors.text}`}>{habit.name}</p>
                 <div className="flex items-center space-x-1 text-sm text-orange-500 dark:text-orange-400">
                    <FlameIcon className="w-4 h-4" />
                    <span>{habit.streak} days</span>
                </div>
            </div>
            <button onClick={handleComplete} className="bg-white/50 dark:bg-black/20 rounded-lg px-4 py-2 text-center">
                <p className={`font-bold text-lg ${colors.text}`}>{habit.current}/{habit.goal}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{habit.unit}</p>
            </button>
        </div>
    );
}

const Habits: React.FC = () => {
    const [habits, setHabits] = useLocalStorage<Habit[]>('habits', initialHabits);
    const { openModal, closeModal } = useModal();

    const handleAddHabit = (newHabitData: Omit<Habit, 'id' | 'streak' | 'history' | 'current'>) => {
        const newHabit: Habit = {
            ...newHabitData,
            id: crypto.randomUUID(),
            streak: 0,
            history: Array(7).fill(false),
            current: 0
        };
        setHabits(prev => [...prev, newHabit]);
        closeModal();
    };

    const handleUpdateHabit = (updatedHabit: Habit) => {
        setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h));
    };

    const weekDays = ['Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">Habits</h1>
                <button onClick={() => openModal(<AddHabitForm onAdd={handleAddHabit} />)} className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            
             <div className="space-y-3">
                {habits.map(habit => <HabitItem key={habit.id} habit={habit} onUpdate={handleUpdateHabit} />)}
            </div>
        </div>
    );
};

export default Habits;
