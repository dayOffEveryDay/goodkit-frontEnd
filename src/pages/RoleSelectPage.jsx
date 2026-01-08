// src/pages/RoleSelectPage.jsx
import React from "react"
import { useNavigate } from "react-router-dom"
import { Card, Button, Typography } from "antd"

const { Title, Paragraph } = Typography

function RoleSelectPage() {
  const navigate = useNavigate()

  const handleSelectPublisher = () => {
    // 可以暫存角色資訊（之後你可以寫到後端）
    localStorage.setItem("role", "PUBLISHER")
    navigate("/publisher/tasks")
  }

  const handleSelectExecutor = () => {
    localStorage.setItem("role", "EXECUTOR")
    navigate("/executor/bind")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card style={{ width: 420, textAlign: "center" }}>
        <Title level={3}>請選擇你的角色</Title>
        <Paragraph type="secondary">
          首次登入時你的身分。
        </Paragraph>

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <Button type="primary" size="large" onClick={handleSelectPublisher}>
            我是發布者
          </Button>
          <Button size="large" onClick={handleSelectExecutor}>
            我是執行者
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default RoleSelectPage
