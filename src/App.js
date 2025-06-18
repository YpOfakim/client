import * as React from 'react';
import { Outlet, NavLink, useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Create_Minyan from './pages/Create_Minyan';
import Navigation from './components/Navigation'; // עדכני לפי הנתיב שלך

import Segment_And_Note from './pages/Segment_And_Note';
import Login from './pages/Login';
import Home from './pages/Home';
import Todos from './pages/Todos';
import Albums from './pages/Albums';
import Posts from './pages/Posts';
import Register from './pages/Register';
import Photos from './pages/Photos';
import Comments from './pages/Comments';
function App() {

  return (
 
     <AuthProvider>
       <Routes>
         <Route index element={<Front_Home/>} />
         <Route path="sign_in" element={<Sign_In />} />
         <Route path="sign_up" element={<Sign_Up />} />
         
         {/* עטיפת הדפים שרוצים בהם ניווט */}
          <Route path="user/:userId" element={<LayoutWithNav />}>
           <Route path="home" element={<Home />} />
           <Route path="create_minyan" element={<Create_Minyan />} />
           <Route path="search_minyan" element={<Search_Minyan />} />
           <Route path="profile" element={<Profile />} />
           <Route path="my_notes" element={<My_Notes />} />
           <Route path="daily_segments_history" element={<Daily_Segments_History />} />
           <Route path="segments_and_note" element={<Segments_And_Note />} />
           <Route path="sidur/:prayerName" element={<Sidur />} />
         </Route>
         <Route path="*" element={<NoMatch />} />
       </Routes>
     </AuthProvider>
  );
}

// New layout for user-specific routes
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
  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    const token = 'sample_token'; // Placeholder token
    setToken(token);
    navigate('/home');
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const NoMatch = () => {
  return <p>There's nothing here: 404!</p>;
};

export default App;
export {  AuthContext , AuthProvider, NoMatch };



// const Front_Home = () => {
//   return (
//     <div>
//       <h1>Welcome to the App</h1>
//       <p>Please log in or register to continue.</p>
//       <NavLink to="/sign_in">Login</NavLink>
//       <NavLink to="/sign_up">Register</NavLink>
//     </div>
//   );
// };