import { useMemo, useState } from "react";
import { List, Typography, Space, Button, Modal, Input, Tag } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function TaskList({ items = [], ctx = {} }) {
    const { showSubmit, onSubmitTask, onWithdrawTask, submittingId } = ctx;
    return (
        <List
            dataSource={items}
            locale={{ emptyText: "目前沒有任務" }}
            renderItem={(t) => (
                <List.Item
                    key={t.taskId}
                    style={{ background: "var(--bg-card)", color: "var(--text-main)" }}
                    extra={
                        <Space>
                            <Text strong style={{ color: "var(--text-main)" }}>
                                {t.taskReward ? `+${t.taskReward}` : ""}
                            </Text>

                            {showSubmit && !t.submitted && (
                                <Button
                                    type="primary"
                                    size="small"
                                    loading={submittingId === t.taskId}
                                    onClick={() => onSubmitTask?.(t.taskId)}
                                >
                                    完成提交
                                </Button>
                            )}

                            {showSubmit && t.submitted && (
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
                    }
                >
                    <List.Item.Meta
                        title={
                            <Space>
                                <Text strong style={{ color: "var(--text-main)" }}>{t.taskContent}</Text>
                                {t.taskType && <Tag>{t.taskType}</Tag>}
                            </Space>
                        }
                        description={
                            t.taskFrom ? (
                                <Text style={{ color: "var(--text-sub)" }}>{`來自 ${t.taskFrom}`}</Text>
                            ) : null
                        }
                    />
                </List.Item>
            )}
        />
    );
}