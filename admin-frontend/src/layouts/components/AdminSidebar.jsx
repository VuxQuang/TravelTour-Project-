import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdminSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isActive = (p) => pathname.startsWith(p);

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
            <Link to="/admin/dashboard" className="nav-link">
              <i className="fas fa-home"></i>
              <span>{t('sidebar.dashboard')}</span>
            </Link>
          </li>

          <li className={`nav-item ${isActive('/admin/tours') ? 'active' : ''}`}>
            <Link to="/admin/tours" className="nav-link">
              <i className="fas fa-map-marked-alt"></i>
              <span>{t('sidebar.tours')}</span>
            </Link>
          </li>

          <li className={`nav-item ${isActive('/admin/bookings') ? 'active' : ''}`}>
            <Link to="/admin/bookings" className="nav-link">
              <i className="fas fa-calendar-check"></i>
              <span>{t('sidebar.bookings')}</span>
            </Link>
          </li>

          <li className={`nav-item ${isActive('/admin/categories') ? 'active' : ''}`}>
            <Link to="/admin/categories" className="nav-link">
              <i className="fas fa-star"></i>
              <span>{t('sidebar.categories')}</span>
            </Link>
          </li>

          <li className={`nav-item ${isActive('/admin/promotions') ? 'active' : ''}`}>
            <Link to="/admin/promotions" className="nav-link">
              <i className="fas fa-tags"></i>
              <span>{t('sidebar.promotions')}</span>
            </Link>
          </li>

          <li className={`nav-item ${isActive('/admin/articles') ? 'active' : ''}`}>
            <Link to="/admin/articles" className="nav-link">
              <i className="fas fa-newspaper"></i>
              <span>{t('sidebar.articles')}</span>
            </Link>
          </li>

          <li className={`nav-item ${isActive('/admin/reviews') ? 'active' : ''}`}>
            <Link to="/admin/reviews" className="nav-link">
              <i className="fas fa-star"></i>
              <span>{t('sidebar.reviews')}</span>
            </Link>
          </li>

          <li className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
            <Link to="/admin/users" className="nav-link">
              <i className="fas fa-users"></i>
              <span>{t('sidebar.users')}</span>
            </Link>
          </li>

          <li className={`nav-item ${isActive('/admin/support') ? 'active' : ''}`}>
            <Link to="/admin/support" className="nav-link">
              <i className="fas fa-headset"></i>
              <span>{t('sidebar.support')}</span>
            </Link>
          </li>

          <li className={`nav-item ${isActive('/admin/schedule') ? 'active' : ''}`}>
            <Link to="/admin/schedule" className="nav-link">
              <i className="fas fa-calendar-alt"></i>
              <span>{t('sidebar.schedule')}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}