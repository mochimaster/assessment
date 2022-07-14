const sql = require('sql')

const initialize = async (client) => {
  if (!client) return

  await dropTables(client)
  await createTables(client)

  await populateTables(client)
}

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
      })
      .catch((err) => {
        console.log('CREATE TABLE FAILURE', err)
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
      })
      .catch((err) => {
        console.log('DROP TABLE FAILURE: ', err)
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
    room_id: 1,
    status: 'AUTO APPROVED',
    timeslot_from: '1657143000',
    timeslot_to: '1657146600',
    requester_id: 1
  },
  {
    room_id: 5,
    status: 'APPROVED',
    timeslot_from: '1657143000',
    timeslot_to: '1657146600',
    requester_id: 1,
    approver_id: 3
  },
  {
    room_id: 6,
    status: 'APPROVED',
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
  },
  {
    room_id: 1,
    status: 'AUTO APPROVED',
    timeslot_from: '1657954800',
    timeslot_to: '1658214000',
    requester_id: 4
  },
  {
    room_id: 1,
    status: 'AUTO APPROVED',
    timeslot_from: '1658330100',
    timeslot_to: '1658338200',
    requester_id: 5
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
    name: 'name1',
    username: 'user1',
    password: 'user1',
    role: 'MEMBER'
  },
  {
    name: 'name2',
    username: 'user2',
    password: 'user2',
    role: 'MEMBER'
  },
  {
    name: 'name3',
    username: 'user3',
    password: 'user3',
    role: 'MEMBER'
  },
  {
    name: 'name4',
    username: 'user4',
    password: 'user4',
    role: 'ADMIN'
  },
  {
    name: 'name5',
    username: 'user5',
    password: 'user5',
    role: 'ADMIN'
  },
  {
    name: 'name6',
    username: 'user6',
    password: 'user6',
    role: 'FACILITY MANAGER'
  },
  {
    name: 'name7',
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
  let query = Room.insert(roomsToInsert).returning(Room.id).toQuery()
  await client.query(query)
  console.log('INSERTED ROOMS')

  query = Booking.insert(bookingsToInsert).returning(Booking.id).toQuery()
  await client.query(query)
  console.log('INSERTED BOOKINGS')

  query = User.insert(usersToInsert).returning(User.id).toQuery()
  await client.query(query)
  console.log('INSERTED USERS')
}

module.exports = initialize
