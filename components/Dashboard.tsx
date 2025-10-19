
import React from 'react';

const CircularProgress: React.FC<{
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  trailColor?: string;
  rotation?: number;
  circumference: number;
}> = ({ progress, size, strokeWidth, color, trailColor = 'currentColor', rotation = -90, circumference }) => {
  const radius = (size - strokeWidth) / 2;
  const offset = circumference - (progress / 100) * circumference;
  return (
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
      transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
    />
  );
};

const DailyProgressChart: React.FC = () => {
    const size = 220;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const metrics = [
        { progress: 78, color: 'text-purple-500' },
        { progress: 62, color: 'text-sky-400' },
        { progress: 45, color: 'text-amber-400' }
    ];

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="absolute inset-0" width={size} height={size}>
                <circle
                    className="text-gray-200"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {metrics.map((metric, index) => (
                    <CircularProgress
                        key={index}
                        progress={metric.progress}
                        size={size}
                        strokeWidth={strokeWidth}
                        color={metric.color}
                        circumference={circumference}
                    />
                ))}
            </svg>
            <div className="text-center">
                <p className="text-gray-500 text-sm">Today's Progress</p>
                <p className="text-4xl font-bold text-gray-800">78%</p>
                <p className="text-gray-500 text-sm">Great work!</p>
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-gray-500">Good morning,</p>
        <h1 className="text-3xl font-bold text-gray-800">Emmanuel</h1>
      </header>
      
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
        <DailyProgressChart />
        <div className="w-full grid grid-cols-3 gap-4 mt-6 text-center">
            <div>
                <p className="text-sm text-gray-500">Habits</p>
                <p className="font-bold text-lg text-purple-600">4/6</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Projects</p>
                <p className="font-bold text-lg text-sky-500">2 tasks</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Journal</p>
                <p className="font-bold text-lg text-amber-500">1 entry</p>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
            <button className="bg-indigo-100 text-indigo-700 p-4 rounded-xl text-left space-y-2 hover:bg-indigo-200 transition-colors">
                <span className="text-2xl">✍️</span>
                <p className="font-semibold">New Journal Entry</p>
            </button>
             <button className="bg-emerald-100 text-emerald-700 p-4 rounded-xl text-left space-y-2 hover:bg-emerald-200 transition-colors">
                <span className="text-2xl">💧</span>
                <p className="font-semibold">Log Water Intake</p>
            </button>
             <button className="bg-rose-100 text-rose-700 p-4 rounded-xl text-left space-y-2 hover:bg-rose-200 transition-colors">
                <span className="text-2xl">💪</span>
                <p className="font-semibold">Complete Workout</p>
            </button>
             <button className="bg-orange-100 text-orange-700 p-4 rounded-xl text-left space-y-2 hover:bg-orange-200 transition-colors">
                <span className="text-2xl">🚀</span>
                <p className="font-semibold">Add New Task</p>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
