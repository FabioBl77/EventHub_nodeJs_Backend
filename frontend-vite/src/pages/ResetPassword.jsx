// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import "../styles/Register.css"; // riutilizziamo gli stessi stili del register

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordValid, setPasswordValid] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const [loading, setLoading] = useState(false);

  // Regex ufficiale (semplice e identica al Register)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const validatePassword = (password) => {
    setPasswordValid({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validazione password
    if (!passwordRegex.test(form.password)) {
      toast.error(
        "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un simbolo.",
        { position: "top-center" }
      );
      return;
    }

    // Controllo corrispondenza
    if (form.password !== form.confirmPassword) {
      toast.warning("Le password non coincidono.", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(`/auth/reset-password/${token}`, {
        password: form.password,
      });

      toast.success(res.data.message || "Password aggiornata!", {
        position: "top-center",
      });

      navigate("/login");
    } catch (err) {
      console.error("Errore reset password:", err);
      const msg =
        err.response?.data?.message ||
        "Errore durante il reset della password.";
      toast.error(msg, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Reimposta la tua password</h1>
        <p className="subtitle">Inserisci una nuova password sicura</p>

        <form onSubmit={handleSubmit}>
          {/* NUOVA PASSWORD */}
          <label>Nuova Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* REGOLE PASSWORD */}
          <ul className="password-rules">
            <li className={passwordValid.length ? "valid" : ""}>
              Minimo 8 caratteri
            </li>
            <li className={passwordValid.upper ? "valid" : ""}>
              Almeno 1 maiuscola
            </li>
            <li className={passwordValid.lower ? "valid" : ""}>
              Almeno 1 minuscola
            </li>
            <li className={passwordValid.number ? "valid" : ""}>
              Almeno 1 numero
            </li>
            <li className={passwordValid.special ? "valid" : ""}>
              Almeno 1 carattere speciale
            </li>
          </ul>

          {/* CONFERMA PASSWORD */}
          <label>Conferma Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Ripeti la password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Aggiornamento..." : "Aggiorna Password"}
          </button>
        </form>

        <p className="login-text">
          Torna al <Link to="/login">login</Link>
        </p>
      </div>
    </div>
  );
}
