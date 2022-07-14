const axios = require('axios').default

export const createSession = async (payload) => {
  try {
    const { data } = await axios.post('/api/users', payload)
    return data
  } catch (error) {
    console.error(error)
  }
}
