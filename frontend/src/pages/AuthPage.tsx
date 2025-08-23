import React from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const AuthPage = () => {
  const location = useLocation();
  const isSignup = location.pathname === '/signup';

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <img src="/logo.png" alt="Logo" className="w-12 mb-2 mx-auto" />
      <div className="w-96 p-5 bg-white rounded-lg shadow-md">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold">{isSignup ? 'Create an Account' : 'Welcome Back!'}</h2>
        </div>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-bold">Email</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-bold">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {isSignup && (
            <div className="mb-4">
              <label htmlFor="confirm-password" className="block mb-1 font-bold">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm Password"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded font-bold hover:bg-blue-600"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <div className="text-center my-5 text-gray-500">OR</div>
        <button
          className="w-full p-2 bg-white text-black border border-gray-300 rounded flex items-center justify-center font-bold hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faGoogle} className="w-5 h-5 mr-2" />
          {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
        </button>
        <div className="text-center mt-5">
          <a
            href={isSignup ? '/login' : '/signup'}
            className="text-blue-500 hover:underline"
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;