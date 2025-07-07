import React, { useState, useEffect } from "react";
import { LogOut, ShoppingCart, CheckCircle } from "lucide-react";

const LaundryDashboard = ({ setIsLoggedIn, handleLogout, currentUserId }) => {
  const [balance, setBalance] = useState(1500); // Default balance is set to 1500
  const [totalOrders, setTotalOrders] = useState(0);
  const [order, setOrder] = useState({ shirts: 0, pants: 0, dresses: 0, date: "" });
  const [orderHistory, setOrderHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [name,setName] = useState("");

  const prices = { shirts: 2, pants: 3, dresses: 5 };

  // Fetch orders and user balance
  useEffect(() => {
    if (!currentUserId) {
      console.error("No currentUserId provided!");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://laundry-management-system-1-ik0a.onrender.com/orders/user/${currentUserId}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setOrderHistory(data); // Set the order history
        setTotalOrders(data.length); // Total orders
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    const fetchBalance = async () => {
      try {
        const response = await fetch(`https://laundry-management-system-1-ik0a.onrender.com/users/${currentUserId}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setName(data.fullName);
        setBalance(data.balance); // Set balance from database
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    
    fetchOrders();
    fetchBalance();
  }, [currentUserId]);

  // Calculate total cost
  const calculateTotal = () => {
    return order.shirts * prices.shirts + order.pants * prices.pants + order.dresses * prices.dresses;
  };

  // Place an order and update balance
  const placeOrder = async (currentUserId) => {
    const totalCost = calculateTotal();
    if (totalCost > balance) {
      alert("Insufficient balance to place the order.");
      return;
    }

    const newOrder = {
      userId: currentUserId,
      items: order,
      totalAmount: totalCost,
      status: "active",
    };

    try {
      // Place the order
      const response = await fetch("https://laundry-management-system-1-ik0a.onrender.com/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Successfully placed the order, now update the balance
      const newBalance = balance - totalCost;
      const balanceUpdateResponse = await fetch(`https://laundry-management-system-1-ik0a.onrender.com/users/update-balance/${currentUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: newBalance }), // Corrected request format
      });

      if (!balanceUpdateResponse.ok) {
        throw new Error("Failed to update balance.");
      }

      alert("Order placed successfully!");
      setBalance(newBalance);  
      setTotalOrders(prev => prev + 1);
      setOrder({ shirts: 0, pants: 0, dresses: 0, date: "" });

    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen font-sans text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-xl border border-gray-400">
        <h2 className="text-2xl font-bold text-gray-800">🧺 Fresh & Clean</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-800 text-lg">Welcome, {name}</span>
          <button onClick={handleLogout} className="text-red-600 font-bold flex items-center gap-1 hover:text-red-800 transition">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {[{ title: "Balance", value: `$${balance}`, color: "text-green-700", icon: <ShoppingCart className="w-6 h-6 text-green-600" /> },
          { title: "Total Orders", value: totalOrders, color: "text-purple-700", icon: <CheckCircle className="w-6 h-6 text-purple-600" />, onClick: () => setShowHistory(true) },
        ].map((card, index) => (
          <div key={index} className="p-6 bg-white shadow-lg rounded-xl text-center flex flex-col items-center border border-gray-400 cursor-pointer" onClick={card.onClick}>
            {card.icon}
            <p className={`mt-2 font-bold text-lg ${card.color}`}>{card.title}</p>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* New Order Section */}
      <div className="bg-white p-6 mt-6 shadow-lg rounded-xl border border-gray-400">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-gray-600" /> New Order
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
          {Object.keys(prices).map((item) => (
            <div key={item} className="flex flex-col items-center">
              <label className="capitalize text-gray-800 font-medium">{item}</label>
              <input
                type="number"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setOrder({ ...order, [item]: value >= 0 ? value : 0 });
                }}
                className="border p-2 rounded-md w-full text-center shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300"
              />
              <span className="text-sm text-gray-600">${prices[item]} each</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-lg font-bold text-gray-900">Total: ${calculateTotal()}</p>
        <div className="flex justify-center mt-4">
          <button onClick={() => placeOrder(currentUserId)} className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition shadow-md">
            Place Order
          </button>
        </div>
      </div>

      {/* Order History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold text-gray-800">Order History</h3>
            <ul className="mt-4">
              {orderHistory.map((order, index) => (
                <li key={index} className="border-b py-2 text-gray-700">
                  <p>🧺 <strong>Items:</strong> {JSON.stringify(order.items)}</p>
                  <p>💰 <strong>Total:</strong> ${order.totalAmount}</p>
                  <p>📦 <strong>Status:</strong> {order.status}</p>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowHistory(false)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaundryDashboard;
