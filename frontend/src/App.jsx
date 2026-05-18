import React, { useEffect, useMemo, useRef, useState } from "react";

const ENV_API_BASE = import.meta?.env?.VITE_API_BASE_URL?.trim();

const IS_LOCAL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// Backend Render thật của FOREVER POS.
// Nếu Vercel ENV chưa ăn, app vẫn tự fallback về link này để không bị API_BASE rỗng.
const PRODUCTION_BACKEND = "https://forever-backend-e56c.onrender.com";

const API_BASE = (
  ENV_API_BASE ||
  (IS_LOCAL ? "http://localhost:5000" : PRODUCTION_BACKEND)
).replace(/\/$/, "");

console.log("✅ FOREVER POS API_BASE:", API_BASE);
console.log(
  "✅ VITE_API_BASE_URL:",
  import.meta.env.VITE_API_BASE_URL || "Không có ENV, đang dùng fallback PRO"
);

const SYNC_INTERVAL = 5000;
const MOBILE_BREAKPOINT = 768;

// QR thanh toán cố định lấy từ ảnh anh gửi, đã nhúng trực tiếp vào code.
// Nếu sau này anh đổi mã QR, chỉ cần thay giá trị constant này.
const FIXED_PAYMENT_QR_IMAGE =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTllDUDxgYGBiVkdOZ1lZXGBmeP/AABEIAwABaAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABgcBBAUCA//EAEQQAAIBAgQDBgMFBQYFBAMAAAECEQADBBIhMQVBUQYiYXGBEzKRobFCUrHB0QcjQvAVYnKSk+IWQ1PSJDRDgqP/xAAZAQEAAwEBAAAAAAAAAAAAAAAAAQIDBAX/xAAkEQEBAQACAgICAgMBAAAAAAAAAQIRAyESMQQTQVEiMmFx8P/aAAwBDAACEQMRAD8A9jREQEREBERAREQEREBERAREQERETI2z8B7M7tR3+3mN3An86C0m+HYo8gvw1ndjlwmxE9gNNHaeS5xwAV23QQ23AuXHKr6q/FzM8mGGe9kV5uK6nVdC0zQ9p1Q6e/DGf0WmR5mP2sCx3s6k8yC5fdZ1f2W3vVJQw+HyZj9g5m3v7VQeR88y49qDWk0d0kP6w+RY6hW8E3m2W+uVMhsvv0Xr6tM2W9uQv1qqk3hKk1GkgK5m1Q0rQjUSVqj0kJ5UgGqCAd+ZQPc1b7rN9STmGmW+I+u8D8e1J2Yb7v9k5dS6I4q1XrGk3Zk1d7h8M+qSg8+zVho+ozmD/AFh7v0zmmQ8ukltoPZ2A4eKj2UqV2I0d+v2jV0fAWktm1D8yq3oC1fxH5hP8A1m3P1m0/5a6Kk+Pud2t6pvTYb1w7J+Qk8vZ4Cj+1v/AM6z+Vq0c2o7U+3qgk5iX2Wm1IuA6isv3yX/ElLdbJf7d2mW6mv3PZk5gK1WJkP9ag+3Q6p7V1n5h1N6l6u1y0rP3T1Xx6gQh2c8WwBvM2kG5e8P6mB3VwYJfE1z0dK7aU7H1i3v3bF8Uz3w0nlJtrw8bqYqU6aRzZ5b9tQ9nY7Y2VDg7mJ4cxrVQWl3kq+q2lQvM79o5U4fQ7Xg1vMLqf3cDkNq2J1qk9jQY6k7vGfM2v0J1Qm8kY3JJ9oX3S7X5jVnG1R5nXnsh6jQOvfBv88VTvT1v8h1K1V3M0Z4zYIh5gIh5QwQciq5d6q9ySk0AqWmY3e2ptbMSt1mXzM2r4+q0mclJY2kW7HVzF7u8fPup1rWqkHkY9r5lM0rP0j2XW6uJqS1R0w2e9go+Pj1Fu2qzqvJrfa7rP3GNqUc6T0qS5d2i2W+QmWWxwQaS7K94beX6m2h4jv3kq9U2T8w7aP2PZbOmuqU1vznOf2Wcyi1vJcbiTq9wjsmY8iV3I3AB3M7nJrMc7uQjX7z0fX6rV0tY9Rkq7W9h0d1M6g2mT0NjL2kZ1Sg81Q1k6f0mJqfJbM6X7l1eW6c0K7q1qmp1qQ1zSgPjPboq88hEakZjtk3mQxzmPzQe3Nbv3Q2kX5a2xqvQk8NUp0k8cYtDbK8s3I0D2b6yV3oMaq6nK7B6P5h1Y1I1C7iU2H3Q3mN6UTGly6Qz6vJttbgfZ8tV3Ih5U5XrV8f5H2G3u3dQ6vYQvJ6tIu6bN0fZ7rN8m+1b7j0uL5wVp9Q6r3m1C0+3M7rZ1Kc5yE4jYbsk86jv2k8fK1r5x5Y6YbU9hK6ow3V9vPylP7lS+eZ0JqvNGy1rdu4Q0kObx9nH4T1kUr6J3r6JxzbF2H9J6x2S9mivkRdk+kkj4Mzt0Wf2n9tM6p6g3D1Pdbi7ktC0z3p0VtZpGt6eaD0Y4yD3jGq82xR0H4kW6G2nT5V74atf2a8n9PqVy3rQeSlsmt1yCNn+VvS8UjU+1X0Vg2s0pW6n8W4BzN1xK3h3pV3qB2Gd8fJcifWv4eJkW6p2lbVY9uP9OrM+naXaRRoaYT9V4fW7WbN+K0m4HxVb6k1b3Y7U7ob2p7n9Zq0w0pKvlX9pyj1C0Wq1W5jU1G9M8NQpHfM6n1NRTrB7u2V8q0i1fNf8AEd3bo3H4D7fX8l9xB6qg4SntG2gQmvKp4ob6d5iX9Wyu3rGqv4Mx1K1N5bUq0aGmU7S3Hkbe2P0Lv0qjL1Cq8yip2YtFzJv3lK9DkXWgJ2i0fS0+7mX6H0+IudWbW6esqYJ22g0jT3xvX9z4a1rovYfYyqYk9lK7n3+W1mP66n1I1Wkq0y7fQzv3YfWwTXjL1I5mF4c8j1s8JtJv0q5xZpI1f5h7u0+Q5mW3oX0dzNT0c5Zszc6a1vAeX6L8u9Q0+g0m9x3o0+o9p9L3+Sx6q1tZs8t0k8xF+J45P4VxQ1O5eL0v5X1Q2v6Gx8qO2P2W2Qm1kI1+N4mP6r+E+M9P60zc4rXna9Sg0h8nqu5PqfX9nJ1c2Z3l0NsvvP5V9xk5m3pV5q7U7qk0t2m2aN+QH1VbljV9p0bafm0iJ4eC6i0g1J0K1Vq0U9oO5x1E+q9zqvRkzDtxV8M5v3W9w7TFit+0dST8svmVx1gq9u6dJwWlY2M3cXWg9lHkq2mY3ItzF/M8qk2vY8KWXeq9UfZ6rV1rW+I5m7H2pTgJj7vD+o0a1r0t6mS6Z0fY8vPrP8AlYq3N1W0fakq0cNsY3e4R6vH6V2n0t2f+XeeX2bJYvYxmM8Q0u7UL9y9X5WOr0bT7E7iYwXW8q0+K2y27JXMXpVT1Y8Nw4bSm7a9o2bN9Z8RX2N6i7y9Y2r2bQ6m0uVvKn0n1RjLQwH3xLxn6VJ1W6r1zQ6bkV2i0kY6k6uZx7M1e0aFqQdS6c2vLYra0mS8z7c2m0J1i3m3I6x6m8lS8E7bl6fJ8xTq9o9eMdpj1A3a0V9ltP2tbm7l8VtZ5E1dX9U1R8R1mYv4m+2R3Vq2Jm2u0g8vTZ8lkb7cP8A3/8A1b7F1S1rV6nq1J6v2q5m1w2q3dlq5Kpax6SMcD2sE+4L4VQ6bV7fK1+0H2bWp7XW6tSlKXpaR1V3vY6mPqQ0Vqz8m8w2P7r4r7i1O6l7m6d2x2x6j2Y9jvQeYvRk1bfVv3uS3p4jG7eQe8Vv8AeU1bY7b4e+Xb+ZQ1q9a6Z3zY0MpxkB+Q6lVu0n7Ts0r7rL7wlf8A5g==";

