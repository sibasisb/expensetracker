const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()
const app=express()

app.use(cors())
app.use(express.json())
const URI=process.env.URI;
const PORT=process.env.PORT||5000;
const authRouter=require('./routes/auth');
const trackRouter=require('./routes/track')


mongoose.connect(URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
});

mongoose.connection.once('open',()=>{
    console.log('Connected to database server');
});

app.use('/authentication',authRouter);
app.use('/tracker',trackRouter);

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'));
    const path=require('path');
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}

app.listen(PORT,()=>{
    console.log('server listening on port number '+ PORT);
})