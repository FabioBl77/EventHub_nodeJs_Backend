import { useEffect, useContext, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import api from "../api/api";

const OauthSuccess = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const executed = useRef(false); // 👈 protezione

  useEffect(() => {
    if (executed.current) return; // 👈 evita doppie esecuzioni
    executed.current = true;

    const token = searchParams.get("token");

    if (!token) {
      toast.error("Token mancante o non valido", { position: "top-center" });
      navigate("/login");
      return;
    }

    const doLogin = async () => {
      try {
        const decoded = jwtDecode(token);
        const baseUser = { id: decoded.userId, role: decoded.role };

        localStorage.setItem("token", token);

        try {
          const res = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const fullUser = res.data.user || res.data;
          login(fullUser || baseUser, token);

          toast.success(`Benvenuto ${fullUser?.username || ""}!`, {
            position: "top-center",
          });
        } catch (err) {
          console.error("Errore nel recupero utente:", err);
          login(baseUser, token);
          toast.success("Login effettuato con successo!", {
            position: "top-center",
          });
        }

        navigate("/dashboard");
      } catch (err) {
        console.error("Errore decodifica token:", err);
        toast.error("Errore durante l'accesso OAuth", {
          position: "top-center",
        });
        navigate("/login");
      }
    };

    doLogin();
  }, [login, navigate, searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Accesso in corso...</h2>
      <p>Attendi qualche secondo...</p>
    </div>
  );
};

export default OauthSuccess;
