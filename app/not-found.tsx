import React from 'react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>We're sorry, the page you are looking for does not exist.</p>
      <a href="/" className="home-link">Return Home</a>
    </div>
  );
};

export default NotFound;