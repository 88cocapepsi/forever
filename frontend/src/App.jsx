import React, { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const palette = {
  bg: '#f6efe6',
  panel: '#fffaf4',
  line: '#eadfce',
  brown: '#6d4021',
  brown2: '#7a4e2d',
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
          <div style={{ color: palette.muted, marginTop: 6 }}>Bản web đồng bộ MongoDB, hợp Vercel cho frontend</div>
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

function Dashboard({ report }) {
  const stats = [
    ['Doanh thu hôm nay', money(report?.todayRevenue)],
    ['Đơn hôm nay', report?.todayOrders || 0],
    ['Doanh thu tháng', money(report?.monthRevenue)],
    ['Món sắp hết', report?.lowStock?.length || 0]
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
          <SectionTitle title="Thống kê theo ca hôm nay" />
          <div style={{ display: 'grid', gap: 10 }}>
            {(report?.shiftStats || []).map((shift) => (
              <div key={shift.name} style={{ border: `1px solid ${palette.line}`, borderRadius: 14, padding: 12 }}>
                <div style={{ fontWeight: 800, color: palette.text }}>{shift.name}</div>
                <div style={{ color: palette.muted, marginTop: 6 }}>Đơn: {shift.orders}</div>
                <div style={{ color: palette.brown, fontWeight: 800, marginTop: 4 }}>{money(shift.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <div style={cardStyle}>
          <SectionTitle title="Món sắp hết hàng" />
          <div style={{ display: 'grid', gap: 10 }}>
            {(report?.lowStock || []).map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: `1px solid ${palette.line}`, paddingBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, color: palette.text }}>{item.name}</div>
                  <div style={{ color: palette.muted, fontSize: 13 }}>{item.category}</div>
                </div>
                <Badge type={item.stock === 0 ? 'danger' : 'warn'}>{item.stock} {item.unit}</Badge>
              </div>
            ))}
            {!report?.lowStock?.length ? <div style={{ color: palette.muted }}>Tồn kho đang ổn.</div> : null}
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
                    <td style={td}>{order._id.slice(-6).toUpperCase()}</td>
                    <td style={td}>{money(order.subtotal)}</td>
                  </tr>
                ))}
                {!report?.recentPaid?.length ? <tr><td style={td} colSpan={3}>Chưa có hóa đơn.</td></tr> : null}
              </tbody>
            </table>
          </div>
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
          const hasOrder = Boolean(table.currentOrder && table.currentOrder.status === 'open');
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

function MenuAndOrder({ currentTable, currentOrder, products, refreshOrder, refreshProducts, onPayOrder }) {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const categories = useMemo(() => ['Tất cả', ...new Set(products.map((p) => p.category || 'Khác'))], [products]);
  const filteredProducts = products.filter((p) => {
    const categoryOk = selectedCategory === 'Tất cả' || p.category === selectedCategory;
    const searchOk = p.name.toLowerCase().includes(search.toLowerCase());
    return p.isActive !== false && categoryOk && searchOk;
  });

  async function addItem(productId) {
    if (!currentOrder?._id) return;
    await api(`/orders/${currentOrder._id}/items`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: 1 })
    });
    await Promise.all([refreshOrder(), refreshProducts()]);
  }

  async function updateQty(productId, quantity) {
    if (!currentOrder?._id) return;
    await api(`/orders/${currentOrder._id}/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
    await Promise.all([refreshOrder(), refreshProducts()]);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 16 }}>
      <div style={cardStyle}>
        <SectionTitle title={`Menu bán hàng${currentTable ? ` - ${currentTable.name}` : ''}`} />
        <div style={{ display: 'grid', gap: 10 }}>
          <input style={inputStyle} placeholder="Tìm món..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <TabButtons value={selectedCategory} onChange={setSelectedCategory} items={categories.map((c) => ({ value: c, label: c }))} />
        </div>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: 16 }}>
          {filteredProducts.map((product) => (
            <div key={product._id} style={{ background: '#fff8f0', borderRadius: 16, padding: 14, border: `1px solid ${palette.line}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontWeight: 800, color: palette.text }}>{product.name}</div>
                <Badge type={product.stock <= 0 ? 'danger' : product.stock <= 5 ? 'warn' : 'ok'}>{product.stock}</Badge>
              </div>
              <div style={{ color: palette.muted, fontSize: 14, marginTop: 6 }}>{product.category}</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>{money(product.price)}</div>
              <div style={{ color: product.stock > 0 ? palette.ok : palette.danger, fontSize: 13, marginTop: 8 }}>
                Tồn: {product.stock} {product.unit}
              </div>
              <button disabled={!currentOrder || product.stock <= 0} style={{ ...buttonStyle, width: '100%', marginTop: 10, opacity: !currentOrder || product.stock <= 0 ? 0.6 : 1 }} onClick={() => addItem(product._id)}>
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

