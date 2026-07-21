// ============================================================
// 🔐 认证系统 — 前端状态管理
// ============================================================
// 三种身份：student（学生）、parent（家长）、teacher（教师）
// 学生/家长无需密码直接登录，教师需要密码验证
// Token 存储在 sessionStorage，24 小时有效
// ============================================================

"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Role = "student" | "parent" | "teacher";

interface AuthState {
  role: Role | null;
  isTeacher: boolean;
  isLoggedIn: boolean;
  login: (role: Role, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthState>({
  role: null,
  isTeacher: false,
  isLoggedIn: false,
  login: async () => false,
  logout: async () => {},
  getToken: () => null,
});

const TOKEN_KEY = "auth_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // 获取存储的 token（仅在浏览器环境可用）
  const getStoredToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(TOKEN_KEY);
  };

  // 页面加载时自动验证已保存的 token
  useEffect(() => {
    const savedToken = getStoredToken();
    if (savedToken) {
      fetch("/api/auth", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((r) => r.json() as Promise<{ valid: boolean; role?: string }>)
        .then((data) => {
          if (data.valid && data.role === "teacher") {
            setToken(savedToken);
            setRole("teacher");
          } else {
            sessionStorage.removeItem(TOKEN_KEY);
          }
        })
        .catch(() => sessionStorage.removeItem(TOKEN_KEY))
        .finally(() => setInitialized(true));
    } else {
      setInitialized(true);
    }
  }, []);

  // 登录：学生/家长直接通过，教师调 API 验证密码
  const login = useCallback(async (r: Role, password?: string): Promise<boolean> => {
    if (r === "student" || r === "parent") {
      setRole(r);
      setToken(null);
      return true;
    }

    if (r === "teacher") {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: password || "" }),
        });
        const data = (await res.json()) as { token?: string; error?: string };

        if (data.token) {
          setRole("teacher");
          setToken(data.token);
          sessionStorage.setItem(TOKEN_KEY, data.token);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    }

    return false;
  }, []);

  // 退出登录：通知服务端作废 token，清除本地状态
  const logout = useCallback(async () => {
    const currentToken = token || getStoredToken();
    if (currentToken) {
      fetch("/api/auth", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentToken}` },
      }).catch(() => {});
    }
    setRole(null);
    setToken(null);
    sessionStorage.removeItem(TOKEN_KEY);
  }, [token]);

  const getToken = useCallback((): string | null => {
    return token || getStoredToken();
  }, [token]);

  // 初始化完成前不渲染子组件，避免闪烁
  if (!initialized) {
    return (
      <AuthContext.Provider
        value={{ role: null, isTeacher: false, isLoggedIn: false, login, logout, getToken }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        role,
        isTeacher: role === "teacher",
        isLoggedIn: role !== null,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 自定义 Hook：在任何组件中获取认证状态
export function useAuth() {
  return useContext(AuthContext);
}
