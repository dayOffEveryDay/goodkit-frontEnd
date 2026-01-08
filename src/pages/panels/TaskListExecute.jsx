import React from "react";
import { Button, Popconfirm, Space } from "antd";
import TaskListBase from "./TaskListBase";

export default function TaskListExecute({ items = [], actions = {} }) {
  const { onSubmitTask, onWithdrawTask, submittingId } = actions;

  return (
    <TaskListBase
      items={items}
      renderExtra={(t) => (
        <Space>
          {!t.submitted ? (
            <Button
              type="primary"
              size="small"
              loading={submittingId === t.taskId}
              onClick={() => onSubmitTask?.(t.taskId)}
            >
              完成提交
            </Button>
          ) : (
            <Space>
              <Button size="small" disabled>
                已提交
              </Button>
              <Popconfirm
                title="撤回提交？"
                okText="撤回"
                cancelText="取消"
                onConfirm={() => onWithdrawTask?.(t.taskId)}
              >
                <Button danger size="small" loading={submittingId === t.taskId}>
                  撤回
                </Button>
              </Popconfirm>
            </Space>
          )}
        </Space>
      )}
    />
  );
}
