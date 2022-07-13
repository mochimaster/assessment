import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table, Space } from 'antd'
import moment from 'moment'

import { getBookings } from '../../util/booking_api_util'

const columns = [
  {
    title: 'Room ID',
    dataIndex: 'room_id',
    key: 'room_id'
  },
  {
    title: 'Requester ID',
    dataIndex: 'requester_id',
    key: 'requester_id'
  },
  {
    title: 'Booking Time',
    dataIndex: 'timeslot_from',
    key: 'timeslot_from',
    render: (_, record) =>
      moment(new Date(parseInt(record.timeslot_from))).format(
        'MMMM Do YYYY, h:mm:ss a'
      )
  },
  {
    title: 'Booking Time',
    dataIndex: 'timeslot_to',
    key: 'timeslot_to',
    render: (_, record) =>
      moment(new Date(parseInt(record.timeslot_to))).format(
        'MMMM Do YYYY, h:mm:ss a'
      )
  },
  {
    title: 'Requested At',
    dataIndex: 'created_date',
    key: 'created_date',
    render: (_, record) =>
      moment(new Date(record.created_date)).format('MMMM Do YYYY, h:mm:ss a')
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Approver',
    dataIndex: 'approver_id',
    key: 'approver_id'
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => {
      if (record.status !== 'pending') return
      return (
        <Space size="middle">
          <a>Approve {record.name}</a>
          <a>Deny</a>
        </Space>
      )
    }
  }
]

export const BookingIndex = (userId = 1) => {
  const [data, setData] = useState([])

  useEffect(() => {
    getBookings().then((bookings) => {
      console.log('FETCHED bookings: ', bookings)
      setData(bookings)
    })
  }, [])

  return (
    <div>
      <Link to="/">Back to Rooms</Link>
      <p>Booking Approval Page</p>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}
