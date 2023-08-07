const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/router');
const requestLogger = require('./utilities/requestLogger');
const errorLogger = require('./utilities/errorLogger');
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: 'https://chiruvaradani.github.io' || "http://localhost:3001", // Replace with your allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());
// app.use(requestLogger);
// app.use(errorLogger);
app.use('/server', router);

app.listen(port, () => {
  console.log(`server started at ${port}`);
});
