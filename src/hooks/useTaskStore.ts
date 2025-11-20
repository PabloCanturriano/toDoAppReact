import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { api } from '../services/api';
import type { Task, TaskStatus } from '../types';

const useTaskStore = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await api.getTasks();
            setTasks(data);
        } catch {
            setError('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
        setLoading(true);
        try {
            const newTask: Task = {
                ...task,
                id: uuidv4(),
                createdAt: Date.now(),
            };
            await api.createTask(newTask);
            setTasks((prev) => [...prev, newTask]);
        } catch {
            setError('Failed to add task');
        } finally {
            setLoading(false);
        }
    };

    const updateTask = async (id: string, updatedFields: Partial<Task>) => {
        // Optimistic update
        const previousTasks = [...tasks];
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, ...updatedFields } : task))
        );

        try {
            const taskToUpdate = tasks.find((t) => t.id === id);
            if (taskToUpdate) {
                await api.updateTask({ ...taskToUpdate, ...updatedFields });
            }
        } catch {
            setError('Failed to update task');
            setTasks(previousTasks); // Revert on error
        }
    };

    const deleteTask = async (id: string) => {
        // Optimistic update
        const previousTasks = [...tasks];
        setTasks((prev) => prev.filter((task) => task.id !== id));

        try {
            await api.deleteTask(id);
        } catch {
            setError('Failed to delete task');
            setTasks(previousTasks); // Revert on error
        }
    };

    const getTasksByStatus = (status: TaskStatus) => {
        return tasks.filter((task) => task.status === status);
    };

    return {
        tasks,
        loading,
        error,
        setTasks,
        addTask,
        updateTask,
        deleteTask,
        getTasksByStatus,
    };
};

export default useTaskStore;
