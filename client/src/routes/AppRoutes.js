import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/RegisterFixed';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Dashboard Pages
import CoordinatorDashboard from '../pages/dashboard/CoordinatorDashboard';
import EducatorDashboard from '../pages/dashboard/EducatorDashboard';
import LearnerDashboard from '../pages/dashboard/LearnerDashboard';

// Course Pages
import Courses from '../pages/courses/Courses';
import CourseDetails from '../pages/courses/CourseDetails';
import CreateCourse from '../pages/courses/CreateCourse';
import EditCourse from '../pages/courses/EditCourse';
import CourseMaterials from '../pages/courses/CourseMaterials';

// Assignment Pages
import Assignments from '../pages/assignments/Assignments';
import AssignmentDetails from '../pages/assignments/AssignmentDetails';
import CreateAssignment from '../pages/assignments/CreateAssignment';
import EditAssignment from '../pages/assignments/EditAssignment';
import Submissions from '../pages/assignments/Submissions';
import GradeSubmission from '../pages/assignments/GradeSubmission';
import MySubmissions from '../pages/assignments/MySubmissions';

// Study Plan Pages
import StudyPlans from '../pages/studyplans/StudyPlans';
import StudyPlanDetails from '../pages/studyplans/StudyPlanDetails';
import CreateStudyPlan from '../pages/studyplans/CreateStudyPlan';
import EditStudyPlan from '../pages/studyplans/EditStudyPlan';

// Payment Pages
import Payments from '../pages/payments/Payments';
import PaymentHistory from '../pages/payments/PaymentHistory';
import PaymentSuccess from '../pages/payments/PaymentSuccess';
import PaymentFailed from '../pages/payments/PaymentFailed';
import Invoice from '../pages/payments/Invoice';

// User Pages
import Profile from '../pages/users/Profile';
import Settings from '../pages/users/Settings';
import Users from '../pages/users/Users';
import UserDetails from '../pages/users/UserDetails';

// Report Pages
import Reports from '../pages/reports/Reports';
import Analytics from '../pages/reports/Analytics';
import ExportData from '../pages/reports/ExportData';

// Help Pages
import Help from '../pages/help/Help';
import FAQ from '../pages/help/FAQ';
import Contact from '../pages/help/Contact';
import Tutorials from '../pages/help/Tutorials';

// Layout
import Layout from '../components/Layout/Layout';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const AppRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const getDashboardComponent = () => {
    if (!user) return <Navigate to="/login" />;
    
    switch (user.role) {
      case 'coordinator':
        return <CoordinatorDashboard />;
      case 'educator':
        return <EducatorDashboard />;
      case 'learner':
        return <LearnerDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<Layout />}>
          {/* Dashboard */}
          <Route path="/" element={getDashboardComponent()} />
          <Route path="/dashboard" element={getDashboardComponent()} />

          {/* Courses */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/courses/create" element={<CreateCourse />} />
          <Route path="/courses/:id/edit" element={<EditCourse />} />
          <Route path="/courses/:id/materials" element={<CourseMaterials />} />

          {/* Assignments */}
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/assignments/:id" element={<AssignmentDetails />} />
          <Route path="/assignments/create" element={<CreateAssignment />} />
          <Route path="/assignments/:id/edit" element={<EditAssignment />} />
          <Route path="/assignments/:id/submissions" element={<Submissions />} />
          <Route path="/assignments/:id/grade/:submissionId" element={<GradeSubmission />} />
          <Route path="/my-submissions" element={<MySubmissions />} />

          {/* Study Plans */}
          <Route path="/study-plans" element={<StudyPlans />} />
          <Route path="/study-plans/:id" element={<StudyPlanDetails />} />
          <Route path="/study-plans/create" element={<CreateStudyPlan />} />
          <Route path="/study-plans/:id/edit" element={<EditStudyPlan />} />

          {/* Payments */}
          <Route path="/payments" element={<Payments />} />
          <Route path="/payments/history" element={<PaymentHistory />} />
          <Route path="/payments/success" element={<PaymentSuccess />} />
          <Route path="/payments/failed" element={<PaymentFailed />} />
          <Route path="/payments/invoice/:id" element={<Invoice />} />

          {/* Users */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetails />} />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/export" element={<ExportData />} />

          {/* Help */}
          <Route path="/help" element={<Help />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tutorials" element={<Tutorials />} />
        </Route>
      </Route>

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;