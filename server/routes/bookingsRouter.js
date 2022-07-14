const express = require('express')
const router = express.Router()

const bookingsController = require('../controllers/bookings_controller')

router.get('/', bookingsController.index)
router.post('/', bookingsController.post)
router.put('/', bookingsController.update)
router.get('/room-id/:id', bookingsController.getApprovedBookingsByRoomId)

module.exports = router
