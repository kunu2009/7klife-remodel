
import React from 'react';
import { Project, ProjectStatus } from '../types';
import { PlusIcon } from './icons';

const mockProjects: Project[] = [
  { 
    id: 1, name: 'App Redesign', status: ProjectStatus.InProgress, progress: 60,
    tasks: [
      { name: 'Wireframing', completed: true },
      { name: 'UI Mockups', completed: true },
      { name: 'Prototype', completed: true },
      { name: 'User Testing', completed: false },
      { name: 'Final Handoff', completed: false },
    ]
  },
  { 
    id: 2, name: 'Q3 Marketing Plan', status: ProjectStatus.Completed, progress: 100,
    tasks: [
      { name: 'Research', completed: true },
      { name: 'Strategy', completed: true },
      { name: 'Content Calendar', completed: true },
    ]
  },
    { 
    id: 3, name: 'Setup Home Office', status: ProjectStatus.NotStarted, progress: 0,
    tasks: [
      { name: 'Buy Desk', completed: false },
      { name: 'Assemble Chair', completed: false },
      { name: 'Cable Management', completed: false },
    ]
  },
];

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
    const styles = {
        [ProjectStatus.Completed]: 'bg-green-100 text-green-700',
        [ProjectStatus.InProgress]: 'bg-blue-100 text-blue-700',
        [ProjectStatus.NotStarted]: 'bg-gray-100 text-gray-700',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 text-lg">{project.name}</h3>
                <StatusBadge status={project.status} />
            </div>
            <div className="space-y-3">
                {project.tasks.map((task, index) => (
                    <div key={index} className="flex items-center">
                        <div className="flex flex-col items-center mr-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                {task.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            {index < project.tasks.length - 1 && <div className="w-0.5 h-6 bg-gray-300"></div>}
                        </div>
                        <p className={`flex-1 ${task.completed ? 'text-gray-400 line-through' : 'text-gray-600'}`}>{task.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const Projects: React.FC = () => {
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
            <button className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors">
                <PlusIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="space-y-4">
            {mockProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    </div>
  );
};

export default Projects;
