// import * as React from 'react';
// import { Outlet, NavLink, useNavigate, useParams } from "react-router-dom";
// import { useContext, useState } from 'react';
// import { Routes, Route } from "react-router-dom";
import Create_Minyan from './pages/Create_Minyan';
import Search_Minyans from './pages/Search_Minyan';
import Segment_And_Note from './pages/Segment_And_Note';
// import Login from './pages/Login';
// import Home from './pages/Home';
// import Todos from './pages/Todos';
// import Albums from './pages/Albums';
// import Posts from './pages/Posts';
// import Register from './pages/Register';
// import Photos from './pages/Photos';
// import Comments from './pages/Comments';
function App() {

  return (
  // <Search_Minyans />
     <Create_Minyan />
  );
}

// New layout for user-specific routes
// const UserLayout = () => {
//   const { userId } = useParams(); // Get userId from URL
//   return (
//     <>
//       <Navigation userId={userId} />
//       <Outlet />
//     </>
//   );
// };

// const AuthContext = React.createContext(null);

// const Navigation = ({ userId }) => {
//   const { token, onLogout } = useContext(AuthContext);

//   return (
//     <nav>
//       {userId ? (
//         <>
//           <NavLink to={`todos`}>Todos</NavLink>
//           <NavLink to={`posts`}>Posts</NavLink>
//           <NavLink to={`albums`}>Albums</NavLink>
//         </>
//       ) : (
//         <>
//           <NavLink to="/login">Login</NavLink>
//           <NavLink to="/register">Register</NavLink>
//         </>
//       )}

//       {token && (
//         <button type="button" onClick={onLogout}>
//           Sign Out
//         </button>
//       )}
//     </nav>
//   );
// };

// const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const [token, setToken] = useState(null);

//   const handleLogin = async () => {
//     const token = 'sample_token'; // Placeholder token
//     setToken(token);
//     navigate('/home');
//   };

//   const handleLogout = () => {
//     setToken(null);
//   };

//   const value = {
//     token,
//     onLogin: handleLogin,
//     onLogout: handleLogout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// const NoMatch = () => {
//   return <p>There's nothing here: 404!</p>;
// };

export default App;
// export { UserLayout, AuthContext, Navigation, AuthProvider, NoMatch };
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