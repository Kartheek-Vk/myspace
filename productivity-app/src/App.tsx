import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { CalendarPage } from './pages/CalendarPage';
import { JournalPage } from './pages/JournalPage';
import { LearningPage } from './pages/LearningPage';
import { BtechPage, DsaPage } from './pages/CategoryPages';
import { ProjectsPage } from './pages/ProjectsPage';
import { CareerPage } from './pages/CareerPage';
import { NotesPage } from './pages/NotesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GoalsPage } from './pages/GoalsPage';
import { WeeklyReviewPage } from './pages/WeeklyReviewPage';
import { SettingsPage } from './pages/SettingsPage';
import { TomorrowPage } from './pages/TomorrowPage';
import { LandingPage } from './pages/LandingPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage />} />

          {/* Protected Routes (guest + authenticated) */}
          <Route path="/app" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="tasks/:id" element={<TaskDetailPage />} />
            <Route path="tomorrow" element={<TomorrowPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="learning" element={<LearningPage />} />
            <Route path="btech" element={<BtechPage />} />
            <Route path="dsa" element={<DsaPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="career" element={<CareerPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="weekly-review" element={<WeeklyReviewPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
