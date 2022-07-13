const env = process.env

const config = {
  db: {
    /* do not put password or any sensitive info here, done only for demo */
    // host: env.DB_HOST || 'localhost',
    // port: env.DB_PORT || '5432',
    database: env.DB_NAME || 'assignment'
  },
}

module.exports = config
