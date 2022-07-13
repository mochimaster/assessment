const db = require('../helper/db')

const getAll = async () => {
  const data = await db.query('SELECT * FROM rooms')

  console.log('data to return: ', data)

  return data
}

module.exports = {
  getAll
}
