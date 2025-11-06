import api from "./axiosInstance";

export async function testLogin() {
  try {
    const res = await api.post("/auth/login", {
      email: "test@example.com",
      password: "password123",
    });
    console.log("✅ Login OK:", res.data);
  } catch (err) {
    console.error("❌ Errore login:", err.response?.data || err.message);
  }
}
