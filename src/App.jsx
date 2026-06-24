import React, { useState } from 'react';
import { Compass, LayoutDashboard, PlusCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AssessmentForm from './components/AssessmentForm';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-bw-light flex flex-col font-sans">
      {/* Header */}
      <header className="bg-bw-navy text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Compass className="text-bw-gold w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">Team Compass</h1>
          </div>
          <div className="w-8 h-8 bg-bw-gold rounded-full flex justify-center items-center font-bold text-bw-navy">
            BW
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 max-w-4xl mx-auto w-full">
        {activeTab === 'dashboard' ? (
          <Dashboard onNewAssessment={() => setActiveTab('assessment')} />
        ) : (
          <AssessmentForm onCancel={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* Mobile Bottom Nav */}
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

export default App;
