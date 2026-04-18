import React, { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const WAREHOUSE_STORAGE_KEY = 'forever_pos_warehouse_v1';
const WAREHOUSE_LOG_STORAGE_KEY = 'forever_pos_warehouse_logs_v1';

const palette = {
  bg: '#f6efe6',
  panel: '#fffaf4',
  line: '#eadfce',
  brown: '#6d4021',
  brown2: '#8a5a34',
  text: '#4c3214',
  muted: '#8a6a4f',
  soft: '#dbc5ab',
  ok: '#2e7d32',
  warn: '#a15c00',
  danger: '#b42318'
};

const cardStyle = {
  background: palette.panel,
  borderRadius: 18,
  boxShadow: '0 10px 25px rgba(76, 50, 20, 0.08)',
  padding: 16,
  border: `1px solid ${palette.line}`
};

const inputStyle = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: 12,
  border: `1px solid ${palette.soft}`,
  outline: 'none',
  background: '#fffdf9'
};

const buttonStyle = {
  background: palette.brown2,
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  padding: '10px 14px',
  cursor: 'pointer',
  fontWeight: 700
};

const mutedButton = {
  ...buttonStyle,
  background: palette.soft,
  color: palette.text
};

const dangerButton = {
  ...buttonStyle,
  background: '#e9c3be',
  color: '#7c231c'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse'
};

const th = {
  textAlign: 'left',
  color: palette.muted,
  fontSize: 13,
  padding: '10px 8px',
  borderBottom: `1px solid ${palette.line}`
};

const td = {
  padding: '10px 8px',
  borderBottom: `1px solid ${palette.line}`,
  color: palette.text,
  verticalAlign: 'top'
};

