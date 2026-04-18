import React, { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const palette = {
  page: '#f3efe7',
  sidebar: '#5b3a1d',
  sidebarSoft: '#734927',
  surface: '#ffffff',
  surface2: '#fcfaf7',
  line: '#e7dccd',
  text: '#3e2915',
  muted: '#8a6a4f',
  primary: '#8b5e34',
  primaryDark: '#6c4523',
  primarySoft: '#eadcc9',
  green: '#2e7d32',
  orange: '#b26a12',
  red: '#b42318',
  shadow: '0 14px 30px rgba(92, 58, 29, 0.08)'
};

const cardStyle = {
  background: palette.surface,
  borderRadius: 18,
  padding: 16,
  border: `1px solid ${palette.line}`,
  boxShadow: palette.shadow
};

const inputStyle = {
  width: '100%',
  height: 42,
  padding: '0 12px',
  borderRadius: 12,
  border: `1px solid ${palette.line}`,
  outline: 'none',
  background: '#fff'
};

const buttonStyle = {
  background: palette.primary,
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  padding: '10px 14px',
  cursor: 'pointer',
  fontWeight: 800
};

const lightButton = {
  ...buttonStyle,
  background: palette.primarySoft,
  color: palette.text
};

const dangerButton = {
  ...buttonStyle,
  background: '#f3d3cf',
  color: palette.red
};

const th = {
  textAlign: 'left',
  color: palette.muted,
  fontSize: 12,
  padding: '10px 8px',
  borderBottom: `1px solid ${palette.line}`,
  whiteSpace: 'nowrap'
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

async function createNotification(payload) {
  try {
    await api('/notifications', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch {}
}

function printReceipt({ shopName = 'FOREVER Coffee & Beer', tableName = '', items = [], subtotal = 0, mode = 'receipt' }) {
  const now = new Date().toLocaleString('vi-VN');
  const itemRows = items.map((item) => `
    <tr>
      <td style="padding:4px 0">${item.name} x${item.quantity}</td>
      <td style="padding:4px 0;text-align:right">${money(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  const html = `
    <html>
      <head>
        <title>In bill</title>
        <style>
          body { font-family: Arial, sans-serif; width: 80mm; margin: 0 auto; padding: 8px; color: #111; }
          .center { text-align: center; }
          .line { border-top: 1px dashed #000; margin: 8px 0; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          .total { font-size: 16px; font-weight: bold; }
          @media print {
            body { width: 80mm; }
          }
        </style>
      </head>
      <body>
        <div class="center">
          <div style="font-size:18px;font-weight:700">${shopName}</div>
          <div>B38 Đường 4A, P. Tân Hưng, Q.7</div>
          <div>${mode === 'draft' ? 'PHIẾU TẠM TÍNH' : 'HÓA ĐƠN THANH TOÁN'}</div>
        </div>
        <div class="line"></div>
        <div>Bàn/Kênh: ${tableName || 'Mang về / Giao đi'}</div>
        <div>Thời gian: ${now}</div>
        <div class="line"></div>
        <table>
          <tbody>${itemRows}</tbody>
        </table>
        <div class="line"></div>
        <table>
          <tr class="total">
            <td>Tổng cộng</td>
            <td style="text-align:right">${money(subtotal)}</td>
          </tr>
        </table>
        <div class="line"></div>
        <div class="center">Cảm ơn quý khách - Hẹn gặp lại</div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;

  const win = window.open('', '_blank', 'width=400,height=700');
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
}

function Badge({ children, type = 'default' }) {
  const styles = {
    default: { background: '#efe3d4', color: palette.text },
    ok: { background: '#d7ead8', color: palette.green },
    warn: { background: '#f4dfbf', color: palette.orange },
    danger: { background: '#f6d7d3', color: palette.red }
  };
  return (
    <span style={{ padding: '4px 8px', borderRadius: 999, fontSize: 12, fontWeight: 800, ...(styles[type] || styles.default) }}>
      {children}
    </span>
  );
}

function SectionTitle({ title, subtitle, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: palette.text }}>{title}</div>
        {subtitle ? <div style={{ color: palette.muted, fontSize: 13, marginTop: 4 }}>{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}

function Sidebar({ tab, setTab, tabs, user, logout, unreadCount }) {
  return (
    <div style={{
      width: 250,
      background: `linear-gradient(180deg, ${palette.sidebar}, ${palette.sidebarSoft})`,
      color: '#fff',
      borderRadius: 24,
      padding: 18,
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      gap: 18,
      minHeight: 'calc(100vh - 24px)',
      position: 'sticky',
      top: 12
    }}>
      <div>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 0.3 }}>FOREVER</div>
        <div style={{ opacity: 0.85, marginTop: 4 }}>POS PRO · KiotViet style</div>
      </div>

      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        {tabs.map((item) => (
          <button
            key={item.value}
            onClick={() => setTab(item.value)}
            style={{
              textAlign: 'left',
              border: 'none',
              borderRadius: 14,
              padding: '12px 14px',
              cursor: 'pointer',
              fontWeight: 800,
              background: tab === item.value ? '#ffffff' : 'rgba(255,255,255,0.08)',
              color: tab === item.value ? palette.sidebar : '#fff'
            }}
          >
            {item.label}
            {item.value === 'notifications' && unreadCount > 0 ? (
              <span style={{
                float: 'right',
                background: '#ffcf99',
                color: palette.sidebar,
                borderRadius: 999,
                padding: '2px 8px',
                fontSize: 12
              }}>
                {unreadCount}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 14 }}>
        <div style={{ fontWeight: 800 }}>{user?.name}</div>
        <div style={{ opacity: 0.8, marginTop: 4 }}>{user?.role === 'admin' ? 'Admin' : 'Nhân viên'}</div>
        <button style={{ ...buttonStyle, width: '100%', marginTop: 12, background: '#fff', color: palette.sidebar }} onClick={logout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

function HeaderBar({ title, subtitle, onRefresh, unreadCount }) {
  return (
    <div style={{ ...cardStyle, padding: 18, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontSize: 26, fontWeight: 900, color: palette.text }}>{title}</div>
        <div style={{ color: palette.muted, marginTop: 4 }}>{subtitle}</div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ background: palette.primarySoft, color: palette.text, borderRadius: 999, padding: '8px 12px', fontWeight: 800 }}>
          Thông báo: {unreadCount}
        </div>
        <button style={lightButton} onClick={onRefresh}>Làm mới dữ liệu</button>
      </div>
    </div>
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
    <div style={{ minHeight: '100vh', background: palette.page, display: 'grid', placeItems: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 1000, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 18 }}>
        <div style={{ ...cardStyle, background: `linear-gradient(135deg, ${palette.sidebar}, ${palette.sidebarSoft})`, color: '#fff', padding: 28 }}>
          <div style={{ fontSize: 42, fontWeight: 900 }}>FOREVER POS PRO</div>
          <div style={{ marginTop: 10, opacity: 0.9, fontSize: 18 }}>Giao diện lấy cảm hứng từ KiotViet, tông FOREVER Coffee & Beer</div>
          <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
            {[
              'Menu và Kho hàng tách riêng hoàn toàn',
              'Thông báo đồng bộ trên tất cả thiết bị đăng nhập',
              'In bill thật bằng trình duyệt ra máy in bill nhiệt',
              'Dữ liệu đồng bộ MongoDB'
            ].map((item) => (
              <div key={item} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 14 }}>{item}</div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} style={{ ...cardStyle, padding: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: palette.text }}>Đăng nhập hệ thống</div>
          <div style={{ color: palette.muted, marginTop: 6 }}>Tài khoản mẫu: admin / 123456</div>
          <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Tài khoản" style={inputStyle} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" type="password" style={inputStyle} />
            <button disabled={loading} style={{ ...buttonStyle, height: 44 }}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            {error ? <div style={{ color: palette.red }}>{error}</div> : null}
          </div>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ report, products, tables, warehouseItems }) {
  const stats = [
    { label: 'Doanh thu hôm nay', value: money(report?.todayRevenue || 0) },
    { label: 'Đơn hôm nay', value: report?.todayOrders || 0 },
    { label: 'Món trong menu', value: products.length },
    { label: 'Mặt hàng kho', value: warehouseItems.length }
  ];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {stats.map((item) => (
          <div key={item.label} style={{ ...cardStyle, background: palette.surface2 }}>
            <div style={{ color: palette.muted, fontSize: 13 }}>{item.label}</div>
            <div style={{ color: palette.text, fontSize: 28, fontWeight: 900, marginTop: 8 }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1.2fr 1fr' }}>
        <div style={cardStyle}>
          <SectionTitle title="Top món bán trong tháng" />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr><th style={th}>Tên món</th><th style={th}>SL</th><th style={th}>Doanh thu</th></tr>
              </thead>
              <tbody>
                {(report?.topProducts || []).map((item) => (
                  <tr key={item._id}>
                    <td style={td}>{item._id}</td>
                    <td style={td}>{item.qty}</td>
                    <td style={td}>{money(item.revenue)}</td>
                  </tr>
                ))}
                {!report?.topProducts?.length ? <tr><td style={td} colSpan={3}>Chưa có dữ liệu.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>

        <div style={cardStyle}>
          <SectionTitle title="Tổng quan hoạt động" />
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ ...miniMetricStyle }}><span>Số vị trí/bàn</span><strong>{tables.length}</strong></div>
            <div style={{ ...miniMetricStyle }}><span>Bàn đang phục vụ</span><strong>{tables.filter((t) => t.currentOrder).length}</strong></div>
            <div style={{ ...miniMetricStyle }}><span>Kho hàng riêng</span><strong>{warehouseItems.length}</strong></div>
            <div style={{ ...miniMetricStyle }}><span>Menu đang bán</span><strong>{products.filter((p) => p.isActive !== false).length}</strong></div>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <SectionTitle title="20 hóa đơn gần nhất" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={th}>Giờ</th><th style={th}>Mã đơn</th><th style={th}>Tổng tiền</th></tr>
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

const miniMetricStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 14px',
  borderRadius: 14,
  border: `1px solid ${palette.line}`,
  background: palette.surface2
};

function TableManager({ tables, onSeedTables, onOpenTable, currentTableId, setCurrentTableId }) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SectionTitle
        title="Sảnh chờ / bàn phục vụ"
        subtitle="6 bàn trước sảnh, 4 bàn sau công viên, thêm mang về và giao đi"
        right={<button style={lightButton} onClick={onSeedTables}>Tạo bàn mặc định</button>}
      />
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
        {tables.map((table) => {
          const active = table._id === currentTableId;
          const hasOrder = Boolean(table.currentOrder && (table.currentOrder.status === 'open' || table.currentOrder._id));
          return (
            <div key={table._id} onClick={() => setCurrentTableId(table._id)} style={{
              ...cardStyle,
              cursor: 'pointer',
              padding: 14,
              border: active ? `2px solid ${palette.primary}` : `1px solid ${palette.line}`,
              background: active ? '#fff8f1' : palette.surface
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 900, color: palette.text, fontSize: 18 }}>{table.name}</div>
                  <div style={{ color: palette.muted, marginTop: 4 }}>{table.zone}</div>
                </div>
                <Badge type={hasOrder ? 'warn' : 'ok'}>{hasOrder ? 'Đang phục vụ' : 'Trống'}</Badge>
              </div>
              <button style={{ ...buttonStyle, width: '100%', marginTop: 12 }} onClick={(e) => { e.stopPropagation(); onOpenTable(table._id); }}>
                {hasOrder ? 'Mở đơn hiện tại' : 'Mở đơn mới'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MenuAndOrder({ currentTable, currentOrder, products, refreshOrder, onPayOrder, onDraftPrint }) {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const activeProducts = useMemo(() => products.filter((p) => p.isActive !== false), [products]);
  const categories = useMemo(() => ['Tất cả', ...new Set(activeProducts.map((p) => p.category || 'Khác'))], [activeProducts]);
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
    <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 0.95fr', gap: 16 }}>
      <div style={cardStyle}>
        <SectionTitle title={`Menu bán hàng${currentTable ? ` - ${currentTable.name}` : ''}`} subtitle="Giao diện kiểu KiotViet, tông FOREVER" />
        <div style={{ display: 'grid', gap: 10 }}>
          <input style={inputStyle} placeholder="Tìm món..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)} style={{
                ...lightButton,
                background: selectedCategory === c ? palette.primary : palette.primarySoft,
                color: selectedCategory === c ? '#fff' : palette.text
              }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', marginTop: 16 }}>
          {filteredProducts.map((product) => (
            <div key={product._id} style={{ border: `1px solid ${palette.line}`, borderRadius: 16, padding: 14, background: palette.surface2 }}>
              <div style={{ fontWeight: 900, color: palette.text }}>{product.name}</div>
              <div style={{ color: palette.muted, fontSize: 13, marginTop: 4 }}>{product.category}</div>
              <div style={{ marginTop: 10, fontWeight: 900, color: palette.primaryDark }}>{money(product.price)}</div>
              <button disabled={!currentOrder} style={{ ...buttonStyle, width: '100%', marginTop: 12, opacity: currentOrder ? 1 : 0.6 }} onClick={() => addItem(product._id)}>
                Thêm món
              </button>
            </div>
          ))}
          {!filteredProducts.length ? <div style={{ color: palette.muted }}>Không tìm thấy món phù hợp.</div> : null}
        </div>
      </div>

      <div style={cardStyle}>
        <SectionTitle title="Đơn hiện tại" subtitle={currentTable ? currentTable.name : 'Chưa chọn bàn'} />
        {!currentOrder ? (
          <div style={{ color: palette.muted }}>Hãy chọn bàn và mở đơn trước.</div>
        ) : (
          <>
            <div style={{ display: 'grid', gap: 10, maxHeight: '58vh', overflow: 'auto' }}>
              {(currentOrder.items || []).map((item) => (
                <div key={item.product} style={{ border: `1px solid ${palette.line}`, borderRadius: 14, padding: 12 }}>
                  <div style={{ fontWeight: 800, color: palette.text }}>{item.name}</div>
                  <div style={{ color: palette.muted, marginTop: 4 }}>{money(item.price)} x {item.quantity}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button style={lightButton} onClick={() => updateQty(item.product, item.quantity - 1)}>-</button>
                    <button style={buttonStyle} onClick={() => updateQty(item.product, item.quantity + 1)}>+</button>
                    <button style={dangerButton} onClick={() => updateQty(item.product, 0)}>Xóa</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, borderTop: `1px solid ${palette.line}`, paddingTop: 14 }}>
              <div style={{ color: palette.muted }}>Tổng tiền</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: palette.text, marginTop: 4 }}>{money(currentOrder.subtotal)}</div>
              <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                <button style={lightButton} onClick={onDraftPrint}>In tạm tính</button>
                <button style={buttonStyle} onClick={onPayOrder}>Thanh toán + In bill</button>
              </div>
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
    await createNotification({
      type: 'menu',
      level: 'success',
      title: 'Menu vừa được cập nhật',
      message: `Đã thêm món "${form.name.trim()}" vào menu`
    });
    setForm(emptyForm);
    refreshProducts();
  }

  async function saveEdit() {
    if (!editing?._id) return;
    await api(`/products/${editing._id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...editing, stock: editing.stock ?? 999999 })
    });
    await createNotification({
      type: 'menu',
      level: 'info',
      title: 'Đã sửa món trong menu',
      message: `Món "${editing.name}" vừa được cập nhật`
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
    await createNotification({
      type: 'menu',
      level: item.isActive === false ? 'success' : 'warning',
      title: item.isActive === false ? 'Đã mở bán lại món' : 'Đã ngưng bán món',
      message: item.name
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
        body: JSON.stringify({ ...item, stock: item.stock ?? 999999, isActive: false })
      });
    }
    await createNotification({
      type: 'menu',
      level: 'danger',
      title: 'Món đã bị xóa/ngưng bán',
      message: item.name
    });
    refreshProducts();
  }

  async function importForeverMenu() {
    const yes = window.confirm('Nạp toàn bộ menu FOREVER?');
    if (!yes) return;
    setBusy(true);
    try {
      const existingNames = new Set(products.map((p) => p.name.trim().toLowerCase()));
      const missing = FOREVER_MENU_PRESET.filter((item) => !existingNames.has(item.name.trim().toLowerCase()));
      for (const item of missing) {
        await api('/products', {
          method: 'POST',
          body: JSON.stringify({ ...item, stock: 999999, isActive: true })
        });
      }
      await createNotification({
        type: 'menu',
        level: 'success',
        title: 'Đã nạp menu FOREVER',
        message: `Đã thêm ${missing.length} món mới`
      });
      alert(`Đã nạp ${missing.length} món mới vào Menu.`);
      await refreshProducts();
    } catch (err) {
      alert(err.message || 'Nạp menu thất bại');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1.6fr' }}>
      <div style={cardStyle}>
        <SectionTitle
          title="Tạo món mới"
          subtitle="Giữ nguyên logic, chỉ đổi giao diện kiểu KiotViet"
          right={isAdmin ? <button style={lightButton} onClick={importForeverMenu} disabled={busy}>{busy ? 'Đang nạp...' : 'Nạp menu FOREVER'}</button> : null}
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
            <button style={buttonStyle}>Lưu món vào menu</button>
          </form>
        )}
      </div>

      <div style={cardStyle}>
        <SectionTitle title="Danh sách menu" />
        <div style={{ marginBottom: 12 }}>
          <input style={inputStyle} placeholder="Tìm món..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Tên món</th>
                <th style={th}>Danh mục</th>
                <th style={th}>Giá</th>
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
                    <button style={item.isActive === false ? dangerButton : lightButton} onClick={() => toggleActive(item)}>
                      {item.isActive === false ? 'Ngưng bán' : 'Đang bán'}
                    </button>
                  </td>
                  <td style={td}><button style={lightButton} onClick={() => setEditing({ ...item })}>Chỉnh</button></td>
                  <td style={td}><button style={dangerButton} onClick={() => deleteProduct(item)}>Xóa</button></td>
                </tr>
              ))}
              {!filteredProducts.length ? <tr><td style={td} colSpan={7}>Chưa có món nào.</td></tr> : null}
            </tbody>
          </table>
        </div>

        {editing ? (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${palette.line}`, display: 'grid', gap: 10 }}>
            <div style={{ fontWeight: 900, color: palette.text }}>Sửa món</div>
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
              <button style={lightButton} onClick={() => setEditing(null)}>Hủy</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function WarehouseAdmin({ warehouseItems, refreshWarehouse, isAdmin }) {
  const emptyForm = { name: '', quantity: '', unit: 'cái', note: '' };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const filteredItems = warehouseItems.filter((item) => {
    const q = search.toLowerCase();
    return item.name.toLowerCase().includes(q) || String(item.note || '').toLowerCase().includes(q) || String(item.unit || '').toLowerCase().includes(q);
  });

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !isAdmin) return;

    if (editing?._id) {
      await api(`/warehouse/${editing._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: form.name.trim(),
          quantity: Number(form.quantity || 0),
          unit: form.unit.trim() || 'cái',
          note: form.note.trim()
        })
      });
      await createNotification({
        type: 'warehouse',
        level: 'info',
        title: 'Kho hàng vừa được cập nhật',
        message: `${form.name.trim()} · SL ${Number(form.quantity || 0)} ${form.unit.trim() || 'cái'}`
      });
      setEditing(null);
    } else {
      await api('/warehouse', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name.trim(),
          quantity: Number(form.quantity || 0),
          unit: form.unit.trim() || 'cái',
          note: form.note.trim()
        })
      });
      await createNotification({
        type: 'warehouse',
        level: 'success',
        title: 'Đã nhập hàng kho',
        message: `${form.name.trim()} · SL ${Number(form.quantity || 0)} ${form.unit.trim() || 'cái'}`
      });
    }

    setForm(emptyForm);
    refreshWarehouse();
  }

  function startEdit(item) {
    setEditing(item);
    setForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      note: item.note || ''
    });
  }

  async function removeItem(item) {
    if (!isAdmin) return;
    const yes = window.confirm(`Xóa hàng kho "${item.name}"?`);
    if (!yes) return;
    await api(`/warehouse/${item._id}`, { method: 'DELETE' });
    await createNotification({
      type: 'warehouse',
      level: 'danger',
      title: 'Đã xóa hàng kho',
      message: item.name
    });
    if (editing?._id === item._id) {
      setEditing(null);
      setForm(emptyForm);
    }
    refreshWarehouse();
  }

  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1.6fr' }}>
      <div style={cardStyle}>
        <SectionTitle title={editing ? 'Sửa hàng kho' : 'Nhập hàng kho'} subtitle="Kho tách riêng hoàn toàn với menu, đồng bộ MongoDB" />
        {!isAdmin ? (
          <div style={{ color: palette.muted }}>Chỉ admin được thao tác kho hàng.</div>
        ) : (
          <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
            <input style={inputStyle} placeholder="Tên hàng kho" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={inputStyle} type="number" placeholder="Số lượng" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <input style={inputStyle} placeholder="Đơn vị" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            <input style={inputStyle} placeholder="Ghi chú" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={buttonStyle}>{editing ? 'Lưu sửa kho' : 'Lưu hàng kho'}</button>
              {editing ? <button type="button" style={lightButton} onClick={() => { setEditing(null); setForm(emptyForm); }}>Hủy</button> : null}
            </div>
          </form>
        )}
      </div>

      <div style={cardStyle}>
        <SectionTitle title="Danh sách kho hàng" subtitle="Giao diện mới nhưng giữ nguyên chức năng" />
        <div style={{ marginBottom: 12 }}>
          <input style={inputStyle} placeholder="Tìm hàng kho..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                <tr key={item._id}>
                  <td style={td}>{item.name}</td>
                  <td style={td}>{item.quantity}</td>
                  <td style={td}>{item.unit}</td>
                  <td style={td}>{item.note || '—'}</td>
                  <td style={td}>{isAdmin ? <button style={lightButton} onClick={() => startEdit(item)}>Sửa</button> : '—'}</td>
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

function NotificationsPanel({ notifications, userId, refreshNotifications }) {
  const unreadCount = notifications.filter((n) => !(n.readBy || []).includes(userId)).length;

  async function markRead(id) {
    await api(`/notifications/${id}/read`, { method: 'PUT' });
    refreshNotifications();
  }

  async function markAll() {
    await api('/notifications/read-all/all', { method: 'PUT' });
    refreshNotifications();
  }

  return (
    <div style={cardStyle}>
      <SectionTitle
        title="Thông báo đồng bộ"
        subtitle="Mọi thiết bị đăng nhập sẽ cùng nhìn thấy thông báo mới"
        right={
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Badge type={unreadCount > 0 ? 'warn' : 'ok'}>{unreadCount} chưa đọc</Badge>
            <button style={lightButton} onClick={markAll}>Đánh dấu đọc tất cả</button>
          </div>
        }
      />
      <div style={{ display: 'grid', gap: 10 }}>
        {notifications.map((item) => {
          const unread = !(item.readBy || []).includes(userId);
          return (
            <div key={item._id} style={{
              border: `1px solid ${palette.line}`,
              borderRadius: 16,
              padding: 14,
              background: unread ? '#fff8f0' : palette.surface2
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 900, color: palette.text }}>{item.title}</div>
                  <div style={{ color: palette.muted, marginTop: 4 }}>{item.message || '—'}</div>
                  <div style={{ color: palette.muted, fontSize: 12, marginTop: 8 }}>
                    {new Date(item.createdAt).toLocaleString('vi-VN')} · {item.createdByName || 'Hệ thống'}
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 8, justifyItems: 'end' }}>
                  <Badge type={item.level === 'danger' ? 'danger' : item.level === 'warning' ? 'warn' : item.level === 'success' ? 'ok' : 'default'}>
                    {item.level}
                  </Badge>
                  {unread ? <button style={lightButton} onClick={() => markRead(item._id)}>Đánh dấu đã đọc</button> : <Badge type="ok">Đã đọc</Badge>}
                </div>
              </div>
            </div>
          );
        })}
        {!notifications.length ? <div style={{ color: palette.muted }}>Chưa có thông báo nào.</div> : null}
      </div>
    </div>
  );
}

function UserAdmin({ users, refreshUsers, isAdmin }) {
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'staff' });

  async function submit(e) {
    e.preventDefault();
    await api('/auth/users', { method: 'POST', body: JSON.stringify(form) });
    await createNotification({
      type: 'user',
      level: 'success',
      title: 'Đã tạo tài khoản mới',
      message: `${form.username} · ${form.role}`
    });
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
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr><th style={th}>Tên</th><th style={th}>Tài khoản</th><th style={th}>Vai trò</th></tr>
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
          </div>
        </>
      )}
    </div>
  );
}

function OpsPanel({ paidOrders, warehouseLogs }) {
  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
      <div style={cardStyle}>
        <SectionTitle title="Log kho hàng" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={th}>Thời gian</th><th style={th}>Hàng</th><th style={th}>Loại</th><th style={th}>SL</th></tr></thead>
            <tbody>
              {warehouseLogs.map((log) => (
                <tr key={log._id}>
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
      </div>

      <div style={cardStyle}>
        <SectionTitle title="Lịch sử hóa đơn đã thanh toán" subtitle="Có thể in ra máy in bill thật bằng trình duyệt" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={th}>Mã đơn</th><th style={th}>Thời gian</th><th style={th}>Tổng tiền</th></tr></thead>
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
  const [warehouseItems, setWarehouseItems] = useState([]);
  const [warehouseLogs, setWarehouseLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentTableId, setCurrentTableId] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = user?.role === 'admin';

  const currentTable = tables.find((t) => t._id === currentTableId) || null;
  const unreadCount = notifications.filter((n) => !(n.readBy || []).includes(user?._id)).length;

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

  async function loadWarehouse() {
    const data = await api('/warehouse');
    setWarehouseItems(Array.isArray(data) ? data : []);
  }

  async function loadWarehouseLogs() {
    if (!isAdmin) return setWarehouseLogs([]);
    const data = await api('/warehouse/logs');
    setWarehouseLogs(Array.isArray(data) ? data : []);
  }

  async function loadNotifications() {
    const data = await api('/notifications?limit=80');
    setNotifications(Array.isArray(data) ? data : []);
  }

  async function refreshWarehouse() {
    await Promise.all([loadWarehouse(), loadWarehouseLogs(), loadNotifications()]);
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
      await Promise.all([
        loadProducts(),
        loadTables(),
        loadReport(),
        loadUsers(),
        loadPaidOrders(),
        loadWarehouse(),
        loadWarehouseLogs(),
        loadNotifications()
      ]);
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
      loadWarehouse().catch(() => {});
      loadNotifications().catch(() => {});
      if (isAdmin) {
        loadUsers().catch(() => {});
        loadWarehouseLogs().catch(() => {});
      }
    }, 6000);
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
    await createNotification({
      type: 'table',
      level: 'success',
      title: 'Đã tạo bàn mặc định',
      message: 'Hệ thống đã khởi tạo các bàn/sảnh mặc định'
    });
    await Promise.all([loadTables(), loadNotifications()]);
  }

  async function openTable(tableId) {
    const order = await api(`/orders/table/${tableId}/open`, { method: 'POST' });
    const table = tables.find((t) => t._id === tableId);
    await createNotification({
      type: 'order',
      level: 'info',
      title: 'Mở đơn mới',
      message: `Đã mở đơn tại ${table?.name || 'bàn'}`
    });
    setCurrentTableId(tableId);
    setCurrentOrder(order);
    await Promise.all([loadTables(), loadNotifications()]);
    setTab('sales');
  }

  async function draftPrint() {
    if (!currentOrder) return;
    printReceipt({
      tableName: currentTable?.name,
      items: currentOrder.items || [],
      subtotal: currentOrder.subtotal || 0,
      mode: 'draft'
    });
  }

  async function payOrder() {
    if (!currentOrder?._id) return;
    const receiptData = {
      tableName: currentTable?.name,
      items: currentOrder.items || [],
      subtotal: currentOrder.subtotal || 0,
      mode: 'receipt'
    };
    await api(`/orders/${currentOrder._id}/pay`, { method: 'POST' });
    printReceipt(receiptData);
    await createNotification({
      type: 'payment',
      level: 'success',
      title: 'Đã thanh toán hóa đơn',
      message: `${receiptData.tableName || 'Mang về/Giao đi'} · ${money(receiptData.subtotal)}`
    });
    await Promise.all([loadTables(), loadReport(), loadPaidOrders(), loadNotifications()]);
    setCurrentOrder(null);
  }

  if (!user) return <LoginScreen onLogin={setUser} />;

  const tabs = [
    { value: 'dashboard', label: 'Tổng quan' },
    { value: 'tables', label: 'Sảnh chờ' },
    { value: 'sales', label: 'Bán hàng' },
    { value: 'menu', label: 'Menu' },
    { value: 'warehouse', label: 'Kho hàng' },
    { value: 'notifications', label: 'Thông báo' },
    ...(isAdmin ? [{ value: 'ops', label: 'Vận hành' }, { value: 'users', label: 'Tài khoản' }] : [])
  ];

  const titleMap = {
    dashboard: ['Tổng quan', 'Theo dõi doanh thu, hoạt động và dữ liệu quán'],
    tables: ['Sảnh chờ', 'Quản lý bàn và trạng thái phục vụ'],
    sales: ['Bán hàng', 'Chọn món, lên đơn, in bill thật'],
    menu: ['Menu', 'Quản lý món bán theo phong cách KiotViet'],
    warehouse: ['Kho hàng', 'Kho độc lập với menu, đồng bộ MongoDB'],
    notifications: ['Thông báo', 'Thông báo đồng bộ giữa các thiết bị'],
    ops: ['Vận hành', 'Theo dõi log kho và lịch sử đơn'],
    users: ['Tài khoản', 'Quản lý tài khoản đăng nhập']
  };

  return (
    <div style={{ minHeight: '100vh', background: palette.page, padding: 12 }}>
      <div style={{ maxWidth: 1700, margin: '0 auto', display: 'grid', gridTemplateColumns: '250px 1fr', gap: 16 }}>
        <Sidebar tab={tab} setTab={setTab} tabs={tabs} user={user} logout={logout} unreadCount={unreadCount} />
        <div style={{ display: 'grid', gap: 16 }}>
          <HeaderBar title={titleMap[tab]?.[0] || 'FOREVER POS'} subtitle={titleMap[tab]?.[1] || ''} onRefresh={bootstrap} unreadCount={unreadCount} />

          {error ? <div style={{ ...cardStyle, color: palette.red }}>{error}</div> : null}
          {loading ? <div style={{ ...cardStyle, color: palette.muted }}>Đang tải dữ liệu...</div> : null}

          {tab === 'dashboard' ? <Dashboard report={report} products={products} tables={tables} warehouseItems={warehouseItems} /> : null}
          {tab === 'tables' ? <TableManager tables={tables} onSeedTables={seedTables} onOpenTable={openTable} currentTableId={currentTableId} setCurrentTableId={setCurrentTableId} /> : null}
          {tab === 'sales' ? <MenuAndOrder currentTable={currentTable} currentOrder={currentOrder} products={products} refreshOrder={refreshOrder} onPayOrder={payOrder} onDraftPrint={draftPrint} /> : null}
          {tab === 'menu' ? <MenuAdmin products={products} refreshProducts={loadProducts} isAdmin={isAdmin} /> : null}
          {tab === 'warehouse' ? <WarehouseAdmin warehouseItems={warehouseItems} refreshWarehouse={refreshWarehouse} isAdmin={isAdmin} /> : null}
          {tab === 'notifications' ? <NotificationsPanel notifications={notifications} userId={user?._id} refreshNotifications={loadNotifications} /> : null}
          {tab === 'ops' && isAdmin ? <OpsPanel paidOrders={paidOrders} warehouseLogs={warehouseLogs} /> : null}
          {tab === 'users' && isAdmin ? <UserAdmin users={users} refreshUsers={loadUsers} isAdmin={isAdmin} /> : null}

          <div style={{ ...cardStyle, color: palette.muted, fontSize: 13 }}>
            In bill thật hiện hoạt động theo kiểu mở hộp thoại in của trình duyệt để chọn máy in bill nhiệt. Muốn in im lặng 1 chạm không hiện hộp thoại, cần tích hợp thêm QZ Tray hoặc bản desktop bridge.
          </div>
        </div>
      </div>
    </div>
  );
}
