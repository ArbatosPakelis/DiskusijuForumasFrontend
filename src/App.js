import React from 'react'
import { useEffect, useState } from 'react'
import RequireAuth from './components/RequireAuth.js';
import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import SignupPage from './pages/Signup/SignupPage.jsx';
import ThreadList from './pages/ThreadList.jsx';
import CommentSection from './pages/CommentSection.jsx';
import UsersPage from './pages/UsersPage.jsx';
import Unauthorized from './pages/Problems/Unauthorized.jsx';
import ErrorPage from './pages/Problems/ErrorPage.jsx';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/Login" element={<LoginPage/>}/>
        <Route path="/Signup" element={<SignupPage/>}/>
        <Route path="/Threads/:id" element={<ThreadList/>}/>
        <Route path="/Comments/:id" element={<CommentSection/>}/>
        <Route path="/Unauthorized" element={<Unauthorized/>}/>
        <Route
          path="/Users"
          element={<RequireAuth allowedRoles={["regular", "admin"]}><UsersPage /></RequireAuth>}
        />
        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
    </>
  )
}

export default App