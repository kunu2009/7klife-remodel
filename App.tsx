
import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Habits from './components/Habits';
import Journal from './components/Journal';
import Projects from './components/Projects';
import More from './components/More';
import { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'habits':
        return <Habits />;
      case 'journal':
        return <Journal />;
      case 'projects':
        return <Projects />;
      case 'more':
        return <More />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-lg flex flex-col font-sans">
      <main className="flex-1 pb-24 p-4">
        {renderView()}
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;
