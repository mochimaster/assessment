const db = require('../helper/db')

const getAll = () =>
  db.query(
    `SELECT b.*, 
    r.name AS room_name, 
    r.size AS size,
    u1.name AS requester_name, 
    u2.name AS approver_name, 
    u2.role AS approver_role,
    u3.name AS manager_approver_name
    FROM bookings b 
    JOIN rooms r
    ON b.room_id = r.id
    LEFT JOIN users u1
    ON b.requester_id = u1.id
    LEFT JOIN users u2
    ON b.approver_id = u2.id
    LEFT JOIN users u3
    ON b.manager_approver_id = u3.id
    ORDER BY 1 DESC`
  )

const getOne = async (id) => {
  const data = await db.query(`SELECT * FROM bookings WHERE id=${id}`)

  return data ? data[0] : data
}

const saveOne = (body) =>
  db.query(
    `INSERT INTO bookings(room_id, timeslot_from, timeslot_to, requester_id, status) 
    VALUES(${body.id}, ${body.timeslot_from}, ${body.timeslot_to}, 1, '${body.status}')`
  )

const updateOne = (body) =>
  body.approver_id
    ? db.query(
        `UPDATE bookings SET status='${body.status}', approver_id=(${body.approver_id}) WHERE id=(${body.id})`
      )
    : db.query(
        `UPDATE bookings SET status='${body.status}', manager_approver_id=(${body.manager_approver_id}) WHERE id=(${body.id})`
      )

module.exports = {
  getAll,
  getOne,
  saveOne,
  updateOne
}
