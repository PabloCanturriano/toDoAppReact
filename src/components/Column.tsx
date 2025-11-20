import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, Typography, Badge } from 'antd';
import { SortableTask } from './SortableTask';
import type { Task, TaskStatus } from '../types';

const { Title } = Typography;

interface ColumnProps {
    id: TaskStatus;
    title: string;
    tasks: Task[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks, onEditTask, onDeleteTask }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column' }}>
            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={5} style={{ margin: 0 }}>{title}</Title>
                        <Badge count={tasks.length} showZero color="#1677ff" />
                    </div>
                }
                style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}
                styles={{ body: { flex: 1, padding: 12, overflowY: 'auto' } }}
            >
                <div ref={setNodeRef} style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {tasks.map((task) => (
                            <SortableTask
                                key={task.id}
                                task={task}
                                onEdit={onEditTask}
                                onDelete={onDeleteTask}
                            />
                        ))}
                    </SortableContext>
                    {tasks.length === 0 && (
                        <div style={{
                            padding: '20px',
                            textAlign: 'center',
                            color: '#999',
                            border: '2px dashed #e0e0e0',
                            borderRadius: '8px',
                            marginTop: '8px',
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            No tasks yet
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Column;
