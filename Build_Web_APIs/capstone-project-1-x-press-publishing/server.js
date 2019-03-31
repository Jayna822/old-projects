const express = require('express');
const app = express();

module.exports = app;

const PORT = process.env.PORT || 4001;

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const errorHandler = require('errorhandler');
app.use(errorHandler());

const morgan = require('morgan');
app.use(morgan('dev'));

const apiRouter = require('./api/api');
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log('Server is listening on ' + PORT);
});

module.exports = app;
