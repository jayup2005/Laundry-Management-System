import React, { useState } from "react";

const SignUp = ({ setShowSignUp, setShowLogin }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [role, setRole] = useState("User"); // Default role is User

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://laundry-management-system-1-ik0a.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, floorNumber, roomNumber, role }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful! Please login.");
        setShowSignUp(false);
        setShowLogin(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        <label className="block font-semibold">Full Name</label>
        <input type="text" className="w-full p-2 border rounded mb-3" placeholder="John Doe"
          value={fullName} onChange={(e) => setFullName(e.target.value)} />

        <label className="block font-semibold">Email</label>
        <input type="email" className="w-full p-2 border rounded mb-3" placeholder="example@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="block font-semibold">Password</label>
        <input type="password" className="w-full p-2 border rounded mb-3" placeholder="********"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <label className="block font-semibold">Floor Number</label>
        <input type="number" className="w-full p-2 border rounded mb-3" placeholder="e.g. 3"
          value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)} />

        <label className="block font-semibold">Room Number</label>
        <input type="text" className="w-full p-2 border rounded mb-3" placeholder="e.g. 305B"
          value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />

        <label className="block font-semibold">Sign up as</label>
        <select className="w-full p-2 border rounded mb-4"
          value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        <button className="w-full bg-blue-600 text-white py-2 rounded" onClick={handleSubmit}>
          Sign Up
        </button>

        <p className="text-center mt-2">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => { setShowSignUp(false); setShowLogin(true); }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
