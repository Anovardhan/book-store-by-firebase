import React, { useState } from 'react';
import { UseFirebase } from '../Context/firebasecontext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../Context/firebasecontext';
import { useNavigate } from 'react-router-dom';

const AddItemPage = () => {
  const { user } = UseFirebase();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating , setrating] = useState('');
  const [author , setauthor] = useState('');
  const [aboutbook , setaboutbook] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        title,
        description,
        price: Number(price),
        category,
        imageUrl,
        addedBy: user.uid,
        rating: Number(rating),
        author,
        aboutbook
      });
      alert('Product added successfully!');
     
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImageUrl('');
      navigate('/');
    } catch (err) {
      alert('Error adding product: ' + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <input className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Image URL</label>
          <input className="form-control" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Rating</label>
          <input className="form-control" value={rating} onChange={(e) => setrating(e.target.value)} required />
        </div>
         <div className="mb-3">
          <label>Author</label>
          <input className="form-control" value={author} onChange={(e) => setauthor(e.target.value)} required />
        </div>
         <div className="mb-3">
          <label>About book</label>
          <input className="form-control" value={aboutbook} onChange={(e) => setaboutbook(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-success">Add Product</button>
      </form>
    </div>
  );
};

export default AddItemPage;
