import React, { useState, useEffect } from "react";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import DashboardUser from "./pages/user";
import AdminDashboard from "./pages/admin";
import { Waves, LogIn, UserPlus, Timer, Sparkles, ShieldCheck } from 'lucide-react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
   const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  // Save login state and role to localStorage when they change
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("role", role);
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  }, [isLoggedIn, role, userId]);

  // Handle login
  const handleLogin = (userRole, id) => {
    setIsLoggedIn(true);
    setRole(userRole);
    setUserId(id);
    localStorage.setItem("userId", id); 
    
    
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole("");
    setUserId(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.href = "/";  // Redirect to the root/login page
  };

  if (isLoggedIn && role === "Admin") {
    return <AdminDashboard handleLogout={handleLogout} />;
  } else if (isLoggedIn && role === "User") {
    return <DashboardUser handleLogout={handleLogout} currentUserId={userId} />;
  }
  

  return <AuthScreen handleLogin={handleLogin} />;
};

// AuthScreen Component: Handles Login and Signup flow
const AuthScreen = ({ handleLogin }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Conditionally render Login or Signup forms
  if (showSignUp) {
    return <SignUp setShowSignUp={setShowSignUp} setShowLogin={setShowLogin} />;
  }

  if (showLogin) {
    return <Login handleLogin={handleLogin} setShowSignUp={setShowSignUp} setShowLogin={setShowLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />
      <main>
        <Hero />
        <Features />
        <Contact />
      </main>
    </div>
  );
};
// Navbar Component
function Navbar({ setShowLogin, setShowSignUp }) {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-lg shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <Waves className="h-8 w-8 text-gray-700" />
          <span className="text-2xl font-extrabold text-gray-900">Fabric Flow</span>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-2 text-gray-700 font-medium hover:text-gray-900 transition" onClick={() => { setShowLogin(true); setShowSignUp(false); }}>
            <LogIn className="h-5 w-5 inline-block mr-1" /> Login
          </button>
          <button className="px-6 py-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-900 transition" onClick={() => { setShowSignUp(true); setShowLogin(false); }}>
            <UserPlus className="h-5 w-5 inline-block mr-1" /> Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function Hero() {
  return (
    <section className="pt-32 pb-16 bg-gradient-to-br from-gray-100 to-gray-200 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
          Smart Laundry Management <br /> Made <span className="text-gray-700">Effortless</span>
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Optimize your laundry operations with cutting-edge automation & real-time tracking.
        </p>
        <div className="mt-6">
          <button className="px-8 py-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 transition">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}

// Features Section
function Features() {
  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-3xl font-extrabold text-gray-900">Why Choose LaundryPro?</h2>
      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {featuresData.map((feature, index) => (
          <div key={index} className="p-6 bg-gray-100 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            {feature.icon}
            <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
            <p className="text-gray-600 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Feature Data
const featuresData = [
  { icon: <Timer className="h-12 w-12 text-gray-700" />, title: "Real-time Tracking", description: "Monitor your operations with our advanced tracking system." },
  { icon: <Sparkles className="h-12 w-12 text-gray-700" />, title: "Smart Automation", description: "Optimize your workflow with automated processes." },
  { icon: <ShieldCheck className="h-12 w-12 text-gray-700" />, title: "Secure Platform", description: "Enterprise-grade security for your data and business." },
];

// Contact Section
function Contact() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-gray-200 text-center">
      <h2 className="text-4xl font-extrabold text-gray-900">Transform Your Laundry Business Today</h2>
      <p className="text-lg text-gray-600 mt-4">Join thousands of businesses optimizing their laundry operations.</p>
      <button className="mt-6 px-8 py-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 transition">
        Get Started Now
      </button>
      <p className="mt-4 text-sm text-gray-500">No credit card required • Free 14-day trial</p>
    </section>
  );
}

export default App;
