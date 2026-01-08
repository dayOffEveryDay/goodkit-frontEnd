import { useState } from "react";
import { List, Typography, Button, Modal, Input, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function TaskSource({ items = [], actions = {} }) {
  const [open, setOpen] = useState(false);
  const [sourceId, setSourceId] = useState("");

  const onOpen = () => {
    setSourceId("");
    setOpen(true);
  };

  const onCancel = () => {
    setOpen(false);
    setSourceId("");
  };

  const onOk = async () => {
    const value = sourceId.trim();
    if (!value) {
      message.warning("請輸入來源ID");
      return;
    }

    // 把新增動作交給 HomePage（或父層）處理
    await actions.onCreateSource?.(value);

    setOpen(false);
    setSourceId("");
  };

  return (
    <div style={{ position: "relative", paddingBottom: 12 }}>
      <List
        dataSource={items}
        locale={{ emptyText: "目前沒有任務來源" }}
        renderItem={(s) => (
          <List.Item key={s.taskSourceId}>
            <Text style={{ color: "var(--text-main)" }}>{s.taskSourceName}</Text>
          </List.Item>
        )}
      />

      {/* 右下角 + */}
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        style={{ position: "absolute", right: 12, bottom: 12 }}
        onClick={onOpen}
      />

      {/* 新增來源 Modal */}
      <Modal
        title="新增任務來源"
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        okText="送出"
        cancelText="取消"
      >
        <Space  style={{ width: "100%" }}>
          <Text style={{ color: "var(--text-sub)" }}>請輸入來源ID</Text>
          <Input
            placeholder="例如：媽媽 / 自己 / Dad"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            onPressEnter={onOk}
          />
        </Space>
      </Modal>
    </div>
  );
}
