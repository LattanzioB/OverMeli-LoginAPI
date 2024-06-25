const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const corsOptions = require('./cors-options')
const {mongoose} = require('mongoose');
const cookieParser = require('cookie-parser');
const {url, rwurl, port} = require('./config')
const {specs} = require('./swagger_config');
const swaggerUi = require("swagger-ui-express");
const {AuthRouter} = require('./routes/authRoutes')
const setupDatabase = require('./setup');
const User = require('./model/user_model'); 

const routes = new AuthRouter();

//database connection
mongoose.connect(rwurl) //Web: MONGO_URL //docker: url
.then(()=> console.log('Database Connected'))
.catch((err) => console.log('Database not Connected', rwurl, err))



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
app.use(cors(corsOptions));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



//sonar tryout