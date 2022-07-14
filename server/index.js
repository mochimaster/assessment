const express = require('express')
const cors = require('cors')

const { Pool, Client } = require('pg')
const bodyParser = require('body-parser')

const roomsRouter = require('./routes/roomsRouter')
const bookingsRouter = require('./routes/bookingsRouter')
const usersRouter = require('./routes/usersRouter')

const initialize = require('./helper/initializeDB')
const config = require('./config')

const PORT = process.env.PORT || 3001

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/rooms', roomsRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/users', usersRouter)

const client = new Client(config.db)
client.connect()

const pool = new Pool({
  database: config.db.database
})

pool.connect(async (err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }

  await initialize(client)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
