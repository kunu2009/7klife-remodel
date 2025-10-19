import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { InventoryItem } from '../types';
import { PlusIcon, InventoryIcon } from './icons';
import { useModal } from '../contexts/ModalContext';

const AddInventoryItemForm: React.FC<{ onAdd: (item: Omit<InventoryItem, 'id'>) => void }> = ({ onAdd }) => {
    const [name, setName] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ name, category, quantity });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add Inventory Item</h2>
            <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md" required />
            <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md" required />
            <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(parseInt(e.target.value, 10))} className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-md" required />
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Add Item</button>
        </form>
    );
};

const Inventory: React.FC = () => {
    const [items, setItems] = useLocalStorage<InventoryItem[]>('inventory', []);
    const { openModal, closeModal } = useModal();

    const handleAddItem = (newItemData: Omit<InventoryItem, 'id'>) => {
        const newItem: InventoryItem = { ...newItemData, id: crypto.randomUUID() };
        setItems(prev => [...prev, newItem]);
        closeModal();
    };
    
    const groupedItems = items.reduce((acc, item) => {
        const category = item.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, InventoryItem[]>);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">Inventory</h1>
                <button onClick={() => openModal(<AddInventoryItemForm onAdd={handleAddItem} />)} className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>

            {items.length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(groupedItems).map(([category, itemsInCategory]) => (
                        <div key={category}>
                            <h2 className="text-lg font-bold text-gray-600 dark:text-neutral-300 mb-2 capitalize">{category}</h2>
                            <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm space-y-3">
                                {itemsInCategory.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded-md text-sm">{item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 flex flex-col items-center">
                    <InventoryIcon className="w-24 h-24 text-gray-300 dark:text-neutral-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Your inventory is empty.</p>
                    <p className="text-gray-500 dark:text-gray-400">Add an item to get started!</p>
                </div>
            )}
        </div>
    );
};

export default Inventory;
