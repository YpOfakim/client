import * as React from 'react';
import { Outlet, NavLink, useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Navigation from './components/Navigation'; 

import Create_Minyan from './pages/Create_Minyan';
import Daily_Segments_History from './pages/Daily_Segments_History';
import Home from './pages/Home';
import My_Notes from './pages/My_Notes';
import Profile from './pages/Profile';
import Search_Minyan from './pages/Search_Minyan';
import Sign_In from './pages/Sign_In';
import Sign_Up from './pages/Sign_Up';
import Segment_And_Note from './pages/Segment_And_Note';
import Sidur from './pages/Sidur';

import ProtectedRoute from './components/ProtectedRoute'; // ✅

function App() {
  return (
    <AuthProvider>
      <Routes>
<Route path="/" element={<Front_Home />} />
        <Route path="sign_in" element={<Sign_In />} />
        <Route path="sign_up" element={<Sign_Up />} />

        {/* ✅ עטיפת כל המסלולים המוגנים בתוך ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="user/:userId" element={<LayoutWithNav />}>
            <Route path="home" element={<Home />} />
            <Route path="create_minyan" element={<Create_Minyan />} />
            <Route path="search_minyan" element={<Search_Minyan />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my_notes" element={<My_Notes />} />
            <Route path="daily_segments_history" element={<Daily_Segments_History />} />
            <Route path="segments_and_note" element={<Segment_And_Note />} />
            <Route path="sidur/:prayerName" element={<Sidur />} />
          </Route>
        </Route>

        <Route path="*" element={<NoMatch />} />
      </Routes>
    </AuthProvider>
  );
}

const LayoutWithNav = () => {
  const { userId } = useParams();
  return (
    <>
      <Navigation userId={userId} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo") || "{}")
  );

  const handleLogin = async (token, userInfo) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setToken(token);
    setUserInfo(userInfo);
    navigate(`/user/${userInfo.user_id}/home`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setToken(null);
    setUserInfo(null);
    navigate("/");
  };

  const value = {
    token,
    userInfo,
    isLoggedIn: !!token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const NoMatch = () => {
  return <p>There's nothing here: 404!</p>;
};

export default App;
export { AuthContext, AuthProvider, NoMatch };

const Front_Home = () => {
  return (
    <div>
      <h1>בלכתך בדרך</h1>
      <p>נא להתחבר או להרשם כדי</p>
      <NavLink to="/sign_in">התחברות</NavLink>
      <NavLink to="/sign_up">הרשמה</NavLink>
    </div>
  );
};
