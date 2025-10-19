
import React from 'react';
import { FlameIcon, PlusIcon } from './icons';
import { Habit } from '../types';

const mockHabits: Habit[] = [
    { id: 1, name: 'Journaling', icon: '✍️', streak: 14, color: 'purple', history: [true, true, true, false, true, true, true], goal: 1, current: 1, unit: 'entry' },
    { id: 2, name: 'Drink water', icon: '💧', streak: 119, color: 'blue', history: [true, true, true, true, true, true, true], goal: 8, current: 5, unit: 'glasses' },
    { id: 3, name: 'Eat healthy', icon: '🥗', streak: 0, color: 'green', history: [true, true, false, true, true, false, true], goal: 3, current: 2, unit: 'meals' },
    { id: 4, name: 'Meditating', icon: '🧘', streak: 28, color: 'rose', history: [true, false, true, true, true, true, true], goal: 10, current: 10, unit: 'mins' },
    { id: 5, name: 'Reading', icon: '📚', streak: 2, color: 'orange', history: [false, false, false, true, false, true, true], goal: 1, current: 0, unit: 'chapter' },
];

const HabitItem: React.FC<{ habit: Habit }> = ({ habit }) => {
    const colorVariants = {
        purple: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
        blue: { bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500' },
        green: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
        rose: { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
    };
    const colors = colorVariants[habit.color as keyof typeof colorVariants] || colorVariants.purple;

    return (
        <div className={`${colors.bg} p-4 rounded-xl flex items-center space-x-4`}>
            <div className="text-3xl">{habit.icon}</div>
            <div className="flex-1">
                <p className={`font-bold ${colors.text}`}>{habit.name}</p>
                <div className="flex items-center space-x-1 text-sm text-orange-500">
                    <FlameIcon className="w-4 h-4" />
                    <span>{habit.streak} days</span>
                </div>
            </div>
            <div className="flex space-x-1.5">
                {habit.history.map((completed, index) => (
                    <div key={index} className={`w-3 h-3 rounded-full ${completed ? colors.dot : 'bg-gray-300'}`}></div>
                ))}
            </div>
        </div>
    );
}

const Habits: React.FC = () => {
    const weekDays = ['Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Habits</h1>
                <button className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="flex justify-end pr-5 space-x-3">
                {weekDays.map(day => <span key={day} className="text-sm font-medium text-gray-500 w-3 text-center">{day}</span>)}
            </div>

            <div className="space-y-3">
                {mockHabits.map(habit => <HabitItem key={habit.id} habit={habit} />)}
            </div>
        </div>
    );
};

export default Habits;
