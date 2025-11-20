import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../TaskCard';
import type { Task } from '../../types';

const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    attachments: [],
    createdAt: Date.now(),
};

describe('TaskCard', () => {
    it('renders task title and description', () => {
        render(<TaskCard task={mockTask} onEdit={() => { }} onDelete={() => { }} />);
        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('calls onEdit when edit button is clicked', () => {
        const handleEdit = vi.fn();
        render(<TaskCard task={mockTask} onEdit={handleEdit} onDelete={() => { }} />);

        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);

        expect(handleEdit).toHaveBeenCalledWith(mockTask);
    });

    it('calls onDelete when delete button is clicked', async () => {
        const handleDelete = vi.fn();
        render(<TaskCard task={mockTask} onEdit={() => { }} onDelete={handleDelete} />);

        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[1]);

        const confirmButton = await screen.findByText('Yes');
        fireEvent.click(confirmButton);

        expect(handleDelete).toHaveBeenCalledWith('1');
    });
});
