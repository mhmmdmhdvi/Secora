import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  const refreshCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaAnswer("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    if (parseInt(captchaAnswer) !== num1 + num2) {
      toast.warning("Captcha incorrect");
      refreshCaptcha();
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      if (response.ok) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        const data = await response.json();
        toast.error(
          data?.username?.[0] ||
            data?.email?.[0] ||
            data?.password?.[0] ||
            "Registration failed"
        );
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-start justify-center px-4 pt-24 sm:pt-28">
      <div className="w-full max-w-md border-2 border-gray-800 rounded-xl p-6 sm:p-8 md:p-10 shadow-sm">
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
            type="email"
            placeholder="Email"
            className="border border-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <input
            type="password"
            placeholder="Confirm Password"
            className="border border-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {num1} + {num2} =
            </span>

            <input
              type="text"
              placeholder="Answer"
              className="flex-1 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              required
            />
          </div>

          <button className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-sm sm:text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
