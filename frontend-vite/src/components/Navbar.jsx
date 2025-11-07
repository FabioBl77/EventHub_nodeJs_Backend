import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ background: "#eee", padding: "10px" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/login">Login</Link> |{" "}
      <Link to="/register">Register</Link> |{" "}
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}
