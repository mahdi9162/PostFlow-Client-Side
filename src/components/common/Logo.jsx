import React from 'react';
import logoImg from '../../assets/postFlowLogo.webp';
import { Link } from 'react-router';

const Logo = () => {
  return (
    <Link to="/">
      <figure className="bg-white p-1.5 px-2 rounded-xl inline-block">
        <img src={logoImg} className="w-20 sm:w-24 md:w-30" alt="PostFlow logo" />
      </figure>
    </Link>
  );
};

export default Logo;
