// // src/components/ProtectedRoute.js
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '@/context/authContext';
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();

//   return isAuthenticated ? children : <Navigate to="/auth/sign-in" replace />;
// };

// export default ProtectedRoute;

// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token'); // Replace with your cookie name
  console.log('tokkkken',token);
  
  return token ? children : <Navigate to="/auth/sign-in" replace />;
};

export default ProtectedRoute;

