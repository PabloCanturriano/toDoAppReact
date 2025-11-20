import React from 'react';
import { Card, Typography, Tag, Space, Button, Tooltip, Popconfirm } from 'antd';
import { ClockCircleOutlined, PaperClipOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Task } from '../types';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
    const priorityColor = (endDate?: string) => {
        if (!endDate) return 'default';
        const daysLeft = dayjs(endDate).diff(dayjs(), 'day');
        if (daysLeft < 2) return 'error';
        if (daysLeft < 5) return 'warning';
        return 'success';
    };

    return (
        <Card
            size="small"
            style={{ marginBottom: 16, cursor: 'grab' }}
            actions={[
                <Tooltip title="Edit" key="edit">
                    <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(task)} />
                </Tooltip>,
                <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={() => onDelete(task.id)}
                    okText="Yes"
                    cancelText="No"
                    key="delete"
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
            ]}
        >
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Text strong delete={task.status === 'done'}>
                        {task.title}
                    </Text>
                    {task.endDate && (
                        <Tag color={priorityColor(task.endDate)}>
                            {dayjs(task.endDate).format('MMM D')}
                        </Tag>
                    )}
                </Space>

                {task.description && (
                    <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                        {task.description}
                    </Paragraph>
                )}

                <Space size={16} style={{ fontSize: 12, color: '#8c8c8c' }}>
                    {task.startDate && (
                        <Space size={4}>
                            <ClockCircleOutlined />
                            <span>{dayjs(task.startDate).format('MMM D')}</span>
                        </Space>
                    )}
                    {task.attachments.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 8, overflowX: 'auto' }}>
                            {task.attachments.map((att) => (
                                att.type.startsWith('image/') || att.content.startsWith('data:image') ? (
                                    <img
                                        key={att.id}
                                        src={att.content}
                                        alt={att.name}
                                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }}
                                    />
                                ) : (
                                    <div key={att.id} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: 4, border: '1px solid #f0f0f0' }}>
                                        <PaperClipOutlined />
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </Space>
            </Space>
        </Card>
    );
};

export default TaskCard;
