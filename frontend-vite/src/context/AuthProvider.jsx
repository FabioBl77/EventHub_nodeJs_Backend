import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ AGGIUNTO

  // 🔹 Ricostruisce l'auth all'avvio
  useEffect(() => {
    const initializeAuth = () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);

          // Token scaduto → logout
          if (decoded.exp * 1000 < Date.now()) {
            console.warn("Token scaduto, logout automatico.");
            toast.warning("Sessione scaduta. Effettua di nuovo il login.", {
              position: "top-center",
            });
            handleLogout();
            setLoading(false);
            return;
          }

          // Token valido → ripristina utente
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } catch (err) {
          console.error("Token non valido:", err);
          handleLogout();
        }
      } else if (savedUser) {
        // Incongruenza: user salvato ma niente token → pulizia
        handleLogout();
      }

      setLoading(false); // ⬅️ FONDAMENTALE
    };

    initializeAuth();
  }, []);

  // 🔹 Login
  const handleLogin = (userData, token) => {
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,        // ⬅️ AGGIUNTO
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
