import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar></Navbar>
      <div className='flex-1'>
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
