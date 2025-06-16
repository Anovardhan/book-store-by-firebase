import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Context/firebasecontext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const ref = doc(db, "products", id);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setProduct({ id: snapshot.id, ...snapshot.data() });
        } else {
          alert("Product not found");
          navigate("/");
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      <button className="btn btn-danger mb-4" onClick={() => navigate(-1)}>⬅ Back</button>
      
      <div className="d-flex align-items-center">
         <div className="card shadow p-4">
        <img src={product.imageUrl} alt={product.title} style={{ width: "100%", maxHeight: "600px", objectFit: "cover" }} />
       </div>
       <div className="d-iniline">
          <div className="ms-3 d-flex">
        <h3>{product.title}</h3><span className="mt-1 ms-2">|Released:</span>
       </div>
       <p className="ms-3"><strong>By:</strong>{product.author}</p>
       <p className="ms-3"><strong>Description:</strong>{product.description}</p>
              <p className="ms-3"><strong>Rating:</strong>{product.rating}/5</p>
               <p className="ms-3"><strong>aboutbook:</strong>{product.aboutbook}</p>
       
       </div>
     
      </div>
  
   
    
    </div>
  );
};

export default ProductDetail;
