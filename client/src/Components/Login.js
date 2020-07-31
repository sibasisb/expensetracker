import React, { useState, useContext } from 'react'
import M from 'materialize-css'
import {UserContext} from '../App.js'
import { useHistory } from 'react-router-dom';
const Login=()=>{
    const {state,dispatch}=useContext(UserContext);
    const history=useHistory();
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const LoginDetails=()=>{
        fetch("/authentication/signin",{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:'Invalid email or password',classes:'#c62828 red darken-3'});
            }
            else{
                M.toast({html:'Signed in successfully',classes:'#558b2f light-green darken-3'})
                localStorage.setItem("user",JSON.stringify(data.user));
                localStorage.setItem("token",data.token);
                dispatch({type:"USER",payload:{user:data.user}});
                history.push('/');    
            }
            
        })
        .catch(err=>console.log(err));
    }
    
    return(
        <div className="mycard">
        <div className="card auth input-field">
            <h2>Expense Tracker</h2>
            <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
            <input type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}}></input><br/><br/><br/>
            <button className="btn waves-effect waves-light #0d47a1 blue darken-4" onClick={()=>LoginDetails()}>Login</button>
        </div>
        </div>
    );
};

export default Login;