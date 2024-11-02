import React, { useState } from "react";
import {  useNavigate,Link } from "react-router-dom";

import {  signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


function Login() {
  const [err, setErr] = useState(false);
const navigate=useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
    await signInWithEmailAndPassword(auth, email, password)
    navigate("/")
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <div className="formContainer">
   <div className="formWrapper">

  
<span className="logo">aziz chat</span>
<span className="titel">Login</span>
<form action="" onSubmit={handleSubmit}>

<input type="email" name="" id="" placeholder="email"/>
<input type="password" name="" id="" placeholder="password"/>
<button className="button-29" >Login</button>
{err && <span>Somethig went Wrong</span>}
</form>
<p> You don't have an account?<Link to={"/Register"}> Register</Link></p>













   </div>
    </div>
  );
  }
  
  export default Login;
  