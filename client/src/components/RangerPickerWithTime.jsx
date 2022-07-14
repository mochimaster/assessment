import { DatePicker } from 'antd'
import moment from 'moment'

const { RangePicker } = DatePicker

const isMomentConflicted = (targetMoment, bookedRanges = []) => {
  let isConflict = false
  bookedRanges.forEach((range) => {
    const bookedFromUnix = moment.unix(range[0])
    const bookedToUnix = moment.unix(range[1])
    const isBetween = targetMoment.isBetween(bookedFromUnix, bookedToUnix)

    if (isBetween) isConflict = true
  })
  return isConflict
}

export const RangePickerWithTime = ({
  setRangePicker,
  unavailableRanges,
  setIsSelectedRangeConflict
}) => {
  const onChange = (dates) => {
    if (dates) {
      const isBeforeDateConflict = isMomentConflicted(
        dates[0],
        unavailableRanges
      )

      const isAfterDateConflict = isMomentConflicted(
        dates[1],
        unavailableRanges
      )

      if (isBeforeDateConflict || isAfterDateConflict) {
        setIsSelectedRangeConflict(true)
      } else {
        setIsSelectedRangeConflict(false)
      }
    }
  }

  const disabledDate = (current) =>
    current && current < moment().subtract(1, 'days').endOf('day')

  const handleRangePickerOk = (range) => setRangePicker(range)

  return (
    <RangePicker
      showTime
      minuteStep={30}
      format="YYYY/MM/DD HH:mm"
      disabledDate={disabledDate}
      onChange={onChange}
      onOk={handleRangePickerOk}
    />
  )
}
