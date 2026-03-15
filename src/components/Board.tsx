import React, { useState, useMemo, lazy, Suspense } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { Layout, Button, Input, Spin } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Column from './Column';
import TaskCard from './TaskCard';
import useTaskStore from '../hooks/useTaskStore';
import useBoardDnd from '../hooks/useBoardDnd';
import useTaskModal from '../hooks/useTaskModal';
import { COLUMNS } from '../types';

const TaskModal = lazy(() => import('./TaskModal'));

const Board: React.FC = () => {
    const { tasks, setTasks, deleteTask, addTask, updateTask, loading } = useTaskStore();
    const [searchQuery, setSearchQuery] = useState('');

    const { activeId, activeTask, sensors, handleDragStart, handleDragEnd } = useBoardDnd({
        tasks,
        setTasks,
        updateTask,
    });

    const {
        isModalOpen,
        editingTask,
        handleEditTask,
        handleAddTask,
        handleSaveTask,
        handleCloseModal,
    } = useTaskModal({ addTask, updateTask });

    const filteredTasks = useMemo(
        () =>
            tasks.filter(
                (task) =>
                    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [tasks, searchQuery]
    );

    return (
        <Layout style={{ height: '100%', background: 'transparent' }}>
            <div
                style={{
                    padding: '0 0 16px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddTask}
                    loading={loading}
                >
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
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <Spin size="large" />
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: 24,
                            overflowX: 'auto',
                            paddingBottom: 24,
                            height: 'calc(100% - 48px)',
                        }}
                    >
                        {COLUMNS.map((col) => (
                            <Column
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                tasks={filteredTasks.filter((t) => t.status === col.id)}
                                onEditTask={handleEditTask}
                                onDeleteTask={deleteTask}
                            />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeId && activeTask ? (
                            <div style={{ transform: 'rotate(3deg)' }}>
                                <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}
            {isModalOpen && (
                <Suspense fallback={<Spin />}>
                    <TaskModal
                        open={isModalOpen}
                        onCancel={handleCloseModal}
                        onSave={handleSaveTask}
                        initialTask={editingTask}
                    />
                </Suspense>
            )}
        </Layout>
    );
};

export default Board;
