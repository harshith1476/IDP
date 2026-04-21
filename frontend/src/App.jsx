import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { authService } from './services/authService';

// Lazy load all pages for better performance
const Login = lazy(() => import('./pages/Login'));
const FacultyDashboard = lazy(() => import('./pages/FacultyDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const FacultyProfile = lazy(() => import('./pages/FacultyProfile'));
const FacultyTargets = lazy(() => import('./pages/FacultyTargets'));
const FacultyPublications = lazy(() => import('./pages/FacultyPublications'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const AdminFacultyList = lazy(() => import('./pages/AdminFacultyList'));
const AdminFacultyDetail = lazy(() => import('./pages/AdminFacultyDetail'));
const AdminPublications = lazy(() => import('./pages/AdminPublications'));
const AdminApprovals = lazy(() => import('./pages/AdminApprovals'));
const AdminReports = lazy(() => import('./pages/AdminReports'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-vh-100 p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/faculty" element={
            <PrivateRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <FacultyDashboard />
            </PrivateRoute>
          } />

          <Route path="/faculty/profile" element={
            <PrivateRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <FacultyProfile />
            </PrivateRoute>
          } />

          <Route path="/faculty/targets" element={
            <PrivateRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <FacultyTargets />
            </PrivateRoute>
          } />

          <Route path="/faculty/publications" element={
            <PrivateRoute allowedRoles={['FACULTY', 'ADMIN']}>
              <FacultyPublications />
            </PrivateRoute>
          } />

          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          } />

          <Route path="/admin/faculty" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminFacultyList />
            </PrivateRoute>
          } />

          <Route path="/admin/faculty/:id" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminFacultyDetail />
            </PrivateRoute>
          } />

          <Route path="/admin/publications" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminPublications />
            </PrivateRoute>
          } />

          <Route path="/admin/analytics" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminAnalytics />
            </PrivateRoute>
          } />

          <Route path="/admin/approvals" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminApprovals />
            </PrivateRoute>
          } />

          <Route path="/admin/reports" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminReports />
            </PrivateRoute>
          } />

          <Route path="/student" element={
            <PrivateRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <StudentDashboard />
            </PrivateRoute>
          } />



          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

