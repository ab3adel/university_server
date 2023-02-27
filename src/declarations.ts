import {Document} from 'mongoose'
export interface iOption {model:any}
export interface iParams {page?:any,query?:any, limit?:any,id?:string,locale?:any}
export interface iStudent {
    id?:string
    firstName_en?:string ,
    firstName_ar?:string,
    lastName_en?:string,
    lastName_ar?:string,
    address_en?:string,
    address_ar?:string,
    CountryCode:string,
    phoneNumber:string,
    dateOfBirth:  string,
}
export interface iUser {

    username:string,
     password:string 
    firstname: string,
    lastname: string,
  
}
export interface InstitutionDocument extends Document {}