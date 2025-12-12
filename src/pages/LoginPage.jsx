// src/pages/LoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Card, Button, Typography } from "antd";
import {
  GoogleOutlined,
  FacebookFilled,
  MessageOutlined,
} from "@ant-design/icons";
import logo from "../assets/images/goodkidLogo.png"; // 路徑從 pages 出發，要多一層 ../
import "./LoginPage.css"; // 我們等一下會建這個檔
import api from "../api";
const { Content } = Layout;
const { Title, Text } = Typography;

const COPY = {
  prompt: "請選擇登入方式",
  line: "使用 LINE 登入",
  google: "使用 Google 登入",
  facebook: "使用 Facebook 登入",
};

function LoginPage() {
  
  const navigate = useNavigate();

  const handleLineLogin = () => {
    console.log("LINE Login clicked");
    // TODO: 之後接真正的 LINE 登入
    // 目前假裝登入成功，直接進角色選擇
    navigate("/role-select");
  };

  return (
    <Layout className="login-layout">
      <Content>
        <div className="login-wrapper">
          <Card className="login-card" bordered={false}>
            {/* Logo */}
            <div className="login-logo">
              <img src={logo} alt="GoodKit Logo" className="logo-img" />
            </div>

            {/* 標題 + 說明 */}
            <div className="login-title">
              <Title level={3} style={{ marginBottom: 0 }}>
                GoodKit
              </Title>
              <Text type="secondary">{COPY.prompt}</Text>
            </div>

            {/* 按鈕區 */}
            <div className="login-buttons">
              <Button
                type="primary"
                className="btn-line"
                icon={<MessageOutlined />}
                size="large"
                onClick={handleLineLogin}
              >
                {COPY.line}
              </Button>

              <Button
                className="btn-google"
                icon={<GoogleOutlined />}
                size="large"
                disabled
              >
                {COPY.google}
              </Button>

              <Button
                className="btn-facebook"
                icon={<FacebookFilled />}
                size="large"
                disabled
              >
                {COPY.facebook}
              </Button>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default LoginPage;
