import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Room from './components/Room.jsx'
import CreateRoom from './components/CreateRoom.jsx'
import JoinUser from './components/JoinUser.jsx'
import Third from './components/third.jsx'

const  router = createBrowserRouter([
  {
  path:'/',
  element:<CreateRoom />
 },
 {
  path:':roomID',
  element:<Room />
 },
 {
  path:'/joinRoom',
  element:<JoinUser />
 },
 {
  path:'/third',
  element:<Third />
 }

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
