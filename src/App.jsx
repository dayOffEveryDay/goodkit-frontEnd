import React, { useState } from "react";
import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import { ConfigProvider, theme as antdTheme } from "antd";

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ConfigProvider
      theme={{ algorithm: theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm }}
    >
      <Routes>
        {/* 首頁：登入頁*/}
        <Route path="/" element={<LoginPage />} />


        {/* 發布者：任務管理頁 */}
        <Route path="/mainPage" element={<HomePage theme={theme} setTheme={setTheme} />} />

      </Routes>
    </ConfigProvider>

  );
}

export default App
