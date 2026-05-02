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
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTllDUDxgYGBiVkdOZ1lZXGBmeP/AABEIAwABaAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABgcBBAUCA//EAEQQAAIBAgQDBgMFBQYFBAMAAAECEQADBBIhMQVBUQYiYXGBEzKRobFCUrHB0QcjQvAVYnKSk+IWQ1PSJDRDgqP/xAAZAQEAAwEBAAAAAAAAAAAAAAAAAQIDBAX/xAAkEQEBAQACAgICAgMBAAAAAAAAAQIRAyESMQQTQVEiMmFx8P/aAAwDAQACEQMRAD8A9jREQEREBERAREQEREBERAREQERETI2z8B7M7tR3+3mN3An86C0m+HYo8gvw1ndjlwmxE9gNNHaeS5xwAV23QQ23AuXHKr6q/FzM8mGGe9kV5uK6nVdC0zQ9p1Q6e/wDGf0WmR5mP2sCx3s6k8yC5fdZ1f2W3vVJQw+HyZj9g5m3v7VQeR88y49qDWk0d0kP6w+RY6hW8E3m2W+uVMhsvv0Xr6tM2W9uQv1qqk3hKk1GkgK5m1Q0rQjUSVqj0kJ5UgGqCAd+ZQPc1b7rN9STmGmW+I+u8D8e1J2Yb7v9k5dS6I4q1XrGk3Zk1d7h8M+qSg8+zVho+ozmD/AFh7v0zmmQ8ukltoPZ2A4eKj2UqV2I0d+v2jV0f8AWktm1D8yq3oC1fxH5hP8A1m3P1m0/5a6Kk+Pud2t6pvTYb1w7J+Qk8vZ4Cj+1v/AM6z+Vq0c2o7U+3qgk5iX2Wm1IuA6isv3yX/ElLdbJf7d2mW6mv3PZk5gK1WJkP8Aag+3Q6p7V1n5h1N6l6u1y0rP3T1Xx6gQh2c8WwBvM2kG5e8P6mB3VwYJfE1z0dK7aU7H1i3v3bF8Uz3w0nlJtrw8bqYqU6aRzZ5b9tQ9nY7Y2VDg7mJ4cxrVQWl3kq+q2lQvM79o5U4fQ7Xg1vMLqf3cDkNq2J1qk9jQY6k7vGfM2v0J1Qm8kY3JJ9oX3S7X5jVnG1R5nXnsh6jQOvfBv88VTvT1v8h1K1V3M0Z4zYIh5gIh5QwQciq5d6q9ySk0AqWmY3e2ptbMSt1mXzM2r4+q0mclJY2kW7HVzF7u8fP8Aup1rWqkHkY9r5lM0rP0j2XW6uJqS1R0w2e9go+Pj1Fu2qzqvJrfa7rP3GNqUc6T0qS5d2i2W+QmWWxwQaS7K94beX6m2h4jv3kq9U2T8w7aP2PZbOmuqU1v8AnB7p2Wcyi1vJcbiTq9wjsmY8iV3I3AB3M7nJrMc7uQjX7z0fX6rV0tY9Rkq7W9h0d1M6g2mT0NjL2kZ1Sg81Q1k6f0mJqfJbM6X9l1eW6c0K7q1qmp1qQ1zSgPjPboq88hEakZjtk3mQxzmPzQe3Nbv3Q2kX5a2xqvQk8NUp0k8cYtDbK8s3I0D2b6yV3oMaq6nK7B6P5h1Y1I1C7iU2H3Q3mN6UTGly6Qz6vJttbgfZ8tV3Ih5U5XrV8f5H2G3u3dQ6vYQvJ6tIu6bN0fZ7rN8m+1b7j0uL5wVp9Q6r3m1C0+3M7rZ1Kc5yE4jYbsk86jv2k8fK1r8x5Y6YbU9hK6ow3V9vP8AlP7lS+eZ0JqvNGy1rdu4Q0kObx9nH4T1kUr6J3r6JxzbF2H9J6x2S9mivkRdk+kkj4Mzt0Wf2n9tM6p6g3D1Pdbi7ktC0z3p0VtZpGt6eaD0Y4yD3jGq82xR0H4kW6G2nT5V74atf2a8n9PqVy3rQeSlsmt1yCNn+VvS8UjU+1X0Vg2s0pW6n8W4BzN1xK3h3pV3qB2Gd8fJcifWv4eJkW6p2lbVY9uP8ATqzPp2l2kUaY0T9V4fW7WbN+K0m4HxVb6k1b3Y7U7ob2p7n9Zq0w0pKvlX9pyj1C0Wq1W5jU1G9M8NQpHfM6n1NRTrB7u2V8q0i1fNf8AEd3bo3H4D7fX8l9xB6qg4SntG2gQmvKp4ob6d5iX9Wyu3rGqv4Mx1K1N5bUq0aGmU7S3Hkbe2P8AQv0qjL1Cq8yip2YtFzJv3lK9DkXWgJ2i0fS0+7mX6H0+IudWbW6esqYJ22g0jT3xvX9z8a0rV7rYfYyqYk9lK7n3+W1mP66n1I1Wkq0y7fQzv3YfWwTXjL1I5mF4c8j1s8JtJv0q5xZpI1f5h7u0+Q5mW3oX0dzNT0c5Zszc6a1v8AeX6L8u9Q0+g0m9x3o0+o9p9L3+Sx6q1tZs8t0k8xF+J45P4VxQ1O5eL0v5X1Q2v6Gx8qO2P2W2Qm1kI1+N4mP6r+E+M9P60zc4rXna9Sg0h8nqu5PqfX9nJ1c2Z3l0NsvvP5V9xk5m3pV5q7U7qk0t2m2aN+QH1VbljV9p0bafm0iJ4eC6i0g1J0K1Vq0U9oO5x1E+q9zqvRkzDtxV8M5v3W9w7TFit+0dST8svmVx1gq9u6dJwWlY2M3cXWg9lHkq2mY3ItzF/M8qk2vY8KWXeq9UfZ6rV1rW+I5m7H2pTgJj7vD+o0a1r0t6mS6Z0fY8vPrP8AlYq3N1W0fakq0cNsY3e4R6vH6V2n0t2f8Al3eX2bJYvYxmM8Q0u7UL9y9X5WOr0bT7E7iYwXW8q0+K2y27JXMXpVT1Y8Nw4bSm7a9o2bN9Z8RX2N6i7y9Y2r2bQ6m0uVvKn0n1RjLQwH3xLxn6VJ1W6r1zQ6bkV2i0kY6k6uZx7M1e0aFqQdS6c2vLYra0mS8z7c2m0J1i3m3I6x6m8lS8E7bl6fJ8xTq9o9eMdpj1A3a0V9ltP2tbm7l8VtZ5E1dX9U1R8R1mYv4m+2R3Vq2Jm2u0g8vTZ8lkb7cP8A3/8A1b7F1S1rV6nq1J6v2q5m1w2q3dlq5Kpax6SMcD2sE+4L4VQ6bV7fK1+0H2bWp7XW6tSlKXpaR1V3vY6mPqQ0Vqz8m8w2P9r4r7i1O6l7m6d2x2x6j2Y9jvQeYvRk1bfVv3uS3p4jG7eQe8Vv8AeU1bY7b4e+Xb+ZQ1q9a6Z3zY0MpxkB+Q6lVu0n7Ts0r7rL7wlf8A5g==";

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

  // Dữ liệu cũ có thể lưu currentOrder là object giả không có _id.
  // Trường hợp đó không phải order thật, không được dùng để thêm món.
  if (typeof table.currentOrder === "object") {
    return table.currentOrder?._id || null;
  }

  return null;
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

  // Tổng tiền các bàn đang phục vụ / chưa thanh toán.
  const pendingRevenue = useMemo(() => {
    return (tables || []).reduce((sum, table) => {
      const order = table?.currentOrder;

      if (order && typeof order === "object") {
        return sum + Number(order.subtotal || order.total || 0);
      }

      return sum;
    }, 0);
  }, [tables]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        api("/api/orders/history?limit=100", {}, token),
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

    // Chỉ dùng currentOrder hiện tại khi đúng bàn đang chọn.
    // Tránh lỗi bàn A có order nhưng click sang bàn B vẫn giữ đơn cũ.
    if (isOrderForTable(currentOrder, tableId)) {
      return currentOrder;
    }

    // Chỉ dùng currentOrder object khi có _id thật.
    // Object không có _id là dữ liệu cũ/fallback và sẽ làm click món bị kẹt.
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

      // Tự sửa dữ liệu bàn cũ: nhiều bàn đang có currentOrder object giả không có _id.
      // Reset currentOrder về null rồi mở lại order thật.
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

      // Luôn mở/lấy order thật từ backend. Không dùng fallback object không có _id.
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
          title: "Cập nhật kho riêng",
          message: `Đã cập nhật ${payload.name}`,
          level: "info",
        });
        setToast("Đã cập nhật kho");
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
          title: "Thêm hàng kho",
          message: `Đã thêm ${payload.name}`,
          level: "success",
        });
        setToast("Đã thêm hàng kho");
      }

      setWarehouseForm(emptyWarehouseForm());
      setEditingWarehouseId(null);
      await syncAll();
    } catch (err) {
      setError(err.message || "Không lưu được kho");
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
    setActiveMainTab("admin");
    setActiveAdminTab("warehouse");
  }

  async function deleteWarehouseItem(id) {
    if (!window.confirm("Xóa hàng kho này?")) return;

    try {
      const item = warehouseItems.find((x) => x._id === id);
      await api(`/api/warehouse/${id}`, { method: "DELETE" }, token);
      await createNotification({
        type: "warehouse",
        title: "Xóa hàng kho",
        message: `Đã xóa ${item?.name || "hàng kho"}`,
        level: "warning",
      });
      setToast("Đã xóa hàng kho");
      await syncAll();
    } catch (err) {
      setError(err.message || "Không xóa được hàng kho");
    }
  }

  async function saveUser() {
    try {
      const payload = {
        name: userForm.name,
        username: userForm.username,
        password: userForm.password,
        role: userForm.role,
      };

      if (!payload.name.trim() || !payload.username.trim() || !payload.password.trim()) {
        setToast("Nhập đủ họ tên, tài khoản, mật khẩu");
        return;
      }

      await api(
        "/api/auth/users",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        token
      );

      await createNotification({
        type: "user",
        title: "Tạo tài khoản",
        message: `Đã tạo tài khoản ${payload.username} (${payload.role})`,
        level: "success",
        meta: {
          username: payload.username,
          role: payload.role,
        },
      });

      setUserForm(emptyUserForm());
      setToast("Đã tạo tài khoản");
      await syncAll();
    } catch (err) {
      setError(err.message || "Không tạo được tài khoản");
    }
  }

  function printBill(order, tableName = "Bàn", sellerName = "admin", isTemporary = false) {
    const paidDate = order?.paidAt ? new Date(order.paidAt) : new Date();
    const invoiceNumber = buildInvoiceNumber(order);
    const tempSlipNumber = buildTempSlipNumber(order);
    const seller = sellerName || order?.createdByName || order?.paidByName || "admin";
    const items = Array.isArray(order?.items) ? order.items : [];

    const html = `
      <html>
        <head>
          <title>FOREVER POS Bill</title>
          <meta charset="UTF-8" />
          <style>
            @page { size: 80mm auto; margin: 0; }
            body {
              font-family: Arial, Helvetica, sans-serif;
              width: 72mm;
              margin: 0 auto;
              padding: 8px 6px 12px;
              color: #000;
              font-size: 13px;
              line-height: 1.3;
            }
            .center { text-align: center; }
            .bold { font-weight: 700; }
            .title { font-size: 19px; font-weight: 800; }
            .line { border-top: 1px dashed #000; margin: 8px 0; }
            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
            }
            th, td {
              padding: 2px 0;
              vertical-align: top;
              word-wrap: break-word;
            }
            th { font-weight: 700; }
            .left { text-align: left; }
            .center-t { text-align: center; }
            .right { text-align: right; }
            .receipt-block { margin-top: 2px; }
            .big { font-size: 15px; font-weight: 800; }
            .qr-wrap {
              margin-top: 10px;
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
            .qr-image {
              width: 100%;
              max-width: 230px;
              display: block;
              margin: 8px auto 4px;
            }
            .small { font-size: 11px; }
            .spacer { height: 4px; }
          </style>
        </head>
        <body>
          <div class="center title">FOREVER COFFEE & BEER</div>
          <div class="center">Đ/C: B38 Đường 4A</div>
          <div class="center">P.Tân Hưng, Q.7</div>
          <div class="center">Điện thoại: 078.888.0891</div>

          <div class="line"></div>

          ${
            isTemporary
              ? `
            <div class="center bold" style="font-size:18px;">PHIẾU TẠM TÍNH</div>
            <div class="center bold">${tempSlipNumber}</div>
          `
              : `
            <div>Liên số: Liên 1</div>
            <div>Ngày bán: ${paidDate.toLocaleString("vi-VN")}</div>
            <div class="center bold" style="font-size:18px;">HÓA ĐƠN BÁN HÀNG</div>
            <div class="center bold">${invoiceNumber}</div>
          `
          }

          <div class="receipt-block">
            <div><span class="bold">${isTemporary ? "Phòng bàn:" : "Khách hàng:"}</span> ${
      isTemporary ? tableName : "Khách lẻ"
    }</div>
            ${
              isTemporary
                ? `<div>Giờ vào: ${paidDate.toLocaleString("vi-VN")}</div><div>Khách hàng: Khách lẻ</div>`
                : `<div>Địa chỉ:</div><div>Khu vực:</div><div>Thời gian giao hàng:</div><div>Điện thoại:</div>`
            }
            <div><span class="bold">Người bán:</span> ${seller}</div>
          </div>

          <div class="line"></div>

          <table>
            <thead>
              <tr>
                <th class="left" style="width:44%;">Đơn giá</th>
                <th class="center-t" style="width:16%;">SL</th>
                <th class="right" style="width:40%;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                <tr>
                  <td class="left" colspan="3" style="padding-top:4px;">${item.name || ""}</td>
                </tr>
                <tr>
                  <td class="left">${formatMoneyPlain(item.price)}</td>
                  <td class="center-t">${Number(item.quantity || 0)}</td>
                  <td class="right">${formatMoneyPlain(
                    Number(item.price || 0) * Number(item.quantity || 0)
                  )}</td>
                </tr>
                <tr><td colspan="3"><div class="line" style="margin:2px 0 4px;"></div></td></tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="spacer"></div>
          <table>
            <tbody>
              <tr>
                <td class="left">Tổng tiền hàng:</td>
                <td class="right">${formatMoneyPlain(order?.subtotal)}</td>
              </tr>
              <tr>
                <td class="left">Chiết khấu:</td>
                <td class="right">0</td>
              </tr>
              <tr>
                <td class="left bold">Tổng cộng:</td>
                <td class="right bold">${formatMoneyPlain(order?.subtotal)}</td>
              </tr>
            </tbody>
          </table>

          <div class="qr-wrap center">
            <div class="bold" style="font-size:16px;">NHẬN THANH TOÁN QR</div>
            <img class="qr-image" src="${FIXED_PAYMENT_QR_IMAGE}" alt="QR thanh toán" />
            <div class="small">Quét mã để thanh toán</div>
            <div class="small">MoMo - Nguyễn Ngọc Dũng - 0788880891</div>
          </div>

          <div class="line"></div>
          <div class="center bold">FOREVER COFFEE & BEER</div>
          <div class="center">B38 đường 4A - P.Tân Hưng - Quận 7</div>
          <div class="center">Điện thoại: 0788880891</div>
          <div class="center">Ngày bán: ${paidDate.toLocaleString("vi-VN")}</div>

          <script>
            window.onload = function () {
              window.print();
              setTimeout(() => window.close(), 300);
            };
          </script>
        </body>
      </html>
    `;

    const w = window.open("", "_blank", "width=420,height=950");
    if (!w) {
      setToast("Trình duyệt đang chặn cửa sổ in");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  function renderLogin() {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <div className="watermark">FOREVER</div>
          <div className="brand">FOREVER POS</div>
          <div className="brand-sub">Đăng nhập hệ thống bán hàng</div>

          <form className="form-col" onSubmit={handleLogin}>
            <input
              className="input"
              placeholder="Tài khoản"
              value={loginForm.username}
              onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
            />
            <input
              className="input"
              type="password"
              placeholder="Mật khẩu"
              value={loginForm.password}
              onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
            />
            <button className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          {error ? <div className="error-box">{error}</div> : null}
        </div>
      </div>
    );
  }

  function renderHeader() {
    return (
      <div className="topbar">
        <div>
          <div className="topbar-title">FOREVER POS</div>
          <div className="topbar-sub">
            {user?.name} • {isAdmin ? "Admin" : "Nhân viên"}
          </div>
        </div>

        <div className="topbar-actions">
          <button className="chip">{syncing ? "Đang đồng bộ..." : "Đồng bộ tự động"}</button>
          <button className="chip" onClick={() => setActiveMainTab("notifications")}>
            Thông báo {unreadCount ? `(${unreadCount})` : ""}
          </button>
          <button className="chip danger" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>
    );
  }

  function renderMainTabs() {
    return (
      <div className="main-tabs">
        <button
          className={`main-tab ${activeMainTab === "sales" ? "active" : ""}`}
          onClick={() => setActiveMainTab("sales")}
        >
          Bán hàng
        </button>
        {isAdmin && (
          <button
            className={`main-tab ${activeMainTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveMainTab("admin")}
          >
            Quản lý
          </button>
        )}
        <button
          className={`main-tab ${activeMainTab === "reports" ? "active" : ""}`}
          onClick={() => setActiveMainTab("reports")}
        >
          Báo cáo
        </button>
        <button
          className={`main-tab ${activeMainTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveMainTab("notifications")}
        >
          Thông báo
        </button>
      </div>
    );
  }

  function renderTableButton(table) {
    const normalizedTable = normalizeIncomingTable(table);
    const order =
      normalizedTable.currentOrder && typeof normalizedTable.currentOrder === "object"
        ? normalizedTable.currentOrder
        : null;

    const selected = normalizedTable._id === selectedTableId;
    const busy = getTableBusy(normalizedTable);

    return (
      <button
        key={normalizedTable._id}
        className={`table-card ${selected ? "selected" : ""} ${busy ? "busy" : ""}`}
        onClick={async () => {
          setSelectedTableId(normalizedTable._id);
          setCurrentOrder(null);
          await refreshCurrentOrderForTable(normalizedTable._id);
        }}
      >
        <div className="table-name">{normalizedTable.name}</div>
        <div className="table-meta">{getZoneLabel(normalizedTable)}</div>
        <div className="table-meta">{busy ? "Đang phục vụ" : "Trống"}</div>
        <div className="table-total">{order ? formatMoney(order.subtotal) : "---"}</div>
      </button>
    );
  }

  function renderTablesPanel() {
    const normalizedTables = tables.map((table) => normalizeIncomingTable(table));

    const front = sortByTableNumber(normalizedTables.filter((t) => isTableNumberBetween(t, 1, 6)));
    const back = sortByTableNumber(normalizedTables.filter((t) => isTableNumberBetween(t, 7, 10)));
    const vip = sortByTableNumber(normalizedTables.filter((t) => t.area === "vip"));
    const other = normalizedTables.filter((t) => isTakeawayOrDelivery(t));

    return (
      <div className="panel">
        <div className="panel-head stack-mobile">
          <div>
            <div className="panel-title">Sảnh chờ / bàn đang phục vụ</div>
            <div className="panel-sub">Danh sách bàn đồng bộ từ database</div>
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={seedDefaultTables}>
              Tạo bàn mặc định
            </button>
          )}
        </div>

        {!!front.length && (
          <>
            <div className="zone-title">Sảnh trước</div>
            <div className="table-grid">{front.map(renderTableButton)}</div>
          </>
        )}

        {!!back.length && (
          <>
            <div className="zone-title">Sau công viên</div>
            <div className="table-grid">{back.map(renderTableButton)}</div>
          </>
        )}

        {!!vip.length && (
          <>
            <div className="zone-title">VIP</div>
            <div className="table-grid">{vip.map(renderTableButton)}</div>
          </>
        )}

        {!!other.length && (
          <>
            <div className="zone-title">Khác</div>
            <div className="table-grid">{other.map(renderTableButton)}</div>
          </>
        )}

        {!normalizedTables.length && !isAdmin && <div className="empty-box">Chưa có dữ liệu bàn</div>}
      </div>
    );
  }

  function renderProductsPanel() {
    return (
      <div className="panel">
        <div className="panel-head stack-mobile">
          <div className="panel-title">Menu món</div>
          <div className="panel-tools">
            <input
              className="input small"
              placeholder="Tìm món..."
              value={productKeyword}
              onChange={(e) => setProductKeyword(e.target.value)}
            />
            <select
              className="input small"
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="menu-grid">
          {filteredProducts.map((item) => (
            <button
              key={item._id}
              className="menu-card"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addProductToOrder(item);
              }}
              disabled={Number(item.stock || 0) <= 0}
            >
              <div className="menu-card-name">{item.name}</div>
              <div className="menu-card-cat">
                {item.category} • Tồn: {item.stock} {item.unit}
              </div>
              <div className="menu-card-price">{formatMoney(item.price)}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  function renderOrderPanel() {
    return (
      <div className="panel order-panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">Đơn hiện tại</div>
            <div className="panel-sub">{selectedTable?.name || "Chưa chọn bàn"}</div>
          </div>
          <div className="order-total-top">{formatMoney(getOrderTotal(currentOrder))}</div>
        </div>

        <div className="order-list">
          {(currentOrder?.items || []).length ? (
            currentOrder.items.map((item) => (
              <div key={item.product} className="order-row">
                <div className="order-main">
                  <div className="order-name">{item.name}</div>
                  <div className="order-price">{formatMoney(item.price)}</div>
                </div>

                <div className="qty-box">
                  <button
                    className="qty-btn"
                    onClick={() => updateOrderItemQuantity(item, Number(item.quantity || 0) - 1)}
                  >
                    -
                  </button>
                  <span className="qty-num">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateOrderItemQuantity(item, Number(item.quantity || 0) + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="order-line-total">
                  {formatMoney(Number(item.price || 0) * Number(item.quantity || 0))}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-box">Chưa có món trong đơn</div>
          )}
        </div>

        <div className="summary-box">
          <div className="summary-row">
            <span>Tổng món</span>
            <strong>{getOrderQty(currentOrder)}</strong>
          </div>
          <div className="summary-row total">
            <span>Tổng tiền</span>
            <strong>{formatMoney(getOrderTotal(currentOrder))}</strong>
          </div>
        </div>

        <div className="sticky-actions">
          <button
            className="btn"
            onClick={() => {
              if (!currentOrder) return setToast("Chưa có bill để in");
              printBill(currentOrder, selectedTable?.name || "Bàn", user?.name || "admin", true);
            }}
          >
            In bill tạm
          </button>
          <button className="btn btn-primary" onClick={payCurrentOrder}>
            Thanh toán
          </button>
        </div>
      </div>
    );
  }

  function renderSalesDesktop() {
    return (
      <div className="sales-layout desktop-layout">
        <div className="col left">{renderTablesPanel()}</div>
        <div className="col center">{renderProductsPanel()}</div>
        <div className="col right">{renderOrderPanel()}</div>
      </div>
    );
  }

  function renderSalesMobile() {
    return (
      <div className="sales-layout mobile-layout">
        {mobileTab === "tables" && renderTablesPanel()}
        {mobileTab === "menu" && renderProductsPanel()}
        {mobileTab === "order" && renderOrderPanel()}
        {mobileTab === "more" && (
          <div className="panel">
            <div className="panel-title">Mục khác</div>
            <div className="mobile-more-list">
              <button className="mobile-more-btn" onClick={() => setActiveMainTab("notifications")}>
                Thông báo
              </button>
              <button className="mobile-more-btn" onClick={() => setActiveMainTab("reports")}>
                Báo cáo
              </button>
              {isAdmin && (
                <button className="mobile-more-btn" onClick={() => setActiveMainTab("admin")}>
                  Quản lý
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mobile-bottom-nav">
          <button
            className={`mbtn ${mobileTab === "tables" ? "active" : ""}`}
            onClick={() => {
              setActiveMainTab("sales");
              setMobileTab("tables");
            }}
          >
            Bàn
          </button>
          <button
            className={`mbtn ${mobileTab === "menu" ? "active" : ""}`}
            onClick={() => {
              setActiveMainTab("sales");
              setMobileTab("menu");
            }}
          >
            Menu
          </button>
          <button
            className={`mbtn ${mobileTab === "order" ? "active" : ""}`}
            onClick={() => {
              setActiveMainTab("sales");
              setMobileTab("order");
            }}
          >
            Đơn
          </button>
          <button
            className={`mbtn ${mobileTab === "more" ? "active" : ""}`}
            onClick={() => setMobileTab("more")}
          >
            Khác
          </button>
        </div>
      </div>
    );
  }

  function renderAdminProducts() {
    return (
      <div className="admin-grid">
        <div className="panel inner">
          <div className="panel-title small-title">
            {editingProductId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </div>
          <div className="form-col">
            <input
              className="input"
              placeholder="Tên món"
              value={productForm.name}
              onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Danh mục"
              value={productForm.category}
              onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}
            />
            <input
              className="input"
              type="number"
              placeholder="Giá bán"
              value={productForm.price}
              onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
            />
            <input
              className="input"
              type="number"
              placeholder="Tồn kho"
              value={productForm.stock}
              onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Đơn vị"
              value={productForm.unit}
              onChange={(e) => setProductForm((p) => ({ ...p, unit: e.target.value }))}
            />
            <label className="check-row">
              <input
                type="checkbox"
                checked={productForm.isActive}
                onChange={(e) => setProductForm((p) => ({ ...p, isActive: e.target.checked }))}
              />
              <span>Đang bán</span>
            </label>

            <div className="row-actions">
              <button className="btn btn-primary" onClick={saveProduct}>
                {editingProductId ? "Cập nhật" : "Thêm món"}
              </button>
              <button
                className="btn"
                onClick={() => {
                  setProductForm(emptyProductForm());
                  setEditingProductId(null);
                }}
              >
                Mới
              </button>
            </div>
          </div>
        </div>

        <div className="panel inner">
          <div className="panel-title small-title">Danh sách sản phẩm</div>
          <div className="list-table">
            {products.map((item) => (
              <div key={item._id} className="list-row">
                <div>
                  <div className="list-name">{item.name}</div>
                  <div className="list-sub">
                    {item.category} • {formatMoney(item.price)} • Tồn: {item.stock} {item.unit}
                  </div>
                </div>
                <div className="row-actions">
                  <button className="btn small" onClick={() => startEditProduct(item)}>
                    Sửa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="divider" />

          <div className="panel-title small-title">Nhập thêm kho sản phẩm</div>
          <div className="form-col">
            <select
              className="input"
              value={importProductId}
              onChange={(e) => setImportProductId(e.target.value)}
            >
              <option value="">Chọn sản phẩm</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              className="input"
              type="number"
              placeholder="Số lượng nhập"
              value={importForm.quantity}
              onChange={(e) => setImportForm((p) => ({ ...p, quantity: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Ghi chú"
              value={importForm.note}
              onChange={(e) => setImportForm((p) => ({ ...p, note: e.target.value }))}
            />
            <button className="btn btn-primary" onClick={importProductStock}>
              Nhập kho
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderAdminWarehouse() {
    return (
      <div className="admin-grid">
        <div className="panel inner">
          <div className="panel-title small-title">
            {editingWarehouseId ? "Sửa kho riêng" : "Thêm kho riêng"}
          </div>
          <div className="form-col">
            <input
              className="input"
              placeholder="Tên hàng kho"
              value={warehouseForm.name}
              onChange={(e) => setWarehouseForm((p) => ({ ...p, name: e.target.value }))}
            />
            <input
              className="input"
              type="number"
              placeholder="Số lượng"
              value={warehouseForm.quantity}
              onChange={(e) => setWarehouseForm((p) => ({ ...p, quantity: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Đơn vị"
              value={warehouseForm.unit}
              onChange={(e) => setWarehouseForm((p) => ({ ...p, unit: e.target.value }))}
            />
            <textarea
              className="input"
              rows={3}
              placeholder="Ghi chú"
              value={warehouseForm.note}
              onChange={(e) => setWarehouseForm((p) => ({ ...p, note: e.target.value }))}
            />

            <div className="row-actions">
              <button className="btn btn-primary" onClick={saveWarehouseItem}>
                {editingWarehouseId ? "Cập nhật" : "Thêm kho"}
              </button>
              <button
                className="btn"
                onClick={() => {
                  setWarehouseForm(emptyWarehouseForm());
                  setEditingWarehouseId(null);
                }}
              >
                Mới
              </button>
            </div>
          </div>
        </div>

        <div className="panel inner">
          <div className="panel-head stack-mobile">
            <div className="panel-title small-title">Danh sách kho riêng</div>
            <input
              className="input small"
              placeholder="Tìm kho..."
              value={warehouseKeyword}
              onChange={(e) => setWarehouseKeyword(e.target.value)}
            />
          </div>

          <div className="list-table">
            {filteredWarehouse.map((item) => (
              <div key={item._id} className="list-row">
                <div>
                  <div className="list-name">{item.name}</div>
                  <div className="list-sub">
                    {item.quantity} {item.unit} • {item.note || "Không ghi chú"}
                  </div>
                </div>
                <div className="row-actions">
                  <button className="btn small" onClick={() => startEditWarehouse(item)}>
                    Sửa
                  </button>
                  <button className="btn small danger" onClick={() => deleteWarehouseItem(item._id)}>
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!!warehouseLogs.length && (
            <>
              <div className="divider" />
              <div className="panel-title small-title">Log kho riêng</div>
              <div className="list-table">
                {warehouseLogs.slice(0, 20).map((log) => (
                  <div key={log._id} className="list-row">
                    <div>
                      <div className="list-name">
                        {log.itemName} • {log.action}
                      </div>
                      <div className="list-sub">
                        {log.quantity} {log.unit} • {log.note || ""} •{" "}
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  function renderAdminUsers() {
    return (
      <div className="admin-grid">
        <div className="panel inner">
          <div className="panel-title small-title">Tạo tài khoản mới</div>
          <div className="form-col">
            <input
              className="input"
              placeholder="Họ tên"
              value={userForm.name}
              onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Tên đăng nhập"
              value={userForm.username}
              onChange={(e) => setUserForm((p) => ({ ...p, username: e.target.value }))}
            />
            <input
              className="input"
              type="password"
              placeholder="Mật khẩu"
              value={userForm.password}
              onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))}
            />
            <select
              className="input"
              value={userForm.role}
              onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))}
            >
              <option value="staff">Nhân viên</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn btn-primary" onClick={saveUser}>
              Tạo tài khoản
            </button>
          </div>
        </div>

        <div className="panel inner">
          <div className="panel-title small-title">Danh sách tài khoản</div>
          <div className="list-table">
            {users.map((item) => (
              <div key={item._id || item.id} className="list-row">
                <div>
                  <div className="list-name">{item.name}</div>
                  <div className="list-sub">
                    {item.username} • {item.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderAdminLogs() {
    return (
      <div className="panel inner">
        <div className="panel-title small-title">Log tồn kho sản phẩm</div>
        <div className="list-table">
          {inventoryLogs.map((log) => (
            <div key={log._id} className="list-row">
              <div>
                <div className="list-name">
                  {log.productName} • {log.type}
                </div>
                <div className="list-sub">
                  {log.quantity} • {log.note || ""} • {new Date(log.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderAdmin() {
    return (
      <div className="panel">
        <div className="panel-head stack-mobile">
          <div className="panel-title">Quản lý</div>
          <div className="admin-tabs">
            <button
              className={`sub-tab ${activeAdminTab === "products" ? "active" : ""}`}
              onClick={() => setActiveAdminTab("products")}
            >
              Sản phẩm
            </button>
            <button
              className={`sub-tab ${activeAdminTab === "warehouse" ? "active" : ""}`}
              onClick={() => setActiveAdminTab("warehouse")}
            >
              Kho riêng
            </button>
            <button
              className={`sub-tab ${activeAdminTab === "users" ? "active" : ""}`}
              onClick={() => setActiveAdminTab("users")}
            >
              Tài khoản
            </button>
            <button
              className={`sub-tab ${activeAdminTab === "logs" ? "active" : ""}`}
              onClick={() => setActiveAdminTab("logs")}
            >
              Log
            </button>
          </div>
        </div>

        {activeAdminTab === "products" && renderAdminProducts()}
        {activeAdminTab === "warehouse" && renderAdminWarehouse()}
        {activeAdminTab === "users" && renderAdminUsers()}
        {activeAdminTab === "logs" && renderAdminLogs()}
      </div>
    );
  }

  function renderReports() {
    return (
      <div className="panel">
        <div className="panel-title">Báo cáo</div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Doanh thu hôm nay</div>
            <div className="stat-value">{formatMoney(reportSummary?.todayRevenue)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Doanh thu chờ</div>
            <div className="stat-value">{formatMoney(pendingRevenue)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Doanh thu tháng</div>
            <div className="stat-value">{formatMoney(reportSummary?.monthRevenue)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Doanh thu năm</div>
            <div className="stat-value">{formatMoney(reportSummary?.yearRevenue)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Số đơn hôm nay</div>
            <div className="stat-value">{reportSummary?.todayOrders || 0}</div>
          </div>
        </div>

        <div className="admin-grid">
          <div className="panel inner">
            <div className="panel-title small-title">Top món tháng này</div>
            <div className="list-table">
              {(reportSummary?.topProducts || []).map((item, idx) => (
                <div key={`${item._id}-${idx}`} className="list-row">
                  <div>
                    <div className="list-name">{item._id}</div>
                    <div className="list-sub">
                      SL: {item.qty} • Doanh thu: {formatMoney(item.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel inner">
            <div className="panel-title small-title">Món sắp hết hàng</div>
            <div className="list-table">
              {(reportSummary?.lowStock || []).map((item) => (
                <div key={item._id} className="list-row">
                  <div>
                    <div className="list-name">{item.name}</div>
                    <div className="list-sub">
                      Còn {item.stock} {item.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-grid">
          <div className="panel inner">
            <div className="panel-title small-title">Thống kê theo ca</div>
            <div className="list-table">
              {(reportSummary?.shiftStats || []).map((shift) => (
                <div key={shift.name} className="list-row">
                  <div>
                    <div className="list-name">{shift.name}</div>
                    <div className="list-sub">
                      {shift.orders} đơn • {formatMoney(shift.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel inner">
            <div className="panel-head stack-mobile">
              <div className="panel-title small-title">Lịch sử thanh toán</div>
              <button className="btn small" onClick={() => setShowMoreHistory((p) => !p)}>
                {showMoreHistory ? "Thu gọn" : "Xem thêm"}
              </button>
            </div>
            <div className="list-table">
              {visibleHistory.map((order) => (
                <div key={order._id} className="list-row">
                  <div>
                    <div className="list-name">{formatMoney(order.subtotal)}</div>
                    <div className="list-sub">
                      {new Date(order.paidAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <button
                    className="btn small"
                    onClick={() =>
                      printBill(order, order?.tableName || "Đã thanh toán", user?.name || "admin", false)
                    }
                  >
                    In lại
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderNotifications() {
    return (
      <div className="panel">
        <div className="panel-head stack-mobile">
          <div className="panel-title">Thông báo đồng bộ</div>
          <div className="row-actions">
            <button className="btn small" onClick={syncAll}>
              Làm mới
            </button>
            <button className="btn small" onClick={markAllNotificationsRead}>
              Đọc tất cả
            </button>
          </div>
        </div>

        <div className="list-table">
          {notifications.length ? (
            notifications.map((item) => {
              const isRead = getNotificationRead(item, user?.id);
              return (
                <div key={item._id} className={`list-row notification-row ${isRead ? "" : "unread"}`}>
                  <div>
                    <div className="list-name">
                      {item.title || "Thông báo"} {item.level ? `• ${item.level}` : ""}
                    </div>
                    <div className="list-sub">
                      {item.message || ""} •{" "}
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                  {!isRead && (
                    <button className="btn small" onClick={() => markNotificationRead(item._id)}>
                      Đã đọc
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="empty-box">Chưa có thông báo</div>
          )}
        </div>
      </div>
    );
  }

  function renderMobileHomeButton() {
    if (!isMobile) return null;

    const isHomeScreen = activeMainTab === "sales" && mobileTab === "tables";
    if (isHomeScreen) return null;

    return (
      <button className="floating-home-btn" onClick={goHome}>
        Trang chủ
      </button>
    );
  }

  if (!token || !user) {
    return (
      <>
        <StyleTag />
        {renderLogin()}
      </>
    );
  }

  return (
    <>
      <StyleTag />
      <div className="app-shell">
        {renderHeader()}
        {!isMobile && renderMainTabs()}

        {error ? <div className="error-box outer">{error}</div> : null}
        {toast ? <div className="toast">{toast}</div> : null}

        {activeMainTab === "sales" && (isMobile ? renderSalesMobile() : renderSalesDesktop())}
        {activeMainTab === "admin" && isAdmin && renderAdmin()}
        {activeMainTab === "reports" && renderReports()}
        {activeMainTab === "notifications" && renderNotifications()}

        {renderMobileHomeButton()}
      </div>
    </>
  );
}

function StyleTag() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        background: #f7f2ea;
        color: #2e2018;
      }
      button, input, select, textarea { font: inherit; }
      .app-shell {
        min-height: 100vh;
        padding: 14px;
        background:
          radial-gradient(circle at top left, #fff8ef 0%, #f4ece1 45%, #efe5d7 100%);
      }
      .login-wrap {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .login-card {
        width: 100%;
        max-width: 420px;
        background: rgba(255,255,255,0.88);
        border: 1px solid #e5d2b8;
        border-radius: 28px;
        padding: 28px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 20px 50px rgba(82,53,28,0.12);
      }
      .watermark {
        position: absolute;
        inset: auto -40px -30px auto;
        font-size: 72px;
        font-weight: 900;
        color: rgba(125,82,37,0.06);
        transform: rotate(-18deg);
        pointer-events: none;
      }
      .brand {
        font-size: 28px;
        font-weight: 800;
        color: #6c4427;
      }
      .brand-sub {
        color: #8c6b4b;
        margin-top: 6px;
        margin-bottom: 22px;
      }
      .form-col {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .input {
        width: 100%;
        border: 1px solid #d9c2a6;
        border-radius: 16px;
        background: #fffdfb;
        padding: 13px 14px;
        outline: none;
      }
      .input:focus {
        border-color: #9a6638;
        box-shadow: 0 0 0 3px rgba(154,102,56,0.12);
      }
      .input.small { padding: 10px 12px; }
      .btn {
        border: 0;
        border-radius: 16px;
        padding: 12px 14px;
        background: #e9dac7;
        color: #53331e;
        font-weight: 700;
        cursor: pointer;
      }
      .btn-primary {
        background: linear-gradient(180deg, #8d5a2c 0%, #734620 100%);
        color: #fff;
      }
      .btn-lg {
        min-height: 52px;
        font-size: 16px;
      }
      .btn.small {
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 14px;
      }
      .danger {
        background: #f4d7d7 !important;
        color: #8c2a2a !important;
      }
      .error-box {
        margin-top: 14px;
        background: #fff1f1;
        border: 1px solid #f1c9c9;
        color: #8a2e2e;
        padding: 12px 14px;
        border-radius: 16px;
      }
      .error-box.outer { margin-bottom: 12px; }
      .toast {
        position: fixed;
        right: 14px;
        top: 14px;
        z-index: 40;
        background: #2f2017;
        color: white;
        padding: 12px 14px;
        border-radius: 14px;
        box-shadow: 0 12px 30px rgba(0,0,0,0.18);
      }
      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        background: rgba(255,255,255,0.78);
        border: 1px solid #e2d2c0;
        border-radius: 22px;
        padding: 14px 16px;
        box-shadow: 0 10px 30px rgba(79,53,30,0.07);
      }
      .topbar-title {
        font-size: 24px;
        font-weight: 900;
        color: #6f4726;
      }
      .topbar-sub {
        color: #88684d;
        font-size: 14px;
        margin-top: 4px;
      }
      .topbar-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .chip {
        border: 1px solid #d9c4aa;
        border-radius: 999px;
        padding: 10px 14px;
        background: #fffaf4;
        color: #694224;
        font-weight: 700;
        cursor: pointer;
      }
      .main-tabs {
        display: flex;
        gap: 10px;
        margin-top: 14px;
        margin-bottom: 14px;
      }
      .main-tab {
        border: 0;
        border-radius: 16px;
        padding: 12px 16px;
        background: #e7d8c7;
        color: #66401f;
        font-weight: 800;
        cursor: pointer;
      }
      .main-tab.active {
        background: #7b4d27;
        color: #fff;
      }
      .sales-layout.desktop-layout {
        display: grid;
        grid-template-columns: 1.1fr 1.3fr 1fr;
        gap: 14px;
      }
      .sales-layout.mobile-layout {
        padding-bottom: 84px;
      }
      .panel {
        background: rgba(255,255,255,0.86);
        border: 1px solid #e4d4c1;
        border-radius: 24px;
        padding: 14px;
        box-shadow: 0 12px 30px rgba(85,57,32,0.06);
      }
      .panel.inner {
        background: #fffaf5;
      }
      .panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }
      .panel-title {
        font-size: 18px;
        font-weight: 900;
        color: #6c4322;
      }
      .small-title {
        font-size: 16px;
      }
      .panel-sub {
        color: #8f6b4b;
        font-size: 13px;
      }
      .panel-tools,
      .admin-tabs,
      .row-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .sub-tab {
        border: 0;
        border-radius: 12px;
        background: #e8dac8;
        color: #68401e;
        padding: 10px 12px;
        font-weight: 700;
        cursor: pointer;
      }
      .sub-tab.active {
        background: #7b4d27;
        color: white;
      }
      .zone-title {
        font-size: 14px;
        font-weight: 800;
        color: #805635;
        margin: 14px 0 8px;
      }
      .table-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .table-card {
        text-align: left;
        border: 1px solid #e0cfba;
        background: #fffdf9;
        border-radius: 18px;
        padding: 14px;
        cursor: pointer;
      }
      .table-card.selected {
        border-color: #8e5d33;
        box-shadow: 0 0 0 3px rgba(142,93,51,0.12);
      }
      .table-card.busy {
        background: linear-gradient(180deg, #fff6ea 0%, #f7e8d4 100%);
      }
      .table-name {
        font-size: 16px;
        font-weight: 900;
      }
      .table-meta {
        margin-top: 6px;
        color: #89694f;
        font-size: 13px;
      }
      .table-total {
        margin-top: 8px;
        font-size: 16px;
        font-weight: 900;
        color: #7e4d23;
      }
      .menu-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .menu-card {
        border: 1px solid #e0cfba;
        background: #fffdf9;
        border-radius: 18px;
        padding: 14px;
        text-align: left;
        cursor: pointer;
      }
      .menu-card:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
      .menu-card-name {
        font-size: 15px;
        font-weight: 900;
      }
      .menu-card-cat {
        margin-top: 5px;
        color: #8a6b4f;
        font-size: 12px;
      }
      .menu-card-price {
        margin-top: 8px;
        color: #7a4920;
        font-size: 16px;
        font-weight: 900;
      }
      .order-panel {
        display: flex;
        flex-direction: column;
      }
      .order-total-top {
        font-size: 18px;
        font-weight: 900;
        color: #7c4a21;
      }
      .order-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-height: 240px;
      }
      .order-row {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 10px;
        align-items: center;
        border: 1px solid #ebdccb;
        background: #fffdf9;
        border-radius: 16px;
        padding: 10px;
      }
      .order-name { font-weight: 800; }
      .order-price {
        margin-top: 4px;
        font-size: 13px;
        color: #8a6b50;
      }
      .qty-box {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .qty-btn {
        width: 32px;
        height: 32px;
        border: 0;
        border-radius: 10px;
        background: #ebdbc8;
        cursor: pointer;
        font-weight: 900;
      }
      .qty-num {
        min-width: 18px;
        text-align: center;
        font-weight: 900;
      }
      .order-line-total {
        font-weight: 900;
        color: #6e431f;
        white-space: nowrap;
      }
      .empty-box {
        padding: 18px;
        border: 1px dashed #d8c5af;
        border-radius: 18px;
        color: #8b6b4b;
        text-align: center;
      }
      .summary-box {
        margin-top: 12px;
        background: #fff8ef;
        border: 1px solid #eadac8;
        border-radius: 18px;
        padding: 12px;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
      }
      .summary-row.total {
        margin-top: 6px;
        padding-top: 10px;
        border-top: 1px dashed #d7c2ab;
        font-size: 16px;
      }
      .sticky-actions {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        margin-top: 12px;
      }
      .admin-grid {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 14px;
      }
      .list-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .list-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: 1px solid #ead8c6;
        border-radius: 16px;
        background: #fffdf9;
      }
      .list-name { font-weight: 900; }
      .list-sub {
        margin-top: 4px;
        font-size: 13px;
        color: #8c6d50;
      }
      .notification-row.unread {
        background: #fff8ec;
        border-color: #dec39d;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 12px;
        margin-top: 14px;
        margin-bottom: 14px;
      }
      .stat-card {
        border: 1px solid #ead8c7;
        background: #fffdf9;
        border-radius: 20px;
        padding: 16px;
      }
      .stat-label {
        color: #8b6a4d;
        font-size: 13px;
      }
      .stat-value {
        margin-top: 8px;
        font-size: 22px;
        font-weight: 900;
        color: #72441e;
      }
      .mobile-bottom-nav {
        position: fixed;
        left: 10px;
        right: 10px;
        bottom: 10px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        background: rgba(66,41,23,0.95);
        padding: 8px;
        border-radius: 22px;
        box-shadow: 0 18px 34px rgba(0,0,0,0.2);
      }
      .mbtn {
        border: 0;
        border-radius: 16px;
        min-height: 52px;
        background: transparent;
        color: #f8ede2;
        font-weight: 800;
        cursor: pointer;
      }
      .mbtn.active {
        background: #fff3e5;
        color: #6e4322;
      }
      .mobile-more-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .mobile-more-btn {
        width: 100%;
        min-height: 52px;
        border: 0;
        border-radius: 16px;
        background: #ead9c8;
        color: #66401e;
        font-weight: 800;
      }
      .check-row {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #6e4a2a;
      }
      .divider {
        height: 1px;
        background: #ead8c7;
        margin: 16px 0;
      }
      .floating-home-btn {
        position: fixed;
        right: 14px;
        bottom: 86px;
        z-index: 60;
        border: 0;
        border-radius: 999px;
        padding: 14px 18px;
        background: linear-gradient(180deg, #8d5a2c 0%, #734620 100%);
        color: #fff;
        font-weight: 800;
        box-shadow: 0 12px 30px rgba(0,0,0,0.18);
        cursor: pointer;
      }

      @media (max-width: 1024px) {
        .sales-layout.desktop-layout {
          grid-template-columns: 1fr 1fr;
        }
        .sales-layout.desktop-layout .right {
          grid-column: 1 / -1;
        }
        .admin-grid {
          grid-template-columns: 1fr;
        }
        .stats-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 767px) {
        .app-shell { padding: 10px; }
        .topbar {
          align-items: flex-start;
          flex-direction: column;
        }
        .topbar-title { font-size: 20px; }
        .main-tabs { display: none; }
        .stack-mobile {
          flex-direction: column;
          align-items: stretch;
        }
        .table-grid,
        .menu-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .order-row {
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .sticky-actions {
          position: sticky;
          bottom: 76px;
          background: rgba(255,248,239,0.98);
          padding-top: 8px;
        }
        .stats-grid {
          grid-template-columns: 1fr;
        }
        .list-row {
          flex-direction: column;
          align-items: stretch;
        }
        .btn,
        .chip,
        .input,
        .main-tab,
        .sub-tab {
          min-height: 46px;
        }
        .floating-home-btn {
          bottom: 86px;
        }
      }
    `}</style>
  );
}
