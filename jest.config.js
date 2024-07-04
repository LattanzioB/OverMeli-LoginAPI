let config = require('jest').Config;


config = {
    verbose: true,
    collectCoverageFrom: [
        '/src/**/*.{js}',
        '!**/*.test.js',
      ],
    coverageThreshold: {
      global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: -10,
        }  
     }
    }
  
  module.exports = config;