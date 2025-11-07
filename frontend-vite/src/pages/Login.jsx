import { useState } from "react";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tentativo di login:", { email, password });
    // 👇 Qui poi collegheremo l'API di login
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>EventHub</h1>
        <p className="subtitle">Accedi al tuo account</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Inserisci la tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn">Accedi</button>
        </form>

        <p className="signup-text">
          Non hai un account? <a href="#">Registrati</a>
        </p>
      </div>
    </div>
  );
}
