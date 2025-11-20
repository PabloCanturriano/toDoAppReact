import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { db } from '../db';
import { openDB } from 'idb';
import type { Task } from '../../types';

vi.mock('idb', () => ({
    openDB: vi.fn(),
}));

const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    status: 'todo',
    attachments: [],
    createdAt: 1234567890,
};

describe('db service', () => {
    const mockDb = {
        getAll: vi.fn(),
        add: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        objectStoreNames: {
            contains: vi.fn(),
        },
        createObjectStore: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (openDB as Mock).mockResolvedValue(mockDb);
    });

    it('gets all tasks', async () => {
        mockDb.getAll.mockResolvedValue([mockTask]);
        const tasks = await db.getAllTasks();
        expect(openDB).toHaveBeenCalledWith('todo-app-db', 1, expect.any(Object));
        expect(mockDb.getAll).toHaveBeenCalledWith('tasks');
        expect(tasks).toEqual([mockTask]);
    });

    it('adds a task', async () => {
        mockDb.add.mockResolvedValue('1');
        await db.addTask(mockTask);
        expect(mockDb.add).toHaveBeenCalledWith('tasks', mockTask);
    });

    it('updates a task', async () => {
        mockDb.put.mockResolvedValue('1');
        await db.updateTask(mockTask);
        expect(mockDb.put).toHaveBeenCalledWith('tasks', mockTask);
    });

    it('deletes a task', async () => {
        mockDb.delete.mockResolvedValue(undefined);
        await db.deleteTask('1');
        expect(mockDb.delete).toHaveBeenCalledWith('tasks', '1');
    });
});
