import { useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Typography, Button, Space, List, Tag, Badge, Spin } from "antd";
import { BellOutlined, PlusOutlined } from "@ant-design/icons";
import { CARD_TYPE } from "../constants/cardType";
const { Title, Text } = Typography;

// 先用 mock，之後你換成 axios
const api = {
  async getCards() {
    return {
      cardInfo: [
        { cardIcon: "⚔️", cardType: "taskList",   cardTitle: "任務欄",       cardSubTitle: "當前有 3 個任務" },
        { cardIcon: "🧾", cardType: "myTaskList", cardTitle: "我發布的任務",   cardSubTitle: "當前有 1 個任務" },
        { cardIcon: "🧭", cardType: "taskSource", cardTitle: "我的任務來源",   cardSubTitle: "當前有 2 個任務來源" },
        { cardIcon: "🪙", cardType: "shop",       cardTitle: "獎勵商店",     cardSubTitle: "當前有 2 個兌換商店" }
      ]
    };
  },

  async getDetail(type) {
    const mock = {
      taskList: {
        items: [
          { taskId: "1", taskContent: "掃地", taskType: "日常", taskReward: 10, taskFrom: "媽媽" },
          { taskId: "2", taskContent: "倒垃圾", taskType: "日常", taskReward: 10, taskFrom: "媽媽" },
          { taskId: "3", taskContent: "重訓*3", taskType: "週任務", taskReward: 10, taskFrom: "自己" }
        ]
      },
      myTaskList: {
        items: [{ taskId: "3", taskContent: "重訓*3", taskType: "週任務", taskReward: 10 }]
      },
      taskSource: {
        items: [{ taskSourceId: 1, taskSourceName: "媽媽" }, { taskSourceId: 2, taskSourceName: "自己" }]
      },
      shop: {
        items: [
          { shopId: 1, shopFrom: "媽媽", shopCoin: 100, shopItems: [{ item: "switch2", price: 15000 }] },
          { shopId: 2, shopFrom: "自己", shopCoin: 1000, shopItems: [{ item: "手搖", price: 100 }] }
        ]
      }
    };
    return mock[type] || { items: [] };
  }
};

export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [activeType, setActiveType] = useState(CARD_TYPE.TASK_LIST);

  const [detail, setDetail] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // 取小卡資訊
  useEffect(() => {
    (async () => {
      const res = await api.getCards();
      setCards(res.cardInfo || []);
      setActiveType(res.cardInfo?.[0]?.cardType || CARD_TYPE.TASK_LIST);
    })();
  }, []);

  // 取主卡細節
  useEffect(() => {
    if (!activeType) return;

    (async () => {
      setLoading(true);
      try {
        const res = await api.getDetail(activeType);
        setDetail(res || { items: [] });
      } finally {
        setLoading(false);
      }
    })();
  }, [activeType]);

 

  // activeCard：上面那張
const activeCard = cards.find(c => c.cardType === activeType);
// otherCards：下面三張（排除 active）
const otherCards = cards.filter(c => c.cardType !== activeType);

return (
  <div style={{ padding: 24 }}>
    {/* ✅ 上面：主要顯示卡（1 大） */}
    <Card
      style={{ borderRadius: 14 }}
      title={
        <Space>
          <span style={{  fontSize: 28, lineHeight: 1 }}>{activeCard?.cardIcon}</span>
          <span style={{ fontWeight: 800 }}>{activeCard?.cardTitle || "主卡"}</span>
        </Space>
      }
      extra={<Text type="secondary">{activeCard?.cardSubTitle}</Text>}
    >
      <Spin spinning={loading}>
        <MainCardBody activeType={activeType} items={detail.items} />
      </Spin>
    </Card>

    {/* ✅ 下面：三張小卡（排除當前 active） */}
    <Row gutter={16} style={{ marginTop: 16 }}>
      {otherCards.map((c) => (
        <Col key={c.cardType} xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => setActiveType(c.cardType)}
            style={{ borderRadius: 14 }}
          >
            <Space align="start">
              <div style={{ fontSize: 22 }}>{c.cardIcon}</div>
              <div>
                <div style={{ fontWeight: 900 }}>{c.cardTitle}</div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {c.cardSubTitle}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);
}

function MainCardBody({ activeType, items }) {
  const renderer = BODY_RENDERER[activeType] || renderNotSupported;
  return renderer(items, activeType);
}

/** ===== Renderer Mapping（核心） ===== */
const BODY_RENDERER = {
  [CARD_TYPE.TASK_LIST]: renderTaskList,
  [CARD_TYPE.MY_TASK_LIST]: renderTaskList,  // 兩種共用同一個 renderer
  [CARD_TYPE.TASK_SOURCE]: renderTaskSource,
  [CARD_TYPE.SHOP]: renderShop,
};

/** ===== 各 cardType 的 renderer（你以後只加這裡） ===== */

function renderTaskList(items) {
  // items: [{ taskId, taskContent, taskType, taskReward, taskFrom? }]
  return (
    <List
      dataSource={items}
      locale={{ emptyText: "目前沒有任務" }}
      renderItem={(t) => (
        <List.Item
          key={t.taskId}
          extra={<Text strong>{t.taskReward ? `+${t.taskReward}` : ""}</Text>}
        >
          <List.Item.Meta
            title={
              <Space>
                <Text strong>{t.taskContent}</Text>
                {t.taskType && <Tag>{t.taskType}</Tag>}
              </Space>
            }
            description={t.taskFrom ? `來自 ${t.taskFrom}` : null}
          />
        </List.Item>
      )}
    />
  );
}

function renderTaskSource(items) {
  // items: [{ taskSourceId, taskSourceName }]
  return (
    <List
      dataSource={items}
      locale={{ emptyText: "目前沒有任務來源" }}
      renderItem={(s) => (
        <List.Item key={s.taskSourceId}>
          <Text>{s.taskSourceName}</Text>
        </List.Item>
      )}
    />
  );
}

function renderShop(items) {
  // items: [{ shopId, shopFrom, shopCoin, shopItems: [{item, price}] }]
  return (
    <List
      dataSource={items}
      locale={{ emptyText: "目前沒有商店" }}
      renderItem={(shop) => (
        <List.Item key={shop.shopId}>
          <div style={{ width: "100%" }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Text strong>{shop.shopFrom} 的商店</Text>
              <Text>Coin：{shop.shopCoin}</Text>
            </Space>

            <div style={{ marginTop: 10 }}>
              <List
                size="small"
                dataSource={shop.shopItems || []}
                locale={{ emptyText: "沒有商品" }}
                renderItem={(it, idx) => (
                  <List.Item key={idx}>
                    <Space style={{ width: "100%", justifyContent: "space-between" }}>
                      <Text>{it.item}</Text>
                      <Text>{it.price}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

function renderNotSupported(_items, activeType) {
  return <Text type="secondary">尚未支援：{activeType}</Text>;
}

