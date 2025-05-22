import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography, Avatar, Space, Button, Modal, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useStore } from '../store/userStore';
import { UserOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const { user, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  // 根据当前路径获取选中的菜单项
  const selectedKeys = () => {
    if (location.pathname === '/login') {
      return [];
    }
    return [location.pathname];
  };

  // 处理菜单点击事件
  const onMenuClick = (path) => {
    switch (path) {
      case '/':
        navigate('/');
        break;
      case '/categories':
        navigate('/categories');
        break;
      default:
        return [];
    }
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="theme-dark"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '0 24px',
        }}
      >
        <div style={{ width: '200px' }}>
          <Typography.Text
            strong
            style={{ fontSize: '1.2rem', color: '#fff' }}
          >
            书评应用
          </Typography.Text>
        </div>

        <div style={{ 
          flex: 1,
          display: 'flex',
          // justifyContent: 'center',
          alignItems: 'center',
          gap: '24px'
        }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={selectedKeys()}
            style={{
              minWidth: 0,
              border: 'none',
            }}
          >
            <Menu.Item key="/" onClick={() => onMenuClick('/')}>
              首页
            </Menu.Item>
            <Menu.Item key="/categories" onClick={() => onMenuClick('/categories')}>
              分类
            </Menu.Item>
          </Menu>
          <Input.Search
            placeholder="搜索书籍..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            style={{ 
              width: '300px',
              marginLeft: '16px',
            }}
            enterButton
          />
        </div>

        <div style={{ width: '300px', display: 'flex', justifyContent: 'flex-end' }}>
          {user ? (
            <Space align="center" size={8}>
              <Avatar
                style={{ backgroundColor: '#87d068' }}
                alt={user.username}
              >
                {user.username[0].toUpperCase()}
              </Avatar>
              <Text style={{ color: '#fff' }}>{user.username}</Text>
              <Button
                type="text"
                icon={<UserOutlined />}
                style={{ color: '#fff' }}
                onClick={() => navigate('/profile')}
              >
                个人中心
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: '确认退出',
                    content: '确定要退出登录吗？',
                    onOk: () => {
                      logout();
                      navigate('/login');
                    },
                  });
                }}
              >
                退出
              </Button>
            </Space>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')}>
              登录
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar;