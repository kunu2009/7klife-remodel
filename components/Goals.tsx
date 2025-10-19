import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Goal, GoalMilestone } from '../types';
import { PlusIcon, GoalIcon, XIcon } from './icons';
import { useModal } from '../contexts/ModalContext';

const AddGoalForm: React.FC<{ onAdd: (goal: { title: string; targetDate: string; milestones: string[] }) => void }> = ({ onAdd }) => {
    const [title, setTitle] = React.useState('');
    const [targetDate, setTargetDate] = React.useState('');
    const [milestones, setMilestones] = React.useState<string[]>(['', '', '']); // Start with 3 milestones

    const handleMilestoneChange = (index: number, value: string) => {
        const newMilestones = [...milestones];
        newMilestones[index] = value;
        setMilestones(newMilestones);
    };

    const handleAddMilestoneInput = () => {
        setMilestones([...milestones, '']);
    };

    const handleRemoveMilestoneInput = (index: number) => {
        // Prevent removing below 3 milestones
        if (milestones.length > 3) {
            setMilestones(milestones.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nonEmptyMilestones = milestones.map(m => m.trim()).filter(m => m);
        if (nonEmptyMilestones.length < 3) {
            alert('Please fill out at least three milestones.');
            return;
        }
        onAdd({ title, targetDate, milestones: nonEmptyMilestones });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Set a New Goal</h2>
            <input type="text" placeholder="Goal Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md" required />
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md" required />
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Milestones (at least 3)</label>
                <div className="space-y-2 mt-1">
                    {milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder={`Milestone ${index + 1}`}
                                value={milestone}
                                onChange={e => handleMilestoneChange(index, e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none"
                                required
                            />
                             <button
                                type="button"
                                onClick={() => handleRemoveMilestoneInput(index)}
                                className={`text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                                disabled={milestones.length <= 3}
                                aria-label="Remove milestone"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={handleAddMilestoneInput} className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                    + Add another milestone
                </button>
            </div>
            
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Set Goal</button>
        </form>
    );
};

const GoalCard: React.FC<{ goal: Goal, onUpdate: (goal: Goal) => void }> = ({ goal, onUpdate }) => {
    const [newMilestoneText, setNewMilestoneText] = React.useState('');
    const completedMilestones = goal.milestones.filter(m => m.completed).length;
    const progress = goal.milestones.length > 0 ? (completedMilestones / goal.milestones.length) * 100 : 0;

    const handleToggleMilestone = (milestoneId: string) => {
        const updatedMilestones = goal.milestones.map(m => 
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        onUpdate({ ...goal, milestones: updatedMilestones });
    };

    const handleAddNewMilestone = () => {
        if (newMilestoneText.trim() === '') return;
        const newMilestone: GoalMilestone = {
            id: crypto.randomUUID(),
            text: newMilestoneText.trim(),
            completed: false,
        };
        onUpdate({ ...goal, milestones: [...goal.milestones, newMilestone] });
        setNewMilestoneText(''); // Clear input after adding
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddNewMilestone();
        }
    }

    return (
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-xl shadow-sm space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-neutral-100 text-lg">{goal.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
                </div>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
             <div className="space-y-2 pt-2">
                {goal.milestones.map(milestone => (
                    <div key={milestone.id} className="flex items-center cursor-pointer" onClick={() => handleToggleMilestone(milestone.id)}>
                        <input type="checkbox" checked={milestone.completed} readOnly className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 pointer-events-none" />
                        <p className={`ml-3 ${milestone.completed ? 'line-through text-gray-400 dark:text-neutral-500' : 'text-gray-800 dark:text-neutral-200'}`}>{milestone.text}</p>
                    </div>
                ))}
            </div>
            {/* Add new milestone form */}
            <div className="flex items-center space-x-2 pt-2">
                <input 
                    type="text" 
                    value={newMilestoneText}
                    onChange={(e) => setNewMilestoneText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a new milestone"
                    className="flex-grow px-3 py-2 bg-gray-100 dark:bg-neutral-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <button onClick={handleAddNewMilestone} className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-3 py-2 rounded-md text-sm font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors">
                    Add
                </button>
            </div>
        </div>
    );
};

const Goals: React.FC = () => {
    const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
    const { openModal, closeModal } = useModal();

    const handleAddGoal = (newGoalData: { title: string; targetDate: string; milestones: string[] }) => {
        const newGoal: Goal = { 
            id: crypto.randomUUID(),
            title: newGoalData.title,
            targetDate: newGoalData.targetDate,
            milestones: newGoalData.milestones.map(text => ({
                id: crypto.randomUUID(),
                text,
                completed: false
            }))
        };
        setGoals(prev => [...prev, newGoal]);
        closeModal();
    };

    const handleUpdateGoal = (updatedGoal: Goal) => {
        setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">Goals</h1>
                <button onClick={() => openModal(<AddGoalForm onAdd={handleAddGoal} />)} className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>

            {goals.length > 0 ? (
                <div className="space-y-4">
                    {goals.map(goal => <GoalCard key={goal.id} goal={goal} onUpdate={handleUpdateGoal} />)}
                </div>
            ) : (
                 <div className="text-center py-20 flex flex-col items-center">
                    <GoalIcon className="w-24 h-24 text-gray-300 dark:text-neutral-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">You haven't set any goals yet.</p>
                    <p className="text-gray-500 dark:text-gray-400">Aim high and start tracking!</p>
                </div>
            )}
        </div>
    );
};

export default Goals;