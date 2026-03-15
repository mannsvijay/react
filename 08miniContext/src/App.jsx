import { useState } from 'react'
import UserContextProvider from './context/UserContextProvider'
import './App.css'

function App() {

  return (
    <UserContextProvider>
      <h1> Manan Vijay</h1>
    </UserContextProvider>
  )
}

export default App
