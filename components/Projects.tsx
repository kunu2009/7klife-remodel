import React from 'react';
import { Project, ProjectStatus, ProjectTask } from '../types';
import { PlusIcon, XIcon } from './icons';
import useLocalStorage from '../hooks/useLocalStorage';
import { useModal } from '../contexts/ModalContext';

const AddProjectForm: React.FC<{ onAdd: (data: { name: string, tasks: string[] }) => void }> = ({ onAdd }) => {
    const [name, setName] = React.useState('');
    const [tasks, setTasks] = React.useState<string[]>(['']);

    const handleTaskChange = (index: number, value: string) => {
        const newTasks = [...tasks];
        newTasks[index] = value;
        setTasks(newTasks);
    };

    const handleAddTask = () => {
        setTasks([...tasks, '']);
    };

    const handleRemoveTask = (index: number) => {
        if (tasks.length > 1) {
            setTasks(tasks.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nonEmptyTasks = tasks.map(t => t.trim()).filter(t => t);
        onAdd({ name, tasks: nonEmptyTasks });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New Project</h2>
            
            <div>
                <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                <input id="project-name" type="text" placeholder="e.g., Website Redesign" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none" required />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Tasks</label>
                <div className="space-y-2 mt-1">
                    {tasks.map((task, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder={`Task ${index + 1}`}
                                value={task}
                                onChange={e => handleTaskChange(index, e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveTask(index)}
                                className={`text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                                disabled={tasks.length <= 1}
                                aria-label="Remove task"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={handleAddTask} className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                    + Add another task
                </button>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">Add Project</button>
        </form>
    );
};

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
    const styles = {
        [ProjectStatus.Completed]: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
        [ProjectStatus.InProgress]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
        [ProjectStatus.NotStarted]: 'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-neutral-300',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
}

const ProjectCard: React.FC<{ project: Project, onUpdate: (project: Project) => void }> = ({ project, onUpdate }) => {
    const handleToggleTask = (taskId: string) => {
        const updatedTasks = project.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const allCompleted = updatedTasks.every(t => t.completed);
        const anyStarted = updatedTasks.some(t => t.completed);
        
        let newStatus = ProjectStatus.NotStarted;
        if (allCompleted && updatedTasks.length > 0) newStatus = ProjectStatus.Completed;
        else if (anyStarted) newStatus = ProjectStatus.InProgress;

        onUpdate({ ...project, tasks: updatedTasks, status: newStatus });
    };
    
    return (
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 dark:text-neutral-100 text-lg">{project.name}</h3>
                <StatusBadge status={project.status} />
            </div>
            <div className="space-y-3">
                {project.tasks.length > 0 ? (
                    project.tasks.map((task, index) => (
                        <div key={task.id} className="flex items-center cursor-pointer" onClick={() => handleToggleTask(task.id)}>
                            <div className="flex flex-col items-center mr-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-neutral-600'}`}>
                                    {task.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                {index < project.tasks.length - 1 && <div className="w-0.5 h-6 bg-gray-300 dark:bg-neutral-600"></div>}
                            </div>
                            <p className={`flex-1 ${task.completed ? 'text-gray-400 dark:text-neutral-500 line-through' : 'text-gray-600 dark:text-neutral-300'}`}>{task.name}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 dark:text-neutral-400">No tasks yet. Add a task to get started!</p>
                )}
            </div>
        </div>
    );
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const { openModal, closeModal } = useModal();

  const handleAddProject = (newProjectData: { name: string; tasks: string[] }) => {
      const newProject: Project = {
          name: newProjectData.name,
          id: crypto.randomUUID(),
          status: ProjectStatus.NotStarted,
          tasks: newProjectData.tasks.map(taskName => ({
              id: crypto.randomUUID(),
              name: taskName,
              completed: false,
          })),
      };
      setProjects(prev => [newProject, ...prev]);
      closeModal();
  };

  const handleUpdateProject = (updatedProject: Project) => {
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">Projects</h1>
            <button onClick={() => openModal(<AddProjectForm onAdd={handleAddProject}/>)} className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors">
                <PlusIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="space-y-4">
            {projects.length > 0 ? (
                projects.map(project => (
                    <ProjectCard key={project.id} project={project} onUpdate={handleUpdateProject} />
                ))
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No projects yet.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Projects;