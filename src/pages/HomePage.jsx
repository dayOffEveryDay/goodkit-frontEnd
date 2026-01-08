import { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Space, List, Tag, Spin, Switch, Button, message, Popconfirm } from "antd";
import "./HomePage.css";
import { CARD_TYPE } from "../constants/cardType";
import TaskList from "./panels/TaskList";
import ShopList from "./panels/ShopList";
import TaskSource from "./panels/TaskSource";
import TaskListExecute from "./panels/TaskListExecute";
import TaskListPublish from "./panels/TaskListPublish";


const { Text } = Typography;

// 先用 mock，之後你換成 axios（B：/cards & /cards/detail?type=xxx）
const api = {
    async getCards() {
        return {
            cardInfo: [
                { cardIcon: "⚔️", cardType: "taskList", cardTitle: "任務欄", cardSubTitle: "當前有 3 個任務" },
                { cardIcon: "🧾", cardType: "myTaskList", cardTitle: "我發布的任務", cardSubTitle: "當前有 1 個任務" },
                { cardIcon: "🧭", cardType: "taskSource", cardTitle: "我的任務來源", cardSubTitle: "當前有 4 個任務來源" },
                { cardIcon: "🪙", cardType: "shop", cardTitle: "獎勵商店", cardSubTitle: "當前有 4 個兌換商店" },
            ],
        };
    },
    async withdrawSubmit(taskId) {
        return { ok: true, taskId };
    },

    async getDetail(type) {
        const mock = {
            taskList: {
                items: [
                    { taskId: "1", taskContent: "掃地", taskType: "日常", taskReward: 10, taskFrom: "媽媽", submitted: false },
                    { taskId: "2", taskContent: "倒垃圾", taskType: "日常", taskReward: 10, taskFrom: "媽媽", submitted: false },
                    { taskId: "3", taskContent: "重訓*3", taskType: "週任務", taskReward: 10, taskFrom: "自己", submitted: false },
                ],
            },
            myTaskList: {
                items: [
                    { taskId: "3", taskContent: "重訓*3", taskType: "週任務", taskReward: 10, visibility: "PUBLIC" },
                ],
            },

            taskSource: {
                items: [
                    { taskSourceId: 1, taskSourceName: "媽媽" },
                    { taskSourceId: 2, taskSourceName: "自己" },
                    { taskSourceId: 3, taskSourceName: "教練" },
                    { taskSourceId: 4, taskSourceName: "哥哥" },
                ],
            },
            shop: {
                items: [
                    { shopId: 1, shopFrom: "媽媽", shopCoin: 100, shopItems: [{ item: "switch2", price: 15000, requested: false }, { item: "ihpone17", price: 27000, requested: false }] },
                    { shopId: 2, shopFrom: "自己", shopCoin: 1000, shopItems: [{ item: "手搖", price: 100, requested: false }, { item: "ihpone17", price: 20000, requested: false }] },
                    { shopId: 3, shopFrom: "教練", shopCoin: 200, shopItems: [{ item: "可以喝手搖", price: 100, requested: false }, { item: "可以吃燒肉", price: 500, requested: false }, { item: "可以吃甜點", price: 300, requested: false }] },
                    { shopId: 4, shopFrom: "哥哥", shopCoin: 200, shopItems: [{ item: "電腦贊助", price: 10000, requested: false }] }
                ],
            },

        };
        return mock[type] || { items: [] };
    },
    async submitTask(taskId) {
        // mock：假裝成功
        return { ok: true, taskId };
    },
};

