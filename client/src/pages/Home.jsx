import { Layout, Typography, Carousel } from 'antd';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';
import { getBooks } from '@/api/bookApi';
import BookCard from '@/components/BookCard';

const { Content } = Layout;
const { Title } = Typography;

const carouselImages = [
  {
    url: 'https://img1.baidu.com/it/u=81620038,1335211009&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800',
    title: '精选推荐 -- 斗罗大陆',
    description: '热门小说推荐'
  },
  {
    url: 'https://bossaudioandcomic-1252317822.image.myqcloud.com/activity/document/4adf9fdc7f8ba0a01499e6c1c2dea509.jpg',
    title: '精选推荐 -- 元始法则',
    description: '经典作品集锦'
  },
  {
    url: 'https://bossaudioandcomic-1252317822.image.myqcloud.com/activity/document/bb50f9fada39fc49b92c446dd955d152.jpg',
    title: '精选推荐 -- 上命昭唐',
    description: '新书上架'
  }
];

const Home = () => {
  const { user } = useStore();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.data);
      } catch (error) {
        console.error('获取书籍失败:', error);
      }
    };
    fetchBooks();
  }, []);

  // 获取热度最高的三本书
  const topThreeBooks = [...books].sort((a, b) => b.popularity - a.popularity).slice(0, 3);

  return (
    <Layout>
      <Navbar />
      <Content className="p-6">
        {/* 轮播图组件 */}
        <div className="mb-8 max-w-4xl mx-auto">
          <Carousel autoplay className="w-full h-70">
            {carouselImages.map((image, index) => (
              <div key={index} className="h-70">
                <div className="flex items-center justify-center h-full relative">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white rounded-b-lg">
                    <h3 className="text-xl">{image.title}</h3>
                    <p className="text-sm">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* 热门推荐 */}
        <div className="mb-8">
          <Title level={3}>热门推荐</Title>
          <div className="flex gap-6 mt-4 justify-center">
            {topThreeBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;