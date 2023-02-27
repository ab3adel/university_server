// students-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import getMongoose from '../mongoose'
import mongooseClient,{ Model, Mongoose, Types } from 'mongoose';
import  paginate from 'mongoose-paginate-v2'

export default  function (): Model<any> {
  const modelName = 'students';



  const schema = new mongooseClient.Schema({
    id:{ type: Types.ObjectId},
    firstName_en: {type:String, required:true },
    firstName_ar: {type:String, required:true},
    lastName_en: {type:String, required:true},
    lastName_ar: {type:String, required:true},
    address_en:{type:String, required:true},
    address_ar:{type:String, required:true},
    CountryCode:{ type: String, required:true},
    phoneNumber: { type: String, required: true, unique: true },
    creationDate: { type: Date, default: Date.now() },
    dateOfBirth: { type: Date , required:true},
    
  }, {
    timestamps: true
  });
schema.plugin(paginate)
  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
