import logo from './logo.svg'
import './App.css'
import 'antd/dist/antd.css'

// import ClientApp from './components/app'
import Root from './components/root'

import configureStore from './store/store'

document.addEventListener('DOMContentLoaded', () => {
  // let store
  // if (window.currentUser) {
  //   const preloadedState = {
  //     entities: {
  //       users: { [window.currentUser.id]: window.currentUser }
  //     },
  //     session: { id: window.currentUser.id }
  //   }
  //   store = configureStore(preloadedState)
  //   delete window.currentUser
  // } else {
  //   store = configureStore()
  // }
})

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit 22<code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <Root />
      </header>
    </div>
  )
}

export default App
