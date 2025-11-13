import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import RevenueChart from '../components/RevenueChart';

export default function Dashboard() {
  const { t } = useTranslation();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const [summary, setSummary] = useState({ totalUsers: 0, totalTours: 0, todayBookings: 0 });
  const [chart, setChart] = useState({ monthlyRevenue: 0, monthlyBookings: 0, monthlyStats: [] });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    api.get('/admin/dashboard/monthly-stats', { params: { year, month } })
      .then(res => setChart({
        monthlyRevenue: res.data?.monthlyRevenue ?? 0,
        monthlyBookings: res.data?.monthlyBookings ?? 0,
        monthlyStats: res.data?.monthlyStats ?? []
      }))
      .catch(() => setChart({ monthlyRevenue: 0, monthlyBookings: 0, monthlyStats: [] }));

    api.get('/admin/dashboard/summary').then(res => setSummary(res.data)).catch(() => {});
    api.get('/admin/dashboard/recent-activities').then(res => setActivities(res.data || [])).catch(() => setActivities([]));
  }, [year, month]);

  return (
    <div>
      <div className="content-header">
        <h1>{t('dashboard.title')}</h1>
        <p>{t('dashboard.welcome')}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-users" /></div>
          <div className="stat-info">
            <h3>{summary.totalUsers}</h3>
            <p>{t('dashboard.totalUsers')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-map-marked-alt" /></div>
          <div className="stat-info">
            <h3>{summary.totalTours}</h3>
            <p>{t('dashboard.totalTours')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-calendar-check" /></div>
          <div className="stat-info">
            <h3>{summary.todayBookings}</h3>
            <p>{t('dashboard.totalBookings')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-star" /></div>
          <div className="stat-info">
            <h3>4.8</h3>
            <p>{t('dashboard.averageRating')}</p>
          </div>
        </div>
      </div>

      <div className="revenue-chart-section">
        <div className="chart-header">
          <h2>{t('dashboard.revenueChart')}</h2>
          <div className="chart-controls">
            <select className="chart-select" value={year} onChange={e => setYear(+e.target.value)}>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
            <select className="chart-select" value={month} onChange={e => setMonth(+e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{t('dashboard.month')} {m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="chart-content">
          <div className="chart-stats">
            <div className="chart-stat-item">
              <span className="stat-label">{t('dashboard.totalMonthlyRevenue')}:</span>
              <span className="stat-value">{chart.monthlyRevenue} VNĐ</span>
            </div>
            <div className="chart-stat-item">
              <span className="stat-label">{t('dashboard.totalMonthlyBookings')}:</span>
              <span className="stat-value">{chart.monthlyBookings}</span>
            </div>
          </div>
          <div className="chart-container">
            <RevenueChart data={chart.monthlyStats} />
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>{t('dashboard.recentActivity')}</h2>
          <div className="activity-list">
            {activities && activities.length > 0 ? activities.map((a, idx) => (
              <div className="activity-item" key={idx}>
                <div className="activity-icon"><i className={a.icon} /></div>
                <div className="activity-info">
                  <p>{a.title}: {a.description}</p>
                  <span className="activity-time">{a.timeAgo}</span>
                </div>
              </div>
            )) : (
              <div className="activity-item">
                <div className="activity-icon"><i className="fas fa-info-circle" /></div>
                <div className="activity-info">
                  <p>{t('dashboard.noRecentActivity')}</p>
                  <span className="activity-time">-</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


