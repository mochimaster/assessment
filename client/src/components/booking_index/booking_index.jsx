import { useEffect, useState, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Table, Space, Button } from 'antd'
import moment from 'moment'

import { isEmpty } from 'lodash'

import { AppContext } from '../context'

import { getBookings, updateBooking } from '../../util/booking_api_util'
import { BOOKING_STATUS, ROLES, ROOM_SIZES } from '../../helper/constants'

export const BookingIndex = () => {
  const { user } = useContext(AppContext)

  const [data, setData] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    getBookings().then((bookings) => setData(bookings))
  }, [])

  useEffect(() => {
    if (refresh) {
      getBookings().then((bookings) => setData(bookings))
      setRefresh(false)
    }
  }, [refresh])

  const canApprove =
    user.role === ROLES.ADMIN || user.role === ROLES['FACILITY MANAGER']

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Room',
      dataIndex: 'room_name',
      key: 'room_name'
    },
    {
      title: 'Requester',
      dataIndex: 'requester_name',
      key: 'requester_name'
    },
    {
      title: 'Booking Time From',
      dataIndex: 'timeslot_from',
      key: 'timeslot_from',
      render: (_, record) =>
        moment(new Date(parseInt(record.timeslot_from) * 1000)).format(
          'MMMM Do YYYY, h:mm:ss a'
        )
    },
    {
      title: 'Booking Time To',
      dataIndex: 'timeslot_to',
      key: 'timeslot_to',
      render: (_, record) =>
        moment(new Date(parseInt(record.timeslot_to) * 1000)).format(
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
      title: 'Size',
      dataIndex: 'size',
      key: 'size'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status = '' }) => BOOKING_STATUS[status]
    },
    {
      title: 'Admin Reviewer',
      dataIndex: 'approver_name',
      key: 'approver_name'
    },
    {
      title: 'Facility Manager Reviewer',
      dataIndex: 'manager_approver_name',
      key: 'manager_approver_name'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const isApprovalNeeded = [
          BOOKING_STATUS['SEMI APPROVED'],
          BOOKING_STATUS.PENDING
        ].includes(record.status)

        if (record.size === ROOM_SIZES.LARGE && isApprovalNeeded) {
          if (
            user.role === ROLES['FACILITY MANAGER'] &&
            record.manager_approver_id !== null
          ) {
            return
          }

          if (user.role === ROLES.ADMIN && record.approver_id !== null) {
            return
          }
        }

        const approverDetails =
          user.role === ROLES['FACILITY MANAGER']
            ? { managerApproverId: user.id }
            : { approverId: user.id }

        return (
          <Space size="middle" style={{ minWidth: 250 }}>
            {canApprove && isApprovalNeeded && (
              <>
                <Button
                  onClick={async () => {
                    await updateBooking({
                      ...record,
                      ...approverDetails
                    })
                    setRefresh(true)
                  }}
                >
                  Approve
                </Button>
                <Button
                  onClick={async () => {
                    await updateBooking({
                      ...record,
                      ...approverDetails,
                      status: BOOKING_STATUS.DENIED
                    })
                    setRefresh(true)
                  }}
                >
                  Deny
                </Button>
              </>
            )}
          </Space>
        )
      }
    }
  ]

  if (isEmpty(user)) return <Redirect to="/" />

  return (
    <div>
      <Link style={{ display: 'flex' }} to="/">
        Back to Rooms
      </Link>
      <p>Manage Room Bookings</p>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}
