const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/router');
const requestLogger = require('./utilities/requestLogger');
const errorLogger = require('./utilities/errorLogger');
const port = process.env.PORT || 4000;

const corsOptions = {
  origin: '*', // Replace with your allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};


// Enable CORS for all routes
app.use(cors(corsOptions));


// app.use((req,res,next)=>{
//   res.header('Access-Control-Allow-Origin','https://chiruvaradani.github.io')
//   res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS')
//   res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization')
//   next()
// });

app.use(express.json());
// app.use(requestLogger);
// app.use(errorLogger);
app.use('/server', router);

app.listen(port, () => {
  console.log(`server started at ${port}`);
});
