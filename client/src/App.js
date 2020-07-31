import React, { createContext, useReducer, useContext, useEffect } from 'react';
import './App.css';
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import IncomeTab from './Components/IncomeTab'
import Login from './Components/Login'
import Signup from './Components/Signup'
import ExpenditureTab from './Components/ExpenditureTab'
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import userReducer, { initialState } from './Reducers/userReducer';


export const UserContext=createContext();

const Routing=()=>{
  const {state,dispatch}=useContext(UserContext);
  const history=useHistory();
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"USER",payload:user});
    }
    else{
      history.push('/Login');
    }
  },[])

  return(
    <Switch>
      <Route exact path="/"><Home/></Route>
      <Route path="/Income"><IncomeTab/></Route>
      <Route path="/Expend"><ExpenditureTab/></Route>
      <Route path="/Login"><Login/></Route>
      <Route path="/Signup"><Signup/></Route>
    </Switch>
  );
}

function App() {

  const [state,dispatch]=useReducer(userReducer,initialState);

  return (
    <div>
      <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
      <Navbar/>
      <Routing/>
      </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
