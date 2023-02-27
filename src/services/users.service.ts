import {iOption,iParams, iUser} from '../declarations'
import * as bcrypt from 'bcrypt'
export class Users { 
    model:any =undefined
    constructor (options:iOption) {
     
        this.model=options.model
    }
  
  async findOne (query:any) {
  
    try {

        let record = await this.model.find({username:query.username})
      
        if (record && record.length>0) {
            return {success:true,data:record[0]}
        }
        else {
            return {success:false,data:'anauthenticated'}
        }
    }
    catch(err) {
        return null
    }
  }
    async createOne (data:iUser) {
   
        
        try {
            let record =new  this.model(data)
           let res= await record.save()
           return {success:true,data:res}
        }
        catch(err) {
           
            return {success:false,data:err}
        }
    }
   
    async remove(id: string){
        if (id) {
            try {

                let res =await this.model.deleteOne({id})
                return {success:true,data:res}
            }
            catch(err) {
                return {success:false,data:err}
            }
        }
        else {
            return null
        }
       
    }
    async isAuthenticated (username:string) {
        let record=null
        try {
            record = await this.model.findOne({username},'authenticated username')
           
            return {success:true,data:record}
        }
        catch(err){
            return {success:false,data:err}
        }
    }
    async setAuthecticate (username:string,value:boolean) {
        let record =await this.model.findOneAndUpdate({username},{$set:{authenticated:value}})
      
        return {success:true,data:record}
    }
    async passwordReset (username:string,password:string) {
        
        try {
      
          let record =await this.model.findOneAndUpdate({username}
                ,{$set:{password}},{returnOriginal: false})
               
          return {success:true,data:'success'}
        }
        catch(err) {
            return {success:false,data:err}
        }
    }

    async getUser (username?:any ){
      let res=await  this.model.find({username})
      return res
    }
}