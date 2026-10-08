import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Terms from './pages/Terms';
import Signup from './pages/Signup';
import AdminApprovals from './pages/AdminApprovals';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminApprovals />} />
      </Routes>
    </BrowserRouter>
  );
}