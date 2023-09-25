import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className='h-[90dvh] flex flex-col justify-center items-center'>
      <h2>Kam krle bhai</h2>
      <Link to={'/dashboard'}>Yeha ja k dekh kya kya rehta hai</Link>
    </div>
  )
}
//mongodb+srv://jastagar:7CvZD86doM3rp8gU@cluster0.azgdi.mongodb.net/