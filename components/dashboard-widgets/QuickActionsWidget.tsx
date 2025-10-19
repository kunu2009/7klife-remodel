import React from 'react';
import { useModal } from '../../contexts/ModalContext';
import { View } from '../../types';

// TODO: These forms should be created as separate components for better organization
const AddJournalEntryForm = () => <div className="text-black dark:text-white">Add Journal Form Placeholder</div>;
const AddTaskForm = () => <div className="text-black dark:text-white">Add Task Form Placeholder</div>;

interface QuickActionsWidgetProps {
    setActiveView: (view: View) => void;
}

const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({ setActiveView }) => {
    const { openModal } = useModal();
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { openModal(<AddJournalEntryForm />); }} className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 p-4 rounded-xl text-left space-y-2 transition-transform hover:scale-105">
                    <span className="text-2xl">✍️</span>
                    <p className="font-semibold">New Journal Entry</p>
                </button>
                <button onClick={() => setActiveView('habits')} className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 p-4 rounded-xl text-left space-y-2 transition-transform hover:scale-105">
                    <span className="text-2xl">💧</span>
                    <p className="font-semibold">Log Water Intake</p>
                </button>
                <button onClick={() => setActiveView('habits')} className="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 p-4 rounded-xl text-left space-y-2 transition-transform hover:scale-105">
                    <span className="text-2xl">💪</span>
                    <p className="font-semibold">Complete Workout</p>
                </button>
                <button onClick={() => { openModal(<AddTaskForm />); }} className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 p-4 rounded-xl text-left space-y-2 transition-transform hover:scale-105">
                    <span className="text-2xl">🚀</span>
                    <p className="font-semibold">Add New Task</p>
                </button>
            </div>
      </div>
    );
};

export default QuickActionsWidget;