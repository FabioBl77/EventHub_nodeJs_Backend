import { useState } from "react";
import "../styles/Login.css"; // Riutilizzi lo stile della login

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dati registrazione:", form);
    // 👉 In seguito: chiamata API POST /api/auth/register
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Crea il tuo account</h1>
        <p className="subtitle">Unisciti alla community di EventHub</p>

        <form onSubmit={handleSubmit}>
          <label>Nome completo</label>
          <input
            type="text"
            name="name"
            placeholder="Es. Mario Rossi"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Inserisci la tua email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Conferma Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn">Registrati</button>
        </form>

        <p className="signup-text">
          Hai già un account? <a href="#">Accedi</a>
        </p>
        
      </div>
        
    </div>
    
  );
}
