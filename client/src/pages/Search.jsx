import React, { useEffect, useState } from 'react';
import { Layout, Typography, Empty, Input } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { getBooks } from '@/api/bookApi';

const { Content } = Layout;
const { Title } = Typography;

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const [searchText, setSearchText] = useState(query || '');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchBooks = async () => {
      setLoading(true);
      try {
        const response = await getBooks();
        const filteredBooks = response.data.filter(book => 
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.content.toLowerCase().includes(query.toLowerCase())
        );
        setBooks(filteredBooks);
      } catch (error) {
        console.error('搜索书籍失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      searchBooks();
    }
  }, [query]);

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <Layout>
      <Navbar />
      <Content className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Input.Search
              placeholder="搜索书籍..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ 
                maxWidth: '600px',
                margin: '0 auto',
                display: 'block'
              }}
              size="large"
              enterButton
            />
          </div>
          
          <Title level={3}>搜索结果: {query}</Title>
          {loading ? (
            <div>加载中...</div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 mt-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <Empty description="未找到相关书籍" />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Search;