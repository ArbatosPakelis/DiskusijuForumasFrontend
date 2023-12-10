import React from 'react'
import { useEffect, useState } from 'react'
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Signup/SignupPage';
import ThreadList from './pages/ThreadList';
import CommentSection from './pages/CommentSection';
import UsersPage from './pages/UsersPage';
import Unauthorized from './pages/Problems/Unauthorized';
import ErrorPage from './pages/Problems/ErrorPage';

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