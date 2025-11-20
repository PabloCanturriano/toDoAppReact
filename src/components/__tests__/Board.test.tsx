import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Board from '../Board';
import useTaskStore from '../../hooks/useTaskStore';
import type { Task } from '../../types';

vi.mock('../../hooks/useTaskStore');

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

vi.mock('../TaskModal', () => ({
    default: ({ open }: { open: boolean }) => (
        open ? <div data-testid="task-modal">Task Modal Open</div> : null
    ),
}));

describe('Board', () => {
    const mockAddTask = vi.fn();
    const mockUpdateTask = vi.fn();
    const mockDeleteTask = vi.fn();
    const mockSetTasks = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useTaskStore).mockReturnValue({
            tasks: mockTasks,
            loading: false,
            error: null,
            addTask: mockAddTask,
            updateTask: mockUpdateTask,
            deleteTask: mockDeleteTask,
            setTasks: mockSetTasks,
            getTasksByStatus: vi.fn(),
        });
    });

    it('renders columns and tasks', () => {
        render(<Board />);

        expect(screen.getByText('To Do')).toBeInTheDocument();
        expect(screen.getByText('In Progress')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();

        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('opens add task modal when button is clicked', async () => {
        render(<Board />);

        const addButton = screen.getByRole('button', { name: /add task/i });
        fireEvent.click(addButton);

        expect(await screen.findByTestId('task-modal')).toBeInTheDocument();
    });

    it('shows loading spinner when loading', () => {
        vi.mocked(useTaskStore).mockReturnValue({
            tasks: [],
            loading: true,
            error: null,
            addTask: mockAddTask,
            updateTask: mockUpdateTask,
            deleteTask: mockDeleteTask,
            setTasks: mockSetTasks,
            getTasksByStatus: vi.fn(),
        });

        render(<Board />);

        expect(screen.queryByText('To Do')).not.toBeInTheDocument();
    });
});
