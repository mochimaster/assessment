const roomService = require('../services/room_service')

const index = async (req, res, next) => {
  const data = await roomService.getAll()

  res.json(data)
}

module.exports = {
  index
}
