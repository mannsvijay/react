import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

function MyApp(){
  return (
    <div>
      <h1>Custom App || MANAN </h1>
    </div>
  )
}

// const ReactElement = {
//     type : 'a',
//     props: {
//         href : 'https://www.google.com',
//         target : '_blank'
//     },
//     children : "google"
// } 

const anotherElement = (
  <a href='https://www.google.com/' target='_blank'>Visit Google</a>
)

const reactELement = React.createElement(
  'a',
  {href : 'https://www.google.com/' , target : '_blank'}, // attribute
  'Click to visit Google'
)


createRoot(document.getElementById('root'))
.render( 
    <App />
)
