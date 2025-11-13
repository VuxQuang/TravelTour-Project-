import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function AdminHeader() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((v) => !v);

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <i className="fas fa-plane"></i>
          <span>{t('header.title')}</span>
        </div>
        <span className="slogan">{t('header.slogan')}</span>
      </div>
      <div className="header-center">
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder={t('header.searchPlaceholder')} />
          <button type="submit"><i className="fas fa-search"></i></button>
        </form>
      </div>
      <div className="header-right">
        <div className="header-icons">
          <div className="icon-btn">
            <i className="fas fa-envelope"></i>
            <span className="badge">2</span>
          </div>
          <div className="icon-btn">
            <i className="fas fa-bell"></i>
            <span className="badge">5</span>
          </div>
          <div className="icon-btn">
            <i className="fas fa-cog"></i>
          </div>
        </div>
        
        <LanguageSwitcher />
        
        <div className="profile-dropdown">
          <div className="profile-info" onClick={toggleDropdown}>
            <img src="/admin/imgs/img25.jpg" alt="User Avatar" className="user-avatar" />
            <span className="user-name">Tên người dùng</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className={`dropdown-menu${isOpen ? ' open' : ''}`} id="profileDropdown">
            <a href="#" className="dropdown-item">
              <i className="fas fa-user"></i>
              <span>{t('common.profile')}</span>
            </a>
            <a href="#" className="dropdown-item">
              <i className="fas fa-cog"></i>
              <span>{t('common.settings')}</span>
            </a>
            <div className="dropdown-divider"></div>
            <a href="/admin/logout" className="dropdown-item">
              <i className="fas fa-sign-out-alt"></i>
              <span>{t('common.logout')}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}