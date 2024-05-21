const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const {mongoose} = require('mongoose');
const cookieParser = require('cookie-parser');
const {url, rwurl, port} = require('./config')
const {specs} = require('./swagger_config');
const swaggerUi = require("swagger-ui-express");
const {AuthRouter} = require('./routes/authRoutes')

const routes = new AuthRouter();
const allowedOrigins = [
  'https://overmeli-fronted-production.up.railway.app',  // Production frontend URL
  'https://overmeli-loginapi-production.up.railway.app/',
  'http://localhost:8090',
  'http://localhost:8000',
  'overmeli-fronted.railway.internal',
  'overmeli-loginapi.railway.internal'  
    // Local development URL (optional, for local testing)
];

//database connection
mongoose.connect(rwurl) //Web: MONGO_URL //docker: url
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
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials if needed
  optionsSuccessStatus: 204
}));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

