const allowedOrigins = [
  'https://overmeli-fronted-production.up.railway.app',  // Production frontend URL
  'https://overmeli-loginapi-production.up.railway.app',
  'http://localhost:8090',
  'http://localhost:8000',
  'https://over-meli-fronted.vercel.app'  
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isValidOrigin = allowedOrigins.includes(origin);
    if (!isValidOrigin) {
      const _errorMsg =
        'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(_errorMsg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: [
    'Cookie',
    'Cookies',
    'Authorization',
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Access-Control-Allow-Request-Method',
    'Access-Control-Allow-Headers'
  ],
  credentials: true,
};

module.exports = corsOptions;