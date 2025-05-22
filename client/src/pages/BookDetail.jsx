import React, { useEffect, useState } from 'react';
import { Layout, Card, Avatar, Input, Button, List, Divider, Typography, Space, message } from 'antd';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { getBook } from '@/api/bookApi';
import { getCommentsByBook, createComment } from '@/api/commentApi';
import { getUser } from '@/api/userApi';
import { getCategory } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { createLibrary, getLibrariesByUser } from '@/api/libraryApi';
import './BookDetail.css';

const { Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useStore();
  const [book, setBook] = useState(null);
  const [category, setCategory] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await getBook(id);
        setBook(response.data);
        if (response.data.category_id) {
          const categoryResponse = await getCategory(response.data.category_id);
          setCategory(categoryResponse.data);
        }
      } catch (error) {
        console.error('获取书籍详情失败:', error);
      }
    };
    fetchBookData();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getCommentsByBook(id);
        const commentsWithUser = await Promise.all(
          response.data.map(async (comment) => {
            const userResponse = await getUser(comment.user_id);
            return {
              ...comment,
              user: userResponse.data,
            };
          })
        );
        setComments(commentsWithUser);
      } catch (error) {
        console.error('获取评论失败:', error);
      }
    };
    fetchComments();
  }, [id]);

  useEffect(() => {
    const checkLibraryStatus = async () => {
      if (!user) return;
      try {
        const response = await getLibrariesByUser(user.id);
        console.log('书架检查响应:', response);  // 添加日志
        const isBookInLibrary = response.data.some(item => 
          parseInt(item.book_id) === parseInt(id)
        );
        console.log('是否在书架中:', isBookInLibrary);  // 添加日志
        setIsInLibrary(isBookInLibrary);
      } catch (error) {
        console.error('检查书架状态失败:', error);
      }
    };
    checkLibraryStatus();
  }, [user, id]);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !user) return;
    setLoading(true);
    try {
      await createComment({
        userId: user.id,
        content: commentText,
        bookId: parseInt(id)
      });
      setCommentText('');
      // 重新获取评论列表
      const response = await getCommentsByBook(id);
      const commentsWithUser = await Promise.all(
        response.data.map(async (comment) => {
          const userResponse = await getUser(comment.user_id);
          return {
            ...comment,
            user: userResponse.data,
          };
        })
      );
      setComments(commentsWithUser);
    } catch (error) {
      console.error('发表评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!book) return null;

  return (
    <Layout>
      <Navbar />
      <Content className="book-detail-content">
        <div className="book-detail-container">
          {/* 书籍信息卡片 */}
          <Card className="book-info-card">
            <div className="book-info-header">
              <div className="book-cover">
                {book.picture ? (
                  <img src={book.picture} alt={book.title} />
                ) : (
                  <div className="book-cover-placeholder">暂无图片</div>
                )}
              </div>
              <div className="book-info">
                <Title level={2}>{book.title}</Title>
                <Space direction="vertical" size="small">
                  <Text>作者：{book.author}</Text>
                  <Text type="secondary">分类：{category?.name || '暂无分类'}</Text>
                  <Text type="secondary">热度：{book.popularity}</Text>
                  {user && (
                    <Button
                      type="primary"
                      disabled={isInLibrary}
                      onClick={async () => {
                        try {
                          if (!isInLibrary) {
                            await createLibrary({
                              userId: user.id,
                              bookId: parseInt(id)
                            });
                            setIsInLibrary(true);
                            message.success('已添加到书架');
                          }
                        } catch (error) {
                          console.error('添加到书架失败:', error);
                          message.error('添加到书架失败');
                        }
                      }}
                    >
                      {isInLibrary ? '已在书架' : '加入书架'}
                    </Button>
                  )}
                </Space>
              </div>
            </div>
            <Divider />
            <div className="book-content">
              <Title level={4}>内容简介</Title>
              <Text>{book.content}</Text>
            </div>
          </Card>

          {/* 评论区 */}
          <Card className="comments-section">
            <Title level={4}>读者评论</Title>
            {user ? (
              <div className="comment-input">
                <TextArea
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的评论..."
                />
                <Button
                  type="primary"
                  onClick={handleSubmitComment}
                  loading={loading}
                  className="submit-comment"
                >
                  发表评论
                </Button>
              </div>
            ) : (
              <Text type="secondary">登录后即可发表评论</Text>
            )}
            <List
              className="comments-list"
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(comment) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar>
                        {comment.user?.username?.[0]?.toUpperCase()}
                      </Avatar>
                    }
                    title={comment.user?.username}
                    description={comment.content}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default BookDetail;