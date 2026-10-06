require('dotenv').config();
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mon-app',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

module.exports = {
  development: {
    client: 'pg',
    connection: dbConfig,
    migrations: {
      directory: path.join(__dirname, 'server/database/migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'server/database/seeds')
    },
    debug: true,
    pool: {
      min: 2,
      max: 10,
      createTimeoutMillis: 3000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || dbConfig,
    migrations: {
      directory: path.join(__dirname, 'server/database/migrations'),
      tableName: 'knex_migrations'
    },
    pool: {
      min: 2,
      max: 10
    },
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  }
};
