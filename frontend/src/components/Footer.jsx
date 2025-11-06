// src/components/Footer.jsx
import React from 'react';

const Footer = () => (
  <footer style={{ padding: '1rem', borderTop: '1px solid #ddd', marginTop: '2rem', textAlign: 'center' }}>
    © {new Date().getFullYear()} EventHub
  </footer>
);

export default Footer;
