import {iUser} from '../declarations'
import usersModel from '../models/users.model'
import { Users } from '../services/users.service'
import {Response,Request} from 'express'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
let user = new Users ({model:usersModel()})
let secretKey= "jkdaljskjlKEjlaeijf3rew9ofenpKjfldjs(#2u2nldknfL"
export async function signIn (req:Request,res:Response) {
   
    let token =null
    let {username,password}=req.body
    if (!Boolean(username) || !Boolean(password)) {
        res.status(400).json({message:'username/ password are required'})
        return
    }
    let result =await user.findOne({username})


    if (result ) {
        if (result.success){
            let {data}=result
            let matched =await comparePassword(password,username)
         
            if ( !matched) {
             res.status(403).json({succes:false,message:'entered password is wrong'})
             return
            }
            else {
     
                try {
                    //Creating jwt token
                    user.setAuthecticate(username,true)
                    token = jwt.sign(
                      { username: data.username, firstname: data.firstname },
                      secretKey,
                 
                    );
                  } catch (err) {
                    console.log(err);
                    const error = new Error("Error! Something went wrong.");
                    
                  }
            }
        }
        else {
            res.status(401).json({result})
        }
    }
    if (token ) {
        res.status(200)
        .json({
          success: true,
          data: {
          data: result?.data,
            token: token,
          },
        });
    }
    else {
        res.status(400).json({success:false})
    }
}
export async function signUp (req:Request,res:Response,next:Function )  {
    
    
let {username,password,firstname,lastname}=req.body
if (!Boolean(username)) {
    res.status(400).json({success:false,message:'you have to enter username'})
    return
}
if (!Boolean(password)) {
    res.status(400).json({success:false,message:'you have to enter password'})
    return
}
if (!Boolean(firstname)) {
    res.status(400).json({success:false,message:'you have to enter firstname'})
    return
}
if (!Boolean(lastname)) {
    res.status(400).json({success:false,message:'you have to enter lastname'})
    return
}
  let token=null
    let {success,data}=await user.createOne(  {...req.body,authenticated:true})
    if (success) {
        
        try {
           
            token = jwt.sign({usename:data.username,firstname:data.firstname},secretKey)
            if (token) {
                res.status(201).json({success:true,  data: {
                    data,
                      token: token,
                    },})
            }
            else {
                res.status(500).json({})
            }
        }
        catch(err) {
            console.log(err)
        }
       
    }
    else {
        res.status(400).json({success,data})
    }
}
export async function logout (req:Request,res:Response,next:Function) {
    let result=await checkAuthorization(req.headers)
    if (result && result.authorized) {
      let new_res=  user.setAuthecticate((result.data as jwt.JwtPayload).username,false)
      res.status(200).json(new_res)
    }
    else {
        res.status(400).json({success:false,message:'unauthenticated'})
    }
}
export async function resetPassword (req:Request,res:Response,next:Function) {
    let {username,old_password,new_password}=req.body
    let result=await checkAuthorization(req.headers)
    console.log(result,'check auth')
    if (result && result.authorized) {
        
        let matched= await comparePassword(old_password,username)
        console.log('matched',matched)
        if (!matched) {
            res.status(400).json({succes:false,message:'your entered password is wrong'})
            return
        }
        else {
            console.log('new password salting')
            bcrypt.genSalt(10, function(err, salt) {
                if (err) return;
        
                // hash the password using our new salt
           
                if (new_password){
                  
                    bcrypt.hash(new_password, salt,async function(err, hash) {
                        if (err) return ;
                        // override the cleartext password with the hashed
                       
                    let result=await    user.passwordReset(username,hash)
                   console.log(result,'result')
                        res.status(200).json(result)
                        return
                    
                       
                    });
                }
            })
            
         
            
           
        }
    }

    else {

        res.status(403).json({message:'unauthenticated'})
    }
}
export async function getUser(req:Request,res:Response) {
    console.log('get user',req.query)
    let {username}=req.query
   let resu=await  user.getUser(username)
    res.json({data:resu})
}

export async function checkAuthorization (headers:any) {
    const token =headers.authorization.split(' ')[1]; 
  
    if(!token)
    {
        return {authorized:false,data:{message:'unauthorized'}}
    }
    else {
        try {
            let decoded =  jwt.verify(token,secretKey)
            let result=null
            
            if (decoded && (decoded as jwt.JwtPayload).username){
    
                result =await user.isAuthenticated((decoded as jwt.JwtPayload).username)
              
                return {authorized:result?result.data?.authenticated:false, data:decoded}
            }

        }
       catch(err) {
        return {authorized:false,data:null}
       }
      
       
    }
}
async function comparePassword (password:string,username:string) {
    
    let matched=false
    let result= await user.findOne({username})
    console.log('compare password',result)
    if (result?.success ){

        // bcrypt.compare(password, result.data.password, function(err, isMatch) {
            
        //     if (err) matched= false;
        //    return isMatch
        // });
         matched = await bcrypt.compare(password, result.data.password)
         return matched
       
    }
    else {
        return false
    }
   
}
