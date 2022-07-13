const bookingService = require('../services/booking_service')

const index = async (req, res, next) => {
  const bookingsResult = await bookingService.getAll()

  res.json(bookingsResult)
}

const post = async (req, res, next) => {
  const body = req.body
  console.log('BOOKINGS CONTROLLER body: ', body)
  const bookingsResult = await bookingService.saveOne({
    ...body,
    requester_id: 1
  })

  res.send('POST MESSAGE Inside controller')
}

module.exports = {
  index,
  post
}
