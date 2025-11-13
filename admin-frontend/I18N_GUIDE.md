# Hướng dẫn sử dụng i18n trong dự án Travelee Admin

## Cài đặt đã hoàn thành

✅ **Packages đã cài đặt:**
- `i18next` - Core i18n library
- `react-i18next` - React integration
- `i18next-browser-languagedetector` - Auto detect browser language

✅ **Cấu hình đã thiết lập:**
- File cấu hình: `src/i18n/index.js`
- Translation files: `src/i18n/locales/vi.json`, `src/i18n/locales/en.json`
- App đã được wrap với Suspense trong `main.jsx`
- LanguageSwitcher component đã được tích hợp vào AdminHeader

## Cách sử dụng

### 1. Sử dụng hook useTranslation trong component

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
    </div>
  );
}
```

### 2. Thêm translation keys mới

**Trong `src/i18n/locales/vi.json`:**
```json
{
  "myPage": {
    "title": "Tiêu đề trang",
    "description": "Mô tả trang"
  }
}
```

**Trong `src/i18n/locales/en.json`:**
```json
{
  "myPage": {
    "title": "Page Title",
    "description": "Page Description"
  }
}
```

**Sử dụng trong component:**
```jsx
const { t } = useTranslation();
return <h1>{t('myPage.title')}</h1>;
```

### 3. Thay đổi ngôn ngữ programmatically

```jsx
import { useTranslation } from 'react-i18next';

function LanguageButton() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  
  return (
    <button onClick={() => changeLanguage('en')}>
      English
    </button>
  );
}
```

### 4. Sử dụng với parameters

```json
{
  "welcome": "Chào mừng {{name}}!"
}
```

```jsx
const { t } = useTranslation();
return <p>{t('welcome', { name: 'Admin' })}</p>;
```

## Cấu trúc translation hiện tại

- **common**: Các từ chung (save, cancel, edit, delete...)
- **header**: Header component
- **sidebar**: Sidebar navigation
- **dashboard**: Dashboard page
- **users**: User management (list, create, edit)
- **articles**: Article management (list, create, edit)
- **login**: Login page
- **language**: Language switcher

## ✅ Đã cập nhật i18n cho tất cả các trang:

1. **AdminSidebar** - Tất cả menu items
2. **AdminHeader** - Title, slogan, search placeholder, profile menu
3. **Dashboard** - Title, welcome message, stats labels
4. **UsersList** - Page title, table headers, messages
5. **CreateUser** - Form labels, buttons
6. **ArticlesList** - Page title, table headers, messages
7. **Login** - Form labels, buttons, error messages

## Language Switcher

LanguageSwitcher component đã được tích hợp vào AdminHeader với:
- Dropdown hiển thị cờ và tên ngôn ngữ
- Tự động lưu lựa chọn vào localStorage
- CSS styling đã được thêm vào `language-switcher.css`

## Lưu ý

1. **Fallback language**: Mặc định là tiếng Việt (vi)
2. **Auto detection**: Tự động detect ngôn ngữ từ browser/localStorage
3. **Namespace**: Hiện tại sử dụng namespace mặc định 'translation'
4. **Performance**: Translation files được load ngay từ đầu

## Mở rộng

Để thêm ngôn ngữ mới:
1. Tạo file `src/i18n/locales/[lang].json`
2. Thêm vào resources trong `src/i18n/index.js`
3. Cập nhật LanguageSwitcher component
