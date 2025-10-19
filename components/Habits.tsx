import React from 'react';
import { FlameIcon, PlusIcon, CheckIcon } from './icons';
import { Habit } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { useModal } from '../contexts/ModalContext';

const HABIT_COLORS = ['purple', 'blue', 'green', 'rose', 'orange'];
const COLOR_CLASSES: { [key: string]: string } = {
    purple: 'bg-purple-500',
    blue: 'bg-sky-500',
    green: 'bg-emerald-500',
    rose: 'bg-rose-500',
    orange: 'bg-orange-500',
};

// This form can be extracted into its own file if it becomes more complex.
const AddHabitForm: React.FC<{ onAdd: (habit: Omit<Habit, 'id' | 'streak' | 'history' | 'current'>) => void }> = ({ onAdd }) => {
    const [name, setName] = React.useState('');
    const [icon, setIcon] = React.useState('🎯');
    const [goal, setGoal] = React.useState(1);
    const [unit, setUnit] = React.useState('times');
    const [color, setColor] = React.useState('purple');
    
    const PRESET_ICONS = ['🎯', '💧', '💪', '🧘', '📖', '🏃‍♂️', '🥗', '🎨', '💻', '💰', '🧹', '🛌'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ name, icon, goal, unit, color });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New Habit</h2>
            
            <div>
                <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" id="habit-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>

            <div>
                <label htmlFor="habit-icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Icon</label>
                <input
                    type="text"
                    id="habit-icon"
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter an emoji"
                    maxLength={2} // Emojis can sometimes be 2 characters
                />
                <div className="mt-2 flex flex-wrap gap-2">
                    {PRESET_ICONS.map(presetIcon => (
                        <button
                            key={presetIcon}
                            type="button"
                            onClick={() => setIcon(presetIcon)}
                            className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all duration-150 ${
                                icon === presetIcon
                                ? 'bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500'
                                : 'bg-gray-100 dark:bg-neutral-700 hover:scale-110'
                            }`}
                            aria-label={`Select icon ${presetIcon}`}
                        >
                            {presetIcon}
                        </button>
                    ))}
                </div>
            </div>


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="habit-goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal</label>
                    <input type="number" id="habit-goal" min="1" value={goal} onChange={e => setGoal(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                </div>
                <div>
                    <label htmlFor="habit-unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
                    <input type="text" id="habit-unit" value={unit} onChange={e => setUnit(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                </div>
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                <div className="mt-2 flex space-x-3">
                    {HABIT_COLORS.map(c => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            className={`w-8 h-8 rounded-full transition-transform duration-150 ${COLOR_CLASSES[c]} ${color === c ? 'ring-2 ring-offset-2 dark:ring-offset-neutral-800 ring-indigo-500 scale-110' : 'hover:scale-110'}`}
                            aria-label={`Select color ${c}`}
                        />
                    ))}
                </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">Add Habit</button>
        </form>
    );
}

const HabitItem: React.FC<{ habit: Habit, onIncrement: (id: string) => void }> = ({ habit, onIncrement }) => {
    const colorVariants = {
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500', ring: 'ring-purple-500' },
        blue: { bg: 'bg-sky-100 dark:bg-sky-900/50', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500', ring: 'ring-sky-500' },
        green: { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500', ring: 'ring-emerald-500' },
        rose: { bg: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500', ring: 'ring-rose-500' },
        orange: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500', ring: 'ring-orange-500' },
    };
    const colors = colorVariants[habit.color as keyof typeof colorVariants] || colorVariants.purple;
    const isCompletedForToday = habit.current >= habit.goal;
    
    const todayIndex = new Date().getDay(); // Sunday - 0, Monday - 1, etc.
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const weekHistoryLabels = Array(7).fill(null).map((_, i) => {
        const dayOffset = 6 - i;
        const dayOfWeek = (todayIndex - dayOffset + 7) % 7;
        return dayLabels[dayOfWeek];
    });

    return (
        <div className={`${colors.bg} p-4 rounded-xl space-y-3`}>
            <div className="flex items-center space-x-4">
                <div className="text-3xl">{habit.icon}</div>
                <div className="flex-1">
                    <p className={`font-bold ${colors.text}`}>{habit.name}</p>
                    <div className="flex items-center space-x-1 text-sm text-orange-500 dark:text-orange-400 mt-1">
                        <FlameIcon className="w-4 h-4" />
                        <span>{habit.streak} day streak</span>
                    </div>
                </div>
                <button 
                    onClick={() => onIncrement(habit.id)} 
                    disabled={isCompletedForToday}
                    className="bg-white/50 dark:bg-black/20 rounded-lg px-4 py-2 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Increment progress for ${habit.name}`}
                >
                    <p className={`font-bold text-lg ${colors.text}`}>{habit.current}/{habit.goal}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{habit.unit}</p>
                </button>
            </div>
            <div className="flex justify-around items-start pt-3 border-t border-white/50 dark:border-black/10" aria-label="Last 7 days history">
                {habit.history.map((completed, index) => {
                    const isToday = index === 6;
                    return (
                        <div key={index} className="flex flex-col items-center space-y-1.5 text-center">
                            <span className={`text-xs font-medium ${isToday ? 'text-gray-800 dark:text-neutral-200' : 'text-gray-400 dark:text-neutral-500'}`}>{weekHistoryLabels[index]}</span>
                             <div 
                                className={`w-6 h-6 rounded-full transition-colors flex items-center justify-center text-white 
                                    ${completed ? colors.dot : 'bg-gray-200 dark:bg-neutral-700'}
                                    ${isToday && !completed ? `ring-2 ${colors.ring}` : ''}
                                `}
                            >
                               {completed && <CheckIcon className="w-4 h-4"/>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const Habits: React.FC = () => {
    const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
    const { openModal, closeModal } = useModal();

    React.useEffect(() => {
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
                 // Reset daily progress
                newHabit.current = 0;
                
                // Shift history for each missed day
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

    const handleIncrementHabit = (habitId: string) => {
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">Habits</h1>
                <button onClick={() => openModal(<AddHabitForm onAdd={handleAddHabit} />)} className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            
             <div className="space-y-3">
                {habits.length > 0 ? (
                    habits.map(habit => <HabitItem key={habit.id} habit={habit} onIncrement={handleIncrementHabit} />)
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">No habits yet.</p>
                        <p className="text-gray-500 dark:text-gray-400">Click the '+' to add your first one!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Habits;