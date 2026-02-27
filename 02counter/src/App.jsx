import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

const [counter,setCounterValue] = useState(5);
  
const addValue = ()=>{
  setCounterValue(counter +1);
}

const subtractValue = () =>{
  setCounterValue(counter -1);
}

const resetValue = ()=>{
  let  newValue = 0;
  setCounterValue(newValue);
}

const makeWeird = ()=>{
  let  newValue = 69;
  setCounterValue(newValue);
}



  return (
    <>
      <h1>Counter App | Manan</h1>
      <h2>counter value : {counter}</h2>
      <button onClick={addValue}>Increment</button>
      <br /> <br />
      <button onClick={subtractValue}>Decrement</button>
      <br /> <br />
      <button onClick={resetValue}>Reset</button>
      <br /> <br />
      <button onClick={makeWeird}> Make it best Number lmao</button>
      <p> the value of counter is   {counter} </p>
    </>
  )
}

export default App
