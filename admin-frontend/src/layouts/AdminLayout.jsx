import { Outlet } from 'react-router-dom';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import AdminFooter from './components/AdminFooter';

export default function AdminLayout() {
  return (
    <div className="dashboard-container">
      <AdminHeader />
      <AdminSidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
}