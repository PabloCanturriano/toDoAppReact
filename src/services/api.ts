import { db } from './db';
import type { Task } from '../types';

const DELAY_MS = 800; // Simulate network latency

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    async getTasks(): Promise<Task[]> {
        await delay(DELAY_MS);
        return db.getAllTasks();
    },

    async createTask(task: Task): Promise<Task> {
        await delay(DELAY_MS);
        await db.addTask(task);
        return task;
    },

    async updateTask(task: Task): Promise<Task> {
        await delay(DELAY_MS);
        await db.updateTask(task);
        return task;
    },

    async deleteTask(id: string): Promise<void> {
        await delay(DELAY_MS);
        await db.deleteTask(id);
    },
};
