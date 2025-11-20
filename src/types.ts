export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Attachment {
    id: string;
    name: string;
    type: string;
    content: string; // Base64 string
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    startDate?: string;
    endDate?: string;
    attachments: Attachment[];
    createdAt: number;
}

export type ColumnType = {
    id: TaskStatus;
    title: string;
};

export const COLUMNS: ColumnType[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Completed' },
];
