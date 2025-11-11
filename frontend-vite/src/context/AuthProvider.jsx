import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ All'avvio: controlla se esiste utente e token valido
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Se scaduto → logout automatico
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token scaduto, logout automatico.");
          toast.warning("Sessione scaduta. Effettua di nuovo il login.", {
            position: "top-center",
          });
          handleLogout();
          return;
        }

        // Se valido → imposta utente
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Token non valido:", err);
        handleLogout();
      }
    } else if (savedUser) {
      // Non c'è token, ma c'è user (incongruenza) → pulizia
      handleLogout();
    }
  }, []);

  const handleLogin = (userData, token) => {
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
