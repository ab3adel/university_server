import logger from './logger';
import app from './app';

const port = 3000;
const host='http://localhost'

app.listen(port,()=>{
  console.log('server started on port'+port)
});

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);




