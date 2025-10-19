import React from 'react';
import { Project, ProjectStatus, ProjectTask } from '../types';
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from './icons';
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

const EditTaskForm: React.FC<{ task: ProjectTask; onSave: (task: ProjectTask) => void; onDelete: () => void; onClose: () => void; }> = ({ task, onSave, onDelete, onClose }) => {
    const [name, setName] = React.useState(task.name);
    const [description, setDescription] = React.useState(task.description || '');
    const [dueDate, setDueDate] = React.useState(task.dueDate ? task.dueDate.split('T')[0] : '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...task,
            name: name.trim(),
            description: description.trim(),
            dueDate: dueDate || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Task</h2>
            <div>
                <label htmlFor="task-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Name</label>
                <input id="task-name" type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md" required />
            </div>
            <div>
                <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea id="task-description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md" rows={3}></textarea>
            </div>
            <div>
                <label htmlFor="task-dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                <input id="task-dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md" />
            </div>
            <div className="flex justify-between items-center pt-2">
                <button
                    type="button"
                    onClick={onDelete}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-md hover:bg-red-200 dark:hover:bg-red-900"
                    aria-label="Delete task"
                >
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                </button>
                <div className="flex space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-neutral-700 dark:text-gray-200 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-600">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save</button>
                </div>
            </div>
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
    const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);
    const { openModal, closeModal } = useModal();

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

    const handleSaveTaskName = (taskId: string, newName: string) => {
        const trimmedName = newName.trim();
        const originalTask = project.tasks.find(t => t.id === taskId);

        if (trimmedName && originalTask && trimmedName !== originalTask.name) {
            const updatedTasks = project.tasks.map(task =>
                task.id === taskId ? { ...task, name: trimmedName } : task
            );
            onUpdate({ ...project, tasks: updatedTasks });
        }
        setEditingTaskId(null);
    };

    const handleOpenEditModal = (task: ProjectTask) => {
        openModal(
            <EditTaskForm
                task={task}
                onSave={(updatedTask) => {
                    const updatedTasks = project.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
                    onUpdate({ ...project, tasks: updatedTasks });
                    closeModal();
                }}
                onDelete={() => {
                    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
                        const updatedTasks = project.tasks.filter(t => t.id !== task.id);
                        
                        const allCompleted = updatedTasks.every(t => t.completed);
                        const anyStarted = updatedTasks.some(t => t.completed);
                        
                        let newStatus = ProjectStatus.NotStarted;
                        if (updatedTasks.length === 0) newStatus = ProjectStatus.NotStarted;
                        else if (allCompleted) newStatus = ProjectStatus.Completed;
                        else if (anyStarted) newStatus = ProjectStatus.InProgress;

                        onUpdate({ ...project, tasks: updatedTasks, status: newStatus });
                        closeModal();
                    }
                }}
                onClose={closeModal}
            />
        );
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
                        <div key={task.id} className="flex items-center group">
                            <div className="flex flex-col items-center mr-4">
                                <button aria-label={`Toggle task ${task.name}`} onClick={() => handleToggleTask(task.id)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-neutral-600'}`}>
                                    {task.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </button>
                                {index < project.tasks.length - 1 && <div className="w-0.5 h-6 bg-gray-300 dark:bg-neutral-600 mt-1"></div>}
                            </div>
                            <div className="flex-1">
                                {editingTaskId === task.id ? (
                                    <input
                                        type="text"
                                        defaultValue={task.name}
                                        autoFocus
                                        onBlur={(e) => handleSaveTaskName(task.id, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveTaskName(task.id, e.currentTarget.value);
                                            if (e.key === 'Escape') setEditingTaskId(null);
                                        }}
                                        className="w-full bg-transparent focus:bg-white dark:focus:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1 -mx-1"
                                    />
                                ) : (
                                    <p
                                        onClick={(e) => { e.stopPropagation(); setEditingTaskId(task.id); }}
                                        className={`cursor-pointer rounded px-1 -mx-1 hover:bg-gray-100 dark:hover:bg-neutral-700/50 ${task.completed ? 'text-gray-400 dark:text-neutral-500 line-through' : 'text-gray-600 dark:text-neutral-300'}`}
                                    >
                                        {task.name}
                                    </p>
                                )}
                                {task.dueDate && (
                                    <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                                        Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </p>
                                )}
                            </div>
                             <button
                                onClick={() => handleOpenEditModal(task)}
                                className="ml-2 text-gray-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Edit details for ${task.name}`}
                            >
                                <PencilIcon className="w-4 h-4" />
                            </button>
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