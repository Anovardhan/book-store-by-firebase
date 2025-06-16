import React from 'react'
import { FaUserCircle } from 'react-icons/fa';
import { useState ,useEffect} from 'react';
import { UseFirebase } from '../Context/firebasecontext';
import { useNavigate } from 'react-router-dom';
import Googleicon from '../Images/googlelogo.png'


export const Login = () => {
  const [email,setemail] = useState('')
  const [password,setpassword] = useState('')
  const [showPassword, setshowPassword] = useState(false);
  const {signinbyemailandpass,isloggin , signinWithGoogle ,role} = UseFirebase()
  const navigate = useNavigate()

  const handlelogin = async (e)=>{
    e.preventDefault()
    try {
        await signinbyemailandpass(email,password)
        alert("login successfull")
        if(role === 'admin'){
            navigate('/additem')
        }
        else{
             navigate('/')

        }
       
        
        
    }
    catch(err){
        alert(err.message)
    }

  }

 useEffect(() => {
  if (isloggin && role) {
    if (role === 'admin') {
      navigate('/additem');
    } else {
      navigate('/');
    }
  }
}, [isloggin, role, navigate]);

  const handlegoogle = async()=>{
    try {
      await signinWithGoogle()
      navigate('/')
    }
    catch(err){
      alert(err.message)

    }
  }



 
  return (
   <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '1rem' }}>
        <div className="text-center mb-4">
          <FaUserCircle size={70} color="#007bff" />
          <h4 className="mt-2">Login account</h4>
        </div>
        <form onSubmit={handlelogin}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e)=>setemail(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input  type={showPassword ? "text" : "password"} className="form-control" placeholder="Enter password"  value={password} onChange={(e)=>setpassword(e.target.value)}/>
          </div>
           <label>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setshowPassword(!showPassword)}
        />
        Show Password
      </label>
      <p>
  <a href="/reset">Forgot Password?</a>
</p>
         
          <button type="submit" className="btn btn-primary w-100 mt-3">
         Login
          </button>
          <button type="submit" className="btn btn-primary w-100 mt-3" onClick={()=>navigate('/register')}>
         Register
          </button>
          {/* <button className='btn bg-light shadow mt-3 ' style={{border:"none" , marginLeft:"80px"}} onClick={handlegoogle} ><img src={Googleicon} width={20} height={20}/> sign in with google</button> */}
        </form>
      </div>
    </div>
  )
}

export default Login;