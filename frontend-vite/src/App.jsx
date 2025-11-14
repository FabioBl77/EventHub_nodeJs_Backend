// src/App.jsx
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pagine utente
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ConfirmEmail from "./pages/ConfirmEmail";
import UserDashboard from "./pages/UserDashboard";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import UpdateEvent from "./pages/UpdateEvent";
import OauthSuccess from "./pages/OauthSuccess";

// Rotte admin
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminEvents from "./pages/AdminEvents";
import AdminReports from "./pages/AdminReports";
import AdminEventChat from "./pages/AdminEventChat";
import AdminUpdateEvent from "./pages/AdminUpdateEvent";



export default function App() {
  return (
    <>
      <Navbar />

      <main style={{ minHeight: "calc(100vh - 160px)" }}>
        <Routes>
          {/* Rotte pubbliche */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/confirm-email/:token" element={<ConfirmEmail />} />

          {/* OAuth */}
          <Route path="/oauth-success" element={<OauthSuccess />} />

          {/* Dashboard utente */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Eventi */}
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/update-event/:id" element={<UpdateEvent />} />

          {/* Rotte ADMIN protette */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/events"
            element={
              <AdminRoute>
                <AdminEvents />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/event-chat/:id"
            element={
              <AdminRoute>
                <AdminEventChat />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/update-event/:id"
            element={
              <AdminRoute>
                <AdminUpdateEvent />
              </AdminRoute>
            }
          />


          <Route
            path="/admin/reports"
            element={
              <AdminRoute>
                <AdminReports />
              </AdminRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
