// src/pages/ExecutorTasksPage.jsx
import React, { useEffect, useState } from "react"
import { List, Checkbox, Typography } from "antd"
// 之後可以接 API：import { getMyTodayTasks, completeTask } from "@/api/tasks"

const { Title } = Typography

function ExecutorTasksPage() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    // TODO: 之後這裡改成呼叫後端 getMyTodayTasks()
    setTasks([
      { id: 1, title: "刷牙", points: 5, done: false },
      { id: 2, title: "寫功課 30 分鐘", points: 10, done: false },
    ])
  }, [])

  const handleToggleDone = (taskId) => {
    // TODO: 呼叫 completeTask(taskId) 然後重新載入任務列表
    console.log("完成任務 id =", taskId)
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>執行者：今日任務</Title>

      <List
        bordered
        dataSource={tasks}
        renderItem={(item) => (
          <List.Item>
            <Checkbox
              checked={item.done}
              onChange={() => handleToggleDone(item.id)}
            >
              {item.title}（+{item.points} 分）
            </Checkbox>
          </List.Item>
        )}
      />
    </div>
  )
}

export default ExecutorTasksPage
