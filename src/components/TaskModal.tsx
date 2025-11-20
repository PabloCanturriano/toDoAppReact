import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button, message, Carousel } from 'antd';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import { UploadOutlined, PaperClipOutlined } from '@ant-design/icons';
import type { Task, Attachment } from '../types';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

interface TaskModalProps {
    open: boolean;
    onCancel: () => void;
    onSave: (task: Omit<Task, 'id' | 'createdAt'> | Task) => void;
    initialTask?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onCancel, onSave, initialTask }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (open) {
            if (initialTask) {
                form.setFieldsValue({
                    ...initialTask,
                    startDate: initialTask.startDate ? dayjs(initialTask.startDate) : undefined,
                    endDate: initialTask.endDate ? dayjs(initialTask.endDate) : undefined,
                });
                // eslint-disable-next-line
                setFileList(initialTask.attachments.map(a => ({
                    uid: a.id,
                    name: a.name,
                    status: 'done',
                    url: a.content
                })));
            } else {
                form.resetFields();
                form.setFieldsValue({ status: 'todo' });
                setFileList([]);
            }
        }
    }, [open, initialTask, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const attachments: Attachment[] = await Promise.all(
                fileList.map(async (file) => {
                    if (file.url) {
                        return {
                            id: file.uid,
                            name: file.name,
                            type: 'unknown',
                            content: file.url
                        };
                    }
                    return new Promise<Attachment>((resolve, reject) => {
                        const reader = new FileReader();
                        const fileToRead = file.originFileObj || (file as RcFile);
                        reader.readAsDataURL(fileToRead);
                        reader.onload = () => resolve({
                            id: uuidv4(),
                            name: file.name,
                            type: file.type || 'unknown',
                            content: reader.result as string
                        });
                        reader.onerror = error => reject(error);
                    });
                })
            );

            const taskData = {
                ...values,
                startDate: values.startDate?.toISOString(),
                endDate: values.endDate?.toISOString(),
                attachments,
            };

            if (initialTask) {
                onSave({ ...initialTask, ...taskData });
            } else {
                onSave(taskData);
            }
            onCancel();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const uploadProps = {
        onRemove: (file: UploadFile) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file: RcFile) => {
            const isLt500K = file.size / 1024 < 500;
            if (!isLt500K) {
                message.error('File must be smaller than 500KB!');
                return Upload.LIST_IGNORE;
            }
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    return (
        <Modal
            title={initialTask ? "Edit Task" : "Add Task"}
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            destroyOnHidden
        >
            <Form form={form} layout="vertical">
                <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="todo">To Do</Select.Option>
                        <Select.Option value="in-progress">In Progress</Select.Option>
                        <Select.Option value="done">Completed</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Dates" style={{ marginBottom: 0 }}>
                    <Form.Item name="startDate" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                        <DatePicker placeholder="Start Date" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="endDate" style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 16px' }}>
                        <DatePicker placeholder="End Date" style={{ width: '100%' }} />
                    </Form.Item>
                </Form.Item>
                <Form.Item label="Attachments">
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Select File (Max 500KB)</Button>
                    </Upload>
                    {fileList.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <Carousel autoplay style={{ background: '#364d79', padding: '20px', borderRadius: '8px' }}>
                                {fileList.map((file) => {
                                    const url = file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : null);
                                    if (!url && !file.thumbUrl) return null;
                                    const src = url || file.thumbUrl;

                                    return (
                                        <div key={file.uid}>
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                                {file.type?.startsWith('image/') || src?.startsWith('data:image') ? (
                                                    <img src={src} alt={file.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                                ) : (
                                                    <div style={{ color: '#fff', textAlign: 'center' }}>
                                                        <PaperClipOutlined style={{ fontSize: 48 }} />
                                                        <div style={{ marginTop: 8 }}>{file.name}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </Carousel>
                        </div>
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskModal;
