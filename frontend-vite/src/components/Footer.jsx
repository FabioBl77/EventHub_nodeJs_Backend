import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} EventHub. Tutti i diritti riservati.</p>
      <div className="footer-links">
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="/register">Registrati</a>
        <a href="/privacy">Privacy</a>
      </div>
    </footer>
  );
}
