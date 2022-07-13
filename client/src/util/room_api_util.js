const axios = require('axios').default

export const getRooms = async () => {
  try {
    const { data } = await axios.get('/api/rooms')
    return data
  } catch (error) {
    console.error(error)
  }
}

