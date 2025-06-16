import logo from './logo.svg';
import './App.css';
import {BrowserRouter ,Routes,Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Register  from './Pages/register'
import Login from './Pages/login'
import Homepage from './Pages/Homepage';
import Reset from './Pages/Restpage';
import AddItemPage from './Pages/Additems';
import Cartdetails from './Pages/carddetails';
import CartPage from './Pages/CartPage';

import OrderHistoryPage from "./Pages/OrderHistoryPage";
import OrderDetailsPage from "./Pages/OrderDetailsPage";
import AdminDashboard from './Pages/AdminDashboard';



function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/register" element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path = '/' element={<Homepage/>}/>
      <Route path = '/reset' element={<Reset/>}/>
      <Route path="/additem" element={<AddItemPage />}/>
      <Route path = '/product/:id' element={<Cartdetails/>}/>
      <Route path="/cart" element={<CartPage />} />
    
      <Route path="/orders" element={<OrderHistoryPage />} />
<Route path="/order/:id" element={<OrderDetailsPage />} />
<Route path="/admin-dashboard" element={<AdminDashboard />} />

    </Routes>
    
    </BrowserRouter>
   
  );
}

export default App;
