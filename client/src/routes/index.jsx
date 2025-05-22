import React from 'react';  
import { Routes, Route } from 'react-router-dom';   
import Login from '@pages/Login';  
import Register from '@pages/Register'; 
import Home from '@pages/Home';  
import Categories from '@pages/Categories';
import BookDetail from '@pages/BookDetail';
import Search from '@pages/Search';
import Profile from '@pages/Profile';

const AppRoutes = () => {  
    return (  
        <Routes>  
            <Route path="/register" element={<Register />} />  
            <Route path="/login" element={<Login />} />  
            <Route path="/" element={<Home />} />  
            <Route path="/categories" element={<Categories />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>  
    );  
};  

export default AppRoutes;