import React from 'react'
import "./dashboardcss.css"
import useUser from '../../../contexts/userContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {

  const {setAuth, setUser} = useUser()
  const navigate = useNavigate()

  function logout(){
    setAuth(false)
    setUser(null)
    localStorage.setItem("authToken","")
    navigate('/login')
  }
  
  return (
    <div className='text-red-500'>
        <button onClick={logout} type='button'>LOGOUT</button>
        WELCOME TO THE DASHBOARD!!!!!!!!!!!
    </div>
  )
}
