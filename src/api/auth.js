import api from "./index";

// LINE 登入
export const lineLogin = (idToken) =>
  api.post("/oauth2/authorization/line", { idToken });