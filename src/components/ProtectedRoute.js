// components/ProtectedRoute.js
import { useContext } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { AuthContext } from '../App';

const ProtectedRoute = () => {
  const { token, userInfo } = useContext(AuthContext);
  const { userId } = useParams();

  // אם אין התחברות כלל
  if (!token || !userInfo) {
    return <Navigate to="/" replace />;
  }

  // אם יש userId ב־URL והוא שונה מ־userInfo.user_id → נשלח ל־404
  if (userId && String(userId) !== String(userInfo.user_id)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
