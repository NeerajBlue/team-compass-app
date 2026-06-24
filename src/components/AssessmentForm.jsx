import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';

export default function AssessmentForm({ onCancel }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: '', ability: 3, willingness: 3, remarks: '' });
  const [reportGenerating, setReportGenerating] = useState(false);

  const abilityAnchors = [
    "1 - Lacks foundational skills, frequent errors.",
    "2 - Requires significant hand-holding, below expectations.",
    "3 - Competent, meets standard job requirements.",
    "4 - Highly skilled, works independently with high quality.",
    "5 - Expert, innovates and mentors others."
  ];

  const willingnessAnchors = [
    "1 - Disengaged, negative attitude, resists work.",
    "2 - Does bare minimum, requires constant pushing.",
    "3 - Compliant, generally positive, does what is asked.",
    "4 - Proactive, enthusiastic, takes ownership.",
    "5 - Highly driven, inspires others, consistently volunteers."
  ];

  const generateReport = () => {
    setReportGenerating(true);
    
    // Determine Quadrant based on BW Logic
    const ability = data.ability;
    const willingness = data.willingness;
    let quadrant = "";
    let strategy = "";
    
    if (ability >= 4 && willingness >= 4) { quadrant = "M4: High Performer"; strategy = "Delegate"; }
    else if (ability >= 4 && willingness <= 3) { quadrant = "M3: Potential Performer"; strategy = "Excite"; }
    else if (ability <= 3 && willingness >= 4) { quadrant = "M1: Developing Performer"; strategy = "Guide"; }
    else { quadrant = "M2: Non-Performer"; strategy = "Direct"; }

    // Mock Gemini AI API Call
    setTimeout(() => {
      alert(`[AI Report Generated]\n\nEmployee: ${data.name}\nQuadrant: ${quadrant}\nStrategy: ${strategy}\n\nAI Insight: Based on the remarks, the recommended approach is to ${strategy} by setting specific KRAs tailored to their current gap.`);
      setReportGenerating(false);
      onCancel();
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="p-2 bg-white rounded-full shadow-sm text-bw-navy hover:bg-gray-50 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-bw-navy">New Assessment</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-lg text-bw-navy border-b pb-2">1. Employee Details</h3>
            <div>
              <label className="block text-sm font-semibold mb-1">Employee Name</label>
              <input 
                type="text" 
                value={data.name}
                onChange={e => setData({...data, name: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-bw-gold focus:border-transparent outline-none transition"
                placeholder="e.g. Jane Doe"
              />
            </div>
            <button 
              onClick={() => setStep(2)}
              disabled={!data.name}
              className="w-full bg-bw-navy text-white p-3 rounded-lg font-bold disabled:opacity-50 transition hover:bg-blue-900"
            >
              Next: Score Ability
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className="font-bold text-lg text-bw-navy border-b pb-2">2. Rate Ability (Skill)</h3>
            <p className="text-xs text-gray-500">Measures technical competence, problem-solving, and communication.</p>
            <div className="space-y-3">
              {abilityAnchors.map((anchor, idx) => {
                const score = idx + 1;
                return (
                  <label key={score} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${data.ability === score ? 'border-bw-navy bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input 
                      type="radio" 
                      name="ability" 
                      value={score}
                      checked={data.ability === score}
                      onChange={() => setData({...data, ability: score})}
                      className="mt-1"
                    />
                    <span className="text-sm">{anchor}</span>
                  </label>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-200 transition">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-bw-navy text-white p-3 rounded-lg font-bold hover:bg-blue-900 transition">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className="font-bold text-lg text-bw-navy border-b pb-2">3. Rate Willingness (Will)</h3>
            <p className="text-xs text-gray-500">Measures motivation, accountability, attitude, and drive.</p>
            <div className="space-y-3">
              {willingnessAnchors.map((anchor, idx) => {
                const score = idx + 1;
                return (
                  <label key={score} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${data.willingness === score ? 'border-bw-navy bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input 
                      type="radio" 
                      name="willingness" 
                      value={score}
                      checked={data.willingness === score}
                      onChange={() => setData({...data, willingness: score})}
                      className="mt-1"
                    />
                    <span className="text-sm">{anchor}</span>
                  </label>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-200 transition">Back</button>
              <button onClick={() => setStep(4)} className="flex-1 bg-bw-navy text-white p-3 rounded-lg font-bold hover:bg-blue-900 transition">Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className="font-bold text-lg text-bw-navy border-b pb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-bw-gold" />
              4. AI Coaching Context
            </h3>
            <div>
              <label className="block text-sm font-semibold mb-2">Manager Remarks</label>
              <p className="text-xs text-gray-500 mb-2">Provide specific examples. Gemini AI will analyze these remarks to generate the 3-Month Action Plan and KRAs.</p>
              <textarea 
                rows={4}
                value={data.remarks}
                onChange={e => setData({...data, remarks: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-bw-gold focus:border-transparent outline-none transition"
                placeholder="What is holding them back? Are they taking initiative? Provide behavioral examples..."
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} disabled={reportGenerating} className="flex-1 bg-gray-100 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-200 transition">Back</button>
              <button 
                onClick={generateReport} 
                disabled={reportGenerating}
                className="flex-[2] bg-bw-gold text-bw-navy p-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-yellow-500 transition disabled:opacity-75"
              >
                {reportGenerating ? 'Analyzing...' : <><CheckCircle className="w-5 h-5" /> Generate Action Plan</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
