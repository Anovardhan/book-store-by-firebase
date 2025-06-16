import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderDetailsPage = () => {
  const location = useLocation();
  const order = location.state;
  const navigate = useNavigate();

  if (!order) {
    return <p>No order found. Please go back.</p>;
  }

  return (
    <div className="container mt-5">
      <h2>🧾 Order Details</h2>
      <p><strong>Order ID:</strong> {order.id}</p>
  <p><strong>Date:</strong> {
  order.timestamp?.seconds
    ? new Date(order.timestamp.seconds * 1000).toLocaleString()
    : order.orderDate?.seconds
    ? new Date(order.orderDate.seconds * 1000).toLocaleString()
    : "Date not available"
}</p>


      
      <h4 className="mt-4">Items:</h4>
      {order.items.map((item, idx) => (
        <div key={idx} className="card p-3 mb-3 shadow-sm">
          <div className="d-flex align-items-center">
            <img src={item.imageUrl} width={80} height={80} alt={item.title} />
            <div className="ms-3">
              <h5>{item.title}</h5>
              <p>Price: ₹{item.price}</p>
            
            </div>
          </div>
        </div>
      ))}
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default OrderDetailsPage;
