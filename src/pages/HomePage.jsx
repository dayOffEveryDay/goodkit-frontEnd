import { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Space, List, Tag, Spin, Switch } from "antd";
import "./HomePage.css";
import { CARD_TYPE } from "../constants/cardType";

const { Text } = Typography;

// 先用 mock，之後你換成 axios（B：/cards & /cards/detail?type=xxx）
const api = {
  async getCards() {
    return {
      cardInfo: [
        { cardIcon: "⚔️", cardType: "taskList", cardTitle: "任務欄", cardSubTitle: "當前有 3 個任務" },
        { cardIcon: "🧾", cardType: "myTaskList", cardTitle: "我發布的任務", cardSubTitle: "當前有 1 個任務" },
        { cardIcon: "🧭", cardType: "taskSource", cardTitle: "我的任務來源", cardSubTitle: "當前有 2 個任務來源" },
        { cardIcon: "🪙", cardType: "shop", cardTitle: "獎勵商店", cardSubTitle: "當前有 2 個兌換商店" },
      ],
    };
  },

  async getDetail(type) {
    const mock = {
      taskList: {
        items: [
          { taskId: "1", taskContent: "掃地", taskType: "日常", taskReward: 10, taskFrom: "媽媽" },
          { taskId: "2", taskContent: "倒垃圾", taskType: "日常", taskReward: 10, taskFrom: "媽媽" },
          { taskId: "3", taskContent: "重訓*3", taskType: "週任務", taskReward: 10, taskFrom: "自己" },
        ],
      },
      myTaskList: {
        items: [{ taskId: "3", taskContent: "重訓*3", taskType: "週任務", taskReward: 10 }],
      },
      taskSource: {
        items: [
          { taskSourceId: 1, taskSourceName: "媽媽" },
          { taskSourceId: 2, taskSourceName: "自己" },
        ],
      },
      shop: {
        items: [
          { shopId: 1, shopFrom: "媽媽", shopCoin: 100, shopItems: [{ item: "switch2", price: 15000 }] },
          { shopId: 2, shopFrom: "自己", shopCoin: 1000, shopItems: [{ item: "手搖", price: 100 }] },
        ],
      },
    };
    return mock[type] || { items: [] };
  },
};

export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [activeType, setActiveType] = useState(CARD_TYPE.TASK_LIST);

  const [detail, setDetail] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // theme: "light" | "dark"
  const [theme, setTheme] = useState("light");

  // 套用主題到 body
  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // 取小卡資訊
  useEffect(() => {
    (async () => {
      const res = await api.getCards();
      const list = res.cardInfo || [];
      setCards(list);
      setActiveType(list?.[0]?.cardType || CARD_TYPE.TASK_LIST);
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

  const activeCard = cards.find((c) => c.cardType === activeType);
  const otherCards = cards.filter((c) => c.cardType !== activeType);

  return (
    <>
      {/* 右上角：白/深色切換 */}
      <div className="themeToggle">
        <Switch
          checked={theme === "dark"}
          onChange={(checked) => setTheme(checked ? "dark" : "light")}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
        />
      </div>

      {/* 主卡容器 */}
      <div className="mainWrap">
        <Card
          style={{
            borderRadius: 14,
            background: "var(--bg-card)",
            borderColor: "var(--border-card)",
            color: "var(--text-main)",
          }}
          title={
            <Space>
              <span style={{ fontSize: 22, lineHeight: 1 }}>{activeCard?.cardIcon}</span>
              <span style={{ fontWeight: 900, color: "var(--text-main)" }}>
                {activeCard?.cardTitle || "主卡"}
              </span>
            </Space>
          }
          extra={<Text style={{ color: "var(--text-sub)" }}>{activeCard?.cardSubTitle}</Text>}
        >
          <Spin spinning={loading}>
            <MainCardBody activeType={activeType} items={detail.items} />
          </Spin>
        </Card>
      </div>

      {/* 小卡容器：合起來同寬/略寬 */}
      <div className="miniWrap">
        <Row gutter={[16, 16]}>
          {otherCards.map((c) => (
            <Col key={c.cardType} xs={24} md={8}>
              <Card
                hoverable
                onClick={() => setActiveType(c.cardType)}
                style={{
                  borderRadius: 14,
                  background: "var(--bg-card)",
                  borderColor: "var(--border-card)",
                  color: "var(--text-main)",
                }}
              >
                <Space align="start">
                  <div style={{ fontSize: 22, lineHeight: 1 }}>{c.cardIcon}</div>
                  <div>
                    <div style={{ fontWeight: 900, color: "var(--text-main)" }}>{c.cardTitle}</div>
                    <Text style={{ fontSize: 12, color: "var(--text-sub)" }}>{c.cardSubTitle}</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

/** ===== MainCardBody：mapping 分流（不會亂長） ===== */
function MainCardBody({ activeType, items }) {
  const renderer = BODY_RENDERER[activeType] || renderNotSupported;
  return renderer(items, activeType);
}

const BODY_RENDERER = {
  [CARD_TYPE.TASK_LIST]: renderTaskList,
  [CARD_TYPE.MY_TASK_LIST]: renderTaskList, // 先共用（未來要可編輯再拆或加 editable 參數）
  [CARD_TYPE.TASK_SOURCE]: renderTaskSource,
  [CARD_TYPE.SHOP]: renderShop,
};

function renderTaskList(items) {
  return (
    <List
      dataSource={items}
      locale={{ emptyText: "目前沒有任務" }}
      renderItem={(t) => (
        <List.Item
          key={t.taskId}
          style={{ background: "var(--bg-card)", color: "var(--text-main)" }}
          extra={<Text strong style={{ color: "var(--text-main)" }}>{t.taskReward ? `+${t.taskReward}` : ""}</Text>}
        >
          <List.Item.Meta
            title={
              <Space>
                <Text strong style={{ color: "var(--text-main)" }}>{t.taskContent}</Text>
                {t.taskType && <Tag>{t.taskType}</Tag>}
              </Space>
            }
            description={t.taskFrom ? <Text style={{ color: "var(--text-sub)" }}>{`來自 ${t.taskFrom}`}</Text> : null}
          />
        </List.Item>
      )}
    />
  );
}

function renderTaskSource(items) {
  return (
    <List
      dataSource={items}
      locale={{ emptyText: "目前沒有任務來源" }}
      renderItem={(s) => (
        <List.Item key={s.taskSourceId}>
          <Text style={{ color: "var(--text-main)" }}>{s.taskSourceName}</Text>
        </List.Item>
      )}
    />
  );
}

function renderShop(items) {
  return (
    <List
      dataSource={items}
      locale={{ emptyText: "目前沒有商店" }}
      renderItem={(shop) => (
        <List.Item key={shop.shopId}>
          <div style={{ width: "100%" }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Text strong style={{ color: "var(--text-main)" }}>{shop.shopFrom} 的商店</Text>
              <Text style={{ color: "var(--text-main)" }}>Coin：{shop.shopCoin}</Text>
            </Space>

            <div style={{ marginTop: 10 }}>
              <List
                size="small"
                dataSource={shop.shopItems || []}
                locale={{ emptyText: "沒有商品" }}
                renderItem={(it, idx) => (
                  <List.Item key={idx}>
                    <Space style={{ width: "100%", justifyContent: "space-between" }}>
                      <Text style={{ color: "var(--text-main)" }}>{it.item}</Text>
                      <Text style={{ color: "var(--text-main)" }}>{it.price}</Text>
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
  return <Text style={{ color: "var(--text-sub)" }}>尚未支援：{activeType}</Text>;
}
