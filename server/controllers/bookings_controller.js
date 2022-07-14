const bookingService = require('../services/booking_service')
const roomService = require('../services/room_service')

const { BOOKING_STATUS, ROOM_SIZES } = require('../helper/constants')

const index = async (_, res) => {
  const bookingsResult = await bookingService.getAll()
  res.json(bookingsResult)
}

const post = async (req, res) => {
  const body = req.body

  const result = await bookingService.saveOne({
    ...body,
    requester_id: 1,
    status: body.size === 'small' ? 'AUTO-APPROVED' : 'PENDING'
  })

  res.send({ result })
}

const update = async (req, res, next) => {
  const payload = req.body

  const currentBooking = await bookingService.getOne(payload.id)

  /** If existing booking is already APPROVED or DENIED, do not update */
  if (
    [BOOKING_STATUS.APPROVED, BOOKING_STATUS.DENIED].includes(
      currentBooking.status
    )
  ) {
    res.sendStatus(401)
    return
  }

  /** If booking DENIED, update and return */
  if (payload.status === BOOKING_STATUS.DENIED) {
    await bookingService.updateOne(payload)

    res.send('BOOKINGS DENIED')
    return
  }

  /** Approval based on room size */
  const room = await roomService.getOne(payload.room_id)

  if (room.size === ROOM_SIZES.MEDIUM) {
    await bookingService.updateOne({
      ...payload,
      status: BOOKING_STATUS.APPROVED
    })
    res.send('BOOKINGS APPROVED')
    return
  }

  /** Remaining condition - Only Large rooms, In PENDING and SEMI APPROVED */
  if (payload.status === BOOKING_STATUS.PENDING) {
    await bookingService.updateOne({
      ...payload,
      status: BOOKING_STATUS.SEMIAPPROVED
    })
    res.send('BOOKINGS SEMIAPPROVED')
    return
  }

  if (payload.status === BOOKING_STATUS.SEMIAPPROVED) {
    await bookingService.updateOne({
      ...payload,
      status: BOOKING_STATUS.APPROVED
    })
    res.send('BOOKINGS APPROVED')
    return
  }
  res.send('BOOKINGS APPROVED')
}

module.exports = {
  index,
  post,
  update
}
