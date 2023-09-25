import React from 'react'
import useUser from '../../contexts/userContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {

    const {authStatus,setAuth, setUser} = useUser()
    const navigate = useNavigate()

    function logout(){
        setAuth(false)
        setUser(null)
        localStorage.setItem("authToken","")
        navigate('/login')
    }
    return (
        <nav className='flex justify-center items-center border-b-2 sticky top-0 bg-white z-20'>
            <div className='p-4 text-xl'>
                <Link to={'/'}>Home</Link>
            </div>
            {
                !authStatus
                    ?(  <div  className='p-4 text-xl'>
                        <Link to={'/login'}>Login/Signup</Link>
                        </div>)
                    :(<>
                        <div  className='p-4 text-xl'>
                            <Link to={'/dashboard'}>Dashboard</Link>
                        </div>
                        <div  className='p-4 text-xl'>
                            <Link to={'/profile'}>Profile</Link>
                        </div>

                        <div className='flex-grow flex justify-end'>
                            <button onClick={logout}
                                className='
                                    mx-4 
                                    my-2 
                                    rounded
                                    bg-yellow-400
                                    text-xl
                                    px-3
                                    py-2'
                            >
                                Logout
                            </button>
                        </div>
                    </>)
            }
        </nav>
    )
}
