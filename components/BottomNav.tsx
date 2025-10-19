
import React from 'react';
import { View } from '../types';
import { HomeIcon, FlameIcon, BookOpenIcon, BriefcaseIcon, GridIcon } from './icons';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

interface NavItemProps {
  view: View;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-500'
      }`}
    >
      <div className={`w-7 h-7 mb-1 ${isActive ? '' : ''}`}>{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: 'dashboard', label: 'Home', icon: <HomeIcon /> },
    { view: 'habits', label: 'Habits', icon: <FlameIcon /> },
    { view: 'journal', label: 'Journal', icon: <BookOpenIcon /> },
    { view: 'projects', label: 'Projects', icon: <BriefcaseIcon /> },
    { view: 'more', label: 'More', icon: <GridIcon /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-t-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ view, label, icon }) => (
          <NavItem
            key={view}
            view={view as View}
            label={label}
            icon={icon}
            isActive={activeView === view}
            onClick={() => setActiveView(view as View)}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
