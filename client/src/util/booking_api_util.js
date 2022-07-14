const axios = require('axios').default

const columnKeyMapping = {
  approverId: 'approver_id',
  managerApproverId: 'manager_approver_id'
}

const transformObjectKey = (object, oldKeys = []) => {
  const newObject = { ...object }

  for (const oldKey of oldKeys) {
    newObject[columnKeyMapping[oldKey]] = newObject[oldKey]
    delete newObject[oldKey]
  }

  return newObject
}

export const getBookings = async () => {
  try {
    const { data } = await axios.get('/api/bookings')
    return data
  } catch (error) {
    console.error(error)
  }
}

export const saveBooking = async (payload) => {
  try {
    const { data } = await axios.post('/api/bookings', payload)
    return data
  } catch (error) {
    console.error(error)
  }
}

export const updateBooking = async (payload) => {
  const newPayload = transformObjectKey(payload, [
    'approverId',
    'managerApproverId'
  ])

  try {
    const { data } = await axios.put('/api/bookings', newPayload)
    return data
  } catch (error) {
    console.error(error)
  }
}

export const denyBooking = async (payload) => {
  const newPayload = transformObjectKey(payload, [
    'approverId',
    'managerApproverId'
  ])

  try {
    await axios.put('/api/bookings', newPayload)
    return newPayload
  } catch (error) {
    console.error(error)
  }
}
