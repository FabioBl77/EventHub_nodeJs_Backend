// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ConfirmEmail from "./pages/ConfirmEmail";
import UserDashboard from "./pages/UserDashboard";

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 160px)" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          
        </Routes>
      </main>
      <Footer />
    </>
  );
}
