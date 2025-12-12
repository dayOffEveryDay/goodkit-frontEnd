// src/api/index.js
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// 請求攔截器：帶 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 回應攔截器：用 HTTP status 做處理
api.interceptors.response.use(
  // ✅ 成功（2xx）的情況
  (response) => {
    // 這裡假設後端成功時 body 就是你要的 JSON
    return response.data;
  },

  // ❌ 錯誤（4xx / 5xx）的情況
  (error) => {
    // 沒有 response，通常是網路掛了或 CORS 問題
    if (!error.response) {
      console.error("Network or CORS error:", error);
      // 之後可以在這裡用 antd message.error 提示使用者
      return Promise.reject(error);
    }
    //const status = error.response.status;
    //const data = error.response.data;等同於下方寫法↓
    const { status, data } = error.response;

    // 401：未登入或 token 過期
    if (status === 401) {
      localStorage.removeItem("token");
      // TODO: 這裡將來可以彈提示
      window.location.href = "/login";
    }

    // 403：沒權限
    if (status === 403) {
      // TODO: 你可以在這裡導回首頁或顯示「沒有權限」
      console.warn("Forbidden:", data);
    }

    // 其他錯誤可以視情況處理（400, 404, 500...）
    // 比方說你可以在這裡 log、丟到 Sentry、或顯示錯誤訊息
    console.error("API error:", status, data);

    // 一樣往外丟，讓呼叫的地方可以 .catch 處理
    return Promise.reject(error);
  }
);

export default api;
