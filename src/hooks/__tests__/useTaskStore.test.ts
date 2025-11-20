import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useTaskStore from '../useTaskStore';
import { api } from '../../services/api';
import type { Task } from '../../types';

// Mock the API service
vi.mock('../../services/api', () => ({
    api: {
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
    },
}));

const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Task 1',
        status: 'todo',
        attachments: [],
        createdAt: 1234567890,
    },
    {
        id: '2',
        title: 'Task 2',
        status: 'in-progress',
        attachments: [],
        createdAt: 1234567891,
    },
];

describe('useTaskStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches tasks on mount', async () => {
        (api.getTasks as any).mockResolvedValue(mockTasks);

        const { result } = renderHook(() => useTaskStore());

        // Initially loading
        expect(result.current.loading).toBe(true);

        // Wait for tasks to be loaded
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.tasks).toEqual(mockTasks);
        expect(api.getTasks).toHaveBeenCalledTimes(1);
    });

    it('adds a task', async () => {
        (api.getTasks as any).mockResolvedValue([]);
        (api.createTask as any).mockImplementation(async (task: Task) => task);

        const { result } = renderHook(() => useTaskStore());

        await waitFor(() => expect(result.current.loading).toBe(false));

        const newTask = {
            title: 'New Task',
            status: 'todo' as const,
            attachments: [],
        };

        await act(async () => {
            await result.current.addTask(newTask);
        });

        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.tasks[0].title).toBe('New Task');
        expect(api.createTask).toHaveBeenCalledTimes(1);
    });

    it('updates a task', async () => {
        (api.getTasks as any).mockResolvedValue(mockTasks);
        (api.updateTask as any).mockResolvedValue({ ...mockTasks[0], status: 'done' });

        const { result } = renderHook(() => useTaskStore());

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.updateTask('1', { status: 'done' });
        });

        expect(result.current.tasks[0].status).toBe('done');
        expect(api.updateTask).toHaveBeenCalledTimes(1);
    });

    it('deletes a task', async () => {
        (api.getTasks as any).mockResolvedValue(mockTasks);
        (api.deleteTask as any).mockResolvedValue(undefined);

        const { result } = renderHook(() => useTaskStore());

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.deleteTask('1');
        });

        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.tasks.find(t => t.id === '1')).toBeUndefined();
        expect(api.deleteTask).toHaveBeenCalledTimes(1);
    });

    it('handles fetch error', async () => {
        (api.getTasks as any).mockRejectedValue(new Error('Failed to fetch'));

        const { result } = renderHook(() => useTaskStore());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Failed to fetch tasks');
    });
});
