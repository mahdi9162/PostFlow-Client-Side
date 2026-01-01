import React from 'react';
import logoImg from '../../assets/postFlowLogo.webp';
import { Link } from 'react-router';

const Logo = () => {
  return (
    <Link to="/">
      <figure>
        <img src={logoImg} className="w-26 md:w-30" alt="EduBridge Logo" />
      </figure>
    </Link>
  );
};

export default Logo;
