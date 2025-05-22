import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { updateUser } from '@/api/userApi';

const UserForm = ({ user, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await updateUser(user.id, {
        nickname: values.nickname,
        email: values.email
      });
      
      if (response.data) {
        message.success('个人资料更新成功');
        onSuccess(response.data); // 传递更新后的用户数据
      } else {
        throw new Error('更新失败');
      }
    } catch (error) {
      console.error('更新个人资料失败:', error);
      message.error(error.response?.data?.message || '更新个人资料失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        username: user.username,
        email: user.email,
        nickname: user.nickname,
      }}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="nickname"
        label="昵称"
        rules={[{ required: true, message: '请输入昵称' }]}
      >
        <Input placeholder="请输入昵称" />
      </Form.Item>

      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>

      <Form.Item className="mb-0">
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default UserForm;