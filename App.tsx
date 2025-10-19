import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Habits from './components/Habits';
import Journal from './components/Journal';
import Projects from './components/Projects';
import More from './components/More';
import Modal from './components/Modal';
import Inventory from './components/Inventory';
import Goals from './components/Goals';
import { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'habits':
        return <Habits />;
      case 'journal':
        return <Journal />;
      case 'projects':
        return <Projects />;
      case 'more':
        return <More setActiveView={setActiveView} />;
      case 'inventory':
        return <Inventory />;
      case 'goals':
        return <Goals />;
      default:
        return <Dashboard setActiveView={setActiveView}/>;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-neutral-50 dark:bg-neutral-900 shadow-lg flex flex-col font-sans">
      <main className="flex-1 pb-24 p-4 text-gray-800 dark:text-neutral-200">
        {renderView()}
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
      <Modal />
    </div>
  );
};

export default App;