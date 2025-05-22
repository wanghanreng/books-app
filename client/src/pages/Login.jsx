import { Form, Input, Button, Typography, message } from 'antd';
import { loginUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await loginUser(values);
      setUser(response.data); // 设置用户信息
      message.success('登录成功');
      navigate('/'); // 登录成功后跳转到首页
    } catch (error) {
      console.error('Login failed:', error);
      message.error('登录失败');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-200">
      <div className="bg-white p-8 rounded-md shadow-lg w-150 mx-auto mt-20">
        <Title level={2}>登录</Title>
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-4">
          还没有账号？
          <a href="/register">去注册</a>
        </div>
      </div>
    </div>
  );
};

export default Login;