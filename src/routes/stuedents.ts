import { iStudent,iOption,iParams,iUser} from '../declarations'
import { Students } from '../services/students.service'
import { checkAuthorization } from './authentication'
import {Request,Response} from 'express'
import getStudentModel from '../models/students.model'
let student = new Students({model:getStudentModel()})

export async function getStuents (req:Request,res:Response) {
let resu=await checkAuthorization(req.headers)
if (resu &&resu.authorized){

    let {page,page_count,locale}=req.query
    if (!locale) {
        res.send(400).json({success:false,message:"you must send locale "})
    }
    let records =await student.getAllStudents({page,limit:page_count,locale:locale?locale:'en'})
    if (records) {
        res.status(200).json({success:true,data:records})
    }
    else {

        res.status(400).json({success:false,message:'page number is required'})
    }
}
else {

    res.status(403).json({message:'unauthenticated'})
}
}
export async function getOneStudent (req:Request,res:Response) {
    let resu=await checkAuthorization(req.headers)
    if (resu && resu.authorized){
    let {id,locale}=req.body
    if (!id) {
        res.status(400).json({success:false,message:'id is required'})
        return 
    }
    if (!locale) {
        res.status(400).json({success:false ,message:'locale is required'})
        return
    }
    let result = await student.getOne({id,locale})
    if (result) {
        res.status(200).json({success:true,data:result})
    }
    res.status(400).json({success:false})
}
else {
    
    res.status(403).json({message:'unauthenticated'})
}
}
export async function createOneStudent (req:Request,res:Response) {
    let resu=await checkAuthorization(req.headers)
    if (resu && resu.authorized){
    let obj:iStudent=req.body
   
    
    if (obj) {
        let result = await student.createOne(obj)
        res.json({data:result})
    }
    else {

        res.status(400).json({success:false})
    }
}
else {
    res.status(403).json({message:'unauthenticated'})
}
}
export async function updateOneStudent (req:Request,res:Response) {
    let resu=await checkAuthorization(req.headers)
    if (resu && resu.authorized){
    let body=req.body
   
    
    if (body) {
        let result = await student.updateOne(body,body.id)
        res.json({data:result})
    }
    res.status(400).json({success:false})
}
else {
    res.status(403).json({message:'unauthenticated'})
}
}
export async function deleteOne (req:Request,res:Response) {
   
    let result=await checkAuthorization(req.headers)
    if (result && result.authorized){
    let {id}=req.body
    if (id) {
        let result =await student.remove(id)
        console.log(result)
        if (result && result.success){
            res.status(200).json({success:true,message:'student has been deleted'})
        }
        else {
            res.status(400).json({success:false,message:'failed'})
        }
    }
}
else {
    res.status(403).json({message:'unauthenticated'})
}
}
