import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const NavbarProfileDropdown = () => {
  const { userSignOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await userSignOut();
      alert('Successfully signout');
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden">
          <img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" alt="User profile" />
        </div>
      </div>
      <ul tabIndex="-1" className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow border border-base-200">
        <li>
          <button>Profile Setting</button>
        </li>
        <li>
          <button onClick={handleSignOut} disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-xs"></span> : null}
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavbarProfileDropdown;
