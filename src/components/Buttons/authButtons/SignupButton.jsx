import React from 'react';
import { Link } from 'react-router';

const SignupButton = () => {
  return (
    <Link to="/signup" className="btn bg-primary/60 text-white">
      Signup
    </Link>
  );
};

export default SignupButton;
