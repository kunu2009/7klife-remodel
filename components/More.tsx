import React from 'react';
import { Subscription, View } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { useTheme } from '../contexts/ThemeContext';
import { useModal } from '../contexts/ModalContext';
import { GoalIcon, InventoryIcon, PlusIcon } from './icons';

const AddSubscriptionForm: React.FC<{ onAdd: (sub: Omit<Subscription, 'id'>) => void }> = ({ onAdd }) => {
    const [name, setName] = React.useState('');
    const [amount, setAmount] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            name,
            amount: parseFloat(amount),
            billingCycle: 'monthly',
            nextBilling: new Date().toISOString(),
            iconUrl: `https://logo.clearbit.com/${name.toLowerCase().replace(/\s/g, '')}.com`
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add Subscription</h2>
            <input type="text" placeholder="Name (e.g., Netflix)" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md" required />
            <input type="number" placeholder="Monthly Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md" required />
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Add</button>
        </form>
    );
};

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm flex justify-between items-center">
            <p className="font-semibold">Dark Mode</p>
            <button onClick={toggleTheme} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    )
}

interface MoreProps {
  setActiveView: (view: View) => void;
}

const More: React.FC<MoreProps> = ({ setActiveView }) => {
    const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>('subscriptions', []);
    const { openModal, closeModal } = useModal();
    const totalMonthly = subscriptions.reduce((acc, sub) => sub.billingCycle === 'monthly' ? acc + sub.amount : acc, 0);

    const handleAddSubscription = (newSubData: Omit<Subscription, 'id'>) => {
        const newSub: Subscription = { ...newSubData, id: crypto.randomUUID() };
        setSubscriptions(prev => [...prev, newSub]);
        closeModal();
    };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">More Trackers</h1>
      
      <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setActiveView('inventory')} className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-2 text-center transition-transform hover:scale-105">
              <InventoryIcon className="w-10 h-10 text-indigo-500" />
              <p className="font-semibold text-gray-700 dark:text-neutral-200">Inventory</p>
          </button>
          <button onClick={() => setActiveView('goals')} className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-2 text-center transition-transform hover:scale-105">
              <GoalIcon className="w-10 h-10 text-rose-500" />
              <p className="font-semibold text-gray-700 dark:text-neutral-200">Goals</p>
          </button>
      </div>
      
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100 mb-3">Settings</h2>
        <ThemeToggle />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100">Subscriptions</h2>
            <button onClick={() => openModal(<AddSubscriptionForm onAdd={handleAddSubscription}/>)} className="text-indigo-600 dark:text-indigo-400">
                <PlusIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm space-y-4">
            <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Total</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-neutral-100">${totalMonthly.toFixed(2)}</p>
            </div>
            <div className="space-y-3">
                {subscriptions.map(sub => (
                    <div key={sub.id} className="flex items-center space-x-3">
                        <img src={sub.iconUrl} alt={sub.name} className="w-10 h-10 object-contain bg-white rounded-lg p-1 shadow-sm"/>
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