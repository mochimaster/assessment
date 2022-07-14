const express = require('express')
const cors = require('cors')

const { Pool, Client } = require('pg')
const sql = require('sql')
const bodyParser = require('body-parser')

const all = require('./routes/api/all')

const roomsRouter = require('./routes/roomsRouter')
const bookingsRouter = require('./routes/bookingsRouter')
const usersRouter = require('./routes/usersRouter')

const PORT = process.env.PORT || 3001

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api', all)
app.use('/api/rooms', roomsRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/users', usersRouter)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  port: 5432
})
client.connect()

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
const tables = ['rooms', 'bookings', 'users']

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
        manager_approver_id INTEGER,
        created_date TIMESTAMP default current_timestamp,
        modified_date TIMESTAMP default current_timestamp
      )`,
    `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(128),
        username VARCHAR(128),
        password VARCHAR(128),
        role VARCHAR(128),
        created_date TIMESTAMP default current_timestamp,
        modified_date TIMESTAMP default current_timestamp
      )`
  ]

  for (const queryText of queriesText) {
    await client
      .query(queryText)
      .then(() => {
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
      .then(() => {
        console.log('DROP TABLE SUCCESS')
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
    status: 'AUTO APPROVED',
    timeslot_from: '1657143000',
    timeslot_to: '1657146600',
    requester_id: 1,
    approver_id: 3
  },
  {
    room_id: 6,
    status: 'AUTO APPROVED',
    timeslot_from: '1656977400',
    timeslot_to: '1656978300',
    requester_id: 1,
    approver_id: 3
  },
  {
    room_id: 7,
    status: 'DENIED',
    timeslot_from: '1656864000',
    timeslot_to: '1656864900',
    requester_id: 1,
    approver_id: 5
  },
  {
    room_id: 5,
    status: 'PENDING',
    timeslot_from: '1658333700',
    timeslot_to: '1658334600',
    requester_id: 1
  },
  {
    room_id: 6,
    status: 'PENDING',
    timeslot_from: '1658421000',
    timeslot_to: '1658424600',
    requester_id: 1
  },
  {
    room_id: 7,
    status: 'SEMI APPROVED',
    timeslot_from: '1658421000',
    timeslot_to: '1658424600',
    requester_id: 1,
    approver_id: 5
  },
  {
    room_id: 7,
    status: 'APPROVED',
    timeslot_from: '1658421000',
    timeslot_to: '1658424600',
    requester_id: 1,
    approver_id: 5,
    manager_approver_id: 6
  },
  {
    room_id: 8,
    status: 'SEMI APPROVED',
    timeslot_from: '1658421000',
    timeslot_to: '1658424600',
    requester_id: 1,
    manager_approver_id: 6
  },
  {
    room_id: 8,
    status: 'SEMI APPROVED',
    timeslot_from: '1658421000',
    timeslot_to: '1658424600',
    requester_id: 1,
    manager_approver_id: 6
  },
  {
    room_id: 8,
    status: 'PENDING',
    timeslot_from: '1658421000',
    timeslot_to: '1658424600',
    requester_id: 3
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
    'approver_id',
    'manager_approver_id'
  ]
})

const usersToInsert = [
  {
    name: 'user1',
    username: 'user1',
    password: 'user1',
    role: 'MEMBER'
  },
  {
    name: 'user2',
    username: 'user2',
    password: 'user2',
    role: 'MEMBER'
  },
  {
    name: 'user3',
    username: 'user3',
    password: 'user3',
    role: 'MEMBER'
  },
  {
    name: 'user4',
    username: 'user4',
    password: 'user4',
    role: 'ADMIN'
  },
  {
    name: 'user5',
    username: 'user5',
    password: 'user5',
    role: 'ADMIN'
  },
  {
    name: 'user6',
    username: 'user6',
    password: 'user6',
    role: 'FACILITY MANAGER'
  },
  {
    name: 'user7',
    username: 'user7',
    password: 'user7',
    role: 'FACILITY MANAGER'
  }
]

const User = sql.define({
  name: 'users',
  columns: ['id', 'name', 'username', 'password', 'role']
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
  const insertedRooms = await client.query(query)
  console.log('INSERTED ROOMS: ', insertedRooms.rows)

  query = Booking.insert(bookingsToInsert).returning(Booking.id).toQuery()
  const insertedBookings = await client.query(query)
  console.log('INSERTED BOOKINGS: ', insertedBookings.rows)

  query = User.insert(usersToInsert).returning(User.id).toQuery()
  const insertedUsers = await client.query(query)
  console.log('INSERTED USERS: ', insertedUsers.rows)
}

// pool.on('remove', () => {
//   console.log('client removed')
//   process.exit(0)
// })
