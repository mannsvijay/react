import { useState } from "react"


function App() {
  const [color,setcolor] = useState("#EBF4DD")

  return (
    <div className="w-full h-screen duration-200"
    style={{backgroundColor : color}}
    >
     <div className="fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-4 gap-4"> 
      <div className="flex flex-wrap justify-center gap-3 shadow-lg bg-white px-4 py-2 rounded-xl"> 
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg"style={{backgroundColor : "red"}} onClick={() => setcolor("red")}>Red</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg"style={{backgroundColor : "blue"}} onClick={() => setcolor("blue")}>Blue</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg"style={{backgroundColor : "green"}} onClick={() => setcolor("green")}>Green</button>
        <button className="outline-none px-4 py-1 rounded-full text-black shadow-lg"style={{backgroundColor : "yellow"}} onClick={() => setcolor("yellow")}>Yellow</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg"style={{backgroundColor : "purple"}} onClick={() => setcolor("purple")}>Purple</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg"style={{backgroundColor : "black"}} onClick={() => setcolor("black")}>Black</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg"style={{backgroundColor : "gray"}} onClick={() => setcolor("gray")}>Gray</button>
        <button className="outline-none px-4 py-1 rounded-full text-black shadow-lg"style={{backgroundColor : "white"}} onClick={() => setcolor("white")}>White</button>
        <button className="outline-none px-4 py-1 rounded-full text-white shadow-lg"style={{backgroundColor : "orange"}} onClick={() => setcolor("orange")}>Orange</button>
        <button className="outline-none px-4 py-1 rounded-full text-gray shadow-lg"style={{backgroundColor : "pink"}} onClick={() => setcolor("pink")}>Pink</button>
      </div>
      
      </div> 

    </div>
  )
}

export default App
