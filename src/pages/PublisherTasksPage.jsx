// src/pages/PublisherTasksPage.jsx
import React, { useEffect, useState } from "react"
import { Button, List, Typography } from "antd"
// 之後你可以從這裡引入 API：import { getTaskTemplates, createTaskTemplate } from "@/api/tasks"

const { Title } = Typography

function PublisherTasksPage() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    // TODO: 之後改成呼叫後端 API 拿任務模板列表
    setTasks([
      { id: 1, title: "每天刷牙", points: 5, frequency: "DAILY" },
      { id: 2, title: "每週整理房間", points: 20, frequency: "WEEKLY" },
    ])
  }, [])

  const handleAddTask = () => {
    // TODO: 這裡之後可以開 Modal 讓父母輸入任務內容，再呼叫 createTaskTemplate
    console.log("新增任務（之後接 modal + API）")
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>發布者：任務管理</Title>

      <Button type="primary" onClick={handleAddTask} style={{ marginBottom: 16 }}>
        新增任務
      </Button>

      <List
        bordered
        dataSource={tasks}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={`${item.title}（+${item.points} 分）`}
              description={`頻率：${item.frequency}`}
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default PublisherTasksPage
