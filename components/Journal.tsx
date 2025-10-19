import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, TrashIcon, Cog6ToothIcon, EllipsisVerticalIcon } from './icons';
import { JournalEntry } from '../types';
import { useJournal } from '../hooks/useDataHooks';
import { useModal } from '../contexts/ModalContext';

const JournalEntryForm: React.FC<{
    onSave: (entry: Partial<JournalEntry>) => void;
    onDelete?: (id: string) => void;
    entryToEdit?: JournalEntry | null;
}> = ({ onSave, onDelete, entryToEdit }) => {
    const [title, setTitle] = useState(entryToEdit?.title || '');
    const [content, setContent] = useState(entryToEdit?.content || '');
    const [mood, setMood] = useState(entryToEdit?.mood || '😊');
    const moodOptions = ['😊', '😄', '🤔', '😢', '😠'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const entryData: Partial<JournalEntry> = {
            date: entryToEdit?.date || new Date().toISOString(),
            title,
            content,
            mood,
        };
        if (entryToEdit) {
            entryData.id = entryToEdit.id;
        }
        onSave(entryData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{entryToEdit ? 'Edit Entry' : 'New Entry'}</h2>
            <div>
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 bg-transparent text-lg font-semibold focus:outline-none" required />
            </div>
            <div>
                <textarea placeholder="Write something..." value={content} onChange={e => setContent(e.target.value)} className="w-full h-32 px-3 py-2 bg-transparent focus:outline-none" required />
            </div>
            <div className="flex justify-between items-center">
                 <div className="flex items-center space-x-2" role="group" aria-label="Mood selection">
                    {moodOptions.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setMood(option)}
                            aria-label={`Select mood: ${option}`}
                            className={`text-3xl p-2 rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800 ${
                                mood === option 
                                ? 'bg-indigo-100 dark:bg-indigo-900/50 scale-110 ring-2 ring-indigo-300 dark:ring-indigo-500' 
                                : 'hover:bg-gray-100 dark:hover:bg-neutral-700 hover:scale-105 ring-2 ring-transparent'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div className="flex items-center space-x-2">
                     {entryToEdit && onDelete && (
                        <button type="button" onClick={() => onDelete(entryToEdit.id!)} className="text-red-600 dark:text-red-400 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    )}
                    <button type="submit" className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors">Save</button>
                </div>
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

const JournalEntryCard: React.FC<{
    entry: JournalEntry;
    onEdit: (entry: JournalEntry) => void;
    onDelete: (id: string) => void;
}> = ({ entry, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const entryDate = new Date(entry.date);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm flex items-start space-x-4">
            <div className="text-center">
                <div className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">{entryDate.getDate()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">{entryDate.toLocaleString('default', { month: 'short' })}</div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-neutral-100 break-words">{entry.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 break-words line-clamp-2">{entry.content}</p>
            </div>
            <div className="flex items-center space-x-2">
                <div className="text-xl">{entry.mood}</div>
                 <div className="relative" ref={menuRef}>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 p-1 rounded-full">
                        <EllipsisVerticalIcon className="w-5 h-5"/>
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-neutral-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 animate-fade-in-sm">
                            <div className="py-1">
                                <button onClick={() => { onEdit(entry); setMenuOpen(false); }} className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700"><Cog6ToothIcon className="w-5 h-5"/><span>Edit</span></button>
                                <button onClick={() => { onDelete(entry.id); setMenuOpen(false); }} className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"><TrashIcon className="w-5 h-5"/><span>Delete</span></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const Journal: React.FC = () => {
    const { entries, addEntry, updateEntry, deleteEntry } = useJournal();
    const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());
    const { openModal, closeModal } = useModal();

    const handleSaveEntry = (entryData: Partial<JournalEntry>) => {
        if (entryData.id) {
            updateEntry(entryData as JournalEntry);
        } else {
            addEntry(entryData as Omit<JournalEntry, 'id'>);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        openModal(
            <div className="space-y-4 text-center p-2">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Delete Entry?</h2>
                <p className="text-gray-600 dark:text-neutral-300">Are you sure you want to delete this journal entry? This action cannot be undone.</p>
                <div className="flex justify-center space-x-4 pt-2">
                    <button onClick={closeModal} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-neutral-700 dark:text-gray-200 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-600">Cancel</button>
                    <button onClick={() => { deleteEntry(id); closeModal(); }} className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                </div>
            </div>
        );
    }
    
    const handleOpenEditModal = (entry: JournalEntry) => {
        openModal(<JournalEntryForm onSave={handleSaveEntry} onDelete={handleDelete} entryToEdit={entry} />);
    };
    
    const handleOpenAddModal = () => {
        openModal(<JournalEntryForm onSave={handleSaveEntry} />);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">Journal</h1>
                 <button onClick={handleOpenAddModal} className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            <Calendar entries={entries} onDateClick={setSelectedDate} />
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100 mb-3">Latest Entries</h2>
                <div className="space-y-3">
                    {entries.length > 0 ? (
                        entries.map(entry => (
                            <JournalEntryCard 
                                key={entry.id}
                                entry={entry}
                                onEdit={handleOpenEditModal}
                                onDelete={handleDelete}
                            />
                        ))
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