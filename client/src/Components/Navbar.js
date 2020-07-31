import React, { useContext } from 'react'
import {Link, useHistory} from 'react-router-dom'
import '../App.css'
import {UserContext} from '../App'
import M from 'materialize-css'
const Navbar=()=>{
    const {state,dispatch}=useContext(UserContext);
    const history=useHistory()
    const renderList=()=>{
        if(state){
            return ([
                <li  style={{paddingLeft:"8px"}} key="1"><Link to="/">Home</Link></li>,
                <li style={{paddingLeft:"8px"}} key="2"><Link to="Income">Income</Link></li>,
                <li style={{paddingLeft:"8px"}} key="3"><Link to="Expend">Expenditure</Link></li>,
                <li style={{paddingLeft:"8px"}} key="4"><button className="btn waves-effect waves-light #0d47a1 red darken-4"
                onClick={()=>{
                    localStorage.clear();
                    dispatch({type:"CLEAR"});
                    M.toast({html:'Logged out successfully',classes:'#558b2f light-green darken-3'});
                    history.push('/Login');
                }}
                >Logout</button></li>
            ]);
        }
        else{
            return ([
                <li style={{paddingLeft:"8px"}} key="5"><Link to="Signup"><button className="btn waves-effect waves-light #0d47a1 green darken-4">
                Signup</button></Link></li>,
                <li style={{paddingLeft:"8px"}} key="6"><Link to="Login"><button className="btn waves-effect waves-light #0d47a1 green darken-4">
                Login</button></Link></li>
            ]);
        }
    };

    return(
        <nav>
        <div className="nav-wrapper #0d47a1 blue darken-4">
        <Link to="/" className="brand-logo">Expense Tracker</Link>
        <ul id="nav-mobile" className="right">
            {renderList()}
        </ul>
        </div>
        </nav>
    );
};

export default Navbar;