import React, { useState, useEffect, useContext, useRef} from 'react'
import '../App.css';
import {UserContext} from '../App'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {Bar,Doughnut} from 'react-chartjs-2'

const ExpenditureTab=()=>{
    const [expenses,setExpenses]=useState([]);
    const [entryId,setEntryId]=useState('');
    const [amount,setAmount]=useState('')
    const [paymentInfo,setPaymentInfo]=useState()
    const [description,setDescription]=useState()
    const [transactor,setTransactor]=useState()
    const dateRef=useRef(null);
    const editDateRef=useRef(null);
    const history=useHistory()
    const {state}=useContext(UserContext);
    const editModal=useRef(null)
    const eModal=useRef(null)
    const [totalExpense,setTotalExpense]=useState(0);
    const [chartData,setChartData]=useState({})

    useEffect(()=>{
        M.Datepicker.init(dateRef.current,{maxDate:new Date(),autoClose:true})
        M.Datepicker.init(editDateRef.current,{maxDate:new Date(),autoClose:true}) 
        M.Modal.init(editModal.current,{onCloseEnd:()=>{
            setAmount('');
            setDescription('');
            setPaymentInfo('')
            setTransactor('')
            dateRef.current.value=''
            editDateRef.current.value=''
        }});
        M.Modal.init(eModal.current,{onCloseEnd:()=>{
            setAmount('');
            setDescription('');
            setPaymentInfo('')
            setTransactor('')
            dateRef.current.value=''
            editDateRef.current.value=''
        }});
        fetch('/tracker/allExpenses',{
            method:'GET',
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("token")
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.expenses){
                setExpenses(data.expenses);
                let totalexpense=0;
                data.expenses.forEach((item)=>{
                    totalexpense=totalexpense + Number(item.amount);
                })
                setTotalExpense(totalexpense);
                let labels=[]
                data.expenses.forEach((item)=>{
                    if(item.description && item.description!=='')
                        labels.push(item.description.toUpperCase());
                    else
                        labels.push("Unknown");
                })
                let newData=[]
                data.expenses.forEach((item)=>{
                    newData.push(item.amount);
                })

                let bgcolors=[]
                data.expenses.forEach((item)=>{
                    let r=Math.floor(Math.random() * 200);
                    let g=Math.floor(Math.random() * 200);
                    let b=Math.floor(Math.random() * 200);
                    let colour='rgb(' + r + ', ' + g + ', ' + b + ')';
                    bgcolors.push(colour);
                })

                let len=data.expenses.length;
                let newLabels=[];
                let newBgColors=[];
                let newDataSet=[];
                for(let i=0;i<len;i++){
                    if(newLabels.includes(labels[i])){
                        continue;
                    }
                    let x=newData[i];
                    for(let j=i+1;j<len;j++){
                        if(labels[i]===labels[j]){
                            x=x + newData[j];
                        }
                    }
                    newLabels.push(labels[i]);
                    newDataSet.push(x);
                    newBgColors.push(bgcolors[i]);
                }

                const newChartData={
                    labels:newLabels,
                    datasets:[
                        {
                            label:'My Transactions',
                            data:newDataSet,
                            backgroundColor:bgcolors
                        }
                    ]
                };
                setChartData(newChartData);
            }
        })
        .catch(err=>console.log(err));
    },[]);


    const deleteRecord=(entryId)=>{
        fetch('/tracker/delete',{
            method:'DELETE',
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer " + localStorage.getItem("token")
            },
            body:JSON.stringify({
                _id:entryId,
                postedBy:state._id
            })
        })
        .then(res=>res.json())
        .then(data=>{
            const deleteId=data.record._id;
            const newEpenses=expenses.filter(e=>{
                return e._id!=deleteId
            });
            setExpenses(newEpenses);            
        })
        .catch(err=>console.log(err));
    }
    
    

    const addRecord=()=>{
        if(amount===''){
            window.alert('Amount field has to be filled!!!');
            return;
        }

        if(dateRef.current===null || dateRef.current.value===''){
            window.alert('Date field has to be filled!!!');
            return;
        }

        fetch('/tracker/add',{
            method:'POST',
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer " + localStorage.getItem("token")
            },
            body:JSON.stringify({
                date:dateRef.current.value,
                amount:amount,
                flag:"Expenditure",
                paymentInfo:paymentInfo,
                description:description,
                transactor:transactor
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                window.alert('Data could not be added')
            }            
            else{
                window.alert('Data has been added')
            }

            
            history.push('/');
            
        })
        .catch(err=>console.log(err));
    }
    
    const editRecord=()=>{
        if(amount===''){
            window.alert('Amount field has to be filled!!!');
            return;
        }

        if(editDateRef.current===null || editDateRef.current.value===''){
            window.alert('Date field has to be filled!!!');
            return;
        }

        fetch('/tracker/update',{
            method:'PUT',
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer " + localStorage.getItem("token")
            },
            body:JSON.stringify({
                _id:entryId,
                date:dateRef.current.value,
                amount:amount,
                flag:"Expenditure",
                paymentInfo:paymentInfo,
                description:description,
                transactor:transactor
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                window.alert('Data could not be edited')
            }            
            else{
                window.alert('Data has been edited')
            }
            const newExpenses=expenses.map(item=>{
                if(item._id!=data.expense._id)
                    return item;
                return data.expense;
            })
            setExpenses(newExpenses);
            

            history.push('/');
        })
        .catch(err=>console.log(err));
    }

    const setId=(id)=>{
        setEntryId(id);
    }

    return(
        <div>
            <h2>My Expenditure Charts</h2><br/>
        {
            expenses.length>0?
            <div className="mycharts">
            <div className="chart" style={{paddingTop:"10px"}}>
            <Doughnut
                data={chartData}
                height="500"
                width="500"
                options={{
                    responsive:true,
                    maintainAspectRatio:true,
                    legend:{
                        display:true,
                        position:'right',
                        labels:{
                            fontColor:'#00F'
                        }
                    },
                    layout:{
                        padding:{
                            top:5,
                            bottom:0,
                            left:0,
                            right:0
                        }
                    }
                }}
            />
        </div>
        <div className="chart" style={{paddingTop:"20px"}}>
            <Bar
                data={chartData}
                height="500"
                width="500"
                options={{
                    responsive:true,
                    maintainAspectRatio:true,
                    legend:{
                        display:true,
                        position:'right',
                        labels:{
                            fontColor:'#00F'
                        }
                    },
                    layout:{
                        padding:{
                            top:5,
                            bottom:0,
                            left:0,
                            right:0
                        }
                    },
                    scales: {
                        yAxes: [{
                           ticks: {
                              beginAtZero: true
                           }
                        }]
                     }
                }}
            />
        </div>
        </div>:
        <h2 style={{fontWeight:"bold",fontSize:"25",textAlign:"center"}}>No expenses yet</h2>
        }
        
        <div>
        <div id="modal-1" className="modal" ref={editModal}>
        <div className="modal-content">
            
            <div className="col s6">
            <input type="text" placeholder="Date of transaction" className="datepicker" ref={editDateRef}/>
            </div>
        
        
            <div className="input-field col s6">
            <input type="text" value={amount} onChange={(e)=>{setAmount(e.target.value)}}/>
            <label>Amount</label>
            </div>
        
        
            <div className="input-field col s6">
            <input type="text" value={transactor} onChange={(e)=>{setTransactor(e.target.value)}}></input>
            <label>Company</label>
            </div>
        
        
            <div className="input-field col s6">
            <input type="text" value={paymentInfo} onChange={(e)=>{setPaymentInfo(e.target.value)}}></input>
            <label>Mode of payment</label>
            </div>
        
        
            <div className="input-field col s6">
            <input type="text" value={description} onChange={(e)=>{setDescription(e.target.value)}}></input>
            <label>Description</label>
            </div>
        
        </div>
            <div className="modal-footer">
                <button className="btn waves-effect waves-light #0d47a1 green darken-4" style={{float:"left"}} onClick={()=>editRecord()}>Submit</button>
                <button className="btn waves-effect waves-light #0d47a1 red darken-4" style={{float:"right"}} onClick={()=>{
                    let instance=M.Modal.getInstance(editModal.current);
                    instance.close();
                }}>Cancel</button>
            </div>
        </div>

        <div id="modal-2" className="modal" ref={eModal}>
            <div className="modal-content">
            
                <div className="col s6">
                <input type="text" placeholder="Date of transaction" className="datepicker" ref={dateRef}/>
                </div>
            
            
                <div className="input-field col s6">
                <input type="text" value={amount} onChange={(e)=>{setAmount(e.target.value)}}/>
                <label>Amount</label>
                </div>
            
            
                <div className="input-field col s6">
                <input type="text" value={transactor} onChange={(e)=>{setTransactor(e.target.value)}}></input>
                <label>Company</label>
                </div>
            
            
                <div className="input-field col s6">
                <input type="text" value={paymentInfo} onChange={(e)=>{setPaymentInfo(e.target.value)}}></input>
                <label>Mode of payment</label>
                </div>
            
            
                <div className="input-field col s6">
                <input type="text" value={description} onChange={(e)=>{setDescription(e.target.value)}}></input>
                <label>Description</label>
                </div>
            
            </div>
            <div className="modal-footer">
                <button className="btn waves-effect waves-light #0d47a1 green darken-4" style={{float:"left"}} onClick={()=>addRecord()}>Submit</button>
                <button className="btn waves-effect waves-light #0d47a1 red darken-4" style={{float:"right"}} onClick={()=>{
                    let instance=M.Modal.getInstance(eModal.current);
                    instance.close();
                }}>Cancel</button>
            </div>
        </div>

        <div>
        <h2>My Expenditure</h2><br/>
        <table className="striped highlight centered responsive-table mytable">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Transactor</th>
                    <th>Mode of payment</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {expenses?expenses.map(expense=>{
                    return (<tr key={expense._id}>
                        <td>{expense.date}</td>
                        <td>{expense.transactor}</td>
                        <td>{expense.paymentInfo}</td>
                        <td>{expense.amount}</td>
                        <td>{expense.description}</td>
                        <td><i className="material-icons modal-trigger" data-target="modal-1" onClick={()=>setId(expense._id)}>edit</i></td>
                        <td><i className="material-icons" style={{color:"red"}} onClick={()=>deleteRecord(expense._id)}>delete</i></td>
                    </tr>);
                }):<h5>Loading.....</h5>}
            </tbody>
        </table>
        <br/><br/><br/>
        <h2>Expenditure Information</h2>
        <table className="striped highlight centered responsive-table mytable">
            <thead>
            <tr>
                <th>Total Expenditure:</th>
                <td>{totalExpense}</td>
            </tr>
            </thead>
        </table><br/><br/>
        <button data-target="modal-2" className="btn waves-effect waves-light #0d47a1 green darken-4 modal-trigger">
        Add expense</button>
    </div>
    </div>
    </div>);
};

export default ExpenditureTab;