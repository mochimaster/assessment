import { Route, Switch, Link, Redirect } from 'react-router-dom'

import { RoomIndex } from './room_index/room_index'
import { BookingIndex } from './booking_index/booking_index'

const App = () => {
  return (
    <div>
      <Route exact path='/booking'>
        <Link to={'/booking'}>Bookings Page</Link>
      </Route>
      <Switch>
        <Route path="/booking" component={BookingIndex} />
        <Route path="/" component={RoomIndex} />
      </Switch>
    </div>
  )
}

export default App
