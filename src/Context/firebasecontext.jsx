import { initializeApp } from "firebase/app";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword , signOut,onAuthStateChanged, GoogleAuthProvider,
  signInWithPopup,sendPasswordResetEmail } from "firebase/auth";
import { getFirestore ,collection, addDoc ,doc, setDoc ,getDoc ,getDocs,deleteDoc,Timestamp,serverTimestamp} from "firebase/firestore";
import { useEffect,useState } from "react";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyD0myRRi-U1vIcFVyhQACgjcBPzG7UL5_w",
  authDomain: "shopping-e133d.firebaseapp.com",
  projectId: "shopping-e133d",
  storageBucket: "shopping-e133d.firebasestorage.app",
  messagingSenderId: "299115187039",
  appId: "1:299115187039:web:ca507e21d50123adde04ea"
};

const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);
const provider = new GoogleAuthProvider();



const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const auth = getAuth(app);

  const createaccountbygmailandpass = (email,password)=>{
    return createUserWithEmailAndPassword(auth,email,password)
  }
  const signinbyemailandpass = (email,password)=>{
  return signInWithEmailAndPassword(auth,email,password)
  }
  const logout = ()=>{
    return signOut(auth)
  }
  const [user , setuser] = useState(null)
  const [role , setrole] = useState(null)
 const [loading, setLoading] = useState(true);
  useEffect(()=>{
   const unsubscribe = onAuthStateChanged(auth,  async (user) =>{
      if(user) {
        setuser(user);
        const userDocref = doc(db,"users" , user.uid);
        const userDoc = await getDoc(userDocref)
        if(userDoc.exists()){
            const userdata = userDoc.data()
            setrole(userdata.role)

        }else{
            setrole(null)//admin
        }
      }
        else {
            setuser(null)
            setrole(null)
        }
         setLoading(false);

    })
    return ()=> unsubscribe()

  },[])
  const isloggin = user ? true : false

  const signinWithGoogle = async () => {
   try{
    const result = await signInWithPopup(auth, provider);
    const user = result.user
    //console.log(user)
    const userDocref = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocref);
    if(!userDoc.exists()){
        const adminemail = "admin@gmail.com"
        
        const role = user.email === adminemail ? "admin" : "user";
        await setDoc(userDocref,{
            email:user.email ,
            role:role,
           uid: user.uid,
            

        });
    }
    return user;

   }
   catch(err){
    alert(err.message)
   }
  }
const resetPassword = (email) => sendPasswordResetEmail(auth, email);

const addtocart = async(product)=>{
    if(!user){
        alert("Please login to add product to cart")
    }
    const cartref = collection(db , "users" , user.uid , "cart");
    await addDoc(cartref,{
    productId: product.id,
    title: product.title,
    price: product.price,
    imageUrl: product.imageUrl,
    quantity: 1, 

    });
    alert("items added to cart")
}
  const getcartitems = async ()=>{
    const cartref = collection(db , "users" , user.uid , "cart");
    const snapshot = await getDocs(cartref);
    return snapshot.docs.map(doc=>(
        {
            id: doc.id ,
            ...doc.data()

        }
    )
)
  }

  const removecart = async(itemid)=>{
    const itemref = doc(db , "users" , user.uid , "cart" , itemid);
    await deleteDoc(itemref);
  }

  const placeOrder = async () => {
  if (!user) return;

  const cartRef = collection(db, "users", user.uid, "cart");
  const snapshot = await getDocs(cartRef);

  const items = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

const totalAmount = items.reduce((sum, item) => {
  const price = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 1;
  return sum + price * quantity;
}, 0);

  const ordersRef = collection(db, "users", user.uid, "orders");
  await addDoc(ordersRef, {
    items,
    totalAmount,
    orderDate: Timestamp.now()
  });
    const globalOrdersRef = collection(db, "orders");
  await addDoc(globalOrdersRef, {
    items,
    totalAmount,
    userId: user.uid,
    userEmail: user.email,
    timestamp: serverTimestamp() // ✅ This is the key for sorting orders globally
  });




  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};
const getUserOrders = async () => {
  if (!user) return [];
  const ordersRef = collection(db, "users", user.uid, "orders");
  const snapshot = await getDocs(ordersRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

 
  return (
    <FirebaseContext.Provider value={{createaccountbygmailandpass ,signinbyemailandpass,auth,logout , isloggin,user,signinWithGoogle,resetPassword,role,addtocart,removecart,getcartitems,placeOrder,getUserOrders}}>
      {children}
    </FirebaseContext.Provider>
  );
};


export const UseFirebase = () => useContext(FirebaseContext);
