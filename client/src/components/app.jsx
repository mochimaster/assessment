import { useState } from 'react'
import { Route, Switch, Link, Redirect } from 'react-router-dom'

import { AppContext } from './context'

import { RoomIndex } from './room_index/room_index'
import { BookingIndex } from './booking_index/booking_index'
import { UserShow } from './user_show/user_show'

export const USER_ACTION = {
  ADD_USER: 'ADD_USER',
  REMOVE_USER: 'REMOVE_USER'
}

const App = () => {
  const [user, setUser] = useState({})

  const dispatchUserEvent = (actionType, payload) => {
    console.log('dispatchUserEvent actionType: ', actionType)
    console.log('dispatchUserEvent payload: ', payload)

    switch (actionType) {
      case USER_ACTION.ADD_USER:
        setUser(payload)
        return
      case USER_ACTION.REMOVE_USER:
        setUser({})
        return
      default:
        return {}
    }
  }

  return (
    <div>
      <AppContext.Provider value={{ user, dispatchUserEvent }}>
        <Route path="/" component={UserShow} />
        <Route exact path="/booking">
        </Route>
        <Switch>
          <Route path="/booking" component={BookingIndex} />
          <Route path="/" component={RoomIndex} />
        </Switch>
      </AppContext.Provider>
    </div>
  )
}

export default App
