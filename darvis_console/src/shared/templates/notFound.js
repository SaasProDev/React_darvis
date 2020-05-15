import React from 'react';
import { NavLink } from 'react-router-dom';

const NotFound = () => (
  <>
    <div
      style={{
        textAlign: 'center',
        marginTop: '20vh',
        textShadow: '2px 2px 0 rgb(255, 86, 0)',
      }}
    >
      <div style={{ fontSize: '11rem', lineHeight: '1' }}>404</div>
      <div style={{ fontSize: '4rem' }}>Not Found</div>
    </div>
    <div
      style={{
        textAlign: 'center',
        marginTop: '5rem',
      }}
    >
      <NavLink className="btn btn-info" style={{ fontSize: '1.5rem' }} to="/console/site">
        Console Home
      </NavLink>
    </div>
  </>
);

export default NotFound;
