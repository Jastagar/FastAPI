import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
  MDBCheckbox
}from 'mdb-react-ui-kit';
import "./LoginSignup.css"
import { login, signup } from '../../../server/server';
import useUser from '../../../contexts/userContext'

export default function LoginSignup() {
  const [justifyActive, setJustifyActive] = useState('tab1');

  const {setUser,setAuth} = useUser()
  const navigate = useNavigate()

  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [rememberMe,setRememberMe] = useState(false)
  const [agreedToTerms,setAgreedToTerms] = useState(false)
  const [cPassword,setCPassword] = useState('')
  const [email,setEmail] = useState('')
  

  async function handleLoginSubmit(e){
    e.preventDefault()
    const dataToSend ={
      email:email,
      password,
      remember: rememberMe
    }
    console.log(dataToSend)
    const res = await login(dataToSend)
    if(res.error){
      alert(res.message)
      return
    }
    localStorage.setItem("authToken",res.token_type+" "+res.token)

    setUser(res.user)
    setAuth(true)
    console.log("Res",res)
    navigate('/dashboard')

  }
  async function handleSignUpSubmit(e){
    e.preventDefault()
    if(password!==cPassword){
      alert("Passwords did not match, Try again")
      setCPassword('')
      return
    }
    const dataToSend ={
      name:username,
      email,
      password
    }
    const res = await signup(dataToSend)
    console.log("SignUp res",res)
    if(res.error){
      alert(res.message)
      return
    }
    setEmail(res.email)
    setJustifyActive('tab1')


  }


  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
  
    setJustifyActive(value);
  };
  return (
    <MDBContainer className="p-3 my-5 flex flex-col w-50">
      <MDBTabs pills justify className='mb-3 flex justify-between'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
            Sign Up
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>

        <MDBTabsPane show={justifyActive === 'tab1'}>
          <div className="text-center mb-3">
            <p>Login:</p>
          </div>
          <form onSubmit={handleLoginSubmit}>
            <MDBInput value={email} onChange={(e)=>{setEmail(e.target.value)}} 
              wrapperClass='mb-4' label='Email address' type='email'/>
            <MDBInput value={password} onChange={(e)=>{setPassword(e.target.value)}}
              wrapperClass='mb-4' label='Password' type='password'/>
            <MDBCheckbox checked={rememberMe} onChange={(e)=>{setRememberMe(!rememberMe)}}
              wrapperClass='mb-4' label='Remember me' type='checkbox'/>
          
            <MDBBtn type='submit' className="mb-4 w-100">Sign in</MDBBtn>
            <p className="text-center">Not a member? <button type='button' onClick={() => handleJustifyClick('tab2')}>Register</button></p>
          </form>
        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === 'tab2'}>

          <form onSubmit={handleSignUpSubmit}>
            <MDBInput value={username} onChange={(e)=>{setUsername(e.target.value)}}
              wrapperClass='mb-4' label='Username' type='text'/>
            <MDBInput value={email} onChange={(e)=>{setEmail(e.target.value)}}
              wrapperClass='mb-4' label='Email' type='email'/>
            <MDBInput value={password} onChange={(e)=>{setPassword(e.target.value)}}
              wrapperClass='mb-4' label='Password' type='password'/>
            <MDBInput value={cPassword} onChange={(e)=>{setCPassword(e.target.value)}}
              wrapperClass='mb-4' label='Confirm Password' type='password'/>

            <div className='flex flex-col justify-center mb-4'>
              <MDBCheckbox checked={agreedToTerms} onChange={()=>{setAgreedToTerms(!agreedToTerms)}} name='flexCheck' id='flexCheckDefault' label='I have read and agree to the terms' />
              <p className="text-center">Already a member? <button type='button' onClick={() => handleJustifyClick('tab1')}>Login</button></p>
            </div>

            <MDBBtn type='submit' className="mb-4 w-100">Sign up</MDBBtn>
          </form>

        </MDBTabsPane>

      </MDBTabsContent>

    </MDBContainer>
  )
}