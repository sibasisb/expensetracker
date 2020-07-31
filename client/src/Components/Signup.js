import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import M from 'materialize-css'
const Signup=()=>{
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [name,setName]=useState('')
    const history=useHistory();

    const SignupDetails=()=>{
        fetch('/authentication/signup',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                email:email,
                password:password
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:'Email id already present',classes:'#c62828 red darken-3'});
                history.push('/Signup');
            }
            else{
                M.toast({html:'Signed up successfully',classes:'#558b2f light-green darken-3'});
                history.push('/Login');
            }
        })
    };

    return(
        <div className="mycard">
        <div className="card auth input-field">
            <h2>Expense Tracker</h2>
            <input type="text" placeholder="Name" value={name} onChange={(e)=>{setName(e.target.value)}}></input>
            <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
            <input type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}}></input><br/><br/><br/>
            <button className="btn waves-effect waves-light #0d47a1 blue darken-4" onClick={()=>SignupDetails()}>Signup</button>
        </div>
        </div>
    );
};

export default Signup;