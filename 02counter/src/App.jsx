import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

const [counter,setCounterValue] = useState(5);
  
const addValue = ()=>{
  setCounterValue(counter +1);
  // setCounterValue(counter => counter+1);
  // setCounterValue(counter => counter+1);
  // setCounterValue(counter => counter+1);
  // setCounterValue(counter => counter+1);


}

const subtractValue = () =>{
  if(counter < 1) {
    let newValue = 0;
    setCounterValue(newValue);
    return;
  }
  setCounterValue(counter -1);
}

const resetValue = ()=>{
  let  newValue = 0;
  setCounterValue(newValue);
}

const makeWeird = ()=>{
  // let  newValue = 67  ;
  // setCounterValue(newValue);
  alert("CHAL LAWDE")
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
