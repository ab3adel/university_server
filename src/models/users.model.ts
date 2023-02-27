// students-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

import mongooseClient,{ Model, Mongoose, Types } from 'mongoose';
import * as bcrypt from 'bcrypt'
const SALT_WORK_FACTOR = 10;
export default  function (): Model<any> {
  const modelName = 'users';
 
  const schema = new mongooseClient.Schema({
    id:{ type: Types.ObjectId},
   username: {type:String ,required:true,unique:true},
    password: {type:String ,required:true},
   firstname: {type:String,required:true},
   lastname: {type:String,required:true},
    creationDate: { type: Date, default: Date.now() },
    authenticated:{type:Boolean ,default:false}
   
    
  }, {
    timestamps: true
  });
  schema.pre('save', function(next) {
    console.log('hashing password')
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        if (user.password){

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                // override the cleartext password with the hashed 
                console.log(hash,'hashed')
                user.password = hash;
                next();
            });
        }
    });
});
 
schema.methods.comparePassword = function(candidatePassword:string, cb:Function) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
