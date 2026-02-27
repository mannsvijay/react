import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

const [counter,setCounterValue] = useState(5);
  
const addValue = ()=>{
  setCounterValue(counter +1);
}

const subtractValue = ()=>{
  setCounterValue(counter -1);
}

  return (
    <>
      <h1>Counter App | Manan</h1>
      <h2>counter value : {counter}</h2>
      <button onClick={addValue}>Increment</button>
      <br /> <br />
      <button onClick={subtractValue}>Decrement</button>
      <p> the value of counter is {counter} </p>
    </>
  )
}

export default App
