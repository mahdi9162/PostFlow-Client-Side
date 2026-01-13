import React from 'react';

const NavbarProfileDropdown = () => {
  return (
    <div className="dropdown dropdown-end hidden">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden">
          <img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
        </div>
      </div>
      <ul tabIndex="-1" className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <button>Profile Setting</button>
        </li>
        <li>
          <button>Sign Out</button>
        </li>
      </ul>
    </div>
  );
};

export default NavbarProfileDropdown;
