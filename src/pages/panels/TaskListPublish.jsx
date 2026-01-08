import React, { useState } from "react";
import { Button, Input, Modal, Space, Select, InputNumber, message } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import TaskListBase from "./TaskListBase";

const TYPE_OPTIONS = [
    { value: "日常", label: "日常" },
    { value: "週任務", label: "週任務" },
    { value: "月任務", label: "月任務" },
    { value: "季任務", label: "季任務" },
    { value: "年任務", label: "年任務" },
    { value: "無期限", label: "無期限" },
];
const MOCK_USERS = [
    { id: "u1", name: "媽媽" },
    { id: "u2", name: "自己" },
    { id: "u3", name: "哥哥" },
    { id: "u4", name: "教練" },
];

const VIS_OPTIONS = [
    { value: "PUBLIC", label: "公開" },
    { value: "PRIVATE", label: "私人" },
    { value: "ASSIGNED", label: "指定" },
];


export default function TaskListPublish({ items = [], actions = {} }) {
    const { onCreatePublishedTask, onUpdatePublishedTask } = actions;

    // Create
    const [createOpen, setCreateOpen] = useState(false);
    const [createContent, setCreateContent] = useState("");
    const [createType, setCreateType] = useState(undefined);
    const [createReward, setCreateReward] = useState(0);
    const [createVisibility, setCreateVisibility] = useState("PUBLIC");
    const [createAssigneeIds, setCreateAssigneeIds] = useState([]);

    // Edit
    const [editOpen, setEditOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editType, setEditType] = useState(undefined);
    const [editReward, setEditReward] = useState(0);
    const [editVisibility, setEditVisibility] = useState("PUBLIC");
    const [editAssigneeIds, setEditAssigneeIds] = useState([]);


    const openCreate = () => {
        setCreateContent("");
        setCreateType(undefined);
        setCreateReward(0);

        setCreateVisibility("PUBLIC");
        setCreateAssigneeIds([]);

        setCreateOpen(true);
    };


    const submitCreate = async () => {
        const content = createContent.trim();
        if (!content) return message.warning("請輸入任務內容");
        if (!createType) return message.warning("請選擇任務週期");

        if (createVisibility === "ASSIGNED" && createAssigneeIds.length === 0) {
            return message.warning("請選擇指定對象");
        }

        await onCreatePublishedTask?.({
            taskContent: content,
            taskType: createType,
            taskReward: createReward || 0,
            visibility: createVisibility,
            assigneeIds: createVisibility === "ASSIGNED" ? createAssigneeIds : [],
        });

        setCreateOpen(false);
    };


    const openEdit = (t) => {
        setEditing(t);

        setEditContent(t.taskContent || "");
        setEditType(t.taskType || undefined);
        setEditReward(Number(t.taskReward) || 0);

        setEditVisibility(t.visibility || "PUBLIC");
        setEditAssigneeIds(t.assigneeIds || []);

        setEditOpen(true);
    };


    const submitEdit = async () => {
        if (!editing) return;

        const content = editContent.trim();
        if (!content) return message.warning("請輸入任務內容");
        if (!editType) return message.warning("請選擇任務週期");

        if (editVisibility === "ASSIGNED" && editAssigneeIds.length === 0) {
            return message.warning("請選擇指定對象");
        }

        await onUpdatePublishedTask?.({
            taskId: editing.taskId,
            patch: {
                taskContent: content,
                taskType: editType,
                taskReward: editReward || 0,
                visibility: editVisibility,
                assigneeIds: editVisibility === "ASSIGNED" ? editAssigneeIds : [],
            },
        });

        setEditOpen(false);
        setEditing(null);
    };


    return (
        <div>
            <TaskListBase
                items={items}
                showVisibilityTag={true}
                renderExtra={(t) => (
                    <Space>
                        <Button size="small" icon={<SettingOutlined />} onClick={() => openEdit(t)} />
                    </Space>
                )}
                footer={
                    <div style={{ paddingTop: 12 }}>
                        <Button type="dashed" block icon={<PlusOutlined />} onClick={openCreate}>
                            新增
                        </Button>
                    </div>
                }
            />

            {/* 新增 */}
            <Modal
                title="新增任務"
                open={createOpen}
                okText="送出"
                cancelText="取消"
                onOk={submitCreate}
                onCancel={() => setCreateOpen(false)}
            >
                <Select
                    style={{ width: "100%", marginBottom: 12 }}
                    placeholder="選擇任務週期"
                    value={createType}
                    onChange={setCreateType}
                    options={TYPE_OPTIONS}
                />
                <Select
                    style={{ width: "100%", marginBottom: 12 }}
                    value={createVisibility}
                    onChange={(v) => {
                        setCreateVisibility(v);
                        if (v !== "ASSIGNED") setCreateAssigneeIds([]);
                    }}
                    options={VIS_OPTIONS}
                />

                {createVisibility === "ASSIGNED" && (
                    <Select
                        mode="multiple"
                        style={{ width: "100%", marginBottom: 12 }}
                        placeholder="選擇指定對象"
                        value={createAssigneeIds}
                        onChange={setCreateAssigneeIds}
                        options={MOCK_USERS.map((u) => ({ value: u.id, label: u.name }))}
                    />
                )}


                <Input
                    placeholder="請輸入任務內容"
                    value={createContent}
                    onChange={(e) => setCreateContent(e.target.value)}
                />

                <InputNumber
                    style={{ width: "100%", marginTop: 12 }}
                    placeholder="獎勵金"
                    min={0}
                    value={createReward}
                    onChange={(v) => setCreateReward(v || 0)}
                    onPressEnter={submitCreate}
                />
            </Modal>

            {/* 編輯 */}
            <Modal
                title="編輯任務"
                open={editOpen}
                okText="儲存"
                cancelText="取消"
                onOk={submitEdit}
                onCancel={() => setEditOpen(false)}
            >
                <Select
                    style={{ width: "100%", marginBottom: 12 }}
                    placeholder="選擇任務週期"
                    value={editType}
                    onChange={setEditType}
                    options={TYPE_OPTIONS}
                />
                <Select
                    style={{ width: "100%", marginBottom: 12 }}
                    value={editVisibility}
                    onChange={(v) => {
                        setEditVisibility(v);
                        if (v !== "ASSIGNED") setEditAssigneeIds([]);
                    }}
                    options={VIS_OPTIONS}
                />

                {editVisibility === "ASSIGNED" && (
                    <Select
                        mode="multiple"
                        style={{ width: "100%", marginBottom: 12 }}
                        placeholder="選擇指定對象"
                        value={editAssigneeIds}
                        onChange={setEditAssigneeIds}
                        options={MOCK_USERS.map((u) => ({ value: u.id, label: u.name }))}
                    />
                )}

                <Input
                    placeholder="請輸入任務內容"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                />

                <InputNumber
                    style={{ width: "100%", marginTop: 12 }}
                    placeholder="獎勵金"
                    min={0}
                    value={editReward}
                    onChange={(v) => setEditReward(v || 0)}
                    onPressEnter={submitEdit}
                />
            </Modal>
        </div>
    );
}
