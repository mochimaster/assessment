import { Button, Popover, Popconfirm, Alert } from 'antd'
import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import styled from 'styled-components'
import { isEmpty } from 'lodash'

import { AppContext } from '../context'
import { getRooms } from '../../util/room_api_util'
import {
  saveBooking,
  getApprovedBookingsByRoomId
} from '../../util/booking_api_util'

import { RangePickerWithTime } from '../RangerPickerWithTime'

const BUTTON_BACKGROUND_COLOR = {
  small: 'green',
  medium: 'yellow',
  large: 'red'
}

const StyledButton = styled(Button)`
  background-color: ${({ size }) => BUTTON_BACKGROUND_COLOR[size]};
  color: black;
`

const transformPayload = (booking) => {
  return {
    ...booking,
    timeslot_from: booking.timeslotFrom.unix(),
    timeslot_to: booking.timeslotTo.unix()
  }
}

export const RoomIndex = () => {
  const { user } = useContext(AppContext)

  const [rooms, setRooms] = useState([])

  const [form, setForm] = useState({})

  const [range, setRangePicker] = useState([])

  const [unavailableRanges, setUnavailableRanges] = useState([])
  console.log('unavailableRanges', unavailableRanges)
  const [isSelectedRangeConflict, setIsSelectedRangeConflict] = useState(false)

  const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false)

  useEffect(() => {
    setForm({ ...form, timeslotFrom: range[0], timeslotTo: range[1] })
  }, [range])

  const handleClick = async () => {
    console.log('CLICKED BOOK, ', form)
    await saveBooking(transformPayload(form))
    setDisplaySuccessAlert(true)
  }

  useEffect(() => {
    getRooms().then((rooms) => {
      console.log('then of rooms: ', rooms)
      setRooms(rooms)
    })
  }, [])

  const convertUnixStringToDateTimeFormat = (string) =>
    moment.unix(string).format('MM/DD/YY HH:mm')

  const getRoomContent = (room) => {
    const isDateSelected = form.timeslotFrom && form.timeslotTo

    return (
      <div>
        <p>Location: {room.location}</p>
        <p>Size: {room.size}</p>
        <p>Select Booking Time</p>
        <RangePickerWithTime
          setRangePicker={setRangePicker}
          unavailableRanges={unavailableRanges}
          setIsSelectedRangeConflict={setIsSelectedRangeConflict}
        />
        <br />
        <br />
        <Popconfirm
          title="Confirm Booking"
          onConfirm={handleClick}
          onVisibleChange={() => console.log('visible change')}
          disabled={!isDateSelected || isSelectedRangeConflict}
        >
          {isSelectedRangeConflict && (
            <Alert
              message="Selected Range is already booked."
              type="error"
              closable
            />
          )}
          <Button disabled={!isDateSelected || isSelectedRangeConflict}>
            BOOK
          </Button>
        </Popconfirm>
        <br />
        <br />
        {unavailableRanges.length > 0 && (
          <div>
            Booked times:
            <div>
              {unavailableRanges.map((range) => (
                <li>
                  From: {convertUnixStringToDateTimeFormat(range[0])}, To:
                  {convertUnixStringToDateTimeFormat(range[1])}
                </li>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  if (isEmpty(user)) return <></>
  return (
    <>
      <Link to={'/booking'}>View Room Bookings</Link>
      {displaySuccessAlert && (
        <Alert message="Room booked successfully" type="success" closable />
      )}
      <ul>
        {rooms.map((room) => (
          <div key={room.id}>
            <Popover
              content={getRoomContent(room)}
              title={room.name}
              trigger="click"
              onVisibleChange={(isVisible) => {
                if (isVisible) setForm(room)
              }}
              onClick={async () => {
                const bookedRanges = await getApprovedBookingsByRoomId(room.id)

                setUnavailableRanges(bookedRanges)
              }}
            >
              <StyledButton type="primary" size={room.size}>
                {room.name}
              </StyledButton>
            </Popover>
          </div>
        ))}
      </ul>
    </>
  )
}
