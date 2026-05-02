// FULL App.jsx (FIXED VERSION)
// Stable version fixing order loading issue

import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function api(path, options = {}, token) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
}

export default function App() {
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [token, setToken] = useState("");

  function getTableOrderId(table) {
    if (!table?.currentOrder) return null;
    if (typeof table.currentOrder === "string") return table.currentOrder;
    return table.currentOrder._id;
  }

  async function refreshCurrentOrderForTable(tableId, tableList = tables) {
    try {
      const table = tableList.find((t) => t._id === tableId);

      if (!table) {
        setCurrentOrder(null);
        return null;
      }

      if (table.currentOrder && table.currentOrder._id) {
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
      console.error("REFRESH ERROR:", err);
      setCurrentOrder(null);
      return null;
    }
  }

  async function handleSelectTable(table) {
    setSelectedTableId(table._id);
    setCurrentOrder(null);
    await refreshCurrentOrderForTable(table._id);
  }

  async function addItem(product) {
    if (!selectedTableId) return alert("Chọn bàn trước");

    let order = currentOrder;

    if (!order?._id) {
      order = await api(`/api/orders/table/${selectedTableId}/open`, {
        method: "POST",
      }, token);
      setCurrentOrder(order);
    }

    const updated = await api(`/api/orders/${order._id}/add-item`, {
      method: "POST",
      body: JSON.stringify({
        productId: product._id,
        quantity: 1,
      }),
    }, token);

    setCurrentOrder(updated);
  }

  useEffect(() => {
    async function load() {
      const t = await api("/api/tables");
      const p = await api("/api/products");
      setTables(t);
      setProducts(p);
    }
    load();
  }, []);

  return (
    <div style={{ display: "flex", padding: 20 }}>
      <div style={{ width: "30%" }}>
        <h3>Bàn</h3>
        {tables.map((t) => (
          <div
            key={t._id}
            onClick={() => handleSelectTable(t)}
            style={{
              padding: 10,
              margin: 5,
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            {t.name}
          </div>
        ))}
      </div>

      <div style={{ width: "40%" }}>
        <h3>Menu</h3>
        {products.map((p) => (
          <div
            key={p._id}
            onClick={() => addItem(p)}
            style={{
              padding: 10,
              margin: 5,
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            {p.name} - {p.price}
          </div>
        ))}
      </div>

      <div style={{ width: "30%" }}>
        <h3>Đơn hiện tại</h3>
        {currentOrder?.items?.length ? (
          currentOrder.items.map((i, idx) => (
            <div key={idx}>
              {i.name} x{i.quantity}
            </div>
          ))
        ) : (
          <div>Chưa có món</div>
        )}
      </div>
    </div>
  );
}
