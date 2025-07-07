import React, { useState, useEffect } from "react";
import { Users, ClipboardList, Briefcase, LogOut, X } from "lucide-react";

const AdminDashboard = ({ handleLogout }) => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([
    { id: 1, name: "Alice", floor: "1st Floor" },
    { id: 2, name: "Bob", floor: "2nd Floor" },
    { id: 3, name: "Charlie", floor: "3rd Floor" },
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderselected, setorderselected] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://laundry-management-system-1-ik0a.onrender.com/users");
        const data = await response.json();
        if (response.ok) {
          setUsers(data.filter((user) => user.role === "User"));
        } else {
          throw new Error("Failed to fetch users");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://laundry-management-system-1-ik0a.onrender.com/orders");
        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOrders();
  }, []);

  // Handle order status change
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://laundry-management-system-1-ik0a.onrender.com/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();

      // Update order list in state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Update selected order if it's open
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        setorderselected(selectedOrder);
        console.log(orderselected);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 space-y-4 fixed h-full">
        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center space-x-2 p-3 rounded-md w-full ${
            activeTab === "orders" ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          <ClipboardList className="w-5 h-5" /> <span>Orders</span>
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center space-x-2 p-3 rounded-md w-full ${
            activeTab === "users" ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          <Users className="w-5 h-5" /> <span>Users</span>
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`flex items-center space-x-2 p-3 rounded-md w-full ${
            activeTab === "staff" ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          <Briefcase className="w-5 h-5" /> <span>Staff</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 p-3 rounded-md w-full bg-red-500 text-white hover:bg-red-600 transition"
        >
          <LogOut className="w-5 h-5" /> <span>Logout</span>
        </button>
      </div>

      {/* Content */}
      <div className="ml-64 flex-1 p-6">
        {activeTab === "orders" && (
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-4">All Orders</h3>
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              orders.map((order) => {
                const user = users.find((u) => u._id === order.userId);
                return (
                  <div
                    key={order._id}
                    className="p-4 border rounded-md mb-3 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <h4 className="text-md font-bold">Order ID: {order._id}</h4>
                    <p>User: {user ? user.fullName : "Unknown User"}</p>
                    <p>Status: {order.status}</p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-xl w-[500px] relative border border-gray-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                onClick={() => setSelectedOrder(null)}
              >
                <X className="w-7 h-7" />
              </button>

              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Order Details
              </h3>
              <p className="text-gray-700">
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p className="text-gray-700">
                <strong>User:</strong>{" "}
                {users.find((u) => u._id === selectedOrder.userId)?.fullName ||
                  "Unknown User"}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong> {selectedOrder.status}
              </p>

              {/* <h4 className="font-semibold mt-3 text-gray-800">Items:</h4>
              <ul className="list-disc pl-5 text-gray-700">
  {orderselected.items && orderselected.items.length > 0 ? (
    orderselected.items.map((item, index) => (
      <li key={index}>
        {item.name} - {item.quantity}
      </li>
    ))
  ) : (
    <p className="text-red-500">No items found</p>
  )}
</ul> */}


              <div className="mt-6 flex justify-between">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition font-semibold"
                  onClick={() =>
                    handleOrderStatusChange(selectedOrder._id, "Completed")
                  }
                >
                  ✅ Mark as Completed
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg shadow-md transition font-semibold"
                  onClick={() =>
                    handleOrderStatusChange(selectedOrder._id, "Processing")
                  }
                >
                  🔄 Mark as Processing
                </button>
              </div>
            </div>
          </div>
        )}

{activeTab === "users" && (
  <div className="bg-white p-6 shadow rounded-lg">
    <h3 className="text-lg font-semibold mb-4">All Users</h3>
    {loading ? (
      <p>Loading users...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : users.length === 0 ? (
      <p>No users found.</p>
    ) : (
      users.map((user) => {
        // 🔹 Count orders where status is NOT "Completed"
        const pendingOrdersCount = orders.filter(
          (order) => order.userId === user._id && order.status !== "Completed"
        ).length;

        return (
          <div key={user._id} className="p-4 border rounded-md mb-3">
            <h4 className="text-md font-bold">{user.fullName}</h4>
            <p>Balance: {user.balance}</p>
            <p>Pending/Processing Orders: {pendingOrdersCount}</p>
          </div>
        );
      })
    )}
  </div>
)}


        {activeTab === "staff" && (
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Staff Members</h3>
            {staff.map((member) => (
              <div key={member.id} className="p-4 border rounded-md mb-3">
                <h4 className="text-md font-bold">{member.name}</h4>
                <p>Assigned Floor: {member.floor}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
