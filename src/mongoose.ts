import mongoose, { Mongoose } from 'mongoose';
import logger from './logger';
//etMEmPCgLqQovT8j
const MONGODB_URL= `mongodb+srv://mohammadismael78:etMEmPCgLqQovT8j@cluster0.l5on1r8.mongodb.net/?retryWrites=true&w=majority`
const test ='mongodb://127.0.0.1:27017'
export default  async function () :Promise<any>{
  console.log ('start connecting')
await mongoose.connect(
  MONGODB_URL
  )
  
  .catch(err => {
    logger.error('err',err);
    process.exit(1);
  });

}
