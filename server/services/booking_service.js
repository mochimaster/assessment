const db = require('../helper/db')

const getAll = async () => {
  const data = await db.query('SELECT * FROM bookings')

  console.log('data to return: ', data)

  return data
}

const saveOne = async (body) => {
  console.log('EXECUTE QUERY HERE', body)

  await db.query(
    `INSERT INTO bookings('room_id, time_slot, requester_id', status) VALUES(${
      body.id
    }, ${(body.timeslot[0], 1, 'pending')})`
  )
}

module.exports = {
  getAll,
  saveOne
}