const FOREVER_MENU_PRESET = [
  { name: 'Cà phê đá/nóng', category: 'Coffee', price: 20000, unit: 'ly' },
  { name: 'Cà phê sữa', category: 'Coffee', price: 23000, unit: 'ly' },
  { name: 'Bạc xỉu', category: 'Coffee', price: 23000, unit: 'ly' },
  { name: 'Cà phê đá xay', category: 'Coffee', price: 30000, unit: 'ly' },
  { name: 'Cà phê đá xay bạc hà', category: 'Coffee', price: 30000, unit: 'ly' },
  { name: 'Cà phê sữa bạc hà', category: 'Coffee', price: 28000, unit: 'ly' },
  { name: 'Cà phê latte', category: 'Coffee', price: 33000, unit: 'ly' },
  { name: 'Matcha latte', category: 'Coffee', price: 33000, unit: 'ly' },

  { name: 'Sữa tươi đá/nóng', category: 'Milk', price: 25000, unit: 'ly' },
  { name: 'Sữa tươi trân châu', category: 'Milk', price: 28000, unit: 'ly' },
  { name: 'Sữa tươi cà phê', category: 'Milk', price: 28000, unit: 'ly' },
  { name: 'Sữa chanh sữa tắc', category: 'Milk', price: 28000, unit: 'ly' },
  { name: 'Sâm dứa sữa sâm', category: 'Milk', price: 28000, unit: 'ly' },
  { name: 'Dừa sữa đá xay', category: 'Milk', price: 28000, unit: 'ly' },
  { name: 'Matcha đá xay', category: 'Milk', price: 33000, unit: 'ly' },

  { name: 'Cacao nóng/đá', category: 'Cacao', price: 28000, unit: 'ly' },
  { name: 'Cacao sữa dầm', category: 'Cacao', price: 30000, unit: 'ly' },
  { name: 'Cacao đá xay', category: 'Cacao', price: 30000, unit: 'ly' },
  { name: 'Cacao đá xay bạc hà', category: 'Cacao', price: 33000, unit: 'ly' },
  { name: 'Cacao đá xay oreo', category: 'Cacao', price: 33000, unit: 'ly' },
  { name: 'Cacao dừa', category: 'Cacao', price: 33000, unit: 'ly' },

  { name: 'Hồng trà phúc bồn tử', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Hồng trà việt quất', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Hồng trà ổi', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Hồng trà dâu', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Hồng trà đào', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Hồng trà xí muội tắc', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Hồng trà dưa hấu', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Hồng trà lựu', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Hồng trà vải', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Hồng trà nho', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Hồng trà xoài', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Hồng trà gừng', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Hồng trà tắc', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Trà sữa trân châu', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Trà sữa cà phê caramel', category: 'Tea', price: 33000, unit: 'ly' },
  { name: 'Trà la hán hoa cúc', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Trà hoa đậu biếc', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Trà atiso', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Trà lipton chanh', category: 'Tea', price: 28000, unit: 'ly' },
  { name: 'Lipton sữa trân châu', category: 'Tea', price: 30000, unit: 'ly' },

  { name: 'Sinh tố bơ', category: 'Sinh tố', price: 30000, unit: 'ly' },
  { name: 'Sinh tố mít', category: 'Sinh tố', price: 30000, unit: 'ly' },
  { name: 'Sinh tố xoài', category: 'Sinh tố', price: 30000, unit: 'ly' },
  { name: 'Sinh tố dâu', category: 'Sinh tố', price: 30000, unit: 'ly' },
  { name: 'Sinh tố đu đủ', category: 'Sinh tố', price: 30000, unit: 'ly' },
  { name: 'Sinh tố chuối', category: 'Sinh tố', price: 30000, unit: 'ly' },
  { name: 'Sinh tố dưa gang', category: 'Sinh tố', price: 30000, unit: 'ly' },
  { name: 'Sinh tố mãng cầu', category: 'Sinh tố', price: 30000, unit: 'ly' },
  { name: 'Sinh tố khoai môn', category: 'Sinh tố', price: 30000, unit: 'ly' },
  { name: 'Sinh tố sapoche', category: 'Sinh tố', price: 30000, unit: 'ly' },
  { name: 'Sinh tố dừa', category: 'Sinh tố', price: 30000, unit: 'ly' },
  { name: 'Sinh tố phúc bồn tử', category: 'Sinh tố', price: 30000, unit: 'ly' },
  { name: 'Sinh tố việt quất', category: 'Sinh tố', price: 30000, unit: 'ly' },

  { name: 'Nước ép ổi', category: 'Nước ép', price: 30000, unit: 'ly' },
  { name: 'Nước ép cam', category: 'Nước ép', price: 30000, unit: 'ly' },
  { name: 'Nước ép thơm', category: 'Nước ép', price: 30000, unit: 'ly' },
  { name: 'Nước ép cà rốt', category: 'Nước ép', price: 30000, unit: 'ly' },
  { name: 'Nước ép cà chua', category: 'Nước ép', price: 30000, unit: 'ly' },
  { name: 'Nước ép cam sữa', category: 'Nước ép', price: 30000, unit: 'ly' },
  { name: 'Nước ép dưa hấu', category: 'Nước ép', price: 30000, unit: 'ly' },
  { name: 'Nước ép đá chanh', category: 'Nước ép', price: 30000, unit: 'ly' },
  { name: 'Nước ép chanh muối', category: 'Nước ép', price: 30000, unit: 'ly' },
  { name: 'Nước ép chanh dây', category: 'Nước ép', price: 30000, unit: 'ly' },
  { name: 'Nước ép cam mật ong', category: 'Nước ép', price: 30000, unit: 'ly' },

  { name: 'Soda bạc hà', category: 'Soda', price: 30000, unit: 'ly' },
  { name: 'Soda chanh dây', category: 'Soda', price: 30000, unit: 'ly' },
  { name: 'Soda chanh đường', category: 'Soda', price: 30000, unit: 'ly' },
  { name: 'Soda dâu', category: 'Soda', price: 30000, unit: 'ly' },
  { name: 'Soda đào', category: 'Soda', price: 30000, unit: 'ly' },
  { name: 'Soda nho', category: 'Soda', price: 30000, unit: 'ly' },
  { name: 'Soda phúc bồn tử', category: 'Soda', price: 30000, unit: 'ly' },
  { name: 'Soda vải', category: 'Soda', price: 30000, unit: 'ly' },
  { name: 'Soda việt quất', category: 'Soda', price: 30000, unit: 'ly' },
  { name: 'Soda ổi', category: 'Soda', price: 30000, unit: 'ly' },
  { name: 'Soda xoài', category: 'Soda', price: 30000, unit: 'ly' },
  { name: 'Soda kiwi', category: 'Soda', price: 30000, unit: 'ly' },

  { name: 'Yaourt đá', category: 'Yaourt', price: 25000, unit: 'ly' },
  { name: 'Yaourt ổi', category: 'Yaourt', price: 28000, unit: 'ly' },
  { name: 'Yaourt vải', category: 'Yaourt', price: 28000, unit: 'ly' },
  { name: 'Yaourt dâu', category: 'Yaourt', price: 28000, unit: 'ly' },
  { name: 'Yaourt đào', category: 'Yaourt', price: 28000, unit: 'ly' },
  { name: 'Yaourt nho', category: 'Yaourt', price: 28000, unit: 'ly' },
  { name: 'Yaourt thơm', category: 'Yaourt', price: 28000, unit: 'ly' },
  { name: 'Yaourt cam tươi', category: 'Yaourt', price: 28000, unit: 'ly' },
  { name: 'Yaourt việt quất', category: 'Yaourt', price: 28000, unit: 'ly' },
  { name: 'Yaourt chanh dây', category: 'Yaourt', price: 28000, unit: 'ly' },
  { name: 'Yaourt phúc bồn tử', category: 'Yaourt', price: 28000, unit: 'ly' },
  { name: 'Yaourt trái cây dầm', category: 'Yaourt', price: 32000, unit: 'ly' },

  { name: 'Mojito bạc hà', category: 'Mojito', price: 39000, unit: 'ly' },
  { name: 'Mojito dâu', category: 'Mojito', price: 39000, unit: 'ly' },
  { name: 'Mojito dưa gang', category: 'Mojito', price: 39000, unit: 'ly' },
  { name: 'Mojito đào', category: 'Mojito', price: 39000, unit: 'ly' },
  { name: 'Mojito nho', category: 'Mojito', price: 39000, unit: 'ly' },
  { name: 'Mojito phúc bồn tử', category: 'Mojito', price: 39000, unit: 'ly' },
  { name: 'Mojito vải', category: 'Mojito', price: 39000, unit: 'ly' },
  { name: 'Mojito việt quất', category: 'Mojito', price: 39000, unit: 'ly' },
  { name: 'Mojito xoài', category: 'Mojito', price: 39000, unit: 'ly' },

  { name: 'Beer ruby', category: 'Cocktail & Beer', price: 20000, unit: 'lon/chai' },
  { name: 'Beer Heineken', category: 'Cocktail & Beer', price: 28000, unit: 'lon/chai' },
  { name: 'Beer Sài Gòn xanh', category: 'Cocktail & Beer', price: 23000, unit: 'lon/chai' },
  { name: 'Beer Tiger', category: 'Cocktail & Beer', price: 25000, unit: 'lon/chai' },
  { name: 'Beer úp ngược trái cây', category: 'Cocktail & Beer', price: 40000, unit: 'ly' },
  { name: 'Beer úp ngược rượu', category: 'Cocktail & Beer', price: 45000, unit: 'ly' }
];

function money(value) {
  return `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))} đ`;
}

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function readWarehouse() {
  return safeJsonParse(localStorage.getItem(WAREHOUSE_STORAGE_KEY) || '[]', []);
}

function writeWarehouse(data) {
  localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify(data));
}

