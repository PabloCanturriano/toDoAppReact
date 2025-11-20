import { openDB, type DBSchema } from 'idb';
import type { Task } from '../types';

interface ToDoDB extends DBSchema {
    tasks: {
        key: string;
        value: Task;
    };
}

const DB_NAME = 'todo-app-db';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';

export const initDB = async () => {
    return openDB<ToDoDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        },
    });
};

export const db = {
    async getAllTasks(): Promise<Task[]> {
        const db = await initDB();
        return db.getAll(STORE_NAME);
    },

    async addTask(task: Task): Promise<string> {
        const db = await initDB();
        return db.add(STORE_NAME, task);
    },

    async updateTask(task: Task): Promise<string> {
        const db = await initDB();
        return db.put(STORE_NAME, task);
    },

    async deleteTask(id: string): Promise<void> {
        const db = await initDB();
        return db.delete(STORE_NAME, id);
    },
};
