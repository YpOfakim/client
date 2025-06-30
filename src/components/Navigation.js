import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App'; 
import '../style/nav_style.css'; 

const Navigation = ({ userId }) => {
  const { token, onLogout } = useContext(AuthContext);

  return (
    <nav className="nav-bar">
       <NavLink 
  to={`/user/${userId}/home`} 
  className={({ isActive }) => isActive ? 'active' : ''}
>
  בית
</NavLink>
      <NavLink to={`/user/${userId}/profile`}>הפרופיל שלי</NavLink>
      <NavLink to={`/user/${userId}/create_minyan`}>צור מניין</NavLink>
      <NavLink to={`/user/${userId}/search_minyan`}>חיפוש מניין</NavLink>
      <NavLink to={`/user/${userId}/daily_segments_history`}>היסטוריית חיזוקים</NavLink>
      <NavLink to={`/user/${userId}/segments_and_note`}>חיזוק יומי</NavLink>
      <NavLink to={`/user/${userId}/my_notes`}>הערות שלי</NavLink>

            {/* תפריט נפתח */}
          <div className="dropdown">
        <span className="dropdown-title">תפילות ⬇</span>
        <div className="dropdown-content">
          <NavLink to={`/user/${userId}/sidur/Shacharit`}>שחרית</NavLink>
          <NavLink to={`/user/${userId}/sidur/Mincha`}>מנחה</NavLink>
          <NavLink to={`/user/${userId}/sidur/Maariv`}>ערבית</NavLink>
        </div>
      </div>

       {token && (
  <div className="logout-container">
    <button className="logout-button" onClick={onLogout}>התנתק</button>
  </div>
)}
    </nav>
  );
};

export default Navigation;
