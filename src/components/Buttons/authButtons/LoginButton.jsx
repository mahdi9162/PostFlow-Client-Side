import React from 'react';
import { Link } from 'react-router';

const LoginButton = () => {
    return (
        <Link to='/login' className='btn btn-sm sm:btn-md bg-secondary text-white'>
            Login
        </Link>
    );
};

export default LoginButton;