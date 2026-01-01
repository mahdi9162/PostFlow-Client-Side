import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const MainLayout = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
