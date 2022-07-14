const express = require('express')
const router = express.Router()

const bookingsController = require('../controllers/bookings_controller')

router.get('/', bookingsController.index)
router.post('/', bookingsController.post)
router.put('/', bookingsController.update)

module.exports = router
