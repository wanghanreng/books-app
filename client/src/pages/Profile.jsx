import React, { useState, useEffect } from 'react';
import { Layout, Card, Avatar, Typography, Tabs, Button, List, Modal, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';
import { getCommentsByUser, updateComment, deleteComment } from '@/api/commentApi';
import { getBook } from '@/api/bookApi';
import { getLibrariesByUser, deleteLibrary } from '@/api/libraryApi';
import UserForm from '@/components/UserForm';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Profile = () => {
  const { user, setUser } = useStore();
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('comments');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [libraries, setLibraries] = useState([]);
  
  useEffect(() => {
    const fetchLibraries = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const response = await getLibrariesByUser(user.id);
        const librariesWithBooks = await Promise.all(
          response.data.map(async (library) => {
            try {
              const bookResponse = await getBook(library.book_id);
              return {
                ...library,
                book: bookResponse.data,
              };
            } catch (error) {
              console.error('获取书籍详情失败:', error);
              return {
                ...library,
                book: null,
              };
            }
          })
        );
        setLibraries(librariesWithBooks);
      } catch (error) {
        console.error('获取书架失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'bookshelf') {
      fetchLibraries();
    }
  }, [user, activeTab]);

  const handleDeleteLibrary = (libraryId) => {
    Modal.confirm({
      title: '确认移出',
      content: '确定要将这本书从书架中移出吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteLibrary(libraryId);
          setLibraries(libraries.filter(library => library.id !== libraryId));
          message.success('已从书架移出');
        } catch (error) {
          console.error('移出书架失败:', error);
          message.error('移出书架失败');
        }
      }
    });
  };
  const handleEdit = (comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) {
      message.error('评论内容不能为空');
      return;
    }

    try {
      await updateComment(editingComment.id, {
        content: editContent,
        book_id: editingComment.book_id,
        user_id: user.id
      });
      
      // 更新本地评论列表
      setComments(comments.map(comment => 
        comment.id === editingComment.id 
          ? { ...comment, content: editContent }
          : comment
      ));
      
      message.success('评论更新成功');
      setEditModalVisible(false);
    } catch (error) {
      console.error('更新评论失败:', error);
      message.error('更新评论失败');
    }
  };

  const handleDelete = (commentId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条评论吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteComment(commentId);
          setComments(comments.filter(comment => comment.id !== commentId));
          message.success('评论删除成功');
        } catch (error) {
          console.error('删除评论失败:', error);
          message.error('删除评论失败');
        }
      }
    });
  };

  const handleEditUser = () => {
    setEditUserModalVisible(true);
  };

  const handleUserUpdateSuccess = (updatedUser) => {
    // 确保更新全局用户状态
    setUser({
      ...user,
      ...updatedUser
    });
    setEditUserModalVisible(false);
    message.success('个人资料已更新');
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const response = await getCommentsByUser(user.id);
        const commentsWithBooks = await Promise.all(
          response.data.map(async (comment) => {
            try {
              const bookResponse = await getBook(comment.book_id);
              return {
                ...comment,
                book: bookResponse.data,
              };
            } catch (error) {
              console.error('获取书籍详情失败:', error);
              return {
                ...comment,
                book: null,
              };
            }
          })
        );
        setComments(commentsWithBooks);
      } catch (error) {
        console.error('获取评论失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'comments') {
      fetchComments();
    }
  }, [user, activeTab]);

  return (
    <Layout>
      <Navbar />
      <Content className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* 个人信息卡片 */}
          <Card className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Avatar size={100} style={{ backgroundColor: '#87d068' }}>
                  {user?.username[0]?.toUpperCase()}
                </Avatar>
                <div>
                  <Title level={3}>{user?.nickname || user?.username}</Title>
                  <Text type="secondary">{user?.username}</Text>
                  <div className="mt-2">
                    <Text type="secondary">{user?.email}</Text>
                  </div>
                </div>
              </div>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleEditUser}
              >
                修改资料
              </Button>
            </div>
          </Card>

          {/* 标签页 */}
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="我的评论" key="comments">
                <List
                  loading={loading}
                  itemLayout="horizontal"
                  dataSource={comments}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button 
                          type="text" 
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(item)}
                        >
                          编辑
                        </Button>,
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(item.id)}
                        >
                          删除
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        title={<a href={`/books/${item.book?.id}`}>{item.book?.title || '未知书籍'}</a>}
                        description={item.content}
                      />
                      <div>{new Date(item.created_at).toLocaleDateString()}</div>
                    </List.Item>
                  )}
                />
              </TabPane>
              {/* 书架列表 */}
              <TabPane tab="我的书架" key="bookshelf">
                <List
                  loading={loading}
                  dataSource={libraries}
                  renderItem={library => (
                    <List.Item
                      actions={[
                        <Button
                          key="delete"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteLibrary(library.id)}
                        >
                          移出书架
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          library.book?.picture ? (
                            <img 
                              src={library.book.picture} 
                              alt={library.book.title}
                              style={{ 
                                width: '60px', 
                                height: '80px', 
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                          ) : (
                            <div 
                              style={{
                                width: '60px',
                                height: '80px',
                                background: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                color: '#999'
                              }}
                            >
                              暂无图片
                            </div>
                          )
                        }
                        title={<a href={`/books/${library.book?.id}`}>{library.book?.title}</a>}
                        description={
                          <div>
                            <div>作者：{library.book?.author}</div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </Card>

          {/* 编辑评论对话框 */}
          <Modal
            title="编辑评论"
            open={editModalVisible}
            onOk={handleUpdate}
            onCancel={() => setEditModalVisible(false)}
            okText="确定"
            cancelText="取消"
          >
            <Input.TextArea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              placeholder="请输入评论内容"
            />
          </Modal>

          {/* 编辑用户信息对话框 */}
          <Modal
            title="修改个人资料"
            open={editUserModalVisible}
            onCancel={() => setEditUserModalVisible(false)}
            footer={null}
          >
            <UserForm
              user={user}
              onSuccess={handleUserUpdateSuccess}
              onCancel={() => setEditUserModalVisible(false)}
            />
          </Modal>
        </div>
      </Content>
    </Layout>
  );
};

export default Profile;
