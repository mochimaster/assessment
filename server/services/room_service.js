const db = require('../helper/db')

const getAll = async () => {
  const data = await db.query('SELECT * FROM rooms')

  return data
}

const getOne = async (id) => {
  const data = await db.query(`SELECT * FROM rooms WHERE id=${id}`)
  return data ? data[0] : []
}

module.exports = {
  getAll,
  getOne
}