function readWarehouseLogs() {
  return safeJsonParse(localStorage.getItem(WAREHOUSE_LOG_STORAGE_KEY) || '[]', []);
}

function writeWarehouseLogs(data) {
  localStorage.setItem(WAREHOUSE_LOG_STORAGE_KEY, JSON.stringify(data));
}

function pushWarehouseLog(action, item) {
  const logs = readWarehouseLogs();
  logs.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    action,
    itemName: item.name,
    quantity: item.quantity,
    unit: item.unit,
    note: item.note || '',
    createdAt: new Date().toISOString()
  });
  writeWarehouseLogs(logs.slice(0, 100));
}

async function api(path, options = {}) {
  const token = localStorage.getItem('forever_pos_token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'API error');
  return data;
}

function SectionTitle({ title, right, subtitle }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'end', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap' }}>
      <div>
        <h2 style={{ margin: 0, color: palette.text, fontSize: 22 }}>{title}</h2>
        {subtitle ? <div style={{ color: palette.muted, fontSize: 13, marginTop: 4 }}>{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}

function TabButtons({ value, onChange, items }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          style={{
            ...buttonStyle,
            background: value === item.value ? palette.brown : palette.soft,
            color: value === item.value ? '#fff' : palette.text
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function Badge({ children, type = 'default' }) {
  const styles = {
    default: { background: '#efe3d4', color: palette.text },
    ok: { background: '#d7ead8', color: palette.ok },
    warn: { background: '#f4dfbf', color: palette.warn },
    danger: { background: '#f6d7d3', color: palette.danger }
  };
  return (
    <span style={{ padding: '4px 8px', borderRadius: 999, fontSize: 12, fontWeight: 700, ...(styles[type] || styles.default) }}>
      {children}
    </span>
  );
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      localStorage.setItem('forever_pos_token', result.token);
      localStorage.setItem('forever_pos_user', JSON.stringify(result.user));
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(145deg, #f7efe4, #e8d5bd)', padding: 20 }}>
      <form onSubmit={submit} style={{ ...cardStyle, width: '100%', maxWidth: 520, padding: 28 }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: palette.brown }}>FOREVER POS PRO</div>
          <div style={{ color: palette.muted, marginTop: 6 }}>Menu và kho hàng tách riêng hoàn toàn</div>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Tài khoản" style={inputStyle} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" type="password" style={inputStyle} />
          <button disabled={loading} style={{ ...buttonStyle, width: '100%', padding: '12px 16px' }}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
          <div style={{ color: palette.muted, fontSize: 13 }}>Tài khoản mẫu: admin / 123456</div>
          {error ? <div style={{ color: palette.danger, fontSize: 14 }}>{error}</div> : null}
        </div>
      </form>
    </div>
  );
}

function Dashboard({ report, products, tables, warehouseItems }) {
  const openTables = tables.filter((t) => t.currentOrder && (t.currentOrder.status === 'open' || t.currentOrder._id)).length;
  const activeProducts = products.filter((p) => p.isActive !== false).length;

  const stats = [
    ['Doanh thu hôm nay', money(report?.todayRevenue)],
    ['Đơn hôm nay', report?.todayOrders || 0],
    ['Món đang bán', activeProducts],
    ['Hàng kho thủ công', warehouseItems.length]
  ];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {stats.map(([label, value]) => (
          <div key={label} style={cardStyle}>
            <div style={{ color: palette.muted, fontSize: 14 }}>{label}</div>
            <div style={{ color: palette.text, fontSize: 28, fontWeight: 800, marginTop: 10 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1.2fr 1fr' }}>
        <div style={cardStyle}>
          <SectionTitle title="Top món bán trong tháng" />
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Tên món</th>
                <th style={th}>SL</th>
                <th style={th}>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {(report?.topProducts || []).map((item) => (
                <tr key={item._id}>
                  <td style={td}>{item._id}</td>
                  <td style={td}>{item.qty}</td>
                  <td style={td}>{money(item.revenue)}</td>
                </tr>
              ))}
              {!report?.topProducts?.length ? (
                <tr><td style={td} colSpan={3}>Chưa có dữ liệu.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div style={cardStyle}>
          <SectionTitle title="Tổng quan nhanh" />
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ border: `1px solid ${palette.line}`, borderRadius: 14, padding: 12 }}>
              <div style={{ color: palette.muted }}>Số bàn / khu</div>
              <div style={{ color: palette.text, fontWeight: 800, marginTop: 6 }}>{tables.length} vị trí</div>
            </div>
            <div style={{ border: `1px solid ${palette.line}`, borderRadius: 14, padding: 12 }}>
              <div style={{ color: palette.muted }}>Bàn đang phục vụ</div>
              <div style={{ color: palette.text, fontWeight: 800, marginTop: 6 }}>{openTables}</div>
            </div>
            <div style={{ border: `1px solid ${palette.line}`, borderRadius: 14, padding: 12 }}>
              <div style={{ color: palette.muted }}>Menu hiện có</div>
              <div style={{ color: palette.text, fontWeight: 800, marginTop: 6 }}>{products.length} món</div>
            </div>
            <div style={{ border: `1px solid ${palette.line}`, borderRadius: 14, padding: 12 }}>
              <div style={{ color: palette.muted }}>Kho hàng tách riêng</div>
              <div style={{ color: palette.text, fontWeight: 800, marginTop: 6 }}>{warehouseItems.length} mặt hàng</div>
            </div>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <SectionTitle title="20 hóa đơn gần nhất" />
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Giờ</th>
                <th style={th}>Mã đơn</th>
                <th style={th}>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {(report?.recentPaid || []).map((order) => (
                <tr key={order._id}>
                  <td style={td}>{new Date(order.paidAt).toLocaleString('vi-VN')}</td>
                  <td style={td}>{String(order._id).slice(-6).toUpperCase()}</td>
                  <td style={td}>{money(order.subtotal)}</td>
                </tr>
              ))}
              {!report?.recentPaid?.length ? <tr><td style={td} colSpan={3}>Chưa có hóa đơn.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TableManager({ tables, onSeedTables, onOpenTable, currentTableId, setCurrentTableId }) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SectionTitle
        title="Sảnh chờ / bàn phục vụ"
        subtitle="6 bàn trước sảnh, 4 bàn sau công viên, thêm mang về và giao đi"
        right={<button style={mutedButton} onClick={onSeedTables}>Tạo bàn mặc định</button>}
      />
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))' }}>
        {tables.map((table) => {
          const active = table._id === currentTableId;
          const hasOrder = Boolean(table.currentOrder && (table.currentOrder.status === 'open' || table.currentOrder._id));
          return (
            <div
              key={table._id}
              onClick={() => setCurrentTableId(table._id)}
              style={{
                ...cardStyle,
                cursor: 'pointer',
                border: active ? `2px solid ${palette.brown2}` : hasOrder ? '2px solid #c78d38' : `1px solid ${palette.line}`,
                background: active ? '#fff7ef' : palette.panel
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: palette.text }}>{table.name}</div>
                  <div style={{ color: palette.muted, marginTop: 6 }}>{table.zone}</div>
                </div>
                <Badge type={hasOrder ? 'warn' : 'ok'}>{hasOrder ? 'Đang phục vụ' : 'Trống'}</Badge>
              </div>
              <button
                style={{ ...buttonStyle, width: '100%', marginTop: 12 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTable(table._id);
                }}
              >
                {hasOrder ? 'Mở đơn hiện tại' : 'Mở đơn mới'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MenuAndOrder({ currentTable, currentOrder, products, refreshOrder, onPayOrder }) {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');

  const activeProducts = useMemo(
    () => products.filter((p) => p.isActive !== false),
    [products]
  );

  const categories = useMemo(
    () => ['Tất cả', ...new Set(activeProducts.map((p) => p.category || 'Khác'))],
    [activeProducts]
  );

  const filteredProducts = activeProducts.filter((p) => {
    const categoryOk = selectedCategory === 'Tất cả' || p.category === selectedCategory;
    const searchOk = p.name.toLowerCase().includes(search.toLowerCase());
    return categoryOk && searchOk;
  });

  async function addItem(productId) {
    if (!currentOrder?._id) return;
    await api(`/orders/${currentOrder._id}/items`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: 1 })
    });
    await refreshOrder();
  }

  async function updateQty(productId, quantity) {
    if (!currentOrder?._id) return;
    await api(`/orders/${currentOrder._id}/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
    await refreshOrder();
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 16 }}>
      <div style={cardStyle}>
        <SectionTitle title={`Menu bán hàng${currentTable ? ` - ${currentTable.name}` : ''}`} subtitle="Bán hàng chỉ dùng menu, không liên quan kho hàng" />
        <div style={{ display: 'grid', gap: 10 }}>
          <input style={inputStyle} placeholder="Tìm món..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <TabButtons value={selectedCategory} onChange={setSelectedCategory} items={categories.map((c) => ({ value: c, label: c }))} />
        </div>

        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: 16 }}>
          {filteredProducts.map((product) => (
            <div key={product._id} style={{ background: '#fff8f0', borderRadius: 16, padding: 14, border: `1px solid ${palette.line}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontWeight: 800, color: palette.text }}>{product.name}</div>
                <Badge type="ok">Đang bán</Badge>
              </div>
              <div style={{ color: palette.muted, fontSize: 14, marginTop: 6 }}>{product.category}</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>{money(product.price)}</div>
              <button disabled={!currentOrder} style={{ ...buttonStyle, width: '100%', marginTop: 10, opacity: !currentOrder ? 0.6 : 1 }} onClick={() => addItem(product._id)}>
                Thêm món
              </button>
            </div>
          ))}
          {!filteredProducts.length ? <div style={{ color: palette.muted }}>Không tìm thấy món phù hợp.</div> : null}
        </div>
      </div>

      <div style={cardStyle}>
        <SectionTitle title="Đơn hiện tại" subtitle={currentTable ? `Đang chọn: ${currentTable.name}` : 'Chưa chọn bàn'} />
        {!currentOrder ? (
          <div style={{ color: palette.muted }}>Hãy chọn bàn và mở đơn trước.</div>
        ) : (
          <>
            <div style={{ display: 'grid', gap: 10, maxHeight: '55vh', overflow: 'auto', paddingRight: 4 }}>
              {(currentOrder.items || []).map((item) => (
                <div key={item.product} style={{ border: `1px solid ${palette.line}`, borderRadius: 14, padding: 12 }}>
                  <div style={{ fontWeight: 700, color: palette.text }}>{item.name}</div>
                  <div style={{ color: palette.muted, fontSize: 14, marginTop: 6 }}>{money(item.price)} x {item.quantity}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button style={mutedButton} onClick={() => updateQty(item.product, item.quantity - 1)}>-</button>
                    <button style={buttonStyle} onClick={() => updateQty(item.product, item.quantity + 1)}>+</button>
                    <button style={dangerButton} onClick={() => updateQty(item.product, 0)}>Xóa</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${palette.line}` }}>
              <div style={{ fontSize: 15, color: palette.muted }}>Tổng tiền</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: palette.text, marginTop: 4 }}>{money(currentOrder.subtotal)}</div>
              <button style={{ ...buttonStyle, width: '100%', marginTop: 12 }} onClick={onPayOrder}>Thanh toán</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MenuAdmin({ products, refreshProducts, isAdmin }) {
  const emptyForm = { name: '', category: 'Coffee', price: 0, unit: 'ly', isActive: true };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    String(item.category || '').toLowerCase().includes(search.toLowerCase())
  );

  async function createProduct(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await api('/products', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price || 0),
        stock: 999999,
        unit: form.unit.trim() || 'ly',
        isActive: form.isActive
      })
    });
    setForm(emptyForm);
    refreshProducts();
  }

  async function saveEdit() {
    if (!editing?._id) return;
    await api(`/products/${editing._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...editing,
        stock: editing.stock ?? 999999
      })
    });
    setEditing(null);
    refreshProducts();
  }

  async function toggleActive(item) {
    await api(`/products/${item._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...item,
        stock: item.stock ?? 999999,
        isActive: item.isActive === false ? true : false
      })
    });
    refreshProducts();
  }

  async function deleteProduct(item) {
    const yes = window.confirm(`Xóa món "${item.name}"?`);
    if (!yes) return;

    try {
      await api(`/products/${item._id}`, { method: 'DELETE' });
    } catch {
      await api(`/products/${item._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...item,
          stock: item.stock ?? 999999,
          isActive: false
        })
      });
    }
    refreshProducts();
  }

  async function importForeverMenu() {
    const yes = window.confirm('Nạp toàn bộ menu FOREVER từ 2 bảng ảnh vào menu?');
    if (!yes) return;

    setBusy(true);
    try {
      const existingNames = new Set(products.map((p) => p.name.trim().toLowerCase()));
      const missing = FOREVER_MENU_PRESET.filter((item) => !existingNames.has(item.name.trim().toLowerCase()));

      for (const item of missing) {
        await api('/products', {
          method: 'POST',
          body: JSON.stringify({
            ...item,
            stock: 999999,
            isActive: true
          })
        });
      }

      alert(`Đã nạp ${missing.length} món mới vào Menu.`);
      await refreshProducts();
    } catch (err) {
      alert(err.message || 'Nạp menu thất bại');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1.55fr' }}>
      <div style={cardStyle}>
        <SectionTitle
          title="Tạo món mới trong Menu"
          subtitle="Menu chỉ là danh sách món bán, không liên quan kho hàng"
          right={isAdmin ? (
            <button style={mutedButton} onClick={importForeverMenu} disabled={busy}>
              {busy ? 'Đang nạp...' : 'Nạp menu FOREVER từ ảnh'}
            </button>
          ) : null}
        />

        {!isAdmin ? (
          <div style={{ color: palette.muted }}>Tài khoản nhân viên chỉ được bán hàng.</div>
        ) : (
          <form onSubmit={createProduct} style={{ display: 'grid', gap: 10 }}>
            <input style={inputStyle} placeholder="Tên món" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={inputStyle} placeholder="Danh mục" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input style={inputStyle} type="number" placeholder="Giá bán" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <input style={inputStyle} placeholder="Đơn vị" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            <select style={inputStyle} value={String(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}>
              <option value="true">Đang bán</option>
              <option value="false">Ngưng bán</option>
            </select>
            <button style={buttonStyle}>Lưu món vào Menu</button>
          </form>
        )}
      </div>

      <div style={cardStyle}>
        <SectionTitle title="Danh sách Menu" subtitle="Bảng này chỉ quản lý món bán ra cho khách" />
        <div style={{ marginBottom: 12 }}>
          <input style={inputStyle} placeholder="Tìm theo tên món hoặc danh mục..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Tên món</th>
                <th style={th}>Danh mục</th>
                <th style={th}>Giá bán</th>
                <th style={th}>Đơn vị</th>
                <th style={th}>Trạng thái</th>
                <th style={th}>Sửa</th>
                <th style={th}>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item._id}>
                  <td style={td}>{item.name}</td>
                  <td style={td}>{item.category}</td>
                  <td style={td}>{money(item.price)}</td>
                  <td style={td}>{item.unit || 'ly'}</td>
                  <td style={td}>
                    <button style={item.isActive === false ? dangerButton : mutedButton} onClick={() => toggleActive(item)}>
                      {item.isActive === false ? 'Ngưng bán' : 'Đang bán'}
                    </button>
                  </td>
                  <td style={td}>
                    {isAdmin ? <button style={mutedButton} onClick={() => setEditing({ ...item })}>Chỉnh</button> : '—'}
                  </td>
                  <td style={td}>
                    {isAdmin ? <button style={dangerButton} onClick={() => deleteProduct(item)}>Xóa</button> : '—'}
                  </td>
                </tr>
              ))}
              {!filteredProducts.length ? <tr><td style={td} colSpan={7}>Chưa có món nào.</td></tr> : null}
            </tbody>
          </table>
        </div>

        {editing ? (
          <div style={{ marginTop: 16, borderTop: `1px solid ${palette.line}`, paddingTop: 16, display: 'grid', gap: 10 }}>
            <div style={{ fontWeight: 800, color: palette.text }}>Sửa món trong Menu</div>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
              <input style={inputStyle} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <input style={inputStyle} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              <input style={inputStyle} type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
              <input style={inputStyle} value={editing.unit || ''} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
              <select style={inputStyle} value={String(editing.isActive !== false)} onChange={(e) => setEditing({ ...editing, isActive: e.target.value === 'true' })}>
                <option value="true">Đang bán</option>
                <option value="false">Ngưng bán</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={buttonStyle} onClick={saveEdit}>Lưu chỉnh sửa</button>
              <button style={mutedButton} onClick={() => setEditing(null)}>Hủy</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function WarehouseAdmin({ warehouseItems, setWarehouseItems, isAdmin }) {
  const emptyForm = { name: '', quantity: '', unit: 'cái', note: '' };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const filteredItems = warehouseItems.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      String(item.note || '').toLowerCase().includes(q) ||
      String(item.unit || '').toLowerCase().includes(q)
    );
  });

  function saveWarehouse(next) {
    setWarehouseItems(next);
    writeWarehouse(next);
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (!isAdmin) return;

    if (editingId) {
      const next = warehouseItems.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: form.name.trim(),
              quantity: Number(form.quantity || 0),
              unit: form.unit.trim() || 'cái',
              note: form.note.trim(),
              updatedAt: new Date().toISOString()
            }
          : item
      );
      saveWarehouse(next);
      pushWarehouseLog('edit', {
        name: form.name.trim(),
        quantity: Number(form.quantity || 0),
        unit: form.unit.trim() || 'cái',
        note: form.note.trim()
      });
      setEditingId(null);
    } else {
      const newItem = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: form.name.trim(),
        quantity: Number(form.quantity || 0),
        unit: form.unit.trim() || 'cái',
        note: form.note.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveWarehouse([newItem, ...warehouseItems]);
      pushWarehouseLog('create', newItem);
    }

    setForm(emptyForm);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      note: item.note || ''
    });
  }

  function removeItem(item) {
    if (!isAdmin) return;
    const yes = window.confirm(`Xóa hàng kho "${item.name}"?`);
    if (!yes) return;
    const next = warehouseItems.filter((x) => x.id !== item.id);
    saveWarehouse(next);
    pushWarehouseLog('delete', item);
    if (editingId === item.id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1.55fr' }}>
      <div style={cardStyle}>
        <SectionTitle title={editingId ? 'Sửa hàng kho' : 'Nhập hàng kho thủ công'} subtitle="Kho hàng là khu riêng, không liên quan menu món bán" />
        {!isAdmin ? (
          <div style={{ color: palette.muted }}>Chỉ admin được thao tác kho hàng.</div>
        ) : (
          <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
            <input style={inputStyle} placeholder="Tên hàng kho" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={inputStyle} type="number" placeholder="Số lượng" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <input style={inputStyle} placeholder="Đơn vị" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            <input style={inputStyle} placeholder="Ghi chú" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={buttonStyle}>{editingId ? 'Lưu sửa kho' : 'Lưu hàng kho'}</button>
              {editingId ? <button type="button" style={mutedButton} onClick={() => { setEditingId(null); setForm(emptyForm); }}>Hủy</button> : null}
            </div>
          </form>
        )}
      </div>

      <div style={cardStyle}>
        <SectionTitle title="Danh sách kho hàng riêng" subtitle="Tự nhập, tự sửa, tự xóa thủ công" />
        <div style={{ marginBottom: 12 }}>
          <input style={inputStyle} placeholder="Tìm hàng kho..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Tên hàng</th>
                <th style={th}>Số lượng</th>
                <th style={th}>Đơn vị</th>
                <th style={th}>Ghi chú</th>
                <th style={th}>Sửa</th>
                <th style={th}>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td style={td}>{item.name}</td>
                  <td style={td}>{item.quantity}</td>
                  <td style={td}>{item.unit}</td>
                  <td style={td}>{item.note || '—'}</td>
                  <td style={td}>{isAdmin ? <button style={mutedButton} onClick={() => startEdit(item)}>Sửa</button> : '—'}</td>
                  <td style={td}>{isAdmin ? <button style={dangerButton} onClick={() => removeItem(item)}>Xóa</button> : '—'}</td>
                </tr>
              ))}
              {!filteredItems.length ? <tr><td style={td} colSpan={6}>Kho đang trống.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UserAdmin({ users, refreshUsers, isAdmin }) {
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'staff' });

  async function submit(e) {
    e.preventDefault();
    await api('/auth/users', { method: 'POST', body: JSON.stringify(form) });
    setForm({ name: '', username: '', password: '', role: 'staff' });
    refreshUsers();
  }

  return (
    <div style={cardStyle}>
      <SectionTitle title="Quản lý tài khoản" />
      {!isAdmin ? (
        <div style={{ color: palette.muted }}>Chỉ admin mới xem và tạo tài khoản nhân viên.</div>
      ) : (
        <>
          <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 0.9fr auto', gap: 10, marginBottom: 14 }}>
            <input style={inputStyle} placeholder="Họ tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={inputStyle} placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input style={inputStyle} type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <select style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="staff">Nhân viên</option>
              <option value="admin">Admin</option>
            </select>
            <button style={buttonStyle}>Tạo</button>
          </form>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Tên</th>
                <th style={th}>Tài khoản</th>
                <th style={th}>Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id || user._id}>
                  <td style={td}>{user.name}</td>
                  <td style={td}>{user.username}</td>
                  <td style={td}>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

function OpsPanel({ paidOrders, warehouseLogs }) {
  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
      <div style={cardStyle}>
        <SectionTitle title="Log kho hàng thủ công" subtitle="Log riêng của khu kho, không liên quan menu" />
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={th}>Thời gian</th>
              <th style={th}>Hàng</th>
              <th style={th}>Loại</th>
              <th style={th}>SL</th>
            </tr>
          </thead>
          <tbody>
            {warehouseLogs.map((log) => (
              <tr key={log.id}>
                <td style={td}>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                <td style={td}>{log.itemName}</td>
                <td style={td}>{log.action}</td>
                <td style={td}>{log.quantity} {log.unit}</td>
              </tr>
            ))}
            {!warehouseLogs.length ? <tr><td style={td} colSpan={4}>Chưa có log kho hàng.</td></tr> : null}
          </tbody>
        </table>
      </div>

      <div style={cardStyle}>
        <SectionTitle title="Lịch sử hóa đơn đã thanh toán" />
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={th}>Mã đơn</th>
              <th style={th}>Thời gian</th>
              <th style={th}>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {paidOrders.map((order) => (
              <tr key={order._id}>
                <td style={td}>{String(order._id).slice(-6).toUpperCase()}</td>
                <td style={td}>{new Date(order.paidAt).toLocaleString('vi-VN')}</td>
                <td style={td}>{money(order.subtotal)}</td>
              </tr>
            ))}
            {!paidOrders.length ? <tr><td style={td} colSpan={3}>Chưa có hóa đơn.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('forever_pos_user') || 'null');
    } catch {
      return null;
    }
  });

  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [report, setReport] = useState(null);
  const [users, setUsers] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [warehouseItems, setWarehouseItems] = useState(() => readWarehouse());
  const [warehouseLogs, setWarehouseLogs] = useState(() => readWarehouseLogs());
  const [currentTableId, setCurrentTableId] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = user?.role === 'admin';

  const currentTable = tables.find((t) => t._id === currentTableId) || null;

  function logout() {
    localStorage.removeItem('forever_pos_token');
    localStorage.removeItem('forever_pos_user');
    setUser(null);
  }

  async function loadProducts() {
    const data = await api('/products');
    setProducts(Array.isArray(data) ? data : []);
  }

  async function loadTables() {
    const data = await api('/tables');
    setTables(Array.isArray(data) ? data : []);
    if (!currentTableId && data?.[0]) setCurrentTableId(data[0]._id);
  }

  async function loadReport() {
    const data = await api('/reports/summary');
    setReport(data);
  }

  async function loadUsers() {
    if (!isAdmin) return setUsers([]);
    const data = await api('/auth/users');
    setUsers(Array.isArray(data) ? data : []);
  }

  async function loadPaidOrders() {
    const data = await api('/orders/history?limit=50');
    setPaidOrders(Array.isArray(data) ? data : []);
  }

  function loadWarehouseLocal() {
    setWarehouseItems(readWarehouse());
    setWarehouseLogs(readWarehouseLogs());
  }

  async function refreshOrder() {
    if (!currentTableId) {
      setCurrentOrder(null);
      return;
    }
    const data = await api('/tables');
    setTables(Array.isArray(data) ? data : []);
    const table = data.find((t) => t._id === currentTableId);
    const orderId = table?.currentOrder?._id || table?.currentOrder;
    if (!orderId) {
      setCurrentOrder(null);
      return;
    }
    const order = await api(`/orders/${orderId}`);
    setCurrentOrder(order);
  }

  async function bootstrap() {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      await Promise.all([loadProducts(), loadTables(), loadReport(), loadUsers(), loadPaidOrders()]);
      loadWarehouseLocal();
    } catch (err) {
      setError(err.message);
      if (String(err.message).toLowerCase().includes('token')) logout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const timer = setInterval(() => {
      loadProducts().catch(() => {});
      loadTables().catch(() => {});
      loadReport().catch(() => {});
      loadPaidOrders().catch(() => {});
      if (isAdmin) loadUsers().catch(() => {});
      loadWarehouseLocal();
    }, 8000);
    return () => clearInterval(timer);
  }, [user, isAdmin]);

  useEffect(() => {
    const table = tables.find((t) => t._id === currentTableId);
    const orderId = table?.currentOrder?._id || table?.currentOrder;
    if (!orderId) {
      setCurrentOrder(null);
      return;
    }
    api(`/orders/${orderId}`).then(setCurrentOrder).catch(() => setCurrentOrder(null));
  }, [tables, currentTableId]);

  async function seedTables() {
    await api('/tables/seed-default', { method: 'POST' });
    await loadTables();
  }

  async function openTable(tableId) {
    const order = await api(`/orders/table/${tableId}/open`, { method: 'POST' });
    setCurrentTableId(tableId);
    setCurrentOrder(order);
    await loadTables();
    setTab('sales');
  }

  async function payOrder() {
    if (!currentOrder?._id) return;
    await api(`/orders/${currentOrder._id}/pay`, { method: 'POST' });
    await Promise.all([loadTables(), loadReport(), loadPaidOrders()]);
    setCurrentOrder(null);
  }

  function syncWarehouseState(nextItems) {
    setWarehouseItems(nextItems);
    writeWarehouse(nextItems);
    setWarehouseLogs(readWarehouseLogs());
  }

  if (!user) return <LoginScreen onLogin={setUser} />;

  const tabs = [
    { value: 'dashboard', label: 'Tổng quan' },
    { value: 'tables', label: 'Sảnh chờ' },
    { value: 'sales', label: 'Bán hàng' },
    { value: 'menu', label: 'Menu' },
    { value: 'warehouse', label: 'Kho hàng' },
    ...(isAdmin ? [{ value: 'ops', label: 'Vận hành' }, { value: 'users', label: 'Tài khoản' }] : [])
  ];

  return (
    <div style={{ minHeight: '100vh', background: palette.bg, padding: 18 }}>
      <div style={{ maxWidth: 1500, margin: '0 auto', display: 'grid', gap: 16 }}>
        <div style={{ ...cardStyle, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 900, color: palette.brown }}>FOREVER POS PRO</div>
              <div style={{ color: palette.muted, marginTop: 6 }}>
                Xin chào {user.name} · {user.role === 'admin' ? 'Admin' : 'Nhân viên'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button style={mutedButton} onClick={bootstrap}>Làm mới dữ liệu</button>
              <button style={buttonStyle} onClick={logout}>Đăng xuất</button>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <TabButtons value={tab} onChange={setTab} items={tabs} />
          </div>
        </div>

        {error ? <div style={{ ...cardStyle, color: palette.danger }}>{error}</div> : null}
        {loading ? <div style={{ ...cardStyle, color: palette.muted }}>Đang tải dữ liệu...</div> : null}

        {tab === 'dashboard' ? (
          <Dashboard report={report} products={products} tables={tables} warehouseItems={warehouseItems} />
        ) : null}

        {tab === 'tables' ? (
          <TableManager
            tables={tables}
            onSeedTables={seedTables}
            onOpenTable={openTable}
            currentTableId={currentTableId}
            setCurrentTableId={setCurrentTableId}
          />
        ) : null}

        {tab === 'sales' ? (
          <MenuAndOrder
            currentTable={currentTable}
            currentOrder={currentOrder}
            products={products}
            refreshOrder={refreshOrder}
            onPayOrder={payOrder}
          />
        ) : null}

        {tab === 'menu' ? (
          <MenuAdmin
            products={products}
            refreshProducts={loadProducts}
            isAdmin={isAdmin}
          />
        ) : null}

        {tab === 'warehouse' ? (
          <WarehouseAdmin
            warehouseItems={warehouseItems}
            setWarehouseItems={syncWarehouseState}
            isAdmin={isAdmin}
          />
        ) : null}

        {tab === 'ops' && isAdmin ? (
          <OpsPanel
            paidOrders={paidOrders}
            warehouseLogs={warehouseLogs}
          />
        ) : null}

        {tab === 'users' && isAdmin ? (
          <UserAdmin
            users={users}
            refreshUsers={loadUsers}
            isAdmin={isAdmin}
          />
        ) : null}
      </div>
    </div>
  );
}
