// src/stores/modules/token.ts
import { ref } from "vue";
import { defineStore } from "pinia";

export const useTokenStore = defineStore("token", () => {
  // 从 localStorage 读取初始 token
  const token = ref(localStorage.getItem("token") || "");

  // 设置 token，同时保存到 localStorage
  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  };

  // 清除 token，同时移除 localStorage 中的 token
  const clearToken = () => {
    token.value = "";
    localStorage.removeItem("token");
  };

  // 检查 token 是否有效
  const isTokenValid = () => {
    // 这里可以添加更复杂的有效性验证逻辑
    return !!token.value;
  };

  return {
    token,
    setToken,
    clearToken,
    isTokenValid,
  };
});
