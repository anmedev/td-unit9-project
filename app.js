'use strict';

//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-IMPORTS-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
const express = require('express');
const morgan = require('morgan');
const routes = require("./routes");
const sequelize = require("./models").sequelize;

//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-APP SET UP-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
// Creates variable to enable global error logging.
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Creates the Express app.
const app = express();

// Sets up request body JSON parsing.
app.use(express.json());

// Sets up morgan, which gives us http request logging.
app.use(morgan('dev'));

// Sets up a friendly greeting for the root route.
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Adds routes.
app.use('/api', routes);

//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-ERROR HANDLERS-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-DATABASE CONNECTION-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
// Sets our port.
app.set('port', process.env.PORT || 5000);

// Tests connection to the database.
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

// Starts listening on our port.
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});