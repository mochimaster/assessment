const env = process.env

const config = {
  db: {
    /* do not put password or any sensitive info here, done only for demo */
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    database: env.DB_NAME || 'assignment'
  }
}

module.exports = config
