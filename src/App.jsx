import React from "react"
import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"

function App() {
  return (
    <Routes>
      {/* 首頁：登入頁（現在的 App.jsx 畫面可以搬去 LoginPage） */}
      <Route path="/" element={<LoginPage />} />


      {/* 發布者：任務管理頁 */}
      <Route path="/mainPage" element={<HomePage />} />

    </Routes>
  )
}

export default App
