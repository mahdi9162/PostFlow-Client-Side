import React from 'react';
import Container from '../container/Container';
import Logo from './Logo';
import { Link, NavLink } from 'react-router';
import NavbarProfileDropdown from './NavbarProfileDropdown';

const Navbar = () => {
  const links = [
    { id: 1, name: 'Home', path: '/' },
    { id: 2, name: 'Snortpugs', path: '/snortpugs' },
    { id: 3, name: 'Pugsnortz', path: '/pugsnortz' },
    { id: 4, name: 'Pugsnuff', path: '/pugsnuff' },
  ];
  return (
    <Container>
      <div className="navbar bg-primary/5 shadow-sm mt-4 rounded-4xl px-5">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex="-1" className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              {links.map((link) => (
                <li key={link.id}>
                  <NavLink to={link.path} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <Logo></Logo>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-5">
            {' '}
            {links.map((link) => (
              <li key={link.id}>
                <NavLink to={link.path} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end">
          <NavbarProfileDropdown></NavbarProfileDropdown>
        </div>
      </div>
    </Container>
  );
};

export default Navbar;
