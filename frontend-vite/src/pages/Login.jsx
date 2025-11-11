import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const { user, token } = res.data;

      if (!token) throw new Error("Token non ricevuto dal server.");

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      toast.success(`Benvenuto ${user.username || ""}!`, {
        position: "top-center",
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Errore login:", err);

      let msg = "Errore durante il login.";
      if (err.response?.status === 401)
        msg = "Email o password non corretti.";
      else if (err.response?.data?.message)
        msg = err.response.data.message;

      toast.error(msg, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Accedi a EventHub</h1>
        <p className="subtitle">Inserisci le tue credenziali per continuare</p>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>

        <p className="forgot-password">
          <Link to="/forgot-password">Hai dimenticato la password?</Link>
        </p>

        <p className="signup-text">
          Non hai un account? <Link to="/register">Registrati</Link>
        </p>
      </div>
    </div>
  );
}
