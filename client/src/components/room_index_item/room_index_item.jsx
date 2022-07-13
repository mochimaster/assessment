export const RoomIndexItem = (room) => {
  console.log('RoomIndexItem room: ', room)
  return (
    <li>
      <div>{room.name}</div>
      <div>{room.size}</div>
      <div>{room.location}</div>
    </li>
  )
}
