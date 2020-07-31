import React, { useState, useEffect, useContext } from 'react'
import '../App.css';
import {UserContext} from '../App'
import {Doughnut,Bar} from 'react-chartjs-2'

const Home=()=>{
    const [expenses,setExpenses]=useState([]);
    const [totalExpense,setTotalExpense]=useState(0)
    const [totalIncome,setTotalIncome]=useState(0)
    const [savings,setSavings]=useState(0)
    const [chartData,setChartData]=useState({})
    const {state}=useContext(UserContext);
    useEffect(()=>{
        fetch('/tracker/allInfo',{
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
                let totalincome=0;
                let totalexpense=0;
                let saving=0;
                data.expenses.forEach((item)=>{
                    if(item.flag==="Income"){
                        totalincome=totalincome + Number(item.amount);
                    }
                    else{
                        totalexpense=totalexpense + Number(item.amount);
                    }
                });
                saving=totalincome - totalexpense;
                setTotalExpense(totalexpense);
                setTotalIncome(totalincome);
                setSavings(saving);
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
                            backgroundColor:newBgColors
                        }
                    ]
                };
                setChartData(newChartData);
            }
        })
        .catch(err=>console.log(err));
    },[]);


    

    return(
        <div>
        <h2>My Charts</h2><br/>
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
                    }
                }}
            />
        </div>
        </div>:
        <h2 style={{fontWeight:"bold",fontSize:"25",textAlign:"center"}}>No transaction yet</h2>
        }
        <div>
        <h2>My Transactions</h2><br/>        
        <table className="striped highlight centered responsive-table mytable">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Transactor</th>
                    <th>Mode of payment</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Type</th>
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
                        <td>{expense.flag}</td>
                    </tr>);
                }):<h5>Loading.....</h5>}
            </tbody>
        </table>
        <br/><br/><br/>
       <h2>Financial information</h2><br/>
        <table className="striped highlight centered responsive-table mytable">
            <thead>
            <tr>
                <th>Total Income:</th>
                <td>{totalIncome}</td>
            </tr>
            <tr>
                <th>Total Expenses:</th>
                <td>{totalExpense}</td>
            </tr>
            {
                savings>=0?
                <tr>
                <th>Balance:</th>
                <td>{savings}</td>
                </tr>:
                <tr>
                <th>Debt:</th>
                <td>{-savings}</td>
                </tr>
            }
            </thead>
        </table>
    </div>
    </div>);
};

export default Home;