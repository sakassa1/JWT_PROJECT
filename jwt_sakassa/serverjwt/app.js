const mongoose= require('mongoose')
const express = require('express')
const dotenv=require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { UserRouter } = require('./routes/users');
const { memosRouter } = require('./routes/memos');
dotenv.config();

//mongodb
mongoose.connect
(process.env.MONGODB_URI)
.then(()=>console.log("connected to mongodb atlas"))
.catch(err=>console.log(err))

//express
const app=express();
//middleware to parse json data on body request
app.use(express.json())
app.use(cors({
    origin: '*'//allow all requests 
}));
//app.use(express.static("./clientjwt"))

app.use('/users',UserRouter)

app.use('/memos',memosRouter)

// check authentification (gard / interceptor)
app.use((req,res,next)=>{
try {
const token = req.headers.authorization.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.userData = decoded;
next();
} catch (error) {
return res.status(401).json({
message: 'Auth failed'
});
}
});




const port =process.env.port || 3000
app.listen(port, ()=>{
console.log('server listening on port : ',port)
})