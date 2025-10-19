import React, { useState, useMemo, FC, useRef, useEffect } from 'react';
import { FlameIcon, PlusIcon, CheckIcon, MinusIcon, EllipsisVerticalIcon, Cog6ToothIcon, ArchiveBoxIcon, ArrowUturnLeftIcon, ChartBarIcon, CalendarDaysIcon, TrashIcon } from './icons';
import { Habit, HabitCompletion } from '../types';
import { useHabits, getToday, getCompletion, isHabitCompleted, calculateCurrentStreak, calculateLongestStreak, isDueOn } from '../hooks/useDataHooks';
import { useModal } from '../contexts/ModalContext';

const HABIT_COLORS = ['purple', 'blue', 'green', 'rose', 'orange'];
const COLOR_CLASSES: { [key: string]: { [key: string]: string } } = {
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500', ring: 'ring-purple-500', border: 'border-purple-500' },
    blue: { bg: 'bg-sky-100 dark:bg-sky-900/50', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500', ring: 'ring-sky-500', border: 'border-sky-500' },
    green: { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500', ring: 'ring-emerald-500', border: 'border-emerald-500' },
    rose: { bg: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500', ring: 'ring-rose-500', border: 'border-rose-500' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500', ring: 'ring-orange-500', border: 'border-orange-500' },
};

// --- Add/Edit Habit Form ---
const AddEditHabitForm: FC<{ onSave: (habitData: Partial<Habit>) => void, habitToEdit?: Habit | null }> = ({ onSave, habitToEdit }) => {
    const [name, setName] = useState(habitToEdit?.name || '');
    const [icon, setIcon] = useState(habitToEdit?.icon || '🎯');
    const [color, setColor] = useState(habitToEdit?.color || 'purple');
    const [type, setType] = useState<'measurable' | 'yes-no'>(habitToEdit?.type || 'yes-no');
    const [goal, setGoal] = useState(habitToEdit?.goal || 1);
    const [unit, setUnit] = useState(habitToEdit?.unit || 'times');
    const [schedule, setSchedule] = useState(habitToEdit?.schedule || [0,1,2,3,4,5,6]);

    const PRESET_ICONS = ['🎯', '💧', '💪', '🧘', '📖', '🏃‍♂️', '🥗', '🎨', '💻', '💰', '🧹', '🛌'];
    const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const toggleScheduleDay = (dayIndex: number) => {
        setSchedule(prev => {
            const newSchedule = prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex];
            return newSchedule.sort();
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const habitData: Partial<Habit> = { name, icon, color, type, schedule, goal: type === 'measurable' ? goal : 1, unit: type === 'measurable' ? unit : '' };
        if (habitToEdit) habitData.id = habitToEdit.id;
        onSave(habitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{habitToEdit ? 'Edit Habit' : 'Add New Habit'}</h2>
            <div>
                <label className="label">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" required />
            </div>
             <div>
                <label className="label">Icon</label>
                <div className="flex items-center space-x-2">
                    <input type="text" value={icon} onChange={e => setIcon(e.target.value)} className="input w-16 text-center text-2xl p-2" maxLength={2} />
                    <div className="flex-1 grid grid-cols-6 gap-2">
                    {PRESET_ICONS.map(i => <button key={i} type="button" onClick={() => setIcon(i)} className={`text-2xl rounded-lg p-2 ${icon === i ? 'bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500' : 'bg-gray-100 dark:bg-neutral-700'}`}>{i}</button>)}
                    </div>
                </div>
            </div>
            <div>
                <label className="label">Color</label>
                <div className="flex space-x-3">{HABIT_COLORS.map(c => <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-full ${COLOR_CLASSES[c].dot} ${color === c ? 'ring-2 ring-offset-2 dark:ring-offset-neutral-800 ring-indigo-500' : ''}`}/>)}</div>
            </div>
             <div>
                <label className="label">Type</label>
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setType('yes-no')} className={`p-2 rounded-lg border-2 ${type==='yes-no' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50' : 'border-gray-300 dark:border-neutral-600'}`}>Yes / No</button>
                    <button type="button" onClick={() => setType('measurable')} className={`p-2 rounded-lg border-2 ${type==='measurable' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50' : 'border-gray-300 dark:border-neutral-600'}`}>Measurable</button>
                </div>
            </div>
            {type === 'measurable' && (
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="label">Goal</label><input type="number" min="1" value={goal} onChange={e => setGoal(Number(e.target.value))} className="input" required/></div>
                    <div><label className="label">Unit</label><input type="text" value={unit} onChange={e => setUnit(e.target.value)} className="input" required /></div>
                </div>
            )}
            <div>
                <label className="label">Schedule</label>
                <div className="flex justify-around items-center bg-gray-100 dark:bg-neutral-700/50 p-2 rounded-xl">
                    {DAY_LABELS.map((label, index) => (
                        <button type="button" key={index} onClick={() => toggleScheduleDay(index)} className={`w-9 h-9 font-bold rounded-full ${schedule.includes(index) ? 'bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-600'}`}>{label}</button>
                    ))}
                </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Save Habit</button>
        </form>
    );
};

// --- Calendar Heatmap ---
const CalendarHeatmap: FC<{ completions: HabitCompletion[], color: string }> = ({ completions, color }) => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const days = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    const completionsMap = new Map(completions.map(c => [c.date, c.value || 1]));
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const months = Array.from({ length: 12 }, (_, i) => ({
        name: new Date(year, i).toLocaleString('default', { month: 'short' }),
        days: days.filter(d => d.getMonth() === i),
        padding: firstDayOfMonth(new Date(year, i, 1))
    }));

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 dark:text-neutral-500">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="space-y-3">
            {months.map(month => (
                <div key={month.name}>
                    <p className="text-sm font-semibold mb-1">{month.name}</p>
                    <div className="grid grid-cols-7 gap-1">
                        {Array(month.padding).fill(null).map((_, i) => <div key={`pad-${i}`}/>)}
                        {month.days.map(d => {
                            const dateString = getToday(d);
                            const completionValue = completionsMap.get(dateString) || 0;
                            const opacity = completionValue > 0 ? 'opacity-100' : 'opacity-20';
                            return (
                                <div key={dateString} title={`${dateString}: ${completionValue}`} className={`w-full aspect-square rounded-[3px] ${COLOR_CLASSES[color].dot} ${opacity}`} />
                            )
                        })}
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}


// --- Habit Detail View ---
const HabitDetail: FC<{ habit: Habit, onBack: () => void, onDelete: (id: string) => void }> = ({ habit, onBack, onDelete }) => {
    const totalCompletions = habit.completions.length;
    const totalPossibleCompletions = useMemo(() => {
        const today = new Date();
        let count = 0;
        // Count possible days from the start of the year until today
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        for (let d = startOfYear; d <= today; d.setDate(d.getDate() + 1)) {
            if (isDueOn(habit, d)) count++;
        }
        return count;
    }, [habit]);
    const completionRate = totalPossibleCompletions > 0 ? Math.round((totalCompletions / totalPossibleCompletions) * 100) : 0;
    
    return (
        <div className="space-y-4 animate-fade-in">
            <button onClick={onBack} className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2">&larr; Back to all habits</button>
            <div className="flex items-center space-x-4">
                <span className="text-4xl">{habit.icon}</span>
                <h1 className="text-3xl font-bold">{habit.name}</h1>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-sm"><p className="text-sm text-gray-500">Current Streak</p><p className="font-bold text-2xl">{calculateCurrentStreak(habit)} days</p></div>
                <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-sm"><p className="text-sm text-gray-500">Longest Streak</p><p className="font-bold text-2xl">{calculateLongestStreak(habit)} days</p></div>
                <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-sm"><p className="text-sm text-gray-500">Completion Rate</p><p className="font-bold text-2xl">{completionRate}%</p></div>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-2">History</h2>
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm">
                    <CalendarHeatmap completions={habit.completions} color={habit.color} />
                </div>
            </div>
            <button onClick={() => onDelete(habit.id)} className="w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-md hover:bg-red-200 dark:hover:bg-red-900">
                <TrashIcon className="w-4 h-4" />
                <span>Delete Habit Permanently</span>
            </button>
        </div>
    );
};


// --- Habit Item Card ---
const HabitItem: FC<{ 
    habit: Habit; 
    onLog: (id: string, value: number) => void; 
    onEdit: (habit: Habit) => void;
    onArchive: (id: string) => void;
    onViewDetails: (habit: Habit) => void;
    onDelete: (id: string) => void;
}> = ({ habit, onLog, onEdit, onArchive, onViewDetails, onDelete }) => {
    const colors = COLOR_CLASSES[habit.color as keyof typeof COLOR_CLASSES] || COLOR_CLASSES.purple;
    const todayCompletion = getCompletion(habit, getToday());
    const completed = isHabitCompleted(habit, todayCompletion);
    
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
        <div className={`${colors.bg} p-4 rounded-xl space-y-3`}>
            <div className="flex items-start space-x-4">
                <div className="flex-1 cursor-pointer" onClick={() => onViewDetails(habit)}>
                    <div className="flex items-center space-x-3">
                        <div className="text-3xl">{habit.icon}</div>
                        <div>
                            <p className={`font-bold ${colors.text}`}>{habit.name}</p>
                            <div className="flex items-center space-x-1 text-sm text-orange-500 dark:text-orange-400 mt-1">
                                <FlameIcon className="w-4 h-4" />
                                <span>{calculateCurrentStreak(habit)} day streak</span>
                            </div>
                        </div>
                    </div>
                </div>
                {habit.type === 'yes-no' && (
                    <button onClick={() => onLog(habit.id, completed ? 0 : 1)} className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-colors ${completed ? 'bg-green-500' : `${colors.dot}`}`}>
                        <CheckIcon className="w-8 h-8"/>
                    </button>
                )}
                {habit.type === 'measurable' && (
                    <div className="flex items-center space-x-2">
                        <button onClick={() => onLog(habit.id, Math.max(0, (todayCompletion?.value || 0) - 1))} className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/50 dark:bg-black/20 ${colors.text}`}><MinusIcon className="w-6 h-6"/></button>
                        <div className="text-center">
                            <p className={`font-bold text-lg ${colors.text}`}>{todayCompletion?.value || 0}/{habit.goal}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{habit.unit}</p>
                        </div>
                        <button onClick={() => onLog(habit.id, (todayCompletion?.value || 0) + 1)} disabled={completed} className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/50 dark:bg-black/20 disabled:opacity-50 ${colors.text}`}><PlusIcon className="w-6 h-6"/></button>
                    </div>
                )}
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300"><EllipsisVerticalIcon className="w-6 h-6"/></button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 animate-fade-in-sm">
                            <div className="py-1">
                                <button onClick={() => { onEdit(habit); setMenuOpen(false); }} className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700"><Cog6ToothIcon className="w-5 h-5"/><span>Edit</span></button>
                                <button onClick={() => { onArchive(habit.id); setMenuOpen(false); }} className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700"><ArchiveBoxIcon className="w-5 h-5"/><span>Archive</span></button>
                                <div className="border-t border-gray-100 dark:border-neutral-700 my-1"></div>
                                <button onClick={() => { onDelete(habit.id); setMenuOpen(false); }} className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"><TrashIcon className="w-5 h-5"/><span>Delete</span></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Main Habits Component ---
const Habits: React.FC = () => {
    const { habits, addHabit, updateHabit, logCompletion, archiveHabit, deleteHabit } = useHabits();
    const { openModal, closeModal } = useModal();
    const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

    const handleSaveHabit = (habitData: Partial<Habit>) => {
        if (habitData.id) {
            updateHabit(habitData as Habit);
        } else {
            addHabit(habitData);
        }
        closeModal();
    };
    
    const handleOpenModal = (habit?: Habit) => {
        openModal(<AddEditHabitForm onSave={handleSaveHabit} habitToEdit={habit} />);
    };

    const handleViewDetails = (habit: Habit) => {
        setSelectedHabit(habit);
        setView('detail');
    };

    const handleDelete = (id: string) => {
        openModal(
            <div className="space-y-4 text-center p-2">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Delete Habit?</h2>
                <p className="text-gray-600 dark:text-neutral-300">Are you sure? This will permanently delete this habit and all its history.</p>
                <div className="flex justify-center space-x-4 pt-2">
                    <button onClick={closeModal} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-neutral-700 dark:text-gray-200 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-600">Cancel</button>
                    <button onClick={() => { deleteHabit(id); setView('list'); setSelectedHabit(null); closeModal(); }} className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                </div>
            </div>
        );
    }
    
    const habitsForToday = habits.filter(h => !h.archived && isDueOn(h, new Date()));
    const otherActiveHabits = habits.filter(h => !h.archived && !isDueOn(h, new Date()));
    const archivedHabits = habits.filter(h => h.archived);

    if (view === 'detail' && selectedHabit) {
        // Find the latest version of the habit from the hook
        const currentHabitState = habits.find(h => h.id === selectedHabit.id);
        if (!currentHabitState) { // Habit was deleted
             setView('list');
             return null;
        }
        return <HabitDetail habit={currentHabitState} onBack={() => setView('list')} onDelete={handleDelete} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">Habits</h1>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            
             <div className="border-b border-gray-200 dark:border-neutral-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('active')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'active' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'}`}>Active</button>
                    <button onClick={() => setActiveTab('archived')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'archived' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'}`}>Archived</button>
                </nav>
            </div>
            
            {activeTab === 'active' && (
                <div className="space-y-6">
                    {habitsForToday.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-600 dark:text-neutral-300 mb-2">Today</h2>
                            <div className="space-y-3">
                                {habitsForToday.map(habit => <HabitItem key={habit.id} habit={habit} onLog={logCompletion} onEdit={handleOpenModal} onArchive={archiveHabit} onViewDetails={handleViewDetails} onDelete={handleDelete} />)}
                            </div>
                        </div>
                    )}
                    {otherActiveHabits.length > 0 && (
                         <div>
                            <h2 className="text-lg font-semibold text-gray-600 dark:text-neutral-300 mb-2">Other Habits</h2>
                            <div className="space-y-3">
                                {otherActiveHabits.map(habit => <HabitItem key={habit.id} habit={habit} onLog={logCompletion} onEdit={handleOpenModal} onArchive={archiveHabit} onViewDetails={handleViewDetails} onDelete={handleDelete} />)}
                            </div>
                        </div>
                    )}
                     {habitsForToday.length === 0 && otherActiveHabits.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No active habits yet.</p>
                            <p className="text-gray-500 dark:text-gray-400">Click the '+' to add your first one!</p>
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === 'archived' && (
                 <div className="space-y-3">
                    {archivedHabits.length > 0 ? (
                        archivedHabits.map(habit => (
                            <div key={habit.id} className="bg-gray-100 dark:bg-neutral-800/50 p-4 rounded-xl flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-500 dark:text-neutral-400">{habit.name}</p>
                                    <p className="text-sm text-gray-400 dark:text-neutral-500">Archived</p>
                                </div>
                                <button onClick={() => archiveHabit(habit.id, false)} className="flex items-center space-x-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400"><ArrowUturnLeftIcon className="w-5 h-5"/> <span>Unarchive</span></button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No archived habits.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Habits;

// Add a helper for the input styling inside this file
const _ = `
.label {
    @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}
.input {
    @apply mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500;
}
`;