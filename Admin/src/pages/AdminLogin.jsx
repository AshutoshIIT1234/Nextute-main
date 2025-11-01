import { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { setAdmin } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);

        if (data.admin) setAdmin(data.admin);
        toast.success("Login successful!", {
          position: "top-right",
          style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
        });
        navigate("/");
      } else {
        toast.error(data.message || "Login failed", {
          position: "top-right",
          style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
        });
      }
    } catch (err) {
      toast.error("Server error", {
        position: "top-right",
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#144E53] text-center">Admin Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D7A66]"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D7A66]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#2D7A66] text-white py-2 rounded-lg font-semibold hover:bg-[#144E53] transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Want to create new admin? </span>
          <button
            type="button"
            className="text-[#2D7A66] font-semibold hover:underline"
            onClick={() => navigate("/admin/signup")}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;