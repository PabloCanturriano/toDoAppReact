import { useState, useCallback } from 'react';
import type { Task } from '../types';

interface UseTaskModalParams {
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    updateTask: (id: string, fields: Partial<Task>) => void;
}

const useTaskModal = ({ addTask, updateTask }: UseTaskModalParams) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleEditTask = useCallback((task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    }, []);

    const handleAddTask = useCallback(() => {
        setEditingTask(null);
        setIsModalOpen(true);
    }, []);

    const handleSaveTask = useCallback(
        (task: Omit<Task, 'id' | 'createdAt'> | Task) => {
            if ('id' in task) {
                updateTask(task.id, task);
            } else {
                addTask(task);
            }
            setIsModalOpen(false);
        },
        [updateTask, addTask]
    );

    const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

    return {
        isModalOpen,
        editingTask,
        handleEditTask,
        handleAddTask,
        handleSaveTask,
        handleCloseModal,
    };
};

export default useTaskModal;
