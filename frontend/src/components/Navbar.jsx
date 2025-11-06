// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/">EventHub</Link>
      <span style={{ marginLeft: '1rem' }}><Link to="/events">Eventi</Link></span>

      <div style={{ float: 'right' }}>
        {user ? (
          <>
            <span style={{ marginRight: 8 }}>Ciao, {user.username}</span>
            <button onClick={() => logout()}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 8 }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
