const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const corsOptions = require('./cors-options');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { url, rwurl, port } = require('./config');
const { specs } = require('../swagger_config');
const swaggerUi = require("swagger-ui-express");
const { AuthRouter } = require('./routes/authRoutes');
const setupDatabase = require('./setup');
const User = require('./model/user_model');
const promClient = require('prom-client');  

const register = promClient.register;
promClient.collectDefaultMetrics();

// database connection
mongoose.connect(rwurl)
.then(async ()=> {
  console.log('Database Connected')
  await User.deleteMany({});
  await setupDatabase();
})
.catch((err) => console.log('Database not Connected', err))

const app = express();

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/', new AuthRouter().get_routes());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics()
    res.send(metrics);
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// testing