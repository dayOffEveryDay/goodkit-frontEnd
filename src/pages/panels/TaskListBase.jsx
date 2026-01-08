import React from "react";
import { List, Space, Tag, Typography } from "antd";

const { Text } = Typography;
export default function TaskListBase({ items = [], renderExtra, footer, showVisibilityTag = false }) {

    return (
        <List
            dataSource={items}
            locale={{ emptyText: "目前沒有任務" }}
            footer={footer}
            renderItem={(t) => (
                <List.Item
                    key={t.taskId}
                    style={{ background: "var(--bg-card)", color: "var(--text-main)" }}
                    extra={renderExtra ? renderExtra(t) : null}
                >
                    <List.Item.Meta
                        title={
                            <Space>
                                <Text strong style={{ color: "var(--text-main)" }}>
                                    {t.taskContent}
                                </Text>
                                {t.taskType && <Tag>{t.taskType}</Tag>}

                                {showVisibilityTag && (() => {
                                    const vis = t.visibility || "PUBLIC"; // ✅ 沒給就當公開
                                    const label =
                                        vis === "PUBLIC" ? "公開" :
                                            vis === "PRIVATE" ? "私人" :
                                                vis === "ASSIGNED" ? "指定" :
                                                    "公開"; // ✅ 保底也不要未知

                                    return <Tag>{label}</Tag>;
                                })()}

                            </Space>
                        }
                        
                        description={
                            <Space>
                                {t.taskFrom ? (
                                    <Text style={{ color: "var(--text-sub)" }}>{`來自 ${t.taskFrom}`}</Text>
                                ) : null}

                                {t.taskReward != null && t.taskReward !== "" ? (
                                    <Text style={{ color: "var(--text-sub)" }}>{`+${t.taskReward}`}</Text>
                                ) : null}
                            </Space>
                        }

                    />
                </List.Item>
            )}
        />
    );
}
