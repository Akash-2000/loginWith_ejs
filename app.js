const cookiesession = require("cookie-session")
const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const sendEmail = require("./sendEmail");
const app = express()
const { check, validationResult } = require('express-validator')
const mongoose = require("mongoose")
const User = require("./model/user.js")
const cors = require("cors")
//for hashing the passwords
const bcrypt = require('bcryptjs')
// for login we use this package
const jwt = require("jsonwebtoken");
const  passport  = require("passport");
const passportSetup = require("./passport")
const authRoute = require("./routes/auth")
//JWT SECRET


app.use('/',express.static(path.join(__dirname,'static')))
const JWT_SECRET = "sadajhasghkdrakwhufbalfuiaffoiufdlufas12345@##$%^%afggahyfa"
mongoose.connect('mongodb://localhost:27017/login-app-db',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
     //make this true
    autoIndex:true //make this also true
})
console.log("mongoose connected")

app.use(
  cookiesession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(bodyParser.json())
//change password
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true,
}))


app.post('/api/password',(req,res)=>{
    res.json(req.body)
})





app.use("/auth",authRoute)



app.post('/api/:userId/:token',async(req,res)=>{
    console.log(req.params.token)
    const user_token =req.params.token
    console.log(user_token)

     /*  if(!plaintext || typeof(plaintext) !=="string"){
        return res.json({status:"error",error:"password is not valid"})
     }
          if(plaintext.length < 5){
        return res.json({status:"error",error:"password shoul contain more than 5 characters"})
     }*/

    try{    
            console.log("im here")
            const user =jwt.verify(user_token,JWT_SECRET)
            const _id = user.id;
            const plaintext= req.body.password
            const password = await bcrypt.hash(plaintext,7)
            console.log("final_pass"+password)
        try{
            await User.updateOne({_id},{
                $set:{password}
            })
            res.json({status:"ok"})
        }catch(error){
            res.json({status:"error",error:"unble to update"})
        }
            
    }catch(error){
        console.log(error)
        res.json({status:'error',error:';))'})
    }
    
    })
// login
app.post('/api/login',async(req,res)=>{
    const {username,password}=req.body
    if(!username || !password){
        return res.json({status:"error",data:"Enter all mandatory fields before log in "})
    }
    const user = await User.findOne({username}).lean()
    if(!user){
        return res.json({status:"error",data:"invalid username & Password"})
    }
    console.log()
    if(await bcrypt.compare(password,user.password)){
        //token created
        res.json({status:"ok"})
    }
    else{
        res.json({status:'error',data:'Invalid password'})
    }
})
// forgot password
app.post("/api/forgotpassword",async(req,res)=>{
     const {email}=req.body
     const check_email = await User.findOne({ email }).lean();
     console.log(check_email)
        if (!check_email){
            res.json({status:"error",error:"email id is not valid"})
        }
         else{const token = jwt.sign({
            id:check_email._id,username:check_email.username},JWT_SECRET)
        const link = `http://localhost:9999/api/${check_email._id}/${token}`;
        await sendEmail(check_email.email, "Password reset", link);
        console.log(link)
        res.json({status:"ok","link":link})
        }
        
})

app.post("/api/register",async(req,res)=>{
     var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
     var password_valid = /^(?=.*[0-9])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&.*0-9]{8,}$/i;
     const {username,email,confrim_password,date_of_birth,country,gender}=req.body
     const password1 = req.body.password
    var valid = emailRegex.test(email);

    var password_valid = password_valid.test(password1)
    console.log(password_valid,password1)
     if(!username || typeof(username) !=="string"){
        return res.json({status:"error",error:"username is not valid"})
     }
     if(username.length < 3){
        return res.json({status:"error",error:"username must be greter than 3 chracters"})
     }
     if(!valid){
        return res.json({status:"error",error:"enter a valid email"})
     }
     if(!password_valid){
        return res.json({status:"error",error:"enter a valid password"})
     }
          if(!password1 || typeof(password1) !=="string"){
        return res.json({status:"error",error:"password is not valid"})
     }
          if(password1.length < 5){
        return res.json({status:"error",error:"password shoul contain more than 5 characters"})
     }
     if( password1 != confrim_password){
        return res.json({status:"error",error:"password and confirm password should be same"})
     }
     const password = await bcrypt.hash(password1,7) 
     
     try{
        const response = await User.create({
            username,
            email,
            date_of_birth,
            country,
            gender,
            password
        }).then(()=>{
            
            res.json({status:"ok"})
        })

     } catch(error){
        if(error.code === 11000){
             error_message = Object.keys(error.keyValue).map(val => val)
            return res.json({status:'error',error:`${error_message} already taken try another`})
        }
        throw error
     }
     
})

app.listen(5000,()=>{
    console.log("server set at 5000")
})