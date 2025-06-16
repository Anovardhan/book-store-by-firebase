import React, { useEffect, useState } from "react";
import { UseFirebase } from "../Context/firebasecontext";
import { useNavigate } from "react-router-dom";

const OrderHistoryPage = () => {
  const { getUserOrders } = UseFirebase();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getUserOrders();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mt-5">
      <h2>📦 Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order) => (
          <div className="card mb-3 p-3 shadow-sm" key={order.id}>
            <h5>Order ID: {order.id}</h5>
            <p>Date: {new Date(order.orderDate?.seconds * 1000).toLocaleString()}</p>
           
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate(`/order/${order.id}`, { state: order })}
            >
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistoryPage;
