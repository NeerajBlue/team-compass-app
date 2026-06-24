import React from 'react';
import { Users, ArrowRight } from 'lucide-react';

export default function Dashboard({ onNewAssessment }) {
  // Mock Data based on the Blue Wisdom M1-M4 framework
  const teamStats = {
    m4: { count: 5, label: 'High Performers', desc: 'High Ability, High Willingness', strategy: 'Delegate' },
    m3: { count: 4, label: 'Potential Performers', desc: 'High Ability, Low Willingness', strategy: 'Excite' },
    m1: { count: 3, label: 'Developing Performers', desc: 'Low Ability, High Willingness', strategy: 'Guide' },
    m2: { count: 2, label: 'Non-Performers', desc: 'Low Ability, Low Willingness', strategy: 'Direct' },
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-bw-navy">Team Overview</h2>
        <button 
          onClick={onNewAssessment}
          className="bg-bw-gold text-bw-navy px-4 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2 hover:bg-yellow-500 transition"
        >
          <Users className="w-4 h-4" />
          <span>New</span>
        </button>
      </div>

      {/* 2x2 Matrix Visual */}
      <div className="grid grid-cols-2 gap-4">
        {/* M4: Yellow */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-bw-navy">M4: High Performers</h3>
            <p className="text-xs text-gray-500 mt-1">High Ability & Willingness</p>
            <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded">Strategy: DELEGATE</span>
          </div>
          <div className="mt-4 text-3xl font-bold text-yellow-500">{teamStats.m4.count}</div>
        </div>

        {/* M3: Teal */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-teal-500 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-bw-navy">M3: Potential</h3>
            <p className="text-xs text-gray-500 mt-1">High Ability, Low Willingness</p>
            <span className="inline-block mt-2 px-2 py-1 bg-teal-100 text-teal-800 text-[10px] font-bold rounded">Strategy: EXCITE</span>
          </div>
          <div className="mt-4 text-3xl font-bold text-teal-500">{teamStats.m3.count}</div>
        </div>

        {/* M1: Pink */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-pink-500 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-bw-navy">M1: Developing</h3>
            <p className="text-xs text-gray-500 mt-1">Low Ability, High Willingness</p>
            <span className="inline-block mt-2 px-2 py-1 bg-pink-100 text-pink-800 text-[10px] font-bold rounded">Strategy: GUIDE</span>
          </div>
          <div className="mt-4 text-3xl font-bold text-pink-500">{teamStats.m1.count}</div>
        </div>

        {/* M2: Light Blue */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-400 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-bw-navy">M2: Non-Performers</h3>
            <p className="text-xs text-gray-500 mt-1">Low Ability, Low Willingness</p>
            <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">Strategy: DIRECT</span>
          </div>
          <div className="mt-4 text-3xl font-bold text-blue-400">{teamStats.m2.count}</div>
        </div>
      </div>

      {/* Recent Assessments */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-bw-navy">Recent Assessments</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                  EMP
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Employee Name</h4>
                  <p className="text-xs text-gray-500">Assessed 2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">M4</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
