import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const LoginPage = lazy(() =>
  import('../pages/Login').then((module) => ({ default: module.LoginPage })),
);

const RegisterPage = lazy(() =>
  import('../pages/Register').then((module) => ({ default: module.RegisterPage })),
);

const ForgotPasswordPage = lazy(() =>
  import('../pages/ForgotPassword').then((module) => ({
    default: module.ForgotPasswordPage,
  })),
);

const ResetPasswordPage = lazy(() =>
  import('../pages/ResetPassword').then((module) => ({
    default: module.ResetPasswordPage,
  })),
);

const VerifyEmailPage = lazy(() =>
  import('../pages/VerifyEmail').then((module) => ({
    default: module.VerifyEmailPage,
  })),
);

const VerifyEmailSuccessPage = lazy(() =>
  import('../pages/VerifyEmailSuccess').then((module) => ({
    default: module.VerifyEmailSuccessPage,
  })),
);

const ResetPasswordSuccessPage = lazy(() =>
  import('../pages/ResetPasswordSuccess').then((module) => ({
    default: module.ResetPasswordSuccessPage,
  })),
);

const RegisterSuccessPage = lazy(() =>
  import('../pages/RegisterSuccess').then((module) => ({
    default: module.RegisterSuccessPage,
  })),
);

const HomePage = lazy(() =>
  import('../pages/Home').then((module) => ({ default: module.HomePage })),
);

const SchedulePage = lazy(() =>
  import('../pages/Schedule').then((module) => ({ default: module.SchedulePage })),
);

const BookingPage = lazy(() =>
  import('../pages/Booking').then((module) => ({ default: module.BookingPage })),
);

const MaterialsPage = lazy(() =>
  import('../pages/Materials').then((module) => ({ default: module.MaterialsPage })),
);

const BalancePage = lazy(() =>
  import('../pages/Balance').then((module) => ({ default: module.BalancePage })),
);

const TopupPage = lazy(() =>
  import('../pages/Topup').then((module) => ({ default: module.TopupPage })),
);

const ProfilePage = lazy(() =>
  import('../pages/Profile').then((module) => ({ default: module.ProfilePage })),
);

const ProgressPage = lazy(() =>
  import('../pages/Progress').then((module) => ({ default: module.ProgressPage })),
);

const NotificationsPage = lazy(() =>
  import('../pages/Notifications').then((module) => ({ default: module.NotificationsPage })),
);

const TeacherLessonPage = lazy(() =>
  import('../pages/Lesson').then((module) => ({ default: module.LessonPage })),
);

const TeacherStudentsPage = lazy(() =>
  import('../pages/Students').then((module) => ({ default: module.TeacherStudentsPage })),
);

const TeacherStudentProfilePage = lazy(() =>
  import('../pages/StudentProfile').then((module) => ({
    default: module.TeacherStudentProfilePage,
  })),
);

const AdminUsersPage = lazy(() =>
  import('../pages/Users').then((module) => ({ default: module.AdminUsersPage })),
);

const AdminFinancePage = lazy(() =>
  import('../pages/Finance').then((module) => ({ default: module.AdminFinancePage })),
);

const AdminLessonsPage = lazy(() =>
  import('../pages/Lessons').then((module) => ({ default: module.AdminLessonsPage })),
);

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: '100%',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--color-gray-700)',
        fontFamily: 'var(--font-family-base)',
      }}
    >
      Загрузка…
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/reset-password/success" element={<ResetPasswordSuccessPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/success" element={<RegisterSuccessPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-email/success" element={<VerifyEmailSuccessPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/users" element={<AdminUsersPage />} />
          <Route path="/finance" element={<AdminFinancePage />} />
          <Route path="/lessons" element={<AdminLessonsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking/slot" element={<BookingPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/balance" element={<BalancePage />} />
          <Route path="/balance/topup" element={<TopupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/lesson" element={<TeacherLessonPage />} />
          <Route path="/students" element={<TeacherStudentsPage />} />
          <Route path="/student" element={<TeacherStudentProfilePage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