export default function HomePage() {
    const [cards, setCards] = useState([]);
    const [activeType, setActiveType] = useState(CARD_TYPE.TASK_LIST);

    const [detail, setDetail] = useState({ items: [] });
    const [loading, setLoading] = useState(false);
    const [submittingId, setSubmittingId] = useState(null);

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

    const onSubmitTask = async (taskId) => {
        setSubmittingId(taskId);
        try {
            const res = await api.submitTask(taskId);
            if (res?.ok) {
                message.success("已送出完成提交");

                setDetail((prev) => ({
                    ...prev,
                    items: (prev.items || []).map((t) =>
                        t.taskId === taskId ? { ...t, submitted: true } : t
                    ),
                }));

            } else {
                message.error("提交失敗");
            }
        } catch (e) {
            message.error("提交失敗");
        } finally {
            setSubmittingId(null);
        }
    };
    const onWithdrawTask = async (taskId) => {
        setSubmittingId(taskId);
        try {
            const res = await api.withdrawSubmit(taskId);
            if (res?.ok) {
                message.success("已撤回提交");
                setDetail((prev) => ({
                    ...prev,
                    items: (prev.items || []).map((t) =>
                        t.taskId === taskId ? { ...t, submitted: false } : t
                    ),
                }));
            } else {
                message.error("撤回失敗");
            }
        } catch (e) {
            message.error("撤回失敗");
        } finally {
            setSubmittingId(null);
        }
    };
    const onCreateSource = async (newSourceId) => {
        // 先做本地新增（之後你再換成打 API 成功後再 setDetail）
        setDetail((prev) => {
            const list = prev.items || [];
            const next = {
                taskSourceId: '123456789',          // 自動生成 id（先簡單）
                taskSourceName: '新來源',      // 你要的「來源ID」先存到 name
            };

            return { ...prev, items: [next, ...list] };
        });

        message.success("已新增任務來源");
    };

    const onCreatePublishedTask = async ({ taskContent, taskType, taskReward, visibility, assigneeIds }) => {
        setDetail((prev) => {
            const list = prev.items || [];
            const next = {
                taskId: Date.now().toString(),
                taskContent,
                taskType,
                taskReward,
                visibility,
                assigneeIds,
            };
            return { ...prev, items: [next, ...list] };
        });
        message.success("已新增任務");
    };



    const onUpdatePublishedTask = async ({ taskId, patch }) => {
        setDetail((prev) => ({
            ...prev,
            items: (prev.items || []).map((t) => (t.taskId === taskId ? { ...t, ...patch } : t)),
        }));
        message.success("已儲存");
    };
    const onRequestRedeem = async ({ shopId, itemName }) => {
        // TODO: await api.requestRedeem(shopId, itemName)
        setDetail((prev) => ({
            ...prev,
            items: (prev.items || []).map((shop) => {
                if (shop.shopId !== shopId) return shop;
                return {
                    ...shop,
                    shopItems: (shop.shopItems || []).map((it) =>
                        it.item === itemName ? { ...it, requested: true } : it
                    ),
                };
            }),
        }));
        message.success("已送出兌換請求（Pending）");
    };

    const onCancelRedeem = async ({ shopId, itemName }) => {
        // TODO: await api.cancelRedeem(shopId, itemName)
        setDetail((prev) => ({
            ...prev,
            items: (prev.items || []).map((shop) => {
                if (shop.shopId !== shopId) return shop;
                return {
                    ...shop,
                    shopItems: (shop.shopItems || []).map((it) =>
                        it.item === itemName ? { ...it, requested: false } : it
                    ),
                };
            }),
        }));
        message.info("已取消兌換請求");
    };

    return (
        <>
            {/* 右上角：白/深色切換 TopBar：佔高度  */}
            <div className="topBar">
                <div className="themeToggle">
                    <Switch
                        checked={theme === "dark"}
                        onChange={(checked) => setTheme(checked ? "dark" : "light")}
                        checkedChildren="🌙"
                        unCheckedChildren="☀️"
                    />
                </div>
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
                        <MainCardBody
                            activeType={activeType}
                            items={detail.items}
                            actions={{
                                onSubmitTask,
                                onWithdrawTask,
                                submittingId,
                                onCreateSource,
                                onCreatePublishedTask,
                                onUpdatePublishedTask,
                                onRequestRedeem,
                                onCancelRedeem,
                            }}

                        />
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
function MainCardBody({ activeType, items, actions }) {
    const renderer = BODY_RENDERER[activeType] || renderNotSupported;
    return renderer(items, actions);
}


const BODY_RENDERER = {
    [CARD_TYPE.TASK_LIST]: (items, actions) => <TaskListExecute items={items} actions={actions} />,
    [CARD_TYPE.MY_TASK_LIST]: (items, actions) => <TaskListPublish items={items} actions={actions} />,
    [CARD_TYPE.TASK_SOURCE]: (items, actions) => <TaskSource items={items} actions={actions} />,
    [CARD_TYPE.SHOP]: (items, actions) => <ShopList items={items} action={actions} />,
};




function renderNotSupported(_items, activeType) {
    return <Text style={{ color: "var(--text-sub)" }}>尚未支援：{activeType}</Text>;
}
