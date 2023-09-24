import React from "react";
import {Route, Routes, BrowserRouter as Router, Outlet, Navigate} from "react-router-dom"
import Home from "./pages/unprotected/home/Home.jsx";
import LoginSignup from "./pages/unprotected/loginSignup/LoginSignup.jsx";
import Dashboard from "./pages/protected/dashboard/Dashboard.jsx";
import Profile from "./pages/protected/profile/Profile";
import useUser from "./contexts/userContext";
import Navbar from "./components/Navbar/Navbar.jsx";


function ProtectedRoutes(){
  const {authStatus} = useUser()

  return (
    <>{authStatus
        ? <Outlet/>
        : <Navigate to="/login" />
     }</>
  )
}
function UnProtectedRoutes(){
  const {authStatus} = useUser()

  return (
    <>{authStatus
        ? <Navigate to="/dashboard" />
        : <Outlet/>
     }</>
  )
}

export default function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
            {/* SafeRoutes */}
            <Route path="/" element={<Home/>} exact/>
            
            {/*UnProtected Routes*/}
            <Route element={<UnProtectedRoutes/>}>
              <Route path="/login" element={<LoginSignup />} exact/>
            </Route>
            
            {/*Protected Routes*/}
            <Route element={<ProtectedRoutes/>}>
              <Route path="/dashboard" element={<Dashboard />} exact/>
              <Route path="/profile" element={<Profile />} exact/>
            </Route>
        </Routes>
      </Router>
    </div>
  );
}
