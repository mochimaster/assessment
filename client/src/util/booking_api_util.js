const axios = require('axios').default

export const getBookings = async () => {
  try {
    const { data } = await axios.get('/api/bookings')
    return data
  } catch (error) {
    console.error(error)
  }
}

export const saveBooking = async (payload) => {
  console.log('API UTIL saveBooking ', payload)
  try {
    const { data } = await axios.post('/api/bookings', payload)
    return data
  } catch (error) {
    console.error(error)
  }
}
