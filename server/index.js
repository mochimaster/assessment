const express = require('express')
const cors = require('cors')

const { Pool, Client } = require('pg')
const sql = require('sql')
const bodyParser = require('body-parser')

const all = require('./routes/api/all')

const roomsRouter = require('./routes/roomsRouter')
const bookingsRouter = require('./routes/bookingsRouter')

const PORT = process.env.PORT || 3001

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api', all)
app.use('/api/rooms', roomsRouter)
app.use('/api/bookings', bookingsRouter)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

// const client = new Client()
// client.connect()
// client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
//   console.log(err ? err.stack : res.rows[0].message) // Hello World!
//   client.end()
// })

// const pool = new Pool({
//   user: 'dbuser',
//   host: 'database.server.com',
//   database: 'mydb',
//   password: 'secretpassword',
//   port: 3211
// })
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })
// const client = new Client({
//   user: 'dbuser',
//   host: 'database.server.com',
//   database: 'mydb',
//   password: 'secretpassword',
//   port: 3211
// })
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  //   password: 'postgres',
  port: 5432
})
client.connect()
// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   client.end()
// })

// const dbname = 'ASSIGNMENT'

// const initializeDB = async () => {
//   const db = new Pool({
//     // host: 'SERVER_IP',
//     database: 'assignment',
//     // user: 'USER',
//     // password: 'DB_PASS',
//     // port: '5432'
//   })
//   db.query(
//     'CREATE TABLE TABLE_NAME(id SERIAL PRIMARY KEY, xzy VARCHAR(40) NOT NULL, abc VARCHAR(40) NOT NULL)',
//     (err, res) => {
//       console.log(err, res)
//       db.end()
//     }
//   )
// }

// initializeDB()

const pool = new Pool({
  //   connectionString: 'process.env.DATABASE_URL'
  database: 'assignment'
})

pool.connect(async (err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log(result.rows)
  })

  await dropTables(client)
  await createTables(client)

  await populateTables(client)
})

/**
 * Create Tables
 */
const tables = ['rooms', 'bookings']

const createTables = async (client) => {
  const queriesText = [
    `CREATE TABLE IF NOT EXISTS
      rooms(
        id SERIAL PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        size VARCHAR(128) NOT NULL,
        location VARCHAR(128) NOT NULL,
        created_date TIMESTAMP default current_timestamp,
        modified_date TIMESTAMP default current_timestamp
      )`,
    `CREATE TABLE IF NOT EXISTS
      bookings(
        id SERIAL PRIMARY KEY,
        room_id INTEGER NOT NULL,
        status VARCHAR(128) NOT NULL,
        timeslot_from VARCHAR(128) NOT NULL,
        timeslot_to VARCHAR(128) NOT NULL,
        requester_id INTEGER NOT NULL,
        approver_id INTEGER,
        created_date TIMESTAMP default current_timestamp,
        modified_date TIMESTAMP default current_timestamp
      )`
  ]
  //   const queryText = `CREATE TABLE IF NOT EXISTS
  //       rooms(
  //         id SERIAL PRIMARY KEY,
  //         name VARCHAR(128) NOT NULL,
  //         size VARCHAR(128) NOT NULL,
  //         location VARCHAR(128) NOT NULL,
  //         created_date TIMESTAMP default current_timestamp,
  //         modified_date TIMESTAMP default current_timestamp
  //       )`

  for (const queryText of queriesText) {
    await client
      .query(queryText)
      .then((res) => {
        console.log('CREATE TABLE SUCCESS')
        //   client.end()
      })
      .catch((err) => {
        console.log('CREATE TABLE FAILURE', err)
        //   client.end()
      })
  }
}

/**
 * Drop Tables
 */
const dropTables = async (client) => {
  for (const table of tables) {
    await client
      .query(`DROP TABLE IF EXISTS ${table}`)
      .then((res) => {
        console.log('DROP TABLE SUCCESSL: ')
        //   client.end()
      })
      .catch((err) => {
        console.log('DROP TABLE FAILURE: ', err)
        //   client.end()
      })
  }
}

const roomsToInsert = [
  {
    name: 'room1',
    size: 'small',
    location: 'ground'
  },
  {
    name: 'room2',
    size: 'small',
    location: 'ground'
  },
  {
    name: 'room3',
    size: 'small',
    location: 'ground'
  },
  {
    name: 'room4',
    size: 'small',
    location: 'ground'
  },
  {
    name: 'room5',
    size: 'medium',
    location: 'ground'
  },
  {
    name: 'room6',
    size: 'medium',
    location: 'ground'
  },
  {
    name: 'room7',
    size: 'large',
    location: 'ground'
  },
  {
    name: 'room8',
    size: 'large',
    location: 'mars'
  }
]

const Room = sql.define({
  name: 'rooms',
  columns: ['id', 'name', 'size', 'location']
})

const bookingsToInsert = [
  {
    room_id: 5,
    status: 'approved',
    timeslot_from: new Date().setDate(new Date().getDate() - 7),
    timeslot_to: new Date().setDate(new Date().getDate() - 6),
    requester_id: 1,
    approver_id: 3
  },
  {
    room_id: 6,
    status: 'approved',
    timeslot_from: new Date().setDate(new Date().getDate() - 4),
    timeslot_to: new Date().setDate(new Date().getDate() - 3),
    requester_id: 1,
    approver_id: 3
  },
  {
    room_id: 7,
    status: 'denied',
    timeslot_from: new Date().setDate(new Date().getDate() - 2),
    timeslot_to: new Date().setDate(new Date().getDate() - 1),
    requester_id: 1,
    approver_id: 3
  },
  {
    room_id: 5,
    status: 'pending',
    timeslot_from: new Date().setDate(new Date().getDate() + 1),
    timeslot_to: new Date().setDate(new Date().getDate() + 1),
    requester_id: 1,
  },
  {
    room_id: 6,
    status: 'pending',
    timeslot_from: new Date().setDate(new Date().getDate() + 2),
    timeslot_to: new Date().setDate(new Date().getDate() + 2),
    requester_id: 1,
  }
]

const Booking = sql.define({
  name: 'bookings',
  columns: [
    'id',
    'room_id',
    'status',
    'timeslot_from',
    'timeslot_to',
    'requester_id',
    'approver_id'
  ]
})

const populateTables = async (client) => {
  //   await client
  //     .query(
  //       'INSERT INTO ROOMS(name, size, location) VALUES($1, $2, $3) RETURNING *',
  //       [
  //         ['room1', 'small', 'ground'],
  //         ['room2', 'small', 'ground']
  //       ]
  //     )
  //     .then((res) => {
  //       console.log('INSERT SUCCESS', res)
  //     })
  //     .catch((err) => {
  //       console.log('INSERT ERR: ', err)
  //     })

  let query = Room.insert(roomsToInsert).returning(Room.id).toQuery()
  console.log('QUERY: ', query)
  let { rows } = await client.query(query)
  console.log('rows: ', rows)

  query = Booking.insert(bookingsToInsert).returning(Booking.id).toQuery()
  console.log('QUERY: ', query)
  insertedBookings = await client.query(query)
  console.log('booking rows: ', insertedBookings.rows)
}

// pool.on('remove', () => {
//   console.log('client removed')
//   process.exit(0)
// })
