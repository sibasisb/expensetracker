const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types;

const ExpenseSchema=new mongoose.Schema({
    postedBy:{
        type:ObjectId,
        ref:'users'
    },
    date:{
        type:Date,
        default:Date.now()
    },
    amount:{
        type:Number,
        required:true
    },
    flag:{
        type:String,
        required:true
    },
    paymentInfo:String,
    transactor:String,
    description:{type:String,trim:true}
});

const Expenses=mongoose.model("expenses",ExpenseSchema);
module.exports=Expenses;