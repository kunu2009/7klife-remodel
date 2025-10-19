
import React, { useState } from 'react';
import { PlusIcon } from './icons';
import { JournalEntry } from '../types';

const mockEntries: JournalEntry[] = [
    { id: 1, date: new Date(2024, 6, 27), title: 'We spent most of the day trying to convince...', excerpt: 'Mark was somehow trying to convince me that monkeys were taking over the world and that we needed to start a banana selling business.', mood: '😂' },
    { id: 2, date: new Date(2024, 6, 24), title: 'Tattoo idea for the weekend', excerpt: 'I was thinking of getting a small minimalist wave on my wrist. It represents...', mood: '🤔' },
    { id: 3, date: new Date(2024, 6, 22), title: 'A productive day at work', excerpt: 'Started the day by reviewing my to-do list and prioritizing. I had...', mood: '😌' },
    { id: 4, date: new Date(2024, 6, 20), title: 'Thoughts on today\'s adventure', excerpt: 'Today, I went on a hike in the mountains and w... #hiking #adventure', mood: ' adventurous ' },
];

const Calendar: React.FC<{ entries: JournalEntry[], onDateClick: (date: number) => void }> = ({ entries, onDateClick }) => {
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
    const entryDays = new Set(entries.map(e => e.date.getDate()));
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{currentMonth} {currentYear}</h3>
                <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">&lt;</button>
                    <button className="text-gray-400 hover:text-gray-600">&gt;</button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-xs font-bold text-gray-400">{d}</div>)}
                {/* This is a simplified calendar, not accounting for start day of month */}
                {days.map(day => (
                    <button 
                        key={day} 
                        onClick={() => onDateClick(day)}
                        className={`w-9 h-9 flex items-center justify-center rounded-full text-sm ${
                            day === today.getDate() ? 'bg-indigo-600 text-white' : 
                            entryDays.has(day) ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-100'
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
    const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Journal</h1>
                 <button className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            <Calendar entries={mockEntries} onDateClick={setSelectedDate} />
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Latest Entries</h2>
                <div className="space-y-3">
                    {mockEntries.map(entry => (
                        <div key={entry.id} className="bg-white p-4 rounded-xl shadow-sm flex items-start space-x-4">
                            <div className="text-center">
                               <div className="font-bold text-indigo-600 text-xl">{entry.date.getDate()}</div>
                               <div className="text-xs text-gray-500 uppercase">{entry.date.toLocaleString('default', { month: 'short' })}</div>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 truncate">{entry.title}</p>
                                <p className="text-sm text-gray-500 truncate">{entry.excerpt}</p>
                            </div>
                            <div className="text-xl">{entry.mood}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Journal;
