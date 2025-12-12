// src/pages/ExecutorBindPage.jsx
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Input, Button, Typography } from "antd"
// 之後可以接 API：import { bindPublisher } from "@/api/family"

const { Title, Paragraph } = Typography

function ExecutorBindPage() {
  const [code, setCode] = useState("")
  const navigate = useNavigate()

  const handleBind = () => {
    if (!code.trim()) return

    // TODO: 之後改成呼叫後端：bindPublisher({ code })
    console.log("綁定發布者代碼：", code)

    // 假裝綁定成功，導到任務列表
    navigate("/executor/tasks")
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
      <Card style={{ width: 420 }}>
        <Title level={3}>執行者：綁定發布者</Title>
        <Paragraph type="secondary">
          請輸入父母提供給你的「發布者代碼」，以便系統知道你屬於哪位發布者。
        </Paragraph>

        <Input
          placeholder="請輸入發布者代碼"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ marginTop: 16, marginBottom: 16 }}
        />

        <Button type="primary" block onClick={handleBind}>
          確認綁定
        </Button>
      </Card>
    </div>
  )
}

export default ExecutorBindPage
