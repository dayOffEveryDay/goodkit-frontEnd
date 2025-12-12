import React from "react"
import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RoleSelectPage from "./pages/RoleSelectPage"
import PublisherTasksPage from "./pages/PublisherTasksPage"
import ExecutorBindPage from "./pages/ExecutorBindPage"
import ExecutorTasksPage from "./pages/ExecutorTasksPage"

function App() {
  return (
    <Routes>
      {/* 首頁：登入頁（現在的 App.jsx 畫面可以搬去 LoginPage） */}
      <Route path="/" element={<LoginPage />} />

      {/* 第一層：角色選擇 */}
      <Route path="/role-select" element={<RoleSelectPage />} />

      {/* 發布者：任務管理頁 */}
      <Route path="/publisher/tasks" element={<PublisherTasksPage />} />

      {/* 執行者：綁定發布者 + 任務列表 */}
      <Route path="/executor/bind" element={<ExecutorBindPage />} />
      <Route path="/executor/tasks" element={<ExecutorTasksPage />} />
    </Routes>
  )
}

export default App
