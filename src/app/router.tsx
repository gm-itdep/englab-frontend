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

const TeacherSchedulePage = lazy(() =>
  import('../pages/Schedule').then((module) => ({ default: module.TeacherSchedulePage })),
);

const TeacherLessonPage = lazy(() =>
  import('../pages/Lesson').then((module) => ({ default: module.TeacherLessonPage })),
);

const TeacherStudentsPage = lazy(() =>
  import('../pages/Students').then((module) => ({ default: module.TeacherStudentsPage })),
);

const TeacherStudentProfilePage = lazy(() =>
  import('../pages/StudentProfile').then((module) => ({
    default: module.TeacherStudentProfilePage,
  })),
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
          <Route path="/home" element={<HomePage />} />
          <Route path="/schedule" element={<TeacherSchedulePage />} />
          <Route path="/lesson" element={<TeacherLessonPage />} />
          <Route path="/students" element={<TeacherStudentsPage />} />
          <Route path="/student" element={<TeacherStudentProfilePage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
