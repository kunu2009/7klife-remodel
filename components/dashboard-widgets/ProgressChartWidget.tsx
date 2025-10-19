import React from 'react';
import { useHabits, useProjects, useJournal } from '../../hooks/useDataHooks';

const CircularProgress: React.FC<{
  progress: number;
  radius: number;
  strokeWidth: number;
  color: string;
  size: number;
}> = ({ progress, radius, strokeWidth, color, size }) => {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
      <circle
        className="text-gray-200 dark:text-neutral-700/50"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </g>
  );
};

const MultiLayerProgressChart: React.FC = () => {
    const { habits } = useHabits();
    const { projects } = useProjects();
    const { entries } = useJournal();

    const size = 220;
    const strokeWidth = 18;

    const habitsCompleted = habits.filter(h => h.current >= h.goal).length;
    const habitsProgress = habits.length > 0 ? (habitsCompleted / habits.length) * 100 : 0;
    
    const tasksCompleted = projects.flatMap(p => p.tasks).filter(t => t.completed).length;
    const totalTasks = projects.flatMap(p => p.tasks).length;
    const projectsProgress = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;
    
    const journalProgress = entries.some(e => new Date(e.date).toDateString() === new Date().toDateString()) ? 100 : 0;

    const totalProgress = (habitsProgress + projectsProgress + journalProgress) / 3;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="absolute inset-0" width={size} height={size}>
                <CircularProgress progress={habitsProgress} radius={100} strokeWidth={strokeWidth} color="text-purple-500" size={size} />
                <CircularProgress progress={projectsProgress} radius={78} strokeWidth={strokeWidth} color="text-sky-500" size={size} />
                <CircularProgress progress={journalProgress} radius={56} strokeWidth={strokeWidth} color="text-amber-500" size={size} />
            </svg>
            <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Overall Progress</p>
                <p className="text-5xl font-bold text-gray-800 dark:text-neutral-100">{Math.round(totalProgress) || 0}%</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Keep it up!</p>
            </div>
        </div>
    );
};

const ProgressChartWidget: React.FC = () => {
  const { habits } = useHabits();
  const { projects } = useProjects();
  const { entries } = useJournal();

  const habitsCompleted = habits.filter(h => h.current >= h.goal).length;
  const tasksLeft = projects.flatMap(p => p.tasks).filter(t => !t.completed).length;
  const journaledToday = entries.some(e => new Date(e.date).toDateString() === new Date().toDateString());

  return (
    <div className="bg-slate-50 dark:bg-neutral-800 rounded-2xl shadow-sm p-6 flex flex-col items-center">
        <MultiLayerProgressChart />
        <div className="w-full grid grid-cols-3 gap-4 mt-6 text-center">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Habits</p>
                <p className="font-bold text-lg text-purple-600 dark:text-purple-400">{habitsCompleted}/{habits.length}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tasks</p>
                <p className="font-bold text-lg text-sky-500 dark:text-sky-400">{tasksLeft} left</p>
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Journal</p>
                <p className={`font-bold text-lg ${journaledToday ? 'text-amber-500 dark:text-amber-400' : 'text-gray-500'}`}>{journaledToday ? 'Done' : 'Write'}</p>
            </div>
        </div>
    </div>
  );
};

export default ProgressChartWidget;
