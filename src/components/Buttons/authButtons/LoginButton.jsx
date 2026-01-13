import React from 'react';
import { Link } from 'react-router';

const LoginButton = () => {
    return (
        <Link to='/login' className='btn bg-secondary text-white'>
            Login
        </Link>
    );
};

export default LoginButton;