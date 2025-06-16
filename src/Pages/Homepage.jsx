import React from 'react'
import { UseFirebase } from '../Context/firebasecontext';
import { FaUserCircle , } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi'
import { FaUser } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import BookstoreLogo from '../Images/logo.png'
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs ,deleteDoc, doc} from 'firebase/firestore';
import { db } from '../Context/firebasecontext';
import { FaStar, FaRegStar } from "react-icons/fa";




export const Homepage = () => {
  const navigate = useNavigate();
    const { logout,user,role,addtocart,placeOrder} = UseFirebase();

    //console.log(user)
    const [userdetails , setuserdetails] = useState([])
    const [products , setproducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
     const [minPrice, setMinPrice] = useState('');
      const [maxPrice, setMaxPrice] = useState('');


    useEffect(()=>{
      setuserdetails(user)
    },[user])

    useEffect(()=>{
        const fetchproducts = async ()=>{
            const querysnapshot = await getDocs(collection(db, "products"))
            const items = [];
            querysnapshot.forEach((doc)=>{
                items.push( {...doc.data(), id: doc.id})
            })
            setproducts(items)
        };
        fetchproducts();
    })

   const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "products", id));
      setproducts(prev => prev.filter(p => p.id !== id)); 
    } catch (err) {
      alert("Error deleting item: " + err.message);
    }
  };
 const handlelogout = async ()=>{
  try{
    await logout();
    navigate('/login')
  }
  catch(err){
    alert(err.message)
  }
 }
const filteredProducts = products.filter(product => {
  const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = selectedCategory === '' || product.category.toLowerCase() === selectedCategory.toLowerCase();
  const matchesMinPrice = minPrice === '' || product.price >= parseFloat(minPrice);
  const matchesMaxPrice = maxPrice === '' || product.price <= parseFloat(maxPrice);

  return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
});


  


  return (
<>
<div className='container-fluid' style={{backgroundColor:"#F5DEB3"}}>
    <div className='navbar'>
        <div className='navbar-logo'>
          <img src={BookstoreLogo} width={50} height={50}/>
         Shopping
        </div>
        <div className='search'>
            <input placeholder='search for books ...' type='search' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}  className='p-3'    style={{
          backgroundColor: '#F5F3EE',
          border: '1px solid #EDE6DA',
          height: '2.5rem',
          borderRadius:"20px"
        }}/>
        </div>
        <div className='d-flex align-items-center'>
             <button style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>
      <FaUser />
    </button>
          {userdetails?.email ? (
  <h5 className='text-dark mt-2 ms-2'>{userdetails.email}</h5>
) : (
  <h6 className='text-muted mt-2 ms-2'>Guest</h6>
)}

        </div>
        <div className='items d-flex align-items-center' style={{cursor:"pointer"}}>
         
    {
        role !== "admin"?  <div className='d-flex align-items-center'> <FaShoppingCart size={20}/> <Link to='/cart' style={{textDecoration:"none" , color:"inherit"}}><h5 className='mt-2'>cart</h5></Link>  <Link to="/orders" className="  btn btn-success text-white ms-4" style={{textDecoration:"none"}}>My Orders</Link></div> : null
    }
           
         
            {
                role === 'admin' ? <div className='d-flex'><Link to='/additem' style={{textDecoration:"none" , color:"inherit"}}><button className='ms-3 btn bg-success text-white'>Add items</button></Link> <Link  to="/admin-dashboard"><button className='ms-3 btn bg-success text-white'>view all orders</button></Link>  </div> : null
            }
            </div>
            {
              user ? <button onClick={handlelogout} className='btn btn-danger'>logout</button> :<button onClick={()=>navigate('/login')} className='btn btn-danger'>login</button>
            }
         
         
    </div>
    
</div>


<div className="row mb-4 p-3 d-flex justify-content-center">


  <div className="col-md-3">
    <label>Category:</label>
    <select
      className="form-control"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="">All</option>
      <option value="thriller">Thriller</option>
      <option value="romantic">Romantic</option>
      <option value="crime">crime</option>
      
    </select>
  </div>

  <div className="col-md-2">
    <label>Min Price:</label>
    <input
      type="number"
      className="form-control"
      value={minPrice}
      onChange={(e) => setMinPrice(e.target.value)}
    />
  </div>

  <div className="col-md-2">
    <label>Max Price:</label>
    <input
      type="number"
      className="form-control"
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
    />
  </div>

  <div className="col-md-2 d-flex align-items-end">
    <button
      className="btn btn-secondary w-100"
      onClick={() => {
        setSearchTerm('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
      }}
    >
      Reset Filters
    </button>
  </div>
</div>

<div className='row ' style = {{marginLeft:"100px"}}>
    {
        filteredProducts.map((product)=>(
            <div className="col-md-4 p-4" key={product.id}  style={{cursor:"pointer"}}>
        <div className="card shadow p-3 mb-4" style={{ width: "18rem" }}>
      <img src={product.imageUrl} className="card-img-top" alt={product.title} style={{ height: "300px" }}  />
      <div className="card-body">
        <h5 className="card-title">{product.title.slice(0,20)}</h5>
        <p className="card-text"><strong>Author:</strong>{product.author}</p>
        <p><strong>Price:</strong> ₹{product.price}</p>
        <p><strong>rating:{product.rating}/5</strong></p>
         {role === "admin" && (
          <button className="btn btn-danger mt-2" onClick={() =>  handleDelete(product.id)}>
            Delete
          </button>
        )}
        {
            role !== "admin" && (
                <div className='d-flex align-items-center'>
                     <button className='btn btn-success' onClick={()=>addtocart(product)}>add to cart</button>
                      <button className='btn btn-success ms-3' onClick={()=>navigate(`/product/${product.id}`)}>View</button>

                </div>
               

            )
        }
      </div>
    </div>


            </div>
        )) 
      }
 

</div>

 
  
  </>
  )
}
export default Homepage