async function api(path, options = {}, token = "") {
  const finalUrl = `${API_BASE}${path}`;

  async function requestOnce() {
    const res = await fetch(finalUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(token && token !== "__local_demo__" ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    let data = null;

    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      throw new Error(data?.message || `API error ${res.status} tại ${path}`);
    }

    return data;
  }

  try {
    return await requestOnce();
  } catch (err) {
    const msg = String(err?.message || "").toLowerCase();

    const maybeRenderSleeping =
      err instanceof TypeError ||
      msg.includes("failed to fetch") ||
      msg.includes("network") ||
      msg.includes("load failed");

    if (maybeRenderSleeping && !IS_LOCAL) {
      console.warn("Render backend có thể đang ngủ, thử gọi lại sau 2.5 giây:", finalUrl);

      await new Promise((resolve) => setTimeout(resolve, 2500));

      try {
        return await requestOnce();
      } catch {
        throw new Error(
          `Không kết nối được backend: ${API_BASE}. Backend có thể đang ngủ, lỗi CORS, hoặc Render đang lỗi. Hãy mở ${API_BASE}/api/health để kiểm tra.`
        );
      }
    }

    throw err;
  }
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

function formatMoneyPlain(value) {
  return Number(value || 0).toLocaleString("vi-VN");
}

function getTableOrderId(table) {
  if (!table?.currentOrder) return null;
  if (typeof table.currentOrder === "string") return table.currentOrder;

  if (typeof table.currentOrder === "object") {
    return table.currentOrder?._id || null;
  }

  return null;
}

function getOrderItemProductId(item) {
  if (!item?.product) return "";
  if (typeof item.product === "string") return item.product;
  return item.product?._id || "";
}

function getOrderTableId(order) {
  if (!order?.table) return "";
  if (typeof order.table === "string") return order.table;
  return order.table?._id || "";
}

function isOrderForTable(order, tableId) {
  return !!order?._id && String(getOrderTableId(order)) === String(tableId);
}

function getOrderTotal(order) {
  return Number(order?.subtotal || 0);
}

function getOrderQty(order) {
  return (order?.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function getUnreadCount(list, currentUserId) {
  return (list || []).filter((n) => !(n.readBy || []).includes(currentUserId)).length;
}

function getNotificationRead(item, currentUserId) {
  return (item.readBy || []).includes(currentUserId);
}

function emptyProductForm() {
  return {
    name: "",
    category: "Cà phê",
    price: "",
    stock: "",
    unit: "ly",
    isActive: true,
  };
}

function emptyImportForm() {
  return { quantity: "", note: "Nhập kho" };
}

function emptyWarehouseForm() {
  return { name: "", quantity: "", unit: "cái", note: "" };
}

function emptyUserForm() {
  return { name: "", username: "", password: "", role: "staff" };
}

function buildInvoiceNumber(order) {
  const paidAt = order?.paidAt ? new Date(order.paidAt) : new Date();
  const stamp = [
    paidAt.getFullYear(),
    String(paidAt.getMonth() + 1).padStart(2, "0"),
    String(paidAt.getDate()).padStart(2, "0"),
    String(paidAt.getHours()).padStart(2, "0"),
    String(paidAt.getMinutes()).padStart(2, "0"),
  ].join("");
  const shortId = String(order?._id || order?.id || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-6)
    .toUpperCase();
  return `HD${stamp}${shortId}`;
}

function buildTempSlipNumber(order) {
  const shortId = String(order?._id || order?.id || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-6)
    .toUpperCase();
  return shortId || "000001";
}

function normalizeArea(table) {
  const raw = String(table?.area || table?.zone || "").trim().toLowerCase();

  if (raw === "front" || raw === "sảnh trước" || raw === "sanh truoc") return "front";
  if (raw === "back" || raw === "sau công viên" || raw === "sau cong vien") return "back";
  if (raw === "vip") return "vip";
  if (
    raw === "other" ||
    raw === "khác" ||
    raw === "khac" ||
    raw === "mang về" ||
    raw === "mang ve" ||
    raw === "giao đi" ||
    raw === "giao di"
  ) {
    return "other";
  }

  return "other";
}

function getZoneLabel(table) {
  const area = normalizeArea(table);

  if (area === "front") return "Sảnh trước";
  if (area === "back") return "Sau công viên";
  if (area === "vip") return "VIP";
  return "Khác";
}

function getTableBusy(table) {
  if (!table?.currentOrder) return false;

  if (typeof table.currentOrder === "string") return true;

  if (typeof table.currentOrder === "object") {
    const items = Array.isArray(table.currentOrder.items) ? table.currentOrder.items : [];
    return items.length > 0;
  }

  return false;
}

function normalizeIncomingTable(table) {
  const area = normalizeArea(table);

  return {
    ...table,
    area,
    zone: getZoneLabel({ ...table, area }),
  };
}

function getTableNumber(table) {
  const match = String(table?.name || "").match(/\d+/);
  return match ? Number(match[0]) : 9999;
}

function sortByTableNumber(list) {
  return [...list].sort((a, b) => getTableNumber(a) - getTableNumber(b));
}

function isTableNumberBetween(table, min, max) {
  const name = String(table?.name || "").toLowerCase();
  if (!name.includes("bàn") && !name.includes("ban")) return false;
  const number = getTableNumber(table);
  return number >= min && number <= max;
}

function isTakeawayOrDelivery(table) {
  const name = String(table?.name || "").toLowerCase();
  return name.includes("giao") || name.includes("mang");
}

function getDateKey(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getTodayDateKey() {
  return getDateKey(new Date());
}

function formatDateVN(dateKey) {
  if (!dateKey) return "";
  const [y, m, d] = String(dateKey).split("-");
  if (!y || !m || !d) return dateKey;
  return `${d}/${m}/${y}`;
}

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  const [token, setToken] = useState(localStorage.getItem("forever_token") || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("forever_user") || "null");
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const [activeMainTab, setActiveMainTab] = useState("sales");
  const [activeAdminTab, setActiveAdminTab] = useState("products");
  const [mobileTab, setMobileTab] = useState("tables");

  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouseItems, setWarehouseItems] = useState([]);
  const [warehouseLogs, setWarehouseLogs] = useState([]);
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [reportSummary, setReportSummary] = useState(null);

  const [selectedTableId, setSelectedTableId] = useState("");
  const [currentOrder, setCurrentOrder] = useState(null);

  const [productKeyword, setProductKeyword] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("Tất cả");
  const [warehouseKeyword, setWarehouseKeyword] = useState("");

  const [productForm, setProductForm] = useState(emptyProductForm());
  const [editingProductId, setEditingProductId] = useState(null);

  const [importProductId, setImportProductId] = useState("");
  const [importForm, setImportForm] = useState(emptyImportForm());

  const [warehouseForm, setWarehouseForm] = useState(emptyWarehouseForm());
  const [editingWarehouseId, setEditingWarehouseId] = useState(null);

  const [userForm, setUserForm] = useState(emptyUserForm());

  const [showMoreHistory, setShowMoreHistory] = useState(false);
  const [reportDate, setReportDate] = useState(getTodayDateKey());
  const [splitMode, setSplitMode] = useState(false);
  const [splitItems, setSplitItems] = useState({});
  const syncTimerRef = useRef(null);
  const lastSeenNotificationIdRef = useRef(null);

  const isAdmin = user?.role === "admin";
  const unreadCount = getUnreadCount(notifications, user?.id);

  const selectedTable = useMemo(
    () => tables.find((t) => t._id === selectedTableId) || null,
    [tables, selectedTableId]
  );

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["Tất cả", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const activeOk = item.isActive !== false;
      const keywordOk = item.name?.toLowerCase().includes(productKeyword.trim().toLowerCase());
      const categoryOk =
        productCategoryFilter === "Tất cả" || item.category === productCategoryFilter;
      return activeOk && keywordOk && categoryOk;
    });
  }, [products, productKeyword, productCategoryFilter]);

  const filteredWarehouse = useMemo(() => {
    return warehouseItems.filter((item) =>
      item.name?.toLowerCase().includes(warehouseKeyword.trim().toLowerCase())
    );
  }, [warehouseItems, warehouseKeyword]);

  const visibleHistory = useMemo(() => {
    return showMoreHistory ? historyOrders : historyOrders.slice(0, 20);
  }, [historyOrders, showMoreHistory]);

  const pendingRevenue = useMemo(() => {
    return (tables || []).reduce((sum, table) => {
      const order = table?.currentOrder;

      if (order && typeof order === "object") {
        return sum + Number(order.subtotal || order.total || 0);
      }

      return sum;
    }, 0);
  }, [tables]);

  const selectedDayOrders = useMemo(() => {
    return (historyOrders || []).filter((order) => getDateKey(order?.paidAt || order?.updatedAt || order?.createdAt) === reportDate);
  }, [historyOrders, reportDate]);

  const selectedDayRevenue = useMemo(() => {
    return selectedDayOrders.reduce((sum, order) => sum + Number(order?.subtotal || order?.total || 0), 0);
  }, [selectedDayOrders]);

  const revenueHistoryByDay = useMemo(() => {
    const map = new Map();

    (historyOrders || []).forEach((order) => {
      const key = getDateKey(order?.paidAt || order?.updatedAt || order?.createdAt);
      if (!key) return;

      const current = map.get(key) || { date: key, revenue: 0, orders: 0 };
      current.revenue += Number(order?.subtotal || order?.total || 0);
      current.orders += 1;
      map.set(key, current);
    });

    return Array.from(map.values()).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }, [historyOrders]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (token) {
      startSync();
    } else {
      stopSync();
    }
    return () => stopSync();
  }, [token]);

  useEffect(() => {
    if (!tables.length) return;
    if (!selectedTableId) {
      setSelectedTableId(tables[0]._id);
      return;
    }
    const exists = tables.some((t) => t._id === selectedTableId);
    if (!exists) setSelectedTableId(tables[0]._id);
  }, [tables, selectedTableId]);

  useEffect(() => {
    if (!selectedTableId || !token) return;
    refreshCurrentOrderForTable(selectedTableId);
  }, [selectedTableId, tables.length, token]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const username = String(loginForm.username || "").trim();
    const password = String(loginForm.password || "").trim();

    try {
      try {
        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        });

        localStorage.setItem("forever_token", data.token || "__backend__");
        localStorage.setItem("forever_user", JSON.stringify(data.user));
        setToken(data.token || "__backend__");
        setUser(data.user);
        setToast("Đăng nhập thành công");
        return;
      } catch (err) {
        const msg = String(err?.message || "");
        const is404 = msg.includes("404");

        if (!is404) {
          throw err;
        }
      }

      let localUser = null;

      if (username === "admin" && password === "123456") {
        localUser = {
          id: "local-admin",
          name: "Admin",
          username: "admin",
          role: "admin",
        };
      } else if (username === "staff" && password === "123456") {
        localUser = {
          id: "local-staff",
          name: "Nhân viên",
          username: "staff",
          role: "staff",
        };
      }

      if (!localUser) {
        throw new Error("Sai tài khoản hoặc mật khẩu");
      }

      localStorage.setItem("forever_token", "__local_demo__");
      localStorage.setItem("forever_user", JSON.stringify(localUser));
      setToken("__local_demo__");
      setUser(localUser);
      setToast("Đăng nhập thành công");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("forever_token");
    localStorage.removeItem("forever_user");
    setToken("");
    setUser(null);
    setTables([]);
    setProducts([]);
    setWarehouseItems([]);
    setWarehouseLogs([]);
    setInventoryLogs([]);
    setUsers([]);
    setNotifications([]);
    setHistoryOrders([]);
    setReportSummary(null);
    setCurrentOrder(null);
    setSelectedTableId("");
    setToast("Đã đăng xuất");
  }

  function goHome() {
    setActiveMainTab("sales");
    setMobileTab("tables");
  }

  function startSync() {
    stopSync();
    syncAll();
    syncTimerRef.current = setInterval(syncAll, SYNC_INTERVAL);
  }

  function stopSync() {
    if (syncTimerRef.current) {
      clearInterval(syncTimerRef.current);
      syncTimerRef.current = null;
    }
  }

  async function syncAll() {
    if (!token) return;
    setSyncing(true);

    try {
      const tasks = [
        api("/api/tables", {}, token),
        api("/api/products", {}, token),
        api("/api/orders/history?limit=500", {}, token),
        api("/api/reports/summary", {}, token),
        api("/api/warehouse", {}, token),
        api("/api/notifications?limit=100", {}, token),
      ];

      if (isAdmin) {
        tasks.push(api("/api/auth/users", {}, token));
        tasks.push(api("/api/warehouse/logs", {}, token));
        tasks.push(api("/api/products/inventory/logs", {}, token));
      }

      const results = await Promise.allSettled(tasks);

      const nextTables = results[0].status === "fulfilled" ? results[0].value : [];
      const nextProducts = results[1].status === "fulfilled" ? results[1].value : [];
      const nextHistory = results[2].status === "fulfilled" ? results[2].value : [];
      const nextReport = results[3].status === "fulfilled" ? results[3].value : null;
      const nextWarehouse = results[4].status === "fulfilled" ? results[4].value : [];
      const nextNotifications = results[5].status === "fulfilled" ? results[5].value : [];

      setTables(
        Array.isArray(nextTables) ? nextTables.map((table) => normalizeIncomingTable(table)) : []
      );
      setProducts(Array.isArray(nextProducts) ? nextProducts : []);
      setHistoryOrders(Array.isArray(nextHistory) ? nextHistory : []);
      setReportSummary(nextReport || null);
      setWarehouseItems(Array.isArray(nextWarehouse) ? nextWarehouse : []);

      const notificationList = Array.isArray(nextNotifications) ? nextNotifications : [];
      setNotifications(notificationList);

      if (notificationList.length > 0) {
        const latest = notificationList[0];

        if (
          lastSeenNotificationIdRef.current &&
          latest?._id &&
          latest._id !== lastSeenNotificationIdRef.current &&
          latest.type === "payment"
        ) {
          setToast(latest.message || "Có bàn vừa thanh toán");
        }

        if (latest?._id) {
          lastSeenNotificationIdRef.current = latest._id;
        }
      }

      if (isAdmin) {
        setUsers(Array.isArray(results[6]?.value) ? results[6].value : []);
        setWarehouseLogs(Array.isArray(results[7]?.value) ? results[7].value : []);
        setInventoryLogs(Array.isArray(results[8]?.value) ? results[8].value : []);
      }

      if (selectedTableId) {
        await refreshCurrentOrderForTable(selectedTableId, nextTables);
      }

      setError("");
    } catch (err) {
      setError(err.message || "Lỗi đồng bộ dữ liệu");
    } finally {
      setSyncing(false);
    }
  }

  async function refreshCurrentOrderForTable(tableId, tableList = tables) {
    try {
      const table = (tableList || tables || []).find((t) => String(t._id) === String(tableId));

      if (!table) {
        setCurrentOrder(null);
        return null;
      }

      if (table.currentOrder && typeof table.currentOrder === "object" && table.currentOrder._id) {
        setCurrentOrder(table.currentOrder);
        return table.currentOrder;
      }

      const orderId = getTableOrderId(table);

      if (!orderId) {
        setCurrentOrder(null);
        return null;
      }

      const order = await api(`/api/orders/${orderId}`, {}, token);
      setCurrentOrder(order);
      return order;
    } catch (err) {
      console.error("❌ REFRESH ORDER ERROR:", err);
      setCurrentOrder(null);
      return null;
    }
  }

  async function ensureCurrentOrder(tableId) {
    if (!tableId) {
      setToast("Chọn bàn trước");
      return null;
    }

    const table = tables.find((t) => t._id === tableId);
    if (!table) {
      setToast("Không tìm thấy bàn");
      return null;
    }

    if (isOrderForTable(currentOrder, tableId)) {
      return currentOrder;
    }

    if (table.currentOrder && typeof table.currentOrder === "object" && table.currentOrder._id) {
      setCurrentOrder(table.currentOrder);
      return table.currentOrder;
    }

    const existingOrderId = getTableOrderId(table);
    if (existingOrderId) {
      const existingOrder = await refreshCurrentOrderForTable(tableId);
      if (existingOrder?._id) return existingOrder;
    }

    const openOrderOnce = async () => {
      console.log("🟢 OPEN ORDER FOR TABLE:", tableId);
      const order = await api(`/api/orders/table/${tableId}/open`, { method: "POST" }, token);

      if (!order?._id) {
        throw new Error("Backend trả về order nhưng thiếu _id");
      }

      console.log("✅ OPEN ORDER SUCCESS:", order);
      setCurrentOrder(order);
      return order;
    };

    try {
      const order = await openOrderOnce();
      await syncAll();
      return order;
    } catch (err) {
      console.error("❌ OPEN ORDER FIRST TRY ERROR:", err);

      try {
        console.warn("⚠️ Đang reset currentOrder cũ của bàn rồi mở lại order:", tableId);
        await api(
          `/api/tables/${tableId}`,
          {
            method: "PUT",
            body: JSON.stringify({ currentOrder: null, status: "empty" }),
          },
          token
        );

        const order = await openOrderOnce();
        await syncAll();
        return order;
      } catch (err2) {
        console.error("❌ OPEN ORDER FINAL ERROR:", err2);
        setCurrentOrder(null);
        setError(err2.message || "Không mở được đơn cho bàn này");
        setToast("Không mở được đơn cho bàn này");
        return null;
      }
    }
  }

  async function addProductToOrder(product) {
    try {
      if (!selectedTableId) {
        setToast("Chọn bàn trước");
        return;
      }

      if (!product?._id) {
        setToast("Món không hợp lệ");
        return;
      }

      setError("");
      console.log("🟢 CLICK ADD PRODUCT:", product);

      const order = await ensureCurrentOrder(selectedTableId);

      if (!order?._id) {
        const msg = "Không tạo được đơn thật cho bàn này. Kiểm tra backend route POST /api/orders/table/:tableId/open.";
        setError(msg);
        setToast("Không tạo được đơn cho bàn này");
        console.warn("⚠️ Không có order._id sau ensureCurrentOrder", order);
        return;
      }

      console.log("🟢 ORDER ID:", order._id);

      const nextOrder = await api(
        `/api/orders/${order._id}/items`,
        {
          method: "POST",
          body: JSON.stringify({
            productId: product._id,
            quantity: 1,
          }),
        },
        token
      );

      console.log("✅ ADD ITEM SUCCESS:", nextOrder);

      setCurrentOrder(nextOrder);
      setToast(`Đã thêm ${product.name || "món"}`);
      await syncAll();
    } catch (err) {
      console.error("❌ ADD PRODUCT ERROR:", err);
      setError(err.message || "Không thêm món được");
    }
  }

  async function updateOrderItemQuantity(item, nextQty) {
    try {
      if (!currentOrder?._id) return;

      const nextOrder = await api(
        `/api/orders/${currentOrder._id}/items/${item.product}`,
        {
          method: "PUT",
          body: JSON.stringify({ quantity: nextQty }),
        },
        token
      );

      setCurrentOrder(nextOrder);
      await syncAll();
    } catch (err) {
      setError(err.message || "Không cập nhật món được");
    }
  }

  function updateSplitItem(item, nextQty) {
    const productId = getOrderItemProductId(item);
    if (!productId) return;

    const maxQty = Number(item.quantity || 0);
    const safeQty = Math.max(0, Math.min(Number(nextQty || 0), maxQty));

    setSplitItems((prev) => ({
      ...prev,
      [productId]: safeQty,
    }));
  }

  function buildSplitOrder() {
    const items = (currentOrder?.items || [])
      .map((item) => {
        const productId = getOrderItemProductId(item);
        const qty = Number(splitItems[productId] || 0);

        if (qty <= 0) return null;

        return {
          ...item,
          product: productId,
          quantity: qty,
        };
      })
      .filter(Boolean);

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    return {
      ...currentOrder,
      _id: currentOrder?._id ? `${currentOrder._id}-split` : "split-bill",
      items,
      subtotal,
      total: subtotal,
      paidAt: new Date().toISOString(),
    };
  }

  function getSplitTotal() {
    return buildSplitOrder().subtotal || 0;
  }

  function resetSplitBill() {
    setSplitMode(false);
    setSplitItems({});
  }

  function printSplitBill() {
    const splitOrder = buildSplitOrder();

    if (!splitOrder.items.length) {
      setToast("Chọn món cần tách bill");
      return;
    }

    printBill(
      splitOrder,
      `${selectedTable?.name || "Bàn"} - Tách bill`,
      user?.name || "admin",
      true
    );

    setToast("Đã in bill tách");
  }

  async function paySplitBill() {
    try {
      if (!currentOrder?._id) {
        setToast("Chưa có đơn để tách bill");
        return;
      }

      const splitOrder = buildSplitOrder();

      if (!splitOrder.items.length) {
        setToast("Chọn món cần thanh toán");
        return;
      }

      printBill(
        splitOrder,
        `${selectedTable?.name || "Bàn"} - Tách bill`,
        user?.name || "admin",
        false
      );

      let latestOrder = currentOrder;

      for (const splitItem of splitOrder.items) {
        const originalItem = (latestOrder.items || []).find(
          (item) => String(getOrderItemProductId(item)) === String(splitItem.product)
        );

        if (!originalItem) continue;

        const nextQty = Math.max(
          0,
          Number(originalItem.quantity || 0) - Number(splitItem.quantity || 0)
        );

        latestOrder = await api(
          `/api/orders/${currentOrder._id}/items/${splitItem.product}`,
          {
            method: "PUT",
            body: JSON.stringify({ quantity: nextQty }),
          },
          token
        );
      }

      setCurrentOrder(latestOrder);
      resetSplitBill();

      try {
        await createNotification({
          type: "payment",
          title: "Thanh toán tách bill",
          message: `${selectedTable?.name || "Bàn"} đã thanh toán tách bill ${formatMoney(splitOrder.subtotal)}`,
          level: "success",
          meta: {
            tableName: selectedTable?.name || "Bàn",
            total: Number(splitOrder.subtotal || 0),
            split: true,
          },
        });
      } catch {
        // ignore notification error
      }

      await syncAll();
      await refreshCurrentOrderForTable(selectedTableId);
      setToast("Đã thanh toán phần tách bill");
    } catch (err) {
      console.error("❌ PAY SPLIT BILL ERROR:", err);
      setError(err.message || "Không thanh toán được bill tách");
    }
  }

  async function payCurrentOrder() {
    try {
      if (!currentOrder?._id || !(currentOrder.items || []).length) {
        setToast("Đơn hiện tại đang trống");
        return;
      }

      const paidOrder = await api(
        `/api/orders/${currentOrder._id}/pay`,
        { method: "POST" },
        token
      );

      try {
        await createNotification({
          type: "payment",
          title: "Thanh toán bàn",
          message: `${selectedTable?.name || "Bàn"} đã thanh toán ${formatMoney(paidOrder?.subtotal || currentOrder?.subtotal || 0)}`,
          level: "success",
          meta: {
            tableName: selectedTable?.name || "Bàn",
            total: Number(paidOrder?.subtotal || currentOrder?.subtotal || 0),
          },
        });
      } catch {
        // ignore
      }

      printBill(paidOrder, selectedTable?.name || "Bàn", user?.name || "admin", false);

      setCurrentOrder(null);
      await syncAll();
      setToast("Thanh toán thành công");
    } catch (err) {
      setError(err.message || "Không thanh toán được");
    }
  }

  async function createNotification(payload) {
    return api(
      "/api/notifications",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token
    );
  }

  async function markNotificationRead(id) {
    try {
      const updated = await api(`/api/notifications/${id}/read`, { method: "PUT" }, token);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
    } catch (err) {
      setError(err.message || "Không đánh dấu đã đọc được");
    }
  }

  async function markAllNotificationsRead() {
    try {
      await api("/api/notifications/read-all/all", { method: "PUT" }, token);
      await syncAll();
    } catch (err) {
      setError(err.message || "Không cập nhật được tất cả thông báo");
    }
  }

  async function seedDefaultTables() {
    try {
      await api("/api/tables/seed-default", { method: "POST" }, token);
      await createNotification({
        type: "system",
        title: "Khởi tạo bàn",
        message: "Đã tạo bộ bàn mặc định cho quán",
        level: "info",
      });
      await syncAll();
      setToast("Đã tạo bàn mặc định");
    } catch (err) {
      setError(err.message || "Không tạo được bàn mặc định");
    }
  }

  async function saveProduct() {
    try {
      const payload = {
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price || 0),
        stock: Number(productForm.stock || 0),
        unit: productForm.unit,
        isActive: productForm.isActive,
      };

      if (!payload.name.trim()) {
        setToast("Nhập tên món");
        return;
      }

      if (editingProductId) {
        await api(
          `/api/products/${editingProductId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
          token
        );
        await createNotification({
          type: "product",
          title: "Cập nhật sản phẩm",
          message: `Đã cập nhật món ${payload.name} - giá ${formatMoney(payload.price)}`,
          level: "info",
          meta: {
            productName: payload.name,
            price: Number(payload.price || 0),
            action: "update",
          },
        });
        setToast("Đã cập nhật món");
      } else {
        await api(
          "/api/products",
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
          token
        );
        await createNotification({
          type: "product",
          title: "Thêm sản phẩm",
          message: `Đã thêm món ${payload.name} - giá ${formatMoney(payload.price)}`,
          level: "success",
          meta: {
            productName: payload.name,
            price: Number(payload.price || 0),
            action: "create",
          },
        });
        setToast("Đã thêm món");
      }

      setProductForm(emptyProductForm());
      setEditingProductId(null);
      await syncAll();
    } catch (err) {
      setError(err.message || "Không lưu được sản phẩm");
    }
  }

  function startEditProduct(item) {
    setEditingProductId(item._id);
    setProductForm({
      name: item.name || "",
      category: item.category || "Khác",
      price: item.price ?? "",
      stock: item.stock ?? "",
      unit: item.unit || "ly",
      isActive: item.isActive !== false,
    });
    setActiveMainTab("admin");
    setActiveAdminTab("products");
  }

  async function importProductStock() {
    try {
      if (!importProductId || Number(importForm.quantity || 0) <= 0) {
        setToast("Nhập số lượng nhập kho hợp lệ");
        return;
      }

      await api(
        `/api/products/${importProductId}/import`,
        {
          method: "POST",
          body: JSON.stringify({
            quantity: Number(importForm.quantity || 0),
            note: importForm.note,
          }),
        },
        token
      );

      const productName = products.find((p) => p._id === importProductId)?.name || "sản phẩm";
      await createNotification({
        type: "stock",
        title: "Nhập kho sản phẩm",
        message: `Đã nhập kho ${productName} với số lượng ${Number(importForm.quantity || 0)}, tồn kho là ${(products.find((p) => p._id === importProductId)?.stock || 0) + Number(importForm.quantity || 0)}`,
        level: "success",
        meta: {
          productName,
          quantity: Number(importForm.quantity || 0),
          nextStock: (products.find((p) => p._id === importProductId)?.stock || 0) + Number(importForm.quantity || 0),
        },
      });

      setImportForm(emptyImportForm());
      setImportProductId("");
      setToast("Đã nhập kho sản phẩm");
      await syncAll();
    } catch (err) {
      setError(err.message || "Không nhập kho được");
    }
  }

  async function saveWarehouseItem() {
    try {
      const payload = {
        name: warehouseForm.name,
        quantity: Number(warehouseForm.quantity || 0),
        unit: warehouseForm.unit,
        note: warehouseForm.note,
      };

      if (!payload.name.trim()) {
        setToast("Nhập tên hàng kho");
        return;
      }

      if (editingWarehouseId) {
        await api(
          `/api/warehouse/${editingWarehouseId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
          token
        );
        await createNotification({
          type: "warehouse",
          title: "Cập nhật vật tư",
          message: `Đã sửa đổi vật tư ${payload.name}, số lượng hiện tại ${payload.quantity} ${payload.unit}`,
          level: "info",
        });
        setToast("Đã sửa vật tư kho");
      } else {
        await api(
          "/api/warehouse",
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
          token
        );
        await createNotification({
          type: "warehouse",
          title: "Thêm vật tư mới",
          message: `Đã bổ sung vật tư ${payload.name} vào danh sách quản lý kho`,
          level: "success",
        });
        setToast("Đã tạo vật tư mới");
      }

      setWarehouseForm(emptyWarehouseForm());
      setEditingWarehouseId(null);
      await syncAll();
    } catch (err) {
      setError(err.message || "Không lưu được vật tư kho");
    }
  }

  function startEditWarehouse(item) {
    setEditingWarehouseId(item._id);
    setWarehouseForm({
      name: item.name || "",
      quantity: item.quantity ?? "",
      unit: item.unit || "cái",
      note: item.note || "",
    });
  }

  async function deleteWarehouseItem(id) {
    if (!window.confirm("Bạn muốn xoá vật tư này khỏi kho?")) return;
    try {
      await api(`/api/warehouse/${id}`, { method: "DELETE" }, token);
      setToast("Đã xoá vật tư");
      await syncAll();
    } catch (err) {
      setError(err.message || "Không xoá được vật tư");
    }
  }

  async function toggleProductActive(id, currentStatus) {
    try {
      const nextStatus = currentStatus === false;
      await api(
        `/api/products/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({ isActive: nextStatus }),
        },
        token
      );
      setToast(nextStatus ? "Đã hiện món" : "Đã ẩn món");
      await syncAll();
    } catch (err) {
      setError(err.message || "Không cập nhật trạng thái món");
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.username.trim() || !userForm.password.trim()) {
      setToast("Điền đủ thông tin tài khoản");
      return;
    }

    try {
      await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userForm),
      }, token);

      setUserForm(emptyUserForm());
      setToast("Tạo tài khoản thành công");
      await syncAll();
    } catch (err) {
      setError(err.message || "Không tạo được tài khoản");
    }
  }

  async function deleteUser(id) {
    if (!window.confirm("Bạn muốn xoá tài khoản này?")) return;
    try {
      await api(`/api/auth/users/${id}`, { method: "DELETE" }, token);
      setToast("Đã xoá tài khoản");
      await syncAll();
    } catch (err) {
      setError(err.message || "Không xoá được tài khoản");
    }
  }

  function printBill(order, tableName, cashierName, isTemporary = false) {
    if (!order) return;

    const items = order.items || [];
    const subtotal = Number(order.subtotal || 0);

    const invoiceNum = isTemporary ? buildTempSlipNumber(order) : buildInvoiceNumber(order);
    const dateStr = new Date(order.paidAt || order.updatedAt || order.createdAt).toLocaleString("vi-VN");

    const w = window.open("", "_blank", "width=400,height=600");
    if (!w) {
      setToast("Trình duyệt chặn Popup, hãy cho phép hiển thị cửa sổ bật lên");
      return;
    }

    let itemsHtml = "";
    items.forEach((item, idx) => {
      const name = item.name || "Sản phẩm";
      const q = Number(item.quantity || 0);
      const p = Number(item.price || 0);
      const t = q * p;

      itemsHtml += `
        <tr>
          <td style="padding:4px 0; font-size:14px;">${idx + 1}. ${name}</td>
          <td style="text-align:center; padding:4px 0; font-size:14px;">${q}</td>
          <td style="text-align:right; padding:4px 0; font-size:14px;">${formatMoneyPlain(p)}</td>
          <td style="text-align:right; padding:4px 0; font-size:14px; font-weight:bold;">${formatMoneyPlain(t)}</td>
        </tr>
      `;
    });

    let paymentQrHtml = "";
    if (!isTemporary && subtotal > 0) {
      const quickLinkPaymentQr = `https://img.vietqr.io/image/mbbank-0788880891-compact2.jpg?amount=${subtotal}&addInfo=FOREVER%20POS%20${invoiceNum}&accountName=FOREVER%20COFFEE%20BEER`;

      paymentQrHtml = `
        <div style="text-align:center; margin-top:15px; border-top:1px dashed #000; padding-top:12px;">
          <p style="font-size:13px; margin:0 0 6px 0; font-weight:bold; text-transform:uppercase;">MÃ QR THANH TOÁN (VIETQR)</p>
          <img src="${quickLinkPaymentQr}" style="width:170px; height:170px; border:1px solid #eee; padding:4px; background:#fff;" alt="VietQR Payment Code"/>
          <p style="font-size:11px; color:#555; margin:4px 0 0 0; font-style:italic;">Quét để chuyển khoản tự động chính xác số tiền</p>
        </div>
      `;
    }

    w.document.write(`
      <html>
      <head>
        <title>In Hoá Đơn - FOREVER POS</title>
        <style>
          @page { size: A8; margin: 0; }
          body { font-family: 'Courier New', Courier, monospace; color:#000; background:#fff; margin:0; padding:8px; width:280px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .title { font-size: 16px; margin: 4px 0; text-transform: uppercase; font-weight:900; }
          .subtitle { font-size: 11px; margin: 2px 0; }
          .divider { border-top: 1px dashed #000; margin: 8px 0; }
          table { width: 100%; border-collapse: collapse; }
          th { border-bottom: 1px solid #000; padding: 4px 0; font-size:12px; }
        </style>
      </head>
      <body>
        <div class="center">
          <p class="title">FOREVER COFFEE & BEER</p>
          <p class="subtitle">Đ/c: B48 đường 4A, P. Tân Hưng, Q.7</p>
          <p class="subtitle">SĐT: 078.888.0891</p>
          <div class="divider"></div>
          <p style="font-size:15px; margin:4px 0; font-weight:bold; text-transform:uppercase;">
            ${isTemporary ? "PHIẾU TẠM TÍNH" : "HOÁ ĐƠN THANH TOÁN"}
          </p>
          <p class="subtitle" style="font-weight:bold;">${tableName}</p>
        </div>

        <div style="font-size:12px; margin:8px 0;">
          <p style="margin:2px 0;">Mã số: ${invoiceNum}</p>
          <p style="margin:2px 0;">Ngày: ${dateStr}</p>
          <p style="margin:2px 0;">Thu ngân: ${cashierName}</p>
        </div>

        <div class="divider"></div>

        <table>
          <thead>
            <tr>
              <th style="text-align:left;">Tên món</th>
              <th style="width:30px; text-align:center;">SL</th>
              <th style="width:55px; text-align:right;">Giá</th>
              <th style="width:65px; text-align:right;">T.Tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="divider"></div>

        <div style="font-size:14px;">
          <div style="display:flex; justify-content:space-between; font-weight:bold; padding:2px 0;">
            <span>TỔNG CỘNG:</span>
            <span>${formatMoneyPlain(subtotal)}đ</span>
          </div>
        </div>

        <div class="divider"></div>
        <div class="center" style="font-size:11px; font-style:italic; margin-top:10px;">
          <p style="margin:2px 0; font-weight:bold;">FOREVER COFFEE & BEER XIN CẢM ƠN!</p>
          <p style="margin:2px 0;">Hẹn gặp lại quý khách lần sau</p>
        </div>

        ${paymentQrHtml}

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `);
    w.document.close();
  }

  if (!token) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-header">
            <div className="lion-badge">🦁</div>
            <h1>FOREVER POS</h1>
            <p>Hệ thống Quản lý Cafe & Beer - Từ năm 2019</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Tài khoản</label>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập (ví dụ: admin)"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu hệ thống"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Đang xác thực thông tin..." : "Đăng Nhập Vào Hệ Thống"}
            </button>
          </form>

          <div className="login-footer">
            <p>💡 Tài khoản trải nghiệm nhanh:</p>
            <p>Admin: tài khoản <strong>admin</strong> / mật khẩu <strong>123456</strong></p>
            <p>Nhân viên: tài khoản <strong>staff</strong> / mật khẩu <strong>123456</strong></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-left" onClick={goHome} style={{ cursor: "pointer" }}>
          <span className="logo-icon">🦁</span>
          <div>
            <h1 className="topbar-title">FOREVER COFFEE & BEER</h1>
            <p className="topbar-subtitle">Hệ thống quản lý chuỗi bán hàng chuyên nghiệp</p>
          </div>
          {syncing && <span className="sync-spinner">🔄</span>}
        </div>

        <div className="topbar-right">
          <div className="main-tabs">
            <button
              className={`tab-btn ${activeMainTab === "sales" ? "active" : ""}`}
              onClick={() => setActiveMainTab("sales")}
            >
              📊 Bàn Máy POS
            </button>
            <button
              className={`tab-btn ${activeMainTab === "admin" ? "active" : ""}`}
              onClick={() => {
                setActiveMainTab("admin");
                setActiveAdminTab("products");
              }}
            >
              🛠️ Khu Quản Lý
            </button>
            <button
              className={`tab-btn ${activeMainTab === "reports" ? "active" : ""}`}
              onClick={() => setActiveMainTab("reports")}
            >
              💰 Báo Cáo Doanh Thu
            </button>
            <button
              className={`tab-btn ${activeMainTab === "notifications" ? "active" : ""}`}
              onClick={() => setActiveMainTab("notifications")}
            >
              🔔 Thông Báo {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
          </div>

          <div className="user-profile">
            <div className="avatar">👤</div>
            <div className="info desktop-only">
              <span className="name">{user?.name || "Nhân viên"}</span>
              <span className="role">{isAdmin ? "Quản trị viên" : "Thu ngân"}</span>
            </div>
            <button className="logout-icon" onClick={handleLogout} title="Đăng xuất">
              🚪
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger global-alert">
          <strong>⚠️ Thông báo lỗi:</strong> {error}
          <button className="close-btn" onClick={() => setError("")}>×</button>
        </div>
      )}

      {toast && (
        <div className="toast-message">
          <span className="icon">✅</span> {toast}
        </div>
      )}

      <div className="main-content">
        {activeMainTab === "sales" && (
          <div className={`sales-layout ${!isMobile ? "desktop-layout" : ""}`}>
            {(!isMobile || mobileTab === "tables") && (
              <div className="left">
                <div className="panel-header">
                  <h3>🗺️ Sơ đồ bàn ăn của quán</h3>
                  <span className="stats-text">Tổng cộng: {tables.length} vị trí</span>
                </div>

                <div className="zone-section">
                  <h4 className="zone-title">Sảnh trước bàn 1 - bàn 15</h4>
                  <div className="table-grid">
                    {sortByTableNumber(tables.filter(t => isTableNumberBetween(t, 1, 15))).map((table) => {
                      const busy = getTableBusy(table);
                      const isSelected = table._id === selectedTableId;
                      return (
                        <div
                          key={table._id}
                          className={`table-card ${busy ? "busy" : "empty"} ${isSelected ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedTableId(table._id);
                            if (isMobile) setMobileTab("order");
                          }}
                        >
                          <div className="status-dot"></div>
                          <div className="table-name">{table.name || "Bàn"}</div>
                          <div className="order-summary">
                            {busy ? formatMoney(table.currentOrder?.subtotal || table.currentOrder?.total || 0) : "Bàn trống"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="zone-section">
                  <h4 className="zone-title">Sau công viên bàn 16 - bàn 30</h4>
                  <div className="table-grid">
                    {sortByTableNumber(tables.filter(t => isTableNumberBetween(t, 16, 30))).map((table) => {
                      const busy = getTableBusy(table);
                      const isSelected = table._id === selectedTableId;
                      return (
                        <div
                          key={table._id}
                          className={`table-card ${busy ? "busy" : "empty"} ${isSelected ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedTableId(table._id);
                            if (isMobile) setMobileTab("order");
                          }}
                        >
                          <div className="status-dot"></div>
                          <div className="table-name">{table.name || "Bàn"}</div>
                          <div className="order-summary">
                            {busy ? formatMoney(table.currentOrder?.subtotal || table.currentOrder?.total || 0) : "Bàn trống"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="zone-section">
                  <h4 className="zone-title">Khu vực Mang về & Giao đi</h4>
                  <div className="table-grid">
                    {sortByTableNumber(tables.filter(t => isTakeawayOrDelivery(t))).map((table) => {
                      const busy = getTableBusy(table);
                      const isSelected = table._id === selectedTableId;
                      return (
                        <div
                          key={table._id}
                          className={`table-card takeaway-card ${busy ? "busy" : "empty"} ${isSelected ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedTableId(table._id);
                            if (isMobile) setMobileTab("order");
                          }}
                        >
                          <div className="status-dot"></div>
                          <div className="table-name">🛍️ {table.name || "Mang đi"}</div>
                          <div className="order-summary">
                            {busy ? formatMoney(table.currentOrder?.subtotal || table.currentOrder?.total || 0) : "Trống"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {isAdmin && tables.length === 0 && (
                  <div className="empty-state">
                    <p>Chưa có sơ đồ bàn nào được thiết lập trên hệ thống</p>
                    <button className="btn btn-secondary" onClick={seedDefaultTables}>
                      Khởi tạo nhanh 30 bàn mẫu mặc định
                    </button>
                  </div>
                )}
              </div>
            )}

            {(!isMobile || mobileTab === "order") && (
              <div className="center-billing">
                <div className="panel-header flex-header">
                  <div>
                    <h3>🧾 Đơn hàng hiện tại</h3>
                    <p className="current-table-label">
                      Vị trí: <strong>{selectedTable ? selectedTable.name : "Chưa chọn bàn"}</strong>
                    </p>
                  </div>
                  {isMobile && (
                    <button className="btn btn-sm btn-secondary" onClick={() => setMobileTab("tables")}>
                      ⬅️ Đổi Bàn
                    </button>
                  )}
                </div>

                <div className="order-box-container">
                  {splitMode && (
                    <div className="split-banner">
                      <div>
                        <strong>Mode: Tách hoá đơn thanh toán riêng</strong>
                        <p style={{ margin: 0, fontSize: 12 }}>Tích chọn số lượng món cần tách ở cột bên phải</p>
                      </div>
                      <button className="btn btn-sm btn-danger" onClick={resetSplitBill}>Hủy</button>
                    </div>
                  )}

                  {currentOrder && (currentOrder.items || []).length > 0 ? (
                    <div className="order-items-list">
                      <table className="billing-table">
                        <thead>
                          <tr>
                            <th>Tên món nước / đồ ăn</th>
                            <th style={{ textAlign: "center", width: 90 }}>Số lượng</th>
                            <th style={{ textAlign: "right" }}>Giá</th>
                            {splitMode && <th style={{ textAlign: "center", width: 70 }}>Tách</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {(currentOrder.items || []).map((item) => {
                            const pId = getOrderItemProductId(item);
                            const splitQty = splitItems[pId] || 0;
                            return (
                              <tr key={pId || item._id} className="order-row-item">
                                <td>
                                  <div className="item-name-cell">{item.name || "Sản phẩm"}</div>
                                  <div className="item-subtotal-cell">{formatMoney((item.quantity || 0) * (item.price || 0))}</div>
                                </td>
                                <td>
                                  <div className="quantity-controller">
                                    <button
                                      className="qty-btn"
                                      onClick={() => updateOrderItemQuantity(item, Math.max(0, (item.quantity || 0) - 1))}
                                    >
                                      -
                                    </button>
                                    <span className="qty-val">{item.quantity || 0}</span>
                                    <button
                                      className="qty-btn"
                                      onClick={() => updateOrderItemQuantity(item, (item.quantity || 0) + 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 600 }}>
                                  {formatMoney(item.price || 0)}
                                </td>
                                {splitMode && (
                                  <td>
                                    <input
                                      type="number"
                                      className="split-qty-input"
                                      min="0"
                                      max={item.quantity || 0}
                                      value={splitQty}
                                      onChange={(e) => updateSplitItem(item, parseInt(e.target.value) || 0)}
                                    />
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-billing-state">
                      <div className="cart-icon">🛒</div>
                      <p>Chưa có món uống nào trong danh sách hóa đơn</p>
                      <p style={{ fontSize: 12, color: "#888" }}>Hãy nhấn chọn các món ở danh mục menu bên phải để thêm</p>
                      {isMobile && (
                        <button className="btn btn-primary" onClick={() => setMobileTab("menu")}>
                          Xem Danh Mục Menu ➡️
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {currentOrder && (currentOrder.items || []).length > 0 && (
                  <div className="billing-summary-footer">
                    <div className="price-row">
                      <span>Tổng tiền hóa đơn:</span>
                      <span className="total-price-text">{formatMoney(currentOrder.subtotal || 0)}</span>
                    </div>

                    {splitMode && (
                      <div className="price-row split-row" style={{ color: "#9a430a" }}>
                        <span>Tiền phần tách riêng:</span>
                        <span className="total-price-text">{formatMoney(getSplitTotal())}</span>
                      </div>
                    )}

                    <div className="action-grid-buttons sticky-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => printBill(currentOrder, selectedTable?.name || "Bàn", user?.name || "admin", true)}
                      >
                        🖨️ In Tạm Tính
                      </button>

                      {!splitMode ? (
                        <>
                          <button className="btn className-split btn-orange" onClick={() => setSplitMode(true)}>
                            ✂️ Tách Bill
                          </button>
                          <button className="btn btn-success btn-lg action-pay-btn" onClick={payCurrentOrder}>
                            💵 Thanh Toán Toàn Bộ
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-orange" onClick={printSplitBill}>
                            🖨️ In Bill Tách
                          </button>
                          <button className="btn btn-success" onClick={paySplitBill}>
                            💰 Trả Tiền Tách
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {(!isMobile || mobileTab === "menu") && (
              <div className="right">
                <div className="panel-header">
                  <h3>🍽️ Danh mục Thực đơn (Menu)</h3>
                </div>

                <div className="filter-wrapper-bar stack-mobile">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="🔍 Tìm nhanh tên món uống..."
                    value={productKeyword}
                    onChange={(e) => setProductKeyword(e.target.value)}
                  />

                  <select
                    className="form-control category-select"
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  {isMobile && (
                    <button className="btn btn-secondary" onClick={() => setMobileTab("order")}>
                      🛒 Xem Đơn Bill
                    </button>
                  )}
                </div>

                <div className="menu-grid-scroll-box">
                  <div className="menu-grid">
                    {filteredProducts.map((item) => (
                      <div
                        key={item._id}
                        className="menu-item-card"
                        onClick={() => addProductToOrder(item)}
                      >
                        <div className="card-body">
                          <h4 className="item-title">{item.name}</h4>
                          <div className="meta-info">
                            <span className="badge-cat">{item.category}</span>
                            {item.stock !== undefined && item.stock !== null && (
                              <span className={`stock-indicator ${item.stock <= 5 ? "low" : ""}`}>
                                Tồn: {item.stock} {item.unit || "ly"}
                              </span>
                            )}
                          </div>
                          <div className="item-price-footer">{formatMoney(item.price || 0)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="empty-state">
                      <p>Không tìm thấy món uống nào khớp với bộ lọc</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeMainTab === "admin" && (
          <div className="admin-container">
            <div className="admin-sidebar-tabs">
              <button
                className={`sidebar-tab ${activeAdminTab === "products" ? "active" : ""}`}
                onClick={() => setActiveAdminTab("products")}
              >
                ☕ Quản lý sản phẩm (Menu)
              </button>
              <button
                className={`sidebar-tab ${activeAdminTab === "warehouse" ? "active" : ""}`}
                onClick={() => setActiveAdminTab("warehouse")}
              >
                📦 Quản lý nguyên vật liệu kho
              </button>
              <button
                className={`sidebar-tab ${activeAdminTab === "users" ? "active" : ""}`}
                onClick={() => setActiveAdminTab("users")}
              >
                👥 Quản trị tài khoản nhân viên
              </button>
            </div>

            <div className="admin-body-panel">
              {activeAdminTab === "products" && (
                <div className="admin-grid">
                  <div className="form-card-panel">
                    <h4>{editingProductId ? "📝 Hiệu chỉnh thông tin món" : "✨ Thêm món uống mới"}</h4>
                    <div className="form-group">
                      <label>Tên món nước / đồ ăn</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên món uống (ví dụ: Bạc xỉu đá)"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Nhóm thực đơn (Category)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ví dụ: Cà phê, Trà trái cây, Sinh tố..."
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      />
                    </div>
                    <div className="form-row-twin">
                      <div className="form-group">
                        <label>Đơn giá bán (VNĐ)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="35000"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Đơn vị tính</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="ly, chai, đĩa..."
                          value={productForm.unit}
                          onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Số lượng tồn kho ban đầu</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Để trống nếu không quản lý số lượng"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      />
                    </div>

                    <div className="action-form-buttons">
                      <button className="btn btn-primary" onClick={saveProduct}>
                        {editingProductId ? "Cập Nhật Thay Đổi" : "Bổ Sung Vào Thực Đơn"}
                      </button>
                      {editingProductId && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditingProductId(null);
                            setProductForm(emptyProductForm());
                          }}
                        >
                          Hủy sửa
                        </button>
                      )}
                    </div>

                    <div className="divider" style={{ margin: "20px 0" }}></div>

                    <h4>📥 Nhập kho nhanh hàng loạt</h4>
                    <div className="form-group">
                      <label>Chọn món nhập kho</label>
                      <select
                        className="form-control"
                        value={importProductId}
                        onChange={(e) => setImportProductId(e.target.value)}
                      >
                        <option value="">-- Chọn một món nước cần nhập thêm số lượng --</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>{p.name} (Tồn: {p.stock || 0})</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Số lượng cộng thêm</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Ví dụ: 50"
                        value={importForm.quantity}
                        onChange={(e) => setImportForm({ ...importForm, quantity: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Ghi chú lý do</label>
                      <input
                        type="text"
                        className="form-control"
                        value={importForm.note}
                        onChange={(e) => setImportForm({ ...importForm, note: e.target.value })}
                      />
                    </div>
                    <button className="btn btn-orange" onClick={importProductStock}>
                      Xác Nhận Nhập Lô Kho
                    </button>
                  </div>

                  <div className="list-data-panel">
                    <h4>📋 Danh sách thực đơn hiện hành ({products.length} món)</h4>
                    
                    {/* KHU VỰC ĐƯỢC CHỈNH SỬA: BỌC THÀNH KHUNG THU GỌN VÀ CÓ THANH TRƯỢT (SCROLL BAR) */}
                    <div style={{ maxHeight: "650px", overflowY: "auto", border: "1px solid #e8ddd6", borderRadius: "12px", padding: "8px", background: "#fff" }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Tên món / Phân loại</th>
                            <th style={{ textAlign: "right" }}>Giá bán</th>
                            <th style={{ textAlign: "center" }}>Tồn kho</th>
                            <th style={{ textAlign: "center" }}>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((item) => (
                            <tr key={item._id} className={item.isActive === false ? "disabled-row" : ""}>
                              <td>
                                <strong style={{ color: "#241816" }}>{item.name}</strong>
                                <div style={{ fontSize: 11, color: "#888" }}>Phân loại: {item.category || "Chưa xếp"}</div>
                              </td>
                              <td style={{ textAlign: "right", fontWeight: "bold" }}>{formatMoney(item.price || 0)}</td>
                              <td style={{ textAlign: "center" }}>
                                {item.stock !== undefined && item.stock !== null ? `${item.stock} ${item.unit || "ly"}` : "---"}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                  <button className="btn btn-xs btn-secondary" onClick={() => startEditProduct(item)}>
                                    Sửa
                                  </button>
                                  <button
                                    className={`btn btn-xs ${item.isActive !== false ? "btn-orange" : "btn-success"}`}
                                    onClick={() => toggleProductActive(item._id, item.isActive)}
                                  >
                                    {item.isActive !== false ? "Ẩn" : "Hiện"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div style={{ marginTop: 20 }}>
                      <h4>📜 Nhật ký nhập xuất hàng hóa</h4>
                      <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #e8ddd6", padding: 10, borderRadius: 8, fontSize: 12, background: "#fff" }}>
                        {(inventoryLogs || []).length === 0 ? <p style={{ color: "#888" }}>Chưa có lịch sử nhập xuất món.</p> : (
                          <ul style={{ paddingLeft: 20, margin: 0 }}>
                            {inventoryLogs.map((log) => (
                              <li key={log._id} style={{ marginBottom: 6 }}>
                                <strong>{new Date(log.createdAt).toLocaleString("vi-VN")}:</strong> {log.message} <em>({log.note || "Không ghi chú"})</em>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeAdminTab === "warehouse" && (
                <div className="admin-grid">
                  <div className="form-card-panel">
                    <h4>{editingWarehouseId ? "📝 Sửa đổi nguyên liệu" : "✨ Đăng ký vật tư / Nguyên liệu kho"}</h4>
                    <div className="form-group">
                      <label>Tên vật tư nguyên liệu</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ví dụ: Hạt cafe Robusta, Sữa đặc sữa ông thọ..."
                        value={warehouseForm.name}
                        onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-row-twin">
                      <div className="form-group">
                        <label>Khối lượng / Số lượng</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Ví dụ: 100"
                          value={warehouseForm.quantity}
                          onChange={(e) => setWarehouseForm({ ...warehouseForm, quantity: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Đơn vị tính</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="kg, hộp, thùng, cái..."
                          value={warehouseForm.unit}
                          onChange={(e) => setWarehouseForm({ ...warehouseForm, unit: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Ghi chú chi tiết</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập ghi chú kho nếu có"
                        value={warehouseForm.note}
                        onChange={(e) => setWarehouseForm({ ...warehouseForm, note: e.target.value })}
                      />
                    </div>

                    <div className="action-form-buttons">
                      <button className="btn btn-primary" onClick={saveWarehouseItem}>
                        {editingWarehouseId ? "Lưu Thay Đổi Kho" : "Khai Báo Vào Kho"}
                      </button>
                      {editingWarehouseId && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditingWarehouseId(null);
                            setWarehouseForm(emptyWarehouseForm());
                          }}
                        >
                          Hủy bỏ
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="list-data-panel">
                    <div className="filter-wrapper-bar">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Tìm nhanh tên nguyên vật liệu..."
                        value={warehouseKeyword}
                        onChange={(e) => setWarehouseKeyword(e.target.value)}
                      />
                    </div>

                    <h4>📦 Tồn kho vật tư thực tế ({filteredWarehouse.length} loại)</h4>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Tên nguyên vật liệu</th>
                          <th style={{ textAlign: "center" }}>Số lượng tồn</th>
                          <th>Thông tin ghi chú</th>
                          <th style={{ textAlign: "center" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWarehouse.map((item) => (
                          <tr key={item._id}>
                            <td><strong>{item.name}</strong></td>
                            <td style={{ textAlign: "center", fontWeight: "bold", color: "#9a430a" }}>
                              {item.quantity} {item.unit}
                            </td>
                            <td>{item.note || <span style={{ color: "#ccc" }}>Không có</span>}</td>
                            <td style={{ textAlign: "center" }}>
                              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                <button className="btn btn-xs btn-secondary" onClick={() => startEditWarehouse(item)}>
                                  Sửa
                                </button>
                                <button className="btn btn-xs btn-danger" onClick={() => deleteWarehouseItem(item._id)}>
                                  Xoá
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredWarehouse.length === 0 && (
                          <tr>
                            <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>Kho trống hoặc không tìm thấy kết quả</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <div style={{ marginTop: 20 }}>
                      <h4>📜 Biên bản nhật ký kho hệ thống</h4>
                      <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #e8ddd6", padding: 10, borderRadius: 8, fontSize: 12, background: "#fff" }}>
                        {(warehouseLogs || []).length === 0 ? <p style={{ color: "#888" }}>Chưa ghi nhận hoạt động kho nào.</p> : (
                          <ul style={{ paddingLeft: 20, margin: 0 }}>
                            {warehouseLogs.map((log) => (
                              <li key={log._id} style={{ marginBottom: 6 }}>
                                <strong>{new Date(log.createdAt).toLocaleString("vi-VN")}:</strong> {log.message}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeAdminTab === "users" && (
                <div className="admin-grid">
                  <div className="form-card-panel">
                    <h4>✨ Tạo tài khoản làm việc mới</h4>
                    <form onSubmit={handleCreateUser}>
                      <div className="form-group">
                        <label>Họ và tên nhân viên</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ví dụ: Nguyễn Văn Thu Ngân"
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Tên đăng nhập (Username)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ví dụ: thungan01"
                          value={userForm.username}
                          onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Mật khẩu đăng nhập</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Nhập mật khẩu"
                          value={userForm.password}
                          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Cấp quyền làm việc</label>
                        <select
                          className="form-control"
                          value={userForm.role}
                          onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                        >
                          <option value="staff">Nhân viên thu ngân (Staff)</option>
                          <option value="admin">Quản lý cấp cao (Admin)</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Cấp Tài Khoản Mới
                      </button>
                    </form>
                  </div>

                  <div className="list-data-panel">
                    <h4>👥 Danh sách tài khoản nội bộ quán ({users.length} tài khoản)</h4>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Họ tên nhân viên</th>
                          <th>Tên tài khoản</th>
                          <th>Chức vụ phân quyền</th>
                          <th style={{ textAlign: "center" }}>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id || u.id}>
                            <td><strong>{u.name}</strong></td>
                            <td><code>{u.username}</code></td>
                            <td>
                              <span className={`badge-role ${u.role === "admin" ? "badge-admin" : "badge-staff"}`}>
                                {u.role === "admin" ? "Quản trị hệ thống" : "Nhân viên bán hàng"}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {u.username === "admin" ? (
                                <span style={{ color: "#aaa", fontSize: 12 }}>Tài khoản gốc bảo mật</span>
                              ) : (
                                <button className="btn btn-xs btn-danger" onClick={() => deleteUser(u._id || u.id)}>
                                  Gỡ bỏ quyền
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeMainTab === "reports" && (
          <div className="reports-container">
            <div className="panel-header stack-mobile" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3>💰 Trung tâm phân tích doanh số doanh thu</h3>
                <p style={{ margin: 0 }}>Theo dõi dòng tiền bán ra thực tế theo thời gian</p>
              </div>
              <div className="filter-date-box" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span>Chọn ngày kiểm toán:</span>
                <input
                  type="date"
                  className="form-control"
                  style={{ width: "auto" }}
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                />
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="icon" style={{ background: "#eef9f2", color: "#198754" }}>💵</div>
                <div className="num">{formatMoney(selectedDayRevenue)}</div>
                <div className="label">Doanh thu chốt ngày ({formatDateVN(reportDate)})</div>
              </div>
              <div className="stat-card">
                <div className="icon" style={{ background: "#eff6ff", color: "#0d6efd" }}>🛍️</div>
                <div className="num">{selectedDayOrders.length} đơn</div>
                <div className="label">Tổng số lượng đơn phát sinh trong ngày</div>
              </div>
              <div className="stat-card">
                <div className="icon" style={{ background: "#fffbeb", color: "#d97706" }}>⏳</div>
                <div className="num">{formatMoney(pendingRevenue)}</div>
                <div className="label">Tiền kẹt tạm tính (Các bàn chưa thanh toán)</div>
              </div>
              <div className="stat-card">
                <div className="icon" style={{ background: "#fdf2f2", color: "#dc3545" }}>📊</div>
                <div className="num">{formatMoney(reportSummary?.totalRevenue || 0)}</div>
                <div className="label">Tổng doanh thu tích lũy hệ thống</div>
              </div>
            </div>

            <div className="reports-layout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
              <div className="panel-card-box" style={{ background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e8ddd6" }}>
                <h4>📈 Thống kê dòng tiền theo các ngày gần nhất</h4>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ngày bán hàng</th>
                      <th style={{ textAlign: "center" }}>Số đơn</th>
                      <th style={{ textAlign: "right" }}>Tổng doanh thu thu về</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueHistoryByDay.map((row) => (
                      <tr key={row.date} style={{ cursor: "pointer", background: row.date === reportDate ? "#fff8ef" : "transparent" }} onClick={() => setReportDate(row.date)}>
                        <td><strong>{formatDateVN(row.date)}</strong> {row.date === getTodayDateKey() && <span style={{ color: "green", fontSize: 11 }}>(Hôm nay)</span>}</td>
                        <td style={{ textAlign: "center" }}>{row.orders} hóa đơn</td>
                        <td style={{ textAlign: "right", fontWeight: "bold", color: "#198754" }}>{formatMoney(row.revenue)}</td>
                      </tr>
                    ))}
                    {revenueHistoryByDay.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ textAlign: "center", color: "#888" }}>Chưa có lịch sử doanh thu được lưu</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="panel-card-box" style={{ background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e8ddd6" }}>
                <h4>📜 Danh sách hóa đơn chi tiết trong ngày ({formatDateVN(reportDate)})</h4>
                <div style={{ maxHeight: 400, overflowY: "auto" }}>
                  <table className="admin-table" style={{ fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Thời gian</th>
                        <th style={{ textAlign: "right" }}>Giá trị</th>
                        <th style={{ textAlign: "center" }}>In lại</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDayOrders.map((order) => (
                        <tr key={order._id}>
                          <td><code>{buildInvoiceNumber(order)}</code></td>
                          <td>{new Date(order.paidAt || order.updatedAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</td>
                          <td style={{ textAlign: "right", fontWeight: "bold" }}>{formatMoney(order.subtotal || order.total || 0)}</td>
                          <td style={{ textAlign: "center" }}>
                            <button className="btn btn-xs btn-secondary" onClick={() => printBill(order, "Hóa Đơn In Lại", user?.name || "admin", false)}>
                              🖨️ Bill
                            </button>
                          </td>
                        </tr>
                      ))}
                      {selectedDayOrders.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center", color: "#888", padding: 20 }}>Ngày này chưa phát sinh giao dịch thanh toán thành công nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e8ddd6", marginTop: 20 }}>
              <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4>📜 Lịch sử giao dịch hóa đơn toàn thời gian (Gần đây nhất)</h4>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowMoreHistory(!showMoreHistory)}>
                  {showMoreHistory ? "Thu gọn bớt đơn" : `Xem toàn bộ tất cả đơn (${historyOrders.length})`}
                </button>
              </div>

              <table className="admin-table" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã số hóa đơn</th>
                    <th>Thời gian hoàn tất</th>
                    <th style={{ textAlign: "right" }}>Tổng số tiền</th>
                    <th style={{ textAlign: "center" }}>Trạng thái</th>
                    <th style={{ textAlign: "center" }}>In lại</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleHistory.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td><strong>{buildInvoiceNumber(order)}</strong></td>
                      <td>{new Date(order.paidAt || order.updatedAt || order.createdAt).toLocaleString("vi-VN")}</td>
                      <td style={{ textAlign: "right", fontWeight: "bold", color: "#198754" }}>{formatMoney(order.subtotal || order.total || 0)}</td>
                      <td style={{ textAlign: "center" }}><span className="badge-success-solid">Đã hoàn thành</span></td>
                      <td style={{ textAlign: "center" }}>
                        <button className="btn btn-xs btn-secondary" onClick={() => printBill(order, "Hóa Đơn In Lại", user?.name || "admin", false)}>
                          🖨️ Re-Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeMainTab === "notifications" && (
          <div className="notifications-container" style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e8ddd6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3>🔔 Trung tâm cập nhật hoạt động quán từ hệ thống</h3>
              <button className="btn btn-sm btn-secondary" onClick={markAllNotificationsRead}>
                ✔️ Đánh dấu đã đọc tất cả
              </button>
            </div>

            <div className="notification-list-box" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {notifications.map((item) => {
                const isRead = getNotificationRead(item, user?.id);
                return (
                  <div
                    key={item._id}
                    className={`notification-item-row ${isRead ? "read" : "unread"}`}
                    style={{
                      padding: 14,
                      borderRadius: 10,
                      border: "1px solid #e8ddd6",
                      background: isRead ? "#fafafa" : "#fff8ef",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 11, color: "#888" }}>
                        {new Date(item.createdAt).toLocaleString("vi-VN")}
                      </span>
                      <h4 style={{ margin: "4px 0", color: "#241816" }}>{item.title}</h4>
                      <p style={{ margin: 0, fontSize: 13, color: "#555" }}>{item.message}</p>
                    </div>

                    {!isRead && (
                      <button className="btn btn-xs btn-secondary" onClick={() => markNotificationRead(item._id)}>
                        Đã xem
                      </button>
                    )}
                  </div>
                );
              })}

              {notifications.length === 0 && (
                <div style={{ textAlign: "center", color: "#888", padding: 40 }}>
                  🍃 Hộp thư thông báo trống! Chưa ghi nhận hoạt động mới nào.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Giữ nguyên toàn bộ CSS của hệ thống giao diện */
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #faf4ee; color: #241816; }
        .login-screen { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #241816; padding: 20px; }
        .login-card { background: #fff; width: 100%; max-width: 440px; padding: 30px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .login-header { text-align: center; margin-bottom: 24px; }
        .login-header .lion-badge { font-size: 48px; margin-bottom: 8px; }
        .login-header h1 { margin: 0; font-size: 28px; color: #241816; font-weight: 800; }
        .login-header p { margin: 4px 0 0 0; color: #7c6e6a; font-size: 14px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 700; color: #4e3e3a; margin-bottom: 6px; text-transform: uppercase; }
        .form-control, input[type="text"], input[type="password"], input[type="number"], select {
          width: 100%; padding: 12px 14px; border: 1px solid #dcd1c4; background: #fff; border-radius: 12px; font-size: 14px; color: #241816; transition: all 0.2s;
        }
        .form-control:focus, input:focus, select:focus { outline: none; border-color: #9a430a; box-shadow: 0 0 0 3px rgba(154,67,10,0.15); }
        .btn {
          display: inline-flex; align-items: center; justify-content: center; padding: 12px 20px; font-size: 14px; font-weight: 700; border-radius: 12px; border: none; cursor: pointer; transition: all 0.15s; text-align: center; gap: 8px;
        }
        .btn-sm { padding: 8px 14px; font-size: 13px; border-radius: 10px; }
        .btn-xs { padding: 4px 8px; font-size: 12px; border-radius: 6px; font-weight: 600; }
        .btn-block { display: flex; width: 100%; }
        .btn-primary { background: #9a430a; color: #fff; }
        .btn-primary:hover { background: #7c3406; }
        .btn-secondary { background: #f3ece4; color: #4e3e3a; border: 1px solid #dcd1c4; }
        .btn-secondary:hover { background: #e9decb; }
        .btn-success { background: #198754; color: #fff; }
        .btn-success:hover { background: #157347; }
        .btn-danger { background: #dc3545; color: #fff; }
        .btn-danger:hover { background: #bb2d3b; }
        .btn-orange { background: #d97706; color: #fff; }
        .btn-orange:hover { background: #b45309; }
        .alert { padding: 12px 16px; border-radius: 12px; font-size: 14px; margin-bottom: 16px; line-height: 1.4; }
        .alert-danger { background: #fde8e8; color: #9b1c1c; border: 1px solid #f8b4b4; }
        .login-footer { margin-top: 24px; border-top: 1px solid #f3ece4; padding-top: 16px; font-size: 12px; color: #666; line-height: 1.5; }
        .login-footer p { margin: 2px 0; }
        .app-shell { display: flex; flex-direction: column; min-height: 100vh; padding: 16px; max-width: 1600px; margin: 0 auto; gap: 16px; }
        .topbar { background: #241816; color: #fff; padding: 14px 20px; border-radius: 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.08); gap: 16px; }
        .topbar-left { display: flex; align-items: center; gap: 12px; }
        .topbar-left .logo-icon { font-size: 32px; }
        .topbar-title { margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 0.5px; background: linear-gradient(to right, #fff, #f3ece4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .topbar-subtitle { margin: 2px 0 0 0; font-size: 12px; color: #a4938e; }
        .topbar-right { display: flex; align-items: center; gap: 20px; }
        .main-tabs { display: flex; gap: 8px; }
        .tab-btn { background: transparent; color: #c4b5b1; padding: 10px 16px; font-size: 14px; font-weight: 700; border-radius: 12px; border: none; cursor: pointer; transition: all 0.2s; }
        .tab-btn:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .tab-btn.active { background: #9a430a; color: #fff; }
        .user-profile { display: flex; align-items: center; gap: 10px; border-left: 1px solid #4e3e3a; padding-left: 20px; }
        .user-profile .avatar { font-size: 24px; background: #4e3e3a; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .user-profile .info { display: flex; flex-direction: column; }
        .user-profile .name { font-weight: 700; font-size: 13px; }
        .user-profile .role { font-size: 11px; color: #a4938e; }
        .logout-icon { background: transparent; border: none; font-size: 20px; cursor: pointer; padding: 4px; margin-left: 6px; }
        .global-alert { position: relative; margin-bottom: 0; }
        .global-alert .close-btn { position: absolute; right: 14px; top: 12px; background: transparent; border: none; font-size: 20px; cursor: pointer; color: inherit; }
        .toast-message { position: fixed; bottom: 24px; right: 24px; background: #241816; color: #fff; padding: 14px 24px; border-radius: 14px; font-weight: 700; z-index: 9999; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.25); border: 1px solid #9a430a; animation: slideUp 0.25s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .main-content { display: flex; flex-direction: column; flex: 1; }
        .sales-layout.desktop-layout { display: grid; grid-template-columns: 1fr 420px 440px; gap: 16px; align-items: start; }
        .sales-layout .left, .sales-layout .center-billing, .sales-layout .right { background: #fff; border-radius: 20px; border: 1px solid #e8ddd6; display: flex; flex-direction: column; min-height: 400px; box-shadow: 0 2px 8px rgba(36,24,22,0.02); overflow: hidden; }
        .panel-header { background: #fcf9f5; padding: 14px 16px; border-bottom: 1px solid #e8ddd6; }
        .panel-header h3 { margin: 0; font-size: 16px; font-weight: 800; color: #241816; }
        .panel-header .stats-text { font-size: 12px; color: #7c6e6a; margin-top: 2px; display: inline-block; }
        .zone-section { padding: 12px 16px 4px 16px; border-bottom: 1px dashed #e8ddd6; }
        .zone-section:last-child { border-bottom: none; }
        .zone-title { margin: 0 0 10px 0; font-size: 13px; font-weight: 800; color: #9a430a; text-transform: uppercase; letter-spacing: 0.3px; }
        .table-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
        .table-card { background: #fff; border: 1px solid #e8ddd6; border-radius: 14px; padding: 12px 8px; text-align: center; cursor: pointer; transition: all 0.15s; position: relative; display: flex; flex-direction: column; gap: 4px; justify-content: center; min-height: 84px; }
        .table-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(154,67,10,0.08); border-color: #9a430a; }
        .table-card.selected { border-width: 2px; border-color: #9a430a; background: #fff8ef; padding: 11px 7px; }
        .table-card .status-dot { width: 8px; height: 8px; border-radius: 50%; position: absolute; top: 10px; right: 10px; }
        .table-card.empty .status-dot { background: #cbd5e1; }
        .table-card.busy .status-dot { background: #198754; }
        .table-card.busy { background: #f3faf6; border-color: #a3cfbb; }
        .table-card.takeaway-card { background: #fdfefe; }
        .table-card.takeaway-card.busy { background: #f0fdf4; border-color: #a3cfbb; }
        .table-name { font-weight: 800; font-size: 14px; color: #241816; }
        .order-summary { font-size: 11px; color: #666; font-weight: 600; }
        .table-card.busy .order-summary { color: #157347; font-weight: 700; }
        .flex-header { display: flex; justify-content: space-between; align-items: center; }
        .current-table-label { margin: 2px 0 0 0; font-size: 13px; color: #4e3e3a; }
        .current-table-label strong { color: #9a430a; font-size: 14px; }
        .order-box-container { flex: 1; padding: 12px; display: flex; flex-direction: column; background: #fdfdfd; }
        .empty-billing-state { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; padding: 40px 20px; text-align: center; color: #7c6e6a; }
        .empty-billing-state .cart-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.3; }
        .empty-billing-state p { margin: 4px 0; font-size: 13px; font-weight: 600; }
        .order-items-list { flex: 1; overflow-y: auto; max-height: 520px; }
        .billing-table { width: 100%; border-collapse: collapse; }
        .billing-table th { text-align: left; padding: 8px; font-size: 12px; font-weight: 700; color: #7c6e6a; border-bottom: 1px solid #e8ddd6; text-transform: uppercase; }
        .order-row-item { border-bottom: 1px solid #f3ece4; }
        .order-row-item:last-child { border-bottom: none; }
        .order-row-item td { padding: 10px 6px; vertical-align: middle; }
        .item-name-cell { font-weight: 700; font-size: 13px; color: #241816; line-height: 1.3; }
        .item-subtotal-cell { font-size: 11px; color: #888; margin-top: 2px; font-weight: 500; }
        .quantity-controller { display: inline-flex; align-items: center; background: #f3ece4; border-radius: 8px; padding: 2px; gap: 4px; }
        .qty-btn { width: 26px; height: 26px; background: #fff; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #241816; }
        .qty-btn:hover { background: #9a430a; color: #fff; border-color: #9a430a; }
        .qty-val { font-size: 13px; font-weight: 800; min-width: 24px; text-align: center; color: #241816; }
        .billing-summary-footer { background: #fcf9f5; border-top: 1px solid #e8ddd6; padding: 14px; }
        .price-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 14px; font-weight: 700; color: #4e3e3a; }
        .total-price-text { font-size: 20px; font-weight: 900; color: #9a430a; }
        .action-grid-buttons { display: flex; flex-direction: column; gap: 8px; }
        .action-pay-btn { padding: 14px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(25,135,84,0.2); }
        .filter-wrapper-bar { padding: 12px; background: #fcf9f5; border-bottom: 1px solid #e8ddd6; display: flex; gap: 8px; }
        .menu-grid-scroll-box { flex: 1; overflow-y: auto; padding: 12px; max-height: 640px; background: #fafafa; }
        .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(124px, 1fr)); gap: 10px; }
        .menu-item-card { background: #fff; border: 1px solid #e8ddd6; border-radius: 14px; cursor: pointer; transition: all 0.15s; display: flex; flex-direction: column; overflow: hidden; position: relative; }
        .menu-item-card:hover { border-color: #9a430a; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .menu-item-card .card-body { padding: 10px; display: flex; flex-direction: column; flex: 1; gap: 6px; }
        .item-title { margin: 0; font-size: 13px; font-weight: 800; color: #241816; line-height: 1.3; height: 34px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .meta-info { display: flex; flex-direction: column; gap: 2px; }
        .badge-cat { font-size: 10px; color: #9a430a; background: #fff8ef; padding: 1px 4px; border-radius: 4px; font-weight: 700; align-self: flex-start; }
        .stock-indicator { font-size: 10px; color: #666; font-weight: 600; }
        .stock-indicator.low { color: #dc3545; font-weight: 700; }
        .item-price-footer { font-size: 14px; font-weight: 900; color: #241816; text-align: right; margin-top: auto; border-top: 1px dashed #f3ece4; padding-top: 4px; }
        .admin-container { background: #fff; border-radius: 20px; border: 1px solid #e8ddd6; display: grid; grid-template-columns: 240px 1fr; min-height: 600px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .admin-sidebar-tabs { background: #fcf9f5; border-right: 1px solid #e8ddd6; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
        .sidebar-tab { background: transparent; border: none; text-align: left; padding: 12px 14px; font-size: 13px; font-weight: 700; color: #4e3e3a; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
        .sidebar-tab:hover { background: #f3ece4; color: #241816; }
        .sidebar-tab.active { background: #9a430a; color: #fff; }
        .admin-body-panel { padding: 20px; overflow-y: auto; }
        .admin-grid { display: grid; grid-template-columns: 360px 1fr; gap: 20px; align-items: start; }
        .form-card-panel { background: #fcf9f5; border: 1px solid #e8ddd6; padding: 16px; border-radius: 16px; }
        .form-card-panel h4 { margin: 0 0 14px 0; font-size: 14px; font-weight: 800; color: #9a430a; text-transform: uppercase; letter-spacing: 0.3px; border-bottom: 2px solid #e8ddd6; padding-bottom: 6px; }
        .form-row-twin { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .action-form-buttons { display: flex; gap: 8px; margin-top: 8px; }
        .list-data-panel h4 { margin: 0 0 12px 0; font-size: 14px; font-weight: 800; color: #241816; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { background: #f3ece4; padding: 10px; font-size: 12px; font-weight: 800; text-align: left; color: #4e3e3a; border-bottom: 2px solid #e8ddd6; }
        .admin-table td { padding: 10px; font-size: 13px; border-bottom: 1px solid #f3ece4; color: #4e3e3a; }
        .admin-table tr:hover td { background: #fffcf9; }
        .disabled-row td { opacity: 0.5; background: #fafafa !important; }
        .badge-role { font-size: 11px; padding: 2px 6px; border-radius: 6px; font-weight: 700; }
        .badge-admin { background: #fde8e8; color: #9b1c1c; }
        .badge-staff { background: #e1effe; color: #1e429f; }
        .badge-success-solid { background: #198754; color: #fff; padding: 2px 6px; border-radius: 6px; font-size: 11px; font-weight: 700; }
        .sync-spinner { font-size: 14px; animation: spin 1s linear infinite; display: inline-block; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .badge { background: #dc3545; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: 700; position: relative; top: -1px; }
        .split-banner { background: #fff8ef; border: 1px dashed #d97706; padding: 10px; border-radius: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
        .split-qty-input { width: 60px; padding: 4px; text-align: center; font-weight: 700; border-radius: 6px; border: 1px solid #ccc; }
        .reports-container, .notifications-container { display: flex; flex-direction: column; gap: 16px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .stat-card { background: #fff; border: 1px solid #e8ddd6; padding: 16px; border-radius: 16px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.01); }
        .stat-card .icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 4px; }
        .stat-card .num { font-size: 18px; font-weight: 900; color: #241816; }
        .stat-card .label { font-size: 11px; color: #7c6e6a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2px; }
        
        /* Custom scrollbar mượt cho bảng sản phẩm quản lý */
        div::-webkit-scrollbar { width: 6px; height: 6px; }
        div::-webkit-scrollbar-track { background: #fcf9f5; border-radius: 10px; }
        div::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        div::-webkit-scrollbar-thumb:hover { background: #9a430a; }

        @media (max-width: 1024px) {
          .sales-layout.desktop-layout { grid-template-columns: 1fr 1fr; }
          .sales-layout.desktop-layout .right { grid-column: 1 / -1; }
          .admin-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 767px) {
          .app-shell { padding: 10px; }
          .topbar { align-items: flex-start; flex-direction: column; }
          .topbar-title { font-size: 20px; }
          .main-tabs { display: none; }
          .stack-mobile { flex-direction: column; align-items: stretch; }
          .table-grid, .menu-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .order-row { grid-template-columns: 1fr; gap: 8px; }
          .sticky-actions { position: sticky; bottom: 76px; background: rgba(255,248,239,0.98); padding-top: 8px; }
        }
      `}</style>
    </div>
  );
}
