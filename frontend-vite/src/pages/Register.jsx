import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordValid, setPasswordValid] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const [loading, setLoading] = useState(false);

  // Regex coerente col backend, ma semplificata per evitare errori di escape
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const validatePassword = (password) => {
    setPasswordValid({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password), // ✅ almeno un carattere non alfanumerico
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      validatePassword(value);
    }
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

    // Controllo corrispondenza password
    if (form.password !== form.confirmPassword) {
      toast.warning("Le password non coincidono.", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      toast.success(
        "Registrazione completata! Controlla la tua email per confermare l'account.",
        { position: "top-center", autoClose: 5000 }
      );

      navigate("/login");
    } catch (err) {
      console.error("Errore registrazione:", err);
      const msg =
        err.response?.data?.message ||
        "Errore durante la registrazione. Riprova più tardi.";
      toast.error(msg, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Crea un nuovo account</h1>
        <p className="subtitle">
          Registrati su EventHub per scoprire e creare eventi
        </p>

        <form onSubmit={handleSubmit}>
          {/* USERNAME */}
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Il tuo nome utente"
            value={form.username}
            onChange={handleChange}
            required
          />

          {/* EMAIL */}
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="La tua email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}
          <label>Password</label>
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

          {/* CONFIRM PASSWORD */}
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

          {/* SUBMIT */}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Registrazione in corso..." : "Registrati"}
          </button>
        </form>

        <p className="login-text">
          Hai già un account? <Link to="/login">Accedi</Link>
        </p>
      </div>
    </div>
  );
}
