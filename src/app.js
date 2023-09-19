const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/router');
const requestLogger = require('./utilities/requestLogger');
const errorLogger = require('./utilities/errorLogger');
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: 'https://chiruvaradani.github.io', // Replace with your allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*')
  res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if(req.method==='OPTIONS'){
    res.status(200)
  }else{
    next()
  }
});

app.use(express.json());
// app.use(requestLogger);
// app.use(errorLogger);
app.use('/server', router);

app.listen(port, () => {
  console.log(`server started at ${port}`);
});
