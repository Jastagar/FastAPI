import React, { useContext, useEffect, useState } from 'react'
import { verifyAuth } from '../server/server'

const userContext = React.createContext(null)

export default function useUser(){
    return useContext(userContext)
}

export function UserContext(props) {

    const [auth,setAuth] = useState(false)
    const [user,setUser] = useState(null)

    useEffect(()=>{
        if(!auth){
            verifyAuth().then(e =>{
                setAuth(e.authStatus)
            }).catch(alert)
        }
    },[])

    const val={
        authStatus:auth,
        user,
        setAuth,
        setUser
    }

    return (
        <userContext.Provider value={val}>
            {props.children}
        </userContext.Provider>
    )
}
