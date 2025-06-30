// components/ProtectedRoute.js
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../App';

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext);

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
