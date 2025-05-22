import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { getCategories } from '@/api/categoryApi';
import { getBooks, getBooksByCategory } from '@/api/bookApi';

const { Content, Sider } = Layout;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('获取分类失败:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (selectedCategory === 'all') {
          const response = await getBooks();
          setBooks(response.data);
        } else {
          const response = await getBooksByCategory(selectedCategory);
          setBooks(response.data);
        }
      } catch (error) {
        console.error('获取书籍失败:', error);
      }
    };
    fetchBooks();
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const menuItems = [
    { key: 'all', label: '全部' },
    ...(categories?.map(category => ({
      key: category.id,
      label: category.name
    })) || [])
  ];

  return (
    <Layout>
      <Navbar />
      <Layout>
        <Sider
          width={200}
          theme="light"
          className="min-h-screen"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedCategory.toString()]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => handleCategorySelect(key)}
          />
        </Sider>
        <Layout className="p-6">
          <Content>
            <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Categories;