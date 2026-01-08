import React, { useMemo, useState } from "react";
import { List, Typography, Space, Switch, Popconfirm, Tag } from "antd";
import { CaretDownOutlined, CaretUpOutlined, CheckCircleOutlined } from "@ant-design/icons";


const { Text } = Typography;

export default function ShopList({ items = [], action = {} }) {
    // 哪些商店是展開的：用 shopId 當 key
    const [openMap, setOpenMap] = useState(() => {
        const init = {};
        (items || []).forEach((s) => (init[s.shopId] = true)); // 預設全展開
        return init;
    });

    // 是否只顯示買得起的商品 預設關閉false
    const [onlyAffordable, setOnlyAffordable] = useState(false);

    // 切換商店展開/收起
    const toggleShop = (shopId) => {
        setOpenMap((prev) => ({ ...prev, [shopId]: !prev[shopId] }));
    };
    // 處理過的商店清單：每個商店多帶 __items（過濾後的商品清單）、__allCount（全部商品數量）
    const filteredShops = useMemo(() => {
        return (items || []).map((shop) => {
            const coin = Number(shop.shopCoin) || 0;
            const list = shop.shopItems || [];
            const filtered = onlyAffordable
                ? list.filter((it) => (Number(it.price) || 0) <= coin)
                : list;

            return { ...shop, __items: filtered, __allCount: list.length };
        });
    }, [items, onlyAffordable]);

    return (
        <div>
            {/* 頂部開關 */}
            <div style={{ marginBottom: 12 }}>
                <Space>
                    <Switch checked={onlyAffordable} onChange={setOnlyAffordable} />
                    <Text style={{ color: "var(--text-main)" }}>只顯示足夠金錢可兌換</Text>
                </Space>
            </div>

            <List
                dataSource={filteredShops}
                locale={{ emptyText: "目前沒有商店" }}
                renderItem={(shop) => {
                    const isOpen = !!openMap[shop.shopId];
                    const visibleItems = shop.__items || [];
                    const allCount = shop.__allCount || 0;

                    return (
                        <List.Item key={shop.shopId}>
                            <div style={{ width: "100%" }}>
                                {/* 商店標題列 */}
                                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                                    <Text strong style={{ color: "var(--text-main)" }}>
                                        {shop.shopFrom} 的商店
                                    </Text>
                                    <Text style={{ color: "var(--text-main)" }}>Coin：{shop.shopCoin}</Text>
                                </Space>

                                {/* 收起/展開控制列 */}
                                <div
                                    style={{
                                        marginTop: 8,
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        cursor: "pointer",
                                        userSelect: "none",
                                    }}
                                    onClick={() => toggleShop(shop.shopId)}
                                >
                                    <Space>
                                        {isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
                                        <Text style={{ color: "var(--text-sub)" }}>
                                            {isOpen ? "收起" : `${allCount}項商品`}
                                        </Text>
                                    </Space>
                                </div>

                                {/* 商品清單：展開才顯示 */}
                                {isOpen && (
                                    <div style={{ marginTop: 10 }}>
                                        <List
                                            size="small"
                                            dataSource={visibleItems}
                                            locale={{
                                                emptyText: onlyAffordable ? "沒有可兌換商品" : "沒有商品",
                                            }}
                                            renderItem={(it, idx) => {
                                                const coin = Number(shop.shopCoin) || 0;
                                                const price = Number(it.price) || 0;
                                                const affordable = price <= coin;
                                                const requested = !!it.requested;

                                                const canClick = affordable; // 只有可兌換才允許點

                                                const onConfirm = () => {
                                                    if (!canClick) return;

                                                    if (requested) {
                                                        action.onCancelRedeem?.({ shopId: shop.shopId, itemName: it.item });
                                                    } else {
                                                        action.onRequestRedeem?.({ shopId: shop.shopId, itemName: it.item });
                                                    }
                                                };

                                                const confirmTitle = requested ? "取消兌換請求？" : "是否兌換此商品？";
                                                const okText = requested ? "取消請求" : "確認兌換";

                                                return (
                                                    <Popconfirm
                                                        title={confirmTitle}
                                                        okText={okText}
                                                        cancelText="返回"
                                                        onConfirm={onConfirm}
                                                        disabled={!canClick} // 買不起就不能點
                                                    >
                                                        <List.Item
                                                            key={idx}
                                                            style={{ cursor: canClick ? "pointer" : "not-allowed", opacity: canClick ? 1 : 0.5 }}
                                                        >
                                                            <Space style={{ width: "100%", justifyContent: "space-between" }}>
                                                                <Text style={{ color: "var(--text-main)" }}>{it.item}</Text>

                                                                <Space>
                                                                    {/* 狀態文字：你想要的 ✅兌換 / ✅已請求兌換 */}
                                                                    {affordable && !requested && (
                                                                        <Tag icon={<CheckCircleOutlined />} style={{ marginRight: 0 }}>
                                                                            兌換
                                                                        </Tag>
                                                                    )}

                                                                    {requested && (
                                                                        <Tag icon={<CheckCircleOutlined />} style={{ marginRight: 0 }}>
                                                                            已請求兌換
                                                                        </Tag>
                                                                    )}

                                                                    <Text style={{ color: "var(--text-main)" }}>{it.price}</Text>
                                                                </Space>
                                                            </Space>
                                                        </List.Item>
                                                    </Popconfirm>
                                                );
                                            }}

                                        />
                                    </div>
                                )}
                            </div>
                        </List.Item>
                    );
                }}
            />
        </div>
    );
}
