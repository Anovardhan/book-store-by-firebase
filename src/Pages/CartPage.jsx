import React, { useEffect, useState } from 'react';
import { UseFirebase } from '../Context/firebasecontext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { getcartitems, removecart ,placeOrder} = UseFirebase();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const items = await  getcartitems();
    setCartItems(items);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id) => {
    await removecart(id);
    fetchCart();
  };

  

  const total = cartItems.reduce(
    (acc, item) => acc + item.price ,
    0
  );
   const handleOrder = async () => {
    try {
      await placeOrder();
      alert("✅ Order placed successfully!");
      navigate("/");
    } catch (err) {
      alert("Error placing order: " + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="card mb-3 p-3 shadow-sm">
              <div className="d-flex align-items-center">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <div className="ms-3 flex-grow-1">
                  <h5>{item.title}</h5>
                  <p>Price: ₹{item.price}</p>
                 
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemove(item.id)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <h4>Total: ₹{total}</h4>
            <button className="btn btn-success mt-2" onClick={handleOrder}>Proceed to order</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
