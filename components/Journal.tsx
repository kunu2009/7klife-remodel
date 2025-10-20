import React, { useState, useMemo } from 'react';
import { SparklesIcon, TrashIcon } from './icons';
import { JournalEntry } from '../types';
import { useJournal } from '../hooks/useDataHooks';
import { useModal } from '../contexts/ModalContext';
import AIChatView from './AIChatView';

const DailyLogCard: React.FC<{
    entry: JournalEntry;
    onDelete: (id: string) => void;
}> = ({ entry, onDelete }) => {
    const entryDate = new Date(entry.date);
    const day = entryDate.getUTCDate();
    const month = entryDate.toLocaleString('default', { month: 'short', timeZone: 'UTC' });

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm flex items-start space-x-4">
            <div className="text-center flex-shrink-0">
                <div className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">{day}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">{month}</div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-neutral-100 break-words">{entry.title || "Daily Log"}</p>
                        <div className="text-xl mt-1">{entry.mood}</div>
                    </div>
                    <button onClick={() => onDelete(entry.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className="mt-3 space-y-3 border-t border-gray-100 dark:border-neutral-700 pt-3">
                    {entry.logs.map(log => (
                        <div key={log.id} className="flex items-start space-x-3">
                            <p className="text-xs text-gray-400 dark:text-neutral-500 font-mono flex-shrink-0">{formatTime(log.timestamp)}</p>
                            <p className="text-sm text-gray-600 dark:text-neutral-300">{log.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const Journal: React.FC = () => {
    const { entries, deleteEntry } = useJournal();
    const { openModal, closeModal } = useModal();
    const [view, setView] = useState<'logs' | 'ai'>('logs');

    const sortedEntries = useMemo(() => {
        return [...entries].sort((a, b) => b.date.localeCompare(a.date));
    }, [entries]);

    const handleDelete = (id: string) => {
        openModal(
            <div className="space-y-4 text-center p-2">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Delete Day's Log?</h2>
                <p className="text-gray-600 dark:text-neutral-300">Are you sure you want to delete all logs for this day? This action cannot be undone.</p>
                <div className="flex justify-center space-x-4 pt-2">
                    <button onClick={closeModal} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-neutral-700 dark:text-gray-200 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-600">Cancel</button>
                    <button onClick={() => { deleteEntry(id); closeModal(); }} className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">Journal</h1>
                 <button 
                    onClick={() => setView(v => v === 'logs' ? 'ai' : 'logs')} 
                    className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors flex items-center space-x-2 px-4"
                >
                    <SparklesIcon className="w-6 h-6" />
                    <span className="font-semibold text-sm">{view === 'logs' ? 'Ask AI' : 'View Logs'}</span>
                </button>
            </div>
            
            {view === 'ai' ? (
                <AIChatView />
            ) : (
                <div className="space-y-4">
                    {sortedEntries.length > 0 ? (
                        sortedEntries.map(entry => (
                            <DailyLogCard 
                                key={entry.id}
                                entry={entry}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500 dark:text-gray-400">No journal entries yet.</p>
                             <p className="text-gray-500 dark:text-gray-400 mt-2">Use the "Daily Log" on the dashboard to get started!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Journal;