import React from 'react';
import { Subscription } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { useTheme } from '../contexts/ThemeContext';

const initialSubscriptions: Subscription[] = [
    { id: '1', name: 'Netflix', iconUrl: 'https://img.uxwing.com/wp-content/themes/uxwing/download/brands-social-media/netflix-logo-icon.png', amount: 15.49, billingCycle: 'monthly', nextBilling: new Date(2024, 7, 5).toISOString() },
    { id: '2', name: 'Spotify', iconUrl: 'https://img.uxwing.com/wp-content/themes/uxwing/download/brands-social-media/spotify-icon.png', amount: 10.99, billingCycle: 'monthly', nextBilling: new Date(2024, 7, 12).toISOString() },
];

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm flex justify-between items-center">
            <p className="font-semibold">Dark Mode</p>
            <button onClick={toggleTheme} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    )
}

const More: React.FC = () => {
    const [subscriptions] = useLocalStorage<Subscription[]>('subscriptions', initialSubscriptions);
    const totalMonthly = subscriptions.reduce((acc, sub) => sub.billingCycle === 'monthly' ? acc + sub.amount : acc, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">More Trackers</h1>
      
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-2 text-center cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-4xl">📦</span>
              <p className="font-semibold text-gray-700 dark:text-neutral-200">Inventory</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Coming soon</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-2 text-center cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-4xl">🎯</span>
              <p className="font-semibold text-gray-700 dark:text-neutral-200">Goals</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Coming soon</p>
          </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100 mb-3">Settings</h2>
        <ThemeToggle />
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100 mb-3">Subscriptions</h2>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm space-y-4">
            <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Total</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-neutral-100">${totalMonthly.toFixed(2)}</p>
            </div>
            <div className="space-y-3">
                {subscriptions.map(sub => (
                    <div key={sub.id} className="flex items-center space-x-3">
                        <img src={sub.iconUrl} alt={sub.name} className="w-10 h-10 object-contain bg-white rounded-full p-1"/>
                        <div className="flex-1">
                            <p className="font-semibold">{sub.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Next: {new Date(sub.nextBilling).toLocaleDateString()}</p>
                        </div>
                        <p className="font-bold">${sub.amount.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default More;
