import React, { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Layout, Button, Input, Spin } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Column from './Column';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import useTaskStore from '../hooks/useTaskStore';
import { COLUMNS } from '../types';
import type { Task } from '../types';

const Board: React.FC = () => {
    const { tasks, setTasks, deleteTask, addTask, updateTask, loading } = useTaskStore();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = tasks.find((t) => t.id === activeId);
        const overTask = tasks.find((t) => t.id === overId);

        if (!activeTask) return;

        let newTasks = [...tasks];

        const overColumn = COLUMNS.find(col => col.id === overId);
        if (overColumn) {
            if (activeTask.status !== overColumn.id) {
                newTasks = newTasks.map(t =>
                    t.id === activeId ? { ...t, status: overColumn.id } : t
                );
                updateTask(activeId, { status: overColumn.id });
            }
        }
        else if (overTask) {
            if (activeTask.status !== overTask.status) {
                newTasks = newTasks.map(t =>
                    t.id === activeId ? { ...t, status: overTask.status } : t
                );
                updateTask(activeId, { status: overTask.status });
            } else {
                const oldIndex = tasks.findIndex((t) => t.id === activeId);
                const newIndex = tasks.findIndex((t) => t.id === overId);
                newTasks = arrayMove(tasks, oldIndex, newIndex);
            }
        }

        setTasks(newTasks);
        setActiveId(null);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleAddTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleSaveTask = (task: Omit<Task, 'id' | 'createdAt'> | Task) => {
        if ('id' in task) {
            updateTask(task.id, task);
        } else {
            addTask(task);
        }
        setIsModalOpen(false); // Close modal after saving
    };

    const handleDeleteTask = (taskId: string) => {
        deleteTask(taskId);
    };

    const activeTask = tasks.find(t => t.id === activeId);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout style={{ height: '100%', background: 'transparent' }}>
            <div style={{ padding: '0 0 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTask} loading={loading}>
                    Add Task
                </Button>
                <Input
                    placeholder="Search tasks..."
                    prefix={<SearchOutlined />}
                    style={{ width: 250 }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {loading && tasks.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 24, height: 'calc(100% - 48px)' }}>
                        {COLUMNS.map((col) => (
                            <Column
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                tasks={filteredTasks.filter((t) => t.status === col.id)}
                                onEditTask={handleEditTask}
                                onDeleteTask={handleDeleteTask}
                            />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeId && activeTask ? (
                            <div style={{ transform: 'rotate(3deg)' }}>
                                <TaskCard task={activeTask} onEdit={() => { }} onDelete={() => { }} />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}
            <TaskModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                initialTask={editingTask}
            />
        </Layout>
    );
};

export default Board;
