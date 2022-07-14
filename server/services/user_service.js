const lodash = require('lodash')

const db = require('../helper/db')

const findUser = async ({ username, password }) => {
  const data = await db.query(
    `SELECT * FROM users WHERE username='${username}'`
  )

  if (lodash.isEmpty(data) || data[0].password !== password) return undefined

  const userData = lodash.pick(data[0], ['id', 'name', 'username', 'role'])

  return userData
}

module.exports = {
  findUser
}
