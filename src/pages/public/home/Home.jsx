import React from 'react';

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-base-content">
          Welcome to <span className="text-primary">PostFlow</span>
        </h1>
        <p className="text-base-content/60 max-w-md mx-auto">
          Internal Instagram post preparation and lead generation platform for team members.
        </p>
      </div>
    </div>
  );
};

export default Home;
