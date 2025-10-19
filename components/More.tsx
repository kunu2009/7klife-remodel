
import React from 'react';
import { Subscription } from '../types';

const mockSubscriptions: Subscription[] = [
    { id: 1, name: 'Netflix', iconUrl: 'https://img.uxwing.com/wp-content/themes/uxwing/download/brands-social-media/netflix-logo-icon.png', amount: 15.49, billingCycle: 'monthly', nextBilling: new Date(2024, 7, 5) },
    { id: 2, name: 'Spotify', iconUrl: 'https://img.uxwing.com/wp-content/themes/uxwing/download/brands-social-media/spotify-icon.png', amount: 10.99, billingCycle: 'monthly', nextBilling: new Date(2024, 7, 12) },
    { id: 3, name: 'Adobe Creative Cloud', iconUrl: 'https://img.uxwing.com/wp-content/themes/uxwing/download/brands-social-media/adobe-creative-cloud-icon.png', amount: 54.99, billingCycle: 'monthly', nextBilling: new Date(2024, 7, 20) },
];


const More: React.FC = () => {
    const totalMonthly = mockSubscriptions.reduce((acc, sub) => sub.billingCycle === 'monthly' ? acc + sub.amount : acc, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">More Trackers</h1>
      
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-2 text-center">
              <span className="text-4xl">📦</span>
              <p className="font-semibold text-gray-700">Inventory</p>
              <p className="text-xs text-gray-500">Track your belongings</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-2 text-center">
              <span className="text-4xl">🎯</span>
              <p className="font-semibold text-gray-700">Goals</p>
              <p className="text-xs text-gray-500">Set and achieve goals</p>
          </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Subscriptions</h2>
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
            <div className="text-center">
                <p className="text-sm text-gray-500">Monthly Total</p>
                <p className="text-3xl font-bold text-gray-800">${totalMonthly.toFixed(2)}</p>
            </div>
            <div className="space-y-3">
                {mockSubscriptions.map(sub => (
                    <div key={sub.id} className="flex items-center space-x-3">
                        <img src={sub.iconUrl} alt={sub.name} className="w-10 h-10 object-contain"/>
                        <div className="flex-1">
                            <p className="font-semibold">{sub.name}</p>
                            <p className="text-xs text-gray-500">Next: {sub.nextBilling.toLocaleDateString()}</p>
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
