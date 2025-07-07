import React, { useState, useEffect } from "react";
import { XCircle, CheckCircle, Loader } from "lucide-react";

const Login = ({ handleLogin, setShowSignUp, setShowLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); // Show loading state

    try {
      const response = await fetch("https://laundry-management-system-1-ik0a.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("Login Response:", data); // Debugging log

      if (response.ok) {
        // Store token in localStorage
        
        localStorage.setItem("token", data.token);

        // Decode JWT to get userId
        
      
        // localStorage.setItem("userId", data.userid); // Store userId

        handleLogin(data.role,data.userid);

        setAlert({
          type: "success",
          message:
            data.role === "Admin"
              ? "Welcome Admin! Redirecting to Dashboard..."
              : "Login Successful! Redirecting...",
        });

        console.log("Success Alert Set"); // Debugging log

        // Delay before redirecting to show alert
        setTimeout(() => {
          window.location.href =
            data.role === "Admin" ? "/admin-dashboard" : "/user-dashboard";
        }, 2000);
      } else {
        setAlert({ type: "error", message: data.message });
      }
    } catch (error) {
      console.error("Login failed", error);
      setAlert({
        type: "error",
        message: "Something went wrong. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alert) {
      console.log("Alert Shown:", alert); // Debugging log

      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
          Login
        </h2>

        {/* Custom Alert */}
        {alert && (
          <div
            className={`fixed top-4 right-4 flex items-center gap-3 p-4 rounded-lg shadow-lg transition-all duration-300 ${
              alert.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {alert.type === "success" ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <XCircle className="w-6 h-6" />
            )}
            <span>{alert.message}</span>
          </div>
        )}

        <label className="block font-semibold text-gray-700">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-gray-700"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block font-semibold text-gray-700">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-gray-700"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full flex justify-center items-center bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin w-5 h-5" /> : "Login"}
        </button>

        <p className="text-center mt-2 text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-gray-800 cursor-pointer hover:underline"
            onClick={() => {
              setShowSignUp(true);
              setShowLogin(false);
            }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
