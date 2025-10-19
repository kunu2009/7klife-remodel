import React, { useState } from 'react';
import { PlusIcon } from './icons';
import { JournalEntry } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { useModal } from '../contexts/ModalContext';

const AddJournalEntryForm: React.FC<{ onAdd: (entry: Omit<JournalEntry, 'id'>) => void }> = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('😊');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ date: new Date().toISOString(), title, content, mood });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">New Entry</h2>
            <div>
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 bg-transparent text-lg font-semibold focus:outline-none" required />
            </div>
            <div>
                <textarea placeholder="Write something..." value={content} onChange={e => setContent(e.target.value)} className="w-full h-32 px-3 py-2 bg-transparent focus:outline-none" required />
            </div>
            <div className="flex justify-between items-center">
                 <input type="text" placeholder="Mood Emoji" value={mood} onChange={e => setMood(e.target.value)} className="w-16 text-2xl text-center bg-gray-100 dark:bg-neutral-700 rounded-md focus:outline-none"/>
                <button type="submit" className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors">Save</button>
            </div>
        </form>
    );
}

const Calendar: React.FC<{ entries: JournalEntry[], onDateClick: (date: number) => void }> = ({ entries, onDateClick }) => {
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
    const entryDays = new Set(entries.map(e => new Date(e.date).getDate()));
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{currentMonth} {currentYear}</h3>
                <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">&lt;</button>
                    <button className="text-gray-400 hover:text-gray-600">&gt;</button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-xs font-bold text-gray-400">{d}</div>)}
                {days.map(day => (
                    <button 
                        key={day} 
                        onClick={() => onDateClick(day)}
                        className={`w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors ${
                            day === today.getDate() ? 'bg-indigo-600 text-white' : 
                            entryDays.has(day) ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold' : 'hover:bg-gray-100 dark:hover:bg-neutral-700'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>
    );
};

const Journal: React.FC = () => {
    const [entries, setEntries] = useLocalStorage<JournalEntry[]>('journal_entries', []);
    const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());
    const { openModal, closeModal } = useModal();

    const handleAddEntry = (newEntryData: Omit<JournalEntry, 'id'>) => {
        const newEntry: JournalEntry = {
            ...newEntryData,
            id: crypto.randomUUID(),
        };
        setEntries(prev => [newEntry, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        closeModal();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">Journal</h1>
                 <button onClick={() => openModal(<AddJournalEntryForm onAdd={handleAddEntry}/>)} className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            <Calendar entries={entries} onDateClick={setSelectedDate} />
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100 mb-3">Latest Entries</h2>
                <div className="space-y-3">
                    {entries.length > 0 ? (
                        entries.map(entry => {
                            const entryDate = new Date(entry.date);
                            return (
                            <div key={entry.id} className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm flex items-start space-x-4">
                                <div className="text-center">
                                   <div className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">{entryDate.getDate()}</div>
                                   <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">{entryDate.toLocaleString('default', { month: 'short' })}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 dark:text-neutral-100 break-words">{entry.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 break-words line-clamp-2">{entry.content}</p>
                                </div>
                                <div className="text-xl">{entry.mood}</div>
                            </div>
                        )})
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No journal entries yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Journal;