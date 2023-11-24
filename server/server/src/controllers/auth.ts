import { Elysia,t } from "elysia";
import {Database} from "bun:sqlite"
import {SignJWT,jwtVerify} from "jose"
import sgmail from "@sendgrid/mail"
const api_key:any = Bun.env.SENDGRID_KEY
const db = new Database("mydb.sqlite");

sgmail.setApiKey(api_key)

export const authController = new Elysia()

.post("/signup",async({body,set})=> {
   let emailq=  db.query(`SELECT email FROM users WHERE email=?`).get(body.email)
    if(emailq) {
        set.status = 400;
        return "email already exist"
    }
    try {
       const pass =  await Bun.password.hash(body.password);
        let vals = [body.name,body.email,pass];  
        db.run("INSERT INTO users(name,email,password) VALUES(?,?,?)",vals)
        set.status = 200;
        return {message:"success"};
    } catch (error) {
        set.status=500;
        return "something wrong happened"
    }
    
   
 
},{body:t.Object({name:t.String(),email:t.String(),password:t.String()})})

.post("/signin",async({body,set})=>{
   const emailq:any= db.query("SELECT password,name,image FROM users WHERE email = ?").get(body.email)

    if(!emailq) {
       set.status = 401;
       return "no such user";

    }
    try {
       let match =  await Bun.password.verify(body.password,emailq.password)
        if(!match) {
            set.status = 401;
            return "wrong password";
        }
       
        const token = await new SignJWT({email:body.email,name:emailq.name,image:emailq.image})
        .setProtectedHeader({alg:"HS256"})
        .setIssuedAt()
        .setIssuer("me")
        .setAudience("me")

        .setExpirationTime("2d")
        .sign(new TextEncoder().encode(Bun.env.JWT_SECRET))
        set.status = 200;
        return {token:token,name:emailq.name,image:emailq.image};

 
    } catch (error) {
       set.status = 401
       return "not authorized"
        
    }
    







},{body:t.Object({email:t.String(),password:t.String()})})


.post("/verify-jwt",async({body,set})=>{
    const token = body.token;

    const {payload} = await jwtVerify(token,new TextEncoder().encode(Bun.env.JWT_SECRET));
    if(!payload) {
       set.status  = 401;
        return "unauthorized";
    }
    set.status=200;
    return payload;







},{body:t.Object({token:t.String()})})

.post("/reset-pass",async({body,set})=>{
    const emailq:any= db.query("SELECT password FROM users WHERE email = ?").get(body.email)
    if(!emailq){
        set.status = 401;
        return "no such email"
    }
            const randomNumber  = Math.floor(Math.random()*(99999-10000+1))+10000;

    try {
     

       sgmail
       .send(
        {
            to:body.email,
            from:"michaelmounirmnb@gmail.com",
            subject:"verification code",
            text:"asas",
            html:`
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>

<body style="background-color: white; color: black; text-align: center; font-family: Arial, sans-serif;">

    <div style="margin: 0 auto; max-width: 600px; padding: 20px;">
        <h1>password Verification code</h1>
        <div style="background-color: black; color: white; padding: 20px; font-size: 24px; margin: 20px auto; width: 200px;">
            Your Verification Code: <strong>${randomNumber}</strong>
        </div>
        <p>If you didn't request this verification, please ignore this email.</p>
        <p>Best regards,<br>michael mounir</p>
    </div>

</body>

</html>



`
           }
       )
       .then()
       .catch((e)=>console.log(e.message))
        set.status = 200
        db.run("UPDATE users SET resetCode=? WHERE email = ?",[randomNumber,body.email])
        return "check your email"
    } catch (error) {
    }

    
},{body:t.Object({email:t.String()})})
.post("/verify-code",({body,set})=>{
     const code  = body.code
     const emailq:any = db.query('SELECT email,resetCode FROM users WHERE email = ?').get(body.email)
     if(!emailq){
        set.status = 401;
        return "no email found"
     }
     if(code == emailq.resetCode)
     {
        set.status =200;
        return "success"
     }
},{body:t.Object({code:t.String(),email:t.String()})})

.post("/resetpass",async({body,set})=>{

    const emailq:any = db.query("SELECT resetCode FROM users WHERE email = ?").get(body.email)
    if(!emailq){
        set.status = 400;
        return "unauthrized"
    }
    if(emailq.resetCode!=body.code){
        set.status = 400;
        return "unauthrized"
    }

    const pass =  await Bun.password.hash(body.pass);

     db.run("UPDATE users SET password = ? WHERE email = ?",[pass,body.email])
     set.status = 200
     return "password reset successfully"
     
},{body:t.Object({pass:t.String(),email:t.String(),code:t.String()})})
.post("/saveprofile",async({body,set})=>{
    const token = body.token;

    const {payload} = await jwtVerify(token,new TextEncoder().encode(Bun.env.JWT_SECRET));
    if(!payload) {
       set.status  = 401;
        return "unauthorized";
    }
    set.status=200;
   if(body.name){
    db.run("UPDATE users SET name=? WHERE email=?",[body.name,body.email])

   }
   if(body.imageuri){
    db.run("UPDATE users SET image=? WHERE email=?",[body.imageuri,body.email])

   }
    return "success"
  
},{body:t.Object({
    token:t.String(),
    name:t.String(),
    email:t.String(),
    imageuri:t.String()
})})
.post("/deletephoto",async({body,set})=>{
    const token = body.token;

    const {payload} = await jwtVerify(token,new TextEncoder().encode(Bun.env.JWT_SECRET));
    if(!payload) {
       set.status  = 401;
        return "unauthorized";
    }
    set.status=200;

    db.run("UPDATE users SET image=? WHERE email=?",[null,body.email])
    return "success"
  
},{body:t.Object({
    token:t.String(),
    email:t.String(),
})})
.post("/getNI",({body,set})=>{
   const res:any= db.query("SELECT name,image FROM users WHERE email=?").get(body.email);
   set.status = 200;
   return {name:res.name,image:res.image};
},{body:t.Object({email:t.String()})})



