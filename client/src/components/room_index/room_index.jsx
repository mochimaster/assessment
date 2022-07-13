import { Button, Popover, DatePicker, Popconfirm } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'

import { getRooms } from '../../util/room_api_util'
import { saveBooking } from '../../util/booking_api_util'

import { RoomIndexItem } from '../room_index_item/room_index_item'

const { RangePicker } = DatePicker

const RangePickerWithTime = ({ setRangePicker }) => {
  console.log('RangePickerWithTime: ', setRangePicker)
  const onChange = (dates, dateStrings) => {
    if (dates) {
      //   console.log('From: ', dates[0], ', to: ', dates[1])
      //   console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    } else {
      //   console.log('Clear')
    }
  }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'days').endOf('day')
  }

  const handleRangePickerOk = (range) => {
    // console.log('handleRangePickerOk range: ', range)
    // console.log('handleRangePickerOk from: ', from)
    // console.log('handleRangePickerOk to : ', to)
    setRangePicker(range)
  }

  return (
    <RangePicker
      disabledDate={disabledDate}
      //   ranges={{
      //     Today: [moment(), moment()]
      //   }}
      showTime
      format="YYYY/MM/DD HH:mm"
      onChange={onChange}
      minuteStep={30}
      onOk={handleRangePickerOk}
    />
  )
}

const transformPayload = (booking) => {
  return {
    ...booking,
    timeslot_from: booking.timeslotFrom.unix(),
    timeslot_to: booking.timeslotTo.unix()
  }
}

export const RoomIndex = () => {
  const [rooms, setRooms] = useState([])

  const [form, setForm] = useState({})

  const [range, setRangePicker] = useState([])

  useEffect(() => {
    setForm({ ...form, timeslotFrom: range[0], timeslotTo: range[1] })
  }, [range])

  const handleClick = async () => {
    console.log('CLICKED BOOK, ', form)
    await saveBooking(transformPayload(form))
  }

  useEffect(() => {
    getRooms().then((rooms) => {
      console.log('then of rooms: ', rooms)
      setRooms(rooms)
    })
  }, [])

  const getRoomContent = (room) => {
    const isDateSelected = form.timeslotFrom && form.timeslotTo

    return (
      <div>
        <p>Location: {room.location}</p>
        <p>Size: {room.size}</p>
        <p>Select Booking Time</p>
        <RangePickerWithTime setRangePicker={setRangePicker} />
        <br />
        <br />
        <Popconfirm
          title="Confirm Booking"
          onConfirm={handleClick}
          onVisibleChange={() => console.log('visible change')}
          disabled={!isDateSelected}
        >
          <Button disabled={!isDateSelected}>BOOK</Button>
        </Popconfirm>
      </div>
    )
  }

  return (
    <ul>
      {rooms.map((room) => (
        <Popover
          content={getRoomContent(room)}
          title={room.name}
          trigger="click"
          onVisibleChange={(isVisible) => {
            if (isVisible) setForm(room)
          }}
        >
          <Button type="primary">{room.name}</Button>
        </Popover>
      ))}
    </ul>
  )
}
