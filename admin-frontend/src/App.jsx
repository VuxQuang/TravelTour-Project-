import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './page/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './features/dashboard/pages/Dashboard';
import UsersList from './features/users/pages/UsersList';
import CreateUser from './features/users/pages/CreateUser';
import UserDetail from './features/users/pages/UserDetail';
import EditUser from './features/users/pages/EditUser';
import ArticlesList from './features/article/pages/Article';
import CreateArticle from './features/article/pages/CreateArticle';
import EditArticle from './features/article/pages/EditArticle';
import BookingsList from './features/bookings/pages/BookingsList';
// Admin không được tạo/sửa booking - chỉ xem và quản lý status
// import CreateBooking from './features/bookings/pages/CreateBooking';
// import EditBooking from './features/bookings/pages/EditBooking';
import BookingDetail from './features/bookings/pages/BookingDetail';
import SupportList from './features/support/pages/SupportList';
import CreateSupport from './features/support/pages/CreateSupport';
import EditSupport from './features/support/pages/EditSupport';
import SupportDetail from './features/support/pages/SupportDetail';
import ReviewsList from './features/reviews/pages/ReviewsList';
import CreateReview from './features/reviews/pages/CreateReview';
import EditReview from './features/reviews/pages/EditReview';
import ReviewDetail from './features/reviews/pages/ReviewDetail';
import CategoriesList from './features/categories/pages/CategoriesList';
import CreateCategory from './features/categories/pages/CreateCategory';
import EditCategory from './features/categories/pages/EditCategory';
import CategoryDetail from './features/categories/pages/CategoryDetail';
import ScheduleList from './features/schedule/pages/ScheduleList';
import CreateSchedule from './features/schedule/pages/CreateSchedule';
import EditSchedule from './features/schedule/pages/EditSchedule';
import ScheduleDetail from './features/schedule/pages/ScheduleDetail';
import ToursList from './features/tours/pages/ToursList';
import CreateTour from './features/tours/pages/CreateTour';
import EditTour from './features/tours/pages/EditTour';
import TourDetail from './features/tours/pages/TourDetail';
import PromotionsList from './features/promotions/pages/PromotionsList';
import CreatePromotion from './features/promotions/pages/CreatePromotion';
import EditPromotion from './features/promotions/pages/EditPromotion';
import PromotionDetail from './features/promotions/pages/PromotionDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UsersList />} />
          <Route path="users/create" element={<CreateUser />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="articles" element={<ArticlesList />} />
          <Route path="articles/create" element={<CreateArticle />} />
          <Route path="articles/edit/:id" element={<EditArticle />} />
          <Route path="bookings" element={<BookingsList />} />
          {/* Admin không được tạo/sửa booking - chỉ xem và quản lý status */}
          {/* <Route path="bookings/create" element={<CreateBooking />} /> */}
          <Route path="bookings/:id" element={<BookingDetail />} />
          {/* <Route path="bookings/edit/:id" element={<EditBooking />} /> */}
          <Route path="support" element={<SupportList />} />
          <Route path="support/create" element={<CreateSupport />} />
          <Route path="support/:id" element={<SupportDetail />} />
          <Route path="support/edit/:id" element={<EditSupport />} />
          <Route path="reviews" element={<ReviewsList />} />
          <Route path="reviews/create" element={<CreateReview />} />
          <Route path="reviews/:id" element={<ReviewDetail />} />
          <Route path="reviews/edit/:id" element={<EditReview />} />
          <Route path="categories" element={<CategoriesList />} />
          <Route path="categories/create" element={<CreateCategory />} />
          <Route path="categories/:id" element={<CategoryDetail />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />
          <Route path="schedule" element={<ScheduleList />} />
          <Route path="schedule/create" element={<CreateSchedule />} />
          <Route path="schedule/:id" element={<ScheduleDetail />} />
          <Route path="schedule/edit/:id" element={<EditSchedule />} />
          <Route path="tours" element={<ToursList />} />
          <Route path="tours/create" element={<CreateTour />} />
          <Route path="tours/:id" element={<TourDetail />} />
          <Route path="tours/edit/:id" element={<EditTour />} />
          <Route path="promotions" element={<PromotionsList />} />
          <Route path="promotions/create" element={<CreatePromotion />} />
          <Route path="promotions/:id" element={<PromotionDetail />} />
          <Route path="promotions/edit/:id" element={<EditPromotion />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}