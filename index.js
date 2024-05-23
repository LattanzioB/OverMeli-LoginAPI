const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const {mongoose} = require('mongoose');
const cookieParser = require('cookie-parser');
const {url, rwurl} = require('./config')
const {specs} = require('./swagger_config');
const swaggerUi = require("swagger-ui-express");
const {AuthRouter} = require('./routes/authRoutes')

const routes = new AuthRouter();


//database connection
mongoose.connect(url) //Web: MONGO_URL //docker: url
.then(()=> console.log('Database Connected'))
.catch((err) => console.log('Database not Connected', err))

const app = express();
//middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use('/', routes.get_routes())
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

const port = 8000;
app.listen(port, ()=> console.log(`server is running on port ${port}`))

