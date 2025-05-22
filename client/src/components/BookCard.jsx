import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCategory } from '@/api/categoryApi';
import './Card.css';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (book.category_id) {
          const response = await getCategory(book.category_id);
          setCategory(response.data);
        }
      } catch (error) {
        console.error('获取分类失败:', error);
      }
    };
    fetchCategory();
  }, [book.category_id]);

  const handleCardClick = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <Card
      hoverable
      className="book-card"
      bodyStyle={{ padding: 0 }}
      onClick={handleCardClick}
    >
      <div className="book-card-container">
        {/* 左侧图片 */}
        <div className="book-card-image">
          {book.picture ? (
            <img
              alt={book.title}
              src={book.picture}
            />
          ) : (
            <div className="book-card-placeholder">
              暂无图片
            </div>
          )}
        </div>

        {/* 右侧内容 */}
        <div className="book-card-content">
          <h3 className="book-card-title">{book.title}</h3>
          <div className="book-card-info">
            <p className="book-card-author">作者：{book.author}</p>
            {category && (
              <p className="book-card-category">
                分类：{category.name}
              </p>
            )}
            <p className="book-card-description">{book.content}</p>
            <p className="book-card-popularity">热度：{book.popularity}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookCard;