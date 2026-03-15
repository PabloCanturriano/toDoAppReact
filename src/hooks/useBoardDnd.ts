import { useState, useCallback, useMemo } from 'react';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { COLUMNS } from '../types';
import type { Task } from '../types';

interface UseBoardDndParams {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    updateTask: (id: string, fields: Partial<Task>) => void;
}

const useBoardDnd = ({ tasks, setTasks, updateTask }: UseBoardDndParams) => {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const activeTask = useMemo(() => tasks.find((t) => t.id === activeId), [tasks, activeId]);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    }, []);

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            if (!over) return;

            const activeTaskId = active.id as string;
            const overId = over.id as string;

            const activeTask = tasks.find((t) => t.id === activeTaskId);
            const overTask = tasks.find((t) => t.id === overId);

            if (!activeTask) return;

            let newTasks = [...tasks];

            const overColumn = COLUMNS.find((col) => col.id === overId);
            if (overColumn) {
                if (activeTask.status !== overColumn.id) {
                    newTasks = newTasks.map((t) =>
                        t.id === activeTaskId ? { ...t, status: overColumn.id } : t
                    );
                    updateTask(activeTaskId, { status: overColumn.id });
                }
            } else if (overTask) {
                if (activeTask.status !== overTask.status) {
                    newTasks = newTasks.map((t) =>
                        t.id === activeTaskId ? { ...t, status: overTask.status } : t
                    );
                    updateTask(activeTaskId, { status: overTask.status });
                } else {
                    const oldIndex = tasks.findIndex((t) => t.id === activeTaskId);
                    const newIndex = tasks.findIndex((t) => t.id === overId);
                    newTasks = arrayMove(tasks, oldIndex, newIndex);
                }
            }

            setTasks(newTasks);
            setActiveId(null);
        },
        [tasks, updateTask, setTasks]
    );

    return { activeId, activeTask, sensors, handleDragStart, handleDragEnd };
};

export default useBoardDnd;
