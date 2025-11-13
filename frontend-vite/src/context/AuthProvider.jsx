import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import api from "../api/api"; // ⬅️ NECESSARIO per chiamare /auth/me

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  //   RIPRISTINO AUTH ALL'AVVIO
  // ================================
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);

        // Token scaduto → logout
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token scaduto.");
          toast.warning("Sessione scaduta. Effettua di nuovo il login.");
          handleLogout();
          setLoading(false);
          return;
        }

        // ==========================
        // 🔥 Recupero utente reale dal backend
        // ==========================
        try {
          const res = await api.get("/auth/me");
          const backendUser = res.data.user;

          // Salviamo utente aggiornato
          setUser(backendUser);
          localStorage.setItem("user", JSON.stringify(backendUser));
        } catch (apiErr) {
          console.error("Errore recupero utente:", apiErr);
          handleLogout();
        }

      } catch (err) {
        console.error("Token non valido:", err);
        handleLogout();
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // ================================
  // LOGIN
  // ================================
  const handleLogin = (userData, token) => {
    if (token) localStorage.setItem("token", token);

    // SALVO l’utente in locale + stato
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // ================================
  // LOGOUT
  // ================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
