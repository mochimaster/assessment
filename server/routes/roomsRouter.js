const express = require('express')
const router = express.Router()

const roomsController = require('../controllers/rooms_controller')

router.get('/', roomsController.index)

module.exports = router
