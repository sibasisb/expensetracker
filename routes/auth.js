const router=require('express').Router()
const Users=require('../models/users');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config()

const SECRET_KEY=process.env.SECRET_KEY;


router.post('/signup',(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return res.status(421).json({error:"Field/s is/are empty"});
    }
    Users.findOne({email:email})
    .select('-password')
    .then(user=>{
        if(user)
            return res.status(421).json({error:"Email id already present"});

        bcrypt.hash(password,12,function(err,hashed){
            const newUser=new Users({name,email,password:hashed});
            newUser.save()
            .then((user)=>res.json({message:"User signed up successfully"}))
            .catch(err=>console.log(err));
        });
    })
    .catch(err=>console.log(err));
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(421).json({error:"Field/s is/are empty"});
    }
    Users.findOne({email:email})
    .then(user=>{
        if(!user){
            return res.status(421).json({error:"User creds are not correct"});
        }

        bcrypt.compare(password,user.password)
        .then(flag=>{
            if(flag){
                const token=jwt.sign({_id:user._id},SECRET_KEY);
                const {_id,name}=user;                
                return res.status(200).json({token:token,user:{_id,name,email}});
            }
            else
                return res.status(421).json({error:"User creds not correct"});
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>{
        console.log(err);
    });
})


module.exports=router;