const mongoose=require('mongoose');
const jwt=require('jsonwebtoken')
const SECRET_KEY=process.env.SECRET_KEY;
const Users=require('../models/users');

const requireLogin=(req,res,next)=>{
    const {authorization}=req.headers;
    if(!authorization){
        return res.status(421).json({error:'User not logged in'});
    }
    const token=authorization.split(" ")[1];
    jwt.verify(token,SECRET_KEY,(err,payload)=>{
        if(err){
            console.log(err);
            return res.status(421).json({error:'User not logged in'});
        }

        const {_id}=payload;
        Users.findOne({_id:_id})
        .then(user=>{
            if(!user)
                return res.status(421).json({error:'User not logged in'});
            
            req.user=user
            next()
        })
        .catch(err=>console.log(err));
    })
};


module.exports=requireLogin;



