import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle rounded-xl hover:bg-primary/8 transition-colors"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === 'dark' ? (
        <IoSunnyOutline className="size-5 text-base-content/70" />
      ) : (
        <IoMoonOutline className="size-5 text-base-content/70" />
      )}
    </button>
  );
};

export default ThemeToggle;
