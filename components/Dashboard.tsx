import React, { useState, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { View } from '../types';
import { PencilIcon, CheckIcon, DragHandleIcon } from './icons';
import ProgressChartWidget from './dashboard-widgets/ProgressChartWidget';
import QuickActionsWidget from './dashboard-widgets/QuickActionsWidget';
import { TodaysHabitsWidget, JournalPromptWidget, FocusTasksWidget } from './dashboard-widgets/AdditionalWidgets';
import ToggleSwitch from './ToggleSwitch';

const WIDGET_CONFIG = {
  progress: { name: 'Overall Progress', component: ProgressChartWidget },
  habitsToday: { name: "Today's Habits", component: TodaysHabitsWidget },
  focusTasks: { name: 'Focus Tasks', component: FocusTasksWidget },
  journalPrompt: { name: 'Journal Prompt', component: JournalPromptWidget },
  actions: { name: 'Quick Actions', component: QuickActionsWidget },
};

type WidgetId = keyof typeof WIDGET_CONFIG;

interface WidgetState {
  id: WidgetId;
  enabled: boolean;
}

const DEFAULT_LAYOUT: WidgetState[] = [
  { id: 'progress', enabled: true },
  { id: 'habitsToday', enabled: true },
  { id: 'focusTasks', enabled: true },
  { id: 'journalPrompt', enabled: true },
  { id: 'actions', enabled: true },
];

interface DashboardProps {
  setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [layout, setLayout] = useLocalStorage<WidgetState[]>('dashboard-layout', DEFAULT_LAYOUT);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleToggleWidget = (id: WidgetId) => {
    setLayout(prevLayout =>
      prevLayout.map(widget =>
        widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
      )
    );
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      e.currentTarget.classList.add('opacity-50');
    }, 0)
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
  };
  
  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;
    
    const newLayout = [...layout];
    const draggedItemContent = newLayout.splice(dragItem.current, 1)[0];
    newLayout.splice(dragOverItem.current, 0, draggedItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    setLayout(newLayout);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const orderedWidgets = layout.map(widget => ({
      ...widget,
      ...WIDGET_CONFIG[widget.id]
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <img src="/logo.jpg" alt="7k Life Logo" className="w-12 h-12 rounded-full object-cover" />
            <div>
                <p className="text-gray-500 dark:text-gray-400">{getGreeting()}</p>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-100">Home</h1>
            </div>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label={isEditing ? 'Done editing' : 'Edit dashboard layout'}
        >
          {isEditing ? <CheckIcon className="w-6 h-6 text-green-500"/> : <PencilIcon className="w-5 h-5 text-gray-500" />}
        </button>
      </header>
      
      <div className="space-y-4">
        {(isEditing ? orderedWidgets : orderedWidgets.filter(w => w.enabled)).map((widget, index) => {
          const widgetContent = (() => {
            if (!widget.component) return null;
            switch (widget.id) {
              case 'progress':
                return <ProgressChartWidget />;
              case 'actions':
                return <QuickActionsWidget setActiveView={setActiveView} />;
              case 'habitsToday':
                return <TodaysHabitsWidget />;
              case 'journalPrompt':
                return <JournalPromptWidget setActiveView={setActiveView} />;
              case 'focusTasks':
                return <FocusTasksWidget setActiveView={setActiveView} />;
              default:
                return null;
            }
          })();

          if (!widgetContent) return null;
          
          if (isEditing) {
            return (
              <div
                key={widget.id}
                className="relative bg-white dark:bg-neutral-800 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-2xl transition-opacity"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center text-gray-600 dark:text-neutral-300">
                        <div className="flex items-center space-x-2">
                           <div className="cursor-grab" aria-label={`Drag to reorder ${widget.name}`}>
                                <DragHandleIcon className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
                            </div>
                            <h3 className="font-semibold">{widget.name}</h3>
                        </div>
                        <ToggleSwitch enabled={widget.enabled} onChange={() => handleToggleWidget(widget.id)} label={`Toggle ${widget.name} widget`}/>
                    </div>
                     <div className={`transition-opacity ${widget.enabled ? 'opacity-100' : 'opacity-40'}`}>
                        {widgetContent}
                    </div>
                </div>
              </div>
            )
          }

          return (
            <div key={widget.id}>
              {widgetContent}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Dashboard;
