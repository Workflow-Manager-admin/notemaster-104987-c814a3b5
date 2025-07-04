import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

// PUBLIC_INTERFACE
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  // PUBLIC_INTERFACE
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {isLogin ? (
        <Login onToggleForm={toggleForm} />
      ) : (
        <Register onToggleForm={toggleForm} />
      )}
    </>
  );
};

export default AuthPage;
