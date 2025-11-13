import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import i18n from './i18n'
import './styles/admin/dashboard-style.css';
import './styles/admin/users-style.css';
import './styles/admin/tour-style.css';
import './styles/admin/category-style.css';
import './styles/admin/promotion-style.css';
import './styles/admin/review-style.css';
import './styles/admin/support-style.css';
import './styles/language-switcher.css';

// Wait for i18n to initialize before rendering
i18n.then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </StrictMode>,
  )
}).catch(console.error);
