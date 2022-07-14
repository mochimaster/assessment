BOOKING_STATUS = Object.freeze({
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  DENIED: 'DENIED',
  SEMIAPPROVED: 'SEMI APPROVED'
})

ROOM_SIZES = Object.freeze({
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
})

ROLES = Object.freeze({
  MEMBER: 'MEMBER',
  ADMIN: 'ADMIN',
  'FACILITY MANAGER': 'FACILITY MANAGER'
})

module.exports = {
  BOOKING_STATUS,
  ROOM_SIZES,
  ROLES
}
