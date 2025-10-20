import React, { useState } from 'react';
import { useJournal } from '../../hooks/useDataHooks';
import { ClipboardDocumentListIcon } from '../icons';

const DailyLogWidget: React.FC = () => {
    const { addLogItem } = useJournal();
    const [logText, setLogText] = useState('');
    const [isLogging, setIsLogging] = useState(false);

    const handleLog = () => {
        if (logText.trim() === '') return;
        setIsLogging(true);
        addLogItem(logText);
        setTimeout(() => {
            setLogText('');
            setIsLogging(false);
        }, 1000);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLog();
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 space-y-4 border border-black/5 dark:border-white/5">
            <div className="flex items-center space-x-3">
                <div className="bg-teal-100 dark:bg-teal-900/50 p-2 rounded-full">
                    <ClipboardDocumentListIcon className="w-6 h-6 text-teal-500 dark:text-teal-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100">Daily Log</h2>
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={logText}
                    onChange={(e) => setLogText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What's on your mind?"
                    className="flex-grow w-full px-4 py-2 bg-gray-100 dark:bg-neutral-700/80 border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={handleLog}
                    disabled={isLogging || logText.trim() === ''}
                    className="bg-indigo-600 text-white py-2 px-5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 dark:disabled:bg-indigo-800/50"
                >
                    {isLogging ? 'Logged!' : 'Log'}
                </button>
            </div>
        </div>
    );
};

export default DailyLogWidget;