import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  FaBox, FaConciergeBell, FaDollarSign, FaShoppingCart, FaStore, FaUsers,
} from 'react-icons/fa';
import adminApi from '../../services/adminApi';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminStatCard from '../components/AdminStatCard';
import AdminAlert from '../components/AdminAlert';
import DateRangeFilter from '../components/DateRangeFilter';
import ChartCard from '../components/ChartCard';
import AdminCard from '../components/AdminCard';
import '../styles/admin.css';

const formatCurrency = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('30d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { range };
      if (range === 'custom') {
        if (customFrom) params.from = customFrom;
        if (customTo) params.to = customTo;
      }
      const { data } = await adminApi.get('/admin/dashboard/stats', { params });
      setStats(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [range, customFrom, customTo]);

  useEffect(() => { loadStats(); }, [loadStats]);

  const handleRangeChange = ({ range: r, from, to }) => {
    setRange(r);
    if (from !== undefined) setCustomFrom(from);
    if (to !== undefined) setCustomTo(to);
  };

  return (
    <div className="adm-dashboard">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Overview of your marketplace performance"
      />

      <DateRangeFilter
        range={range}
        customFrom={customFrom}
        customTo={customTo}
        onChange={handleRangeChange}
      />

      {error && <AdminAlert type="error">{error}</AdminAlert>}

      <div className="adm-dashboard__stats">
        <AdminStatCard label="Revenue" value={loading ? '…' : formatCurrency(stats?.revenue)} icon={FaDollarSign} accent="#059669" />
        <AdminStatCard label="Orders" value={loading ? '…' : stats?.ordersInRange} icon={FaShoppingCart} path="/admin/orders" accent="#d97706" />
        <AdminStatCard label="Users" value={loading ? '…' : stats?.usersInRange} icon={FaUsers} path="/admin/users" accent="#2563eb" />
        <AdminStatCard label="Vendors" value={loading ? '…' : stats?.vendorsInRange} icon={FaStore} path="/admin/vendors" accent="#7c3aed" />
        <AdminStatCard label="Products" value={loading ? '…' : stats?.products} icon={FaBox} path="/admin/products" accent="#0891b2" />
        <AdminStatCard label="Services" value={loading ? '…' : stats?.services} icon={FaConciergeBell} path="/admin/services" accent="#db2777" />
      </div>

      <div className="adm-dashboard__charts">
        <ChartCard title="Revenue & Orders" subtitle="Daily revenue and order volume" className="adm-chart-card--wide">
          {loading ? <div className="skeleton" style={{ height: 260 }} /> : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats?.revenueOrdersChart || []}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#4f46e5" fill="url(#revGrad)" strokeWidth={2} />
                <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#f59e0b" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Products & Services" subtitle="New listings in selected period">
          {loading ? <div className="skeleton" style={{ height: 260 }} /> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats?.productsServicesChart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend />
                <Bar dataKey="products" fill="#0891b2" radius={[4, 4, 0, 0]} />
                <Bar dataKey="services" fill="#db2777" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Users & Vendors" subtitle="New registrations in selected period">
          {loading ? <div className="skeleton" style={{ height: 260 }} /> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats?.usersVendorsChart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend />
                <Bar dataKey="users" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vendors" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="adm-dashboard__lists">
        <AdminCard>
          <h3 className="adm-list-card__title">Recent Orders</h3>
          {loading ? <div className="skeleton" style={{ height: 120 }} /> : (
            <ul className="adm-list">
              {(stats?.recentOrders || []).length === 0 ? (
                <li className="adm-list__item"><span className="adm-list__meta">No orders yet</span></li>
              ) : stats.recentOrders.map((o) => (
                <li key={o.id} className="adm-list__item">
                  <div>
                    <strong>{o.orderNumber || `#${o.id}`}</strong>
                    <div className="adm-list__meta">{o.userName} · {formatCurrency(o.total)}</div>
                  </div>
                  <span className={`adm-list__badge status-badge--${o.orderStatus}`}>{o.orderStatus}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/orders" className="adm-btn adm-btn--ghost adm-btn--sm" style={{ marginTop: '0.75rem' }}>View all orders</Link>
        </AdminCard>

        <AdminCard>
          <h3 className="adm-list-card__title">Recent Users</h3>
          {loading ? <div className="skeleton" style={{ height: 120 }} /> : (
            <ul className="adm-list">
              {(stats?.recentUsers || []).length === 0 ? (
                <li className="adm-list__item"><span className="adm-list__meta">No users yet</span></li>
              ) : stats.recentUsers.map((u) => (
                <li key={u.id} className="adm-list__item">
                  <div>
                    <strong>{u.name}</strong>
                    <div className="adm-list__meta">{u.email}</div>
                  </div>
                  <span className={`adm-list__badge status-badge--${u.status}`}>{u.status}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/users" className="adm-btn adm-btn--ghost adm-btn--sm" style={{ marginTop: '0.75rem' }}>View all users</Link>
        </AdminCard>

        <AdminCard>
          <h3 className="adm-list-card__title">Top Products</h3>
          {loading ? <div className="skeleton" style={{ height: 120 }} /> : (
            <ul className="adm-list">
              {(stats?.topProducts || []).map((p) => (
                <li key={p.id} className="adm-list__item">
                  <div>
                    <strong>{p.name}</strong>
                    <div className="adm-list__meta">Rating {p.rating} · {formatCurrency(p.price)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard>
          <h3 className="adm-list-card__title">Top Services</h3>
          {loading ? <div className="skeleton" style={{ height: 120 }} /> : (
            <ul className="adm-list">
              {(stats?.topServices || []).map((s) => (
                <li key={s.id} className="adm-list__item">
                  <div>
                    <strong>{s.name}</strong>
                    <div className="adm-list__meta">{s.city} · Rating {s.rating}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
