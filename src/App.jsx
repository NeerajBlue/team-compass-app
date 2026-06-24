import React, { useState } from 'react';
import { Compass, LayoutDashboard, PlusCircle, LogOut } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AssessmentForm from './components/AssessmentForm';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error("Failed to log out");
    }
  }

  return (
    <div className="min-h-screen bg-bw-light flex flex-col font-sans">
      <header className="bg-bw-navy text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Compass className="text-bw-gold w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">Team Compass</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-300 hidden md:inline">{currentUser?.email}</span>
            <button onClick={handleLogout} className="text-gray-300 hover:text-white transition" title="Log Out">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 max-w-4xl mx-auto w-full">
        {activeTab === 'dashboard' ? (
          <Dashboard onNewAssessment={() => setActiveTab('assessment')} />
        ) : (
          <AssessmentForm onCancel={() => setActiveTab('dashboard')} />
        )}
      </main>

      <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full z-10 pb-safe">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center p-3 flex-1 ${activeTab === 'dashboard' ? 'text-bw-navy border-t-2 border-bw-navy' : 'text-gray-400'}`}
          >
            <LayoutDashboard className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('assessment')}
            className={`flex flex-col items-center p-3 flex-1 ${activeTab === 'assessment' ? 'text-bw-navy border-t-2 border-bw-navy' : 'text-gray-400'}`}
          >
            <PlusCircle className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold">Assess</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
