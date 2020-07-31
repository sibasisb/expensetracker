const Expenses=require('../models/expenses');
const router=require('express').Router()
const requireLogin=require('../middleware/requireLogin');
const { route } = require('./auth');

router.get('/allInfo',requireLogin,(req,res)=>{
    const {_id}=req.user;
    Expenses.find({postedBy:_id})
    .populate("postedBy","_id")
    .sort("-date")
    .then((expenses)=>{
        let newDataExpenses=[];
        expenses.forEach((item)=>{
            if(item.date){
                newDataExpenses.push({_id:item._id,
                    date:item.date.toString().substring(0,10),amount:item.amount,
                    flag:item.flag,transactor:item.transactor,paymentInfo:item.paymentInfo,
                    description:item.description
                });
            }
        })
        return res.json({expenses:newDataExpenses});
    })
    .catch(err=>console.log(err));

})

router.get('/allIncome',requireLogin,(req,res)=>{
    const {_id}=req.user;

    Expenses.find({postedBy:_id,flag:"Income"})
    .sort('-date')
    .then((incomes)=>{
        let newDataExpenses=[];
        incomes.forEach((item)=>{
            if(item.date){
                newDataExpenses.push({_id:item._id,
                    date:item.date.toString().substring(0,10),amount:item.amount,
                    flag:item.flag,transactor:item.transactor,paymentInfo:item.paymentInfo,
                    description:item.description
                });
            }
        })
        return res.json({expenses:newDataExpenses});
    })
    .catch(err=>console.log(err));

})


router.post('/add',requireLogin,(req,res)=>{
    const {_id}=req.user;
    const {date,amount,flag,paymentInfo,transactor,description}=req.body;
    if(!date || !amount || !flag){
        return res.status(401).json({error:'Insufficient info'});
    }

    const newExpense=new Expenses({postedBy:_id,date,amount,flag,paymentInfo,transactor,description});
    newExpense.save()
    .then((expense)=>{
        return res.json({expense});
    })
    .catch(err=>console.log(err));

})

router.delete('/delete',requireLogin,(req,res)=>{
    const entryId=req.body._id;

    if(req.body.postedBy.toString()!=req.user._id.toString()){
        return res.json({message:"No delete access"});
    }
    Expenses.findByIdAndDelete(entryId)
    .then((expense)=>{
        return res.json({record:expense})
    })
    .catch(err=>console.log(err));

})

router.put('/update',requireLogin,(req,res)=>{
    const entryId=req.body._id;

    

    Expenses.findByIdAndUpdate(entryId)
    .then((expense)=>{
        expense.date=req.body.date;
        expense.amount=req.body.amount;
        expense.flag=req.body.flag;
        expense.paymentInfo=req.body.paymentInfo;
        expense.transactor=req.body.transactor;
        expense.description=req.body.description;
        expense.save()
        .then((e)=>{
            return res.json({message:"Entry updated",expense:e});
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));

})



router.get('/allExpenses',requireLogin,(req,res)=>{
    const {_id}=req.user;

    Expenses.find({postedBy:_id,flag:"Expenditure"})
    .sort("-date")
    .then((expenditure)=>{
        let newDataExpenses=[];
        expenditure.forEach((item)=>{
            if(item.date){
                newDataExpenses.push({_id:item._id,
                    date:item.date.toString().substring(0,10),amount:item.amount,
                    flag:item.flag,transactor:item.transactor,paymentInfo:item.paymentInfo,
                    description:item.description
                });
            }
        })
        return res.json({expenses:newDataExpenses});
    })
    .catch(err=>console.log(err));

})





module.exports=router;

