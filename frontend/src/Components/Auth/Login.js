import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        window.dispatchEvent(new Event("storage"));

        toast.success("Logged in successfully");
        navigate("/lessons");
      } else {
        toast.warning("Invalid credentials");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-start justify-center px-4 pt-24 sm:pt-28">
      <div className="w-full max-w-md border-2 border-gray-800 rounded-xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-center mb-6">SecureLearn</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-sm sm:text-base">
          New user?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