function ProductAdmin({ products, refreshProducts, isAdmin }) {
  const emptyForm = { name: '', category: 'Cà phê', price: 0, stock: 0, unit: 'ly' };
  const [form, setForm] = useState(emptyForm);
  const [importQty, setImportQty] = useState({});
  const [editing, setEditing] = useState(null);

  async function createProduct(e) {
    e.preventDefault();
    await api('/products', { method: 'POST', body: JSON.stringify(form) });
    setForm(emptyForm);
    refreshProducts();
  }

  async function importStock(id) {
    const quantity = Number(importQty[id] || 0);
    if (!quantity) return;
    await api(`/products/${id}/import`, { method: 'POST', body: JSON.stringify({ quantity, note: 'Nhập kho từ giao diện admin' }) });
    setImportQty((prev) => ({ ...prev, [id]: '' }));
    refreshProducts();
  }

  async function saveEdit() {
    if (!editing?._id) return;
    await api(`/products/${editing._id}`, { method: 'PUT', body: JSON.stringify(editing) });
    setEditing(null);
    refreshProducts();
  }

  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1.5fr' }}>
      <div style={cardStyle}>
        <SectionTitle title="Tạo sản phẩm mới" />
        {!isAdmin ? (
          <div style={{ color: palette.muted }}>Tài khoản nhân viên chỉ được bán hàng.</div>
        ) : (
          <form onSubmit={createProduct} style={{ display: 'grid', gap: 10 }}>
            <input style={inputStyle} placeholder="Tên món" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={inputStyle} placeholder="Danh mục" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input style={inputStyle} type="number" placeholder="Giá bán" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <input style={inputStyle} type="number" placeholder="Tồn đầu" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            <input style={inputStyle} placeholder="Đơn vị" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            <button style={buttonStyle}>Lưu sản phẩm</button>
          </form>
        )}
      </div>

      <div style={cardStyle}>
        <SectionTitle title="Kho hàng / menu" subtitle="Admin có thể nhập thêm và chỉnh nhanh giá, tồn, trạng thái bán" />
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Tên món</th>
                <th style={th}>Danh mục</th>
                <th style={th}>Giá bán</th>
                <th style={th}>Tồn</th>
                <th style={th}>Nhập thêm</th>
                <th style={th}>Sửa</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item._id}>
                  <td style={td}>{item.name}</td>
                  <td style={td}>{item.category}</td>
                  <td style={td}>{money(item.price)}</td>
                  <td style={td}><Badge type={item.stock <= 0 ? 'danger' : item.stock <= 5 ? 'warn' : 'ok'}>{item.stock} {item.unit}</Badge></td>
                  <td style={td}>
                    {isAdmin ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input style={{ ...inputStyle, minWidth: 90 }} type="number" value={importQty[item._id] || ''} onChange={(e) => setImportQty((prev) => ({ ...prev, [item._id]: e.target.value }))} />
                        <button style={buttonStyle} onClick={() => importStock(item._id)}>Nhập</button>
                      </div>
                    ) : '—'}
                  </td>
                  <td style={td}>
                    {isAdmin ? <button style={mutedButton} onClick={() => setEditing({ ...item })}>Chỉnh</button> : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editing ? (
          <div style={{ marginTop: 16, borderTop: `1px solid ${palette.line}`, paddingTop: 16, display: 'grid', gap: 10 }}>
            <div style={{ fontWeight: 800, color: palette.text }}>Sửa sản phẩm</div>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
              <input style={inputStyle} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <input style={inputStyle} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              <input style={inputStyle} type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
              <input style={inputStyle} type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} />
              <input style={inputStyle} value={editing.unit} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
              <select style={inputStyle} value={String(editing.isActive)} onChange={(e) => setEditing({ ...editing, isActive: e.target.value === 'true' })}>
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

function OpsPanel({ report, logs, orders }) {
  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
      <div style={cardStyle}>
        <SectionTitle title="Log nhập / xuất kho gần đây" />
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={th}>Thời gian</th>
              <th style={th}>Món</th>
              <th style={th}>Loại</th>
              <th style={th}>SL</th>
            </tr>
          </thead>
          <tbody>
            {(logs || report?.recentInventoryLogs || []).map((log) => (
              <tr key={log._id}>
                <td style={td}>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                <td style={td}>{log.productName}</td>
                <td style={td}>{log.type}</td>
                <td style={td}>{log.quantity}</td>
              </tr>
            ))}
            {!(logs || report?.recentInventoryLogs || []).length ? <tr><td style={td} colSpan={4}>Chưa có log.</td></tr> : null}
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
            {(orders || []).map((order) => (
              <tr key={order._id}>
                <td style={td}>{order._id.slice(-6).toUpperCase()}</td>
                <td style={td}>{new Date(order.paidAt).toLocaleString('vi-VN')}</td>
                <td style={td}>{money(order.subtotal)}</td>
              </tr>
            ))}
            {!orders?.length ? <tr><td style={td} colSpan={3}>Chưa có hóa đơn.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = { textAlign: 'left', color: palette.muted, fontSize: 13, padding: '10px 8px', borderBottom: `1px solid ${palette.line}` };
const td = { padding: '10px 8px', borderBottom: `1px solid ${palette.line}`, color: palette.text, verticalAlign: 'top' };

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
  const [logs, setLogs] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
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
    setProducts(data);
  }

  async function loadTables() {
    const data = await api('/tables');
    setTables(data);
    if (!currentTableId && data[0]) setCurrentTableId(data[0]._id);
  }

  async function loadReport() {
    const data = await api('/reports/summary');
    setReport(data);
  }

  async function loadUsers() {
    if (!isAdmin) return setUsers([]);
    const data = await api('/auth/users');
    setUsers(data);
  }

  async function loadLogs() {
    if (!isAdmin) return setLogs([]);
    const data = await api('/products/inventory/logs');
    setLogs(data);
  }

  async function loadPaidOrders() {
    const data = await api('/orders/history?limit=50');
    setPaidOrders(data);
  }

  async function refreshOrder() {
    if (!currentTableId) return setCurrentOrder(null);
    const data = await api('/tables');
    setTables(data);
    const table = data.find((t) => t._id === currentTableId);
    const orderId = table?.currentOrder?._id || table?.currentOrder;
    if (!orderId) return setCurrentOrder(null);
    const order = await api(`/orders/${orderId}`);
    setCurrentOrder(order);
  }

  async function bootstrap() {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      await Promise.all([loadProducts(), loadTables(), loadReport(), loadUsers(), loadLogs(), loadPaidOrders()]);
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
      if (isAdmin) loadLogs().catch(() => {});
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
    await Promise.all([loadTables(), loadReport(), loadProducts(), loadPaidOrders()]);
    setCurrentOrder(null);
  }

  if (!user) return <LoginScreen onLogin={setUser} />;

  const tabs = [
    { value: 'dashboard', label: 'Tổng quan' },
    { value: 'tables', label: 'Sảnh chờ' },
    { value: 'sales', label: 'Bán hàng' },
    { value: 'inventory', label: 'Kho / Menu' },
    ...(isAdmin ? [{ value: 'ops', label: 'Vận hành' }, { value: 'users', label: 'Tài khoản' }] : [])
  ];

  return (
    <div style={{ minHeight: '100vh', background: palette.bg, padding: 18 }}>
      <div style={{ maxWidth: 1500, margin: '0 auto', display: 'grid', gap: 16 }}>
        <div style={{ ...cardStyle, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 900, color: palette.brown }}>FOREVER POS PRO</div>
              <div style={{ color: palette.muted, marginTop: 6 }}>Xin chào {user.name} · {user.role === 'admin' ? 'Admin' : 'Nhân viên'}</div>
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

        {tab === 'dashboard' ? <Dashboard report={report} /> : null}
        {tab === 'tables' ? <TableManager tables={tables} onSeedTables={seedTables} onOpenTable={openTable} currentTableId={currentTableId} setCurrentTableId={setCurrentTableId} /> : null}
        {tab === 'sales' ? <MenuAndOrder currentTable={currentTable} currentOrder={currentOrder} products={products} refreshOrder={refreshOrder} refreshProducts={loadProducts} onPayOrder={payOrder} /> : null}
        {tab === 'inventory' ? <ProductAdmin products={products} refreshProducts={loadProducts} isAdmin={isAdmin} /> : null}
        {tab === 'ops' && isAdmin ? <OpsPanel report={report} logs={logs} orders={paidOrders} /> : null}
        {tab === 'users' && isAdmin ? <UserAdmin users={users} refreshUsers={loadUsers} isAdmin={isAdmin} /> : null}
      </div>
    </div>
  );
}
