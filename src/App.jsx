import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { storage } from './utils/storage';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import LessonIntro from './pages/LessonIntro';
import LessonPlay from './pages/LessonPlay';
import LessonComplete from './pages/LessonComplete';
import Astaanta from './pages/Astaanta';
import Progress from './pages/Progress';
import PracticeHub from './pages/PracticeHub';
import PracticeSession from './pages/PracticeSession';
import About from './pages/About';
import AuthGate from './pages/AuthGate';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProfileSetup from './pages/ProfileSetup';
import AdminPage from './admin/AdminPage';

function LessonGuard({ children }) {
  const { id } = useParams();
  const lessonId = parseInt(id, 10);
  const state = storage.get();

  if (lessonId >= 2 && !state.authComplete) {
    return <Navigate to="/auth-gate" replace />;
  }
  if (lessonId >= 2 && state.authComplete && !state.profileComplete) {
    return <Navigate to="/profile-setup/0" replace />;
  }
  return children;
}

export default function App() {
  useEffect(() => { storage.checkStreak(); }, []);

  const state = storage.get();

  return (
    <Routes>
      <Route path="/" element={
        state.onboardingComplete ? <Navigate to="/home" replace /> : <Navigate to="/onboarding/0" replace />
      } />
      <Route path="/onboarding/:step" element={<Onboarding />} />
      <Route path="/home" element={<Home />} />
      <Route path="/lesson/:id" element={<LessonGuard><LessonIntro /></LessonGuard>} />
      <Route path="/lesson/:id/play" element={<LessonGuard><LessonPlay /></LessonGuard>} />
      <Route path="/lesson/:id/complete" element={<LessonComplete />} />
      <Route path="/auth-gate" element={<AuthGate />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile-setup/:step" element={<ProfileSetup />} />
      <Route path="/astaanta" element={<Astaanta />} />
      <Route path="/progress" element={<PracticeHub />} />
      <Route path="/progress/stats" element={<Progress />} />
      <Route path="/practice/:featureKey" element={<PracticeSession />} />
      <Route path="/about" element={<About />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
