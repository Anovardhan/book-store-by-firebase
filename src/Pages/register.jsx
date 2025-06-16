import React from 'react'
import { doc, setDoc } from "firebase/firestore";
import { FaUserCircle } from 'react-icons/fa';
import { useState ,useEffect} from 'react';
import { UseFirebase } from '../Context/firebasecontext';
import { useNavigate } from 'react-router-dom';
import { db } from   '../Context/firebasecontext'
import { EmailAuthCredential } from 'firebase/auth';

export const Register = () => {
  const [email,setemail] = useState('')
  const [password,setpassword] = useState('')
  const [repassword ,setrepassword] = useState('')
  const {createaccountbygmailandpass,isloggin,logout} = UseFirebase()
  const navigate = useNavigate()
  const handleregister = async (e)=>{
    e.preventDefault()
    if(password !== repassword){
      alert('password and repassword not match')
      return ;
    }
    try{
     const res =  await createaccountbygmailandpass(email,password);
       alert("Account created");
    await logout();
    navigate("/login");
     const adminemail = 'admin@gmail.com'
     const role = email === adminemail ? 'admin' : 'user'
     await setDoc(doc(db, "users", res.user.uid), {
        email:email,
        role:role,
        uid:res.user.uid
     })
  
      }
    catch(err){
      alert(err.message)
    }

  
  }
  useEffect(()=>{
    if(isloggin){
      navigate('/login')
    }
  },[isloggin,navigate])

  return (
   <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '1rem' }}>
        <div className="text-center mb-4">
          <FaUserCircle size={70} color="#007bff" />
          <h4 className="mt-2">Create Account</h4>
        </div>
        <form onSubmit={handleregister}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e)=>setemail(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Enter password"  value={password} onChange={(e)=>setpassword(e.target.value)}/>
          </div>
            <div className="mb-3">
            <label className="form-label"> Re-Password</label>
            <input type="password" className="form-control" placeholder="Enter password" value={repassword} onChange={(e)=>setrepassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register;