import React, { useEffect, useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("myOrders") || "[]");
    setOrders(data);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl text-gray-500">
        💤 No orders yet. Start shopping now!
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-10">📦 My Orders</h2>

      <div className="max-w-4xl mx-auto space-y-6">
        {orders.reverse().map((order, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-3"
          >
            <h3 className="text-xl font-semibold text-blue-600">
              Order ID: {order.id}
            </h3>
            <p>📅 Placed At: {order.placedAt}</p>
            <p>📍 Address: {order.address}</p>
            <p>📞 Phone: {order.phone}</p>
            <p>🧾 Total: ₹{order.total.toFixed(2)}</p>
            <p className="text-sm text-yellow-500">Status: {order.status}</p>

            <ul className="list-disc ml-5 mt-2 text-sm text-gray-600 dark:text-gray-300">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} - ₹{item.price}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
