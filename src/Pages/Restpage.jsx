import { useState } from "react";
import { UseFirebase } from '../Context/firebasecontext';
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';

const ResetPassword = () => {
  const [email, setemail] = useState("");
  const {resetPassword}=  UseFirebase ();
  const navigate = useNavigate()

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      alert("Password reset email sent. Check your inbox.");
      navigate('/login')
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '1rem' }}>
            <div className="text-center mb-4">
              <FaUserCircle size={70} color="#007bff" />
              <h4 className="mt-2">Login account</h4>
            </div>
            <form onSubmit={handleReset}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e)=>setemail(e.target.value)}/>
              </div>
               <button type="submit" className="btn btn-danger " style={{marginLeft:"90px"}}>Send Reset Link</button>
            
            </form>
          </div>
        </div>
  );
};

export default ResetPassword;
