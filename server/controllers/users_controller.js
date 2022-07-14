const userService = require('../services/user_service')

const post = async (req, res, next) => {
  const payload = req.body

  const user = await userService.findUser(payload)

  if (!user) res.sendStatus(401)

  res.send(user)
}

module.exports = {
  post
}
