import path from 'path';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import getConnction from './mongoose'
import * as body_parser from 'body-parser'

import {logout,signIn,signUp,resetPassword,getUser} from './routes/authentication';
import {getOneStudent,getStuents,deleteOne,updateOneStudent,createOneStudent} from './routes/stuedents'

import express from 'express'


// Don't remove this comment. It's needed to format import lines nicely.

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//app.use(body_parser.json())
getConnction()


//app.use(cors());
//app.use(compress());

// Host the public folder


// Set up Plugins and providers

// Configure other middleware (see `middleware/index.ts`)



// Configure a middleware for 404s and the error handler


app.get('/getUser',getUser)

//app.configure(Authenticate);
app.post('/login',signIn)
app.get('/logout',logout)
app.post('/signup',signUp)
app.post('/resetpassword',resetPassword)
app.get('/students',getStuents)
app.get('/student',getOneStudent)
app.delete('/deletestudent',deleteOne)
app.put('/updatestudent',updateOneStudent)
app.post ('/createstudent',createOneStudent)
app.use('/', express.static(__dirname + '/public'));
export default app;




