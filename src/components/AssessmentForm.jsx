import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Sparkles, ChevronRight, ChevronLeft, Download, Mail } from 'lucide-react';
import { generateActionPlan } from '../api/gemini';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import ReportDocument from './ReportDocument';
import html2pdf from 'html2pdf.js';
import emailjs from '@emailjs/browser';

export default function AssessmentForm({ onCancel }) {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('bw_assessment_step');
    return saved ? JSON.parse(saved) : 1;
  });
  const [reportGenerating, setReportGenerating] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [quadrantState, setQuadrantState] = useState('');
  const [strategyState, setStrategyState] = useState('');
  const reportRef = useRef();

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('bw_assessment_data');
    if (saved) return JSON.parse(saved);
    return {
      name: '',
      department: '',
      organization: '',
      location: '',
      role: '',
      reportingManager: '',
      hod: '',
      assessorEmail: '',
      date: new Date().toISOString().split('T')[0],
      kra1: '',
      kra2: '',
      kra3: '',
      overallPerformance: 'Average',
      ability: {
        jobExpertise: 3,
        problemSolving: 3,
        qualityOfWork: 3,
        collaboration: 3,
        adaptability: 3,
        planning: 3
      },
      willingness: {
        proactiveness: 3,
        commitment: 3,
        positiveAttitude: 3,
        opennessToFeedback: 3,
        engagement: 3,
        continuousImprovement: 3
      },
      remarks: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('bw_assessment_step', JSON.stringify(step));
  }, [step]);

  useEffect(() => {
    localStorage.setItem('bw_assessment_data', JSON.stringify(data));
  }, [data]);

  const overallPerformanceOptions = ["Poor", "Below average", "Average", "Above average", "Excellent"];

  const abilityMetrics = [
    { key: 'jobExpertise', label: 'Job-Specific Expertise' },
    { key: 'problemSolving', label: 'Problem-Solving & Strategy' },
    { key: 'qualityOfWork', label: 'Quality of Work' },
    { key: 'collaboration', label: 'Collaboration & Interpersonal' },
    { key: 'adaptability', label: 'Adaptability & Learning' },
    { key: 'planning', label: 'Planning & Execution' }
  ];

  const willingnessMetrics = [
    { key: 'proactiveness', label: 'Proactiveness & Initiative' },
    { key: 'commitment', label: 'Commitment & Accountability' },
    { key: 'positiveAttitude', label: 'Positive Attitude' },
    { key: 'opennessToFeedback', label: 'Openness to Feedback' },
    { key: 'engagement', label: 'Engagement & Contribution' },
    { key: 'continuousImprovement', label: 'Drive for Improvement' }
  ];

  const updateAbility = (key, value) => setData(prev => ({ ...prev, ability: { ...prev.ability, [key]: Number(value) } }));
  const updateWillingness = (key, value) => setData(prev => ({ ...prev, willingness: { ...prev.willingness, [key]: Number(value) } }));

  const generateReport = async () => {
    setReportGenerating(true);
    setAiReport(null);
    
    // Calculate Averages
    const abilityScores = Object.values(data.ability);
    const avgAbility = abilityScores.reduce((a, b) => a + b, 0) / abilityScores.length;
    
    const willingnessScores = Object.values(data.willingness);
    const avgWillingness = willingnessScores.reduce((a, b) => a + b, 0) / willingnessScores.length;

    // Determine Quadrant
    let quadrant = "";
    let strategy = "";
    
    if (avgAbility >= 4 && avgWillingness >= 4) { quadrant = "M4: High Performer"; strategy = "Delegate"; }
    else if (avgAbility >= 4 && avgWillingness <= 3) { quadrant = "M3: Potential Performer"; strategy = "Excite"; }
    else if (avgAbility <= 3 && avgWillingness >= 4) { quadrant = "M1: Developing Performer"; strategy = "Guide"; }
    else { quadrant = "M2: Non-Performer"; strategy = "Direct"; }

    setQuadrantState(quadrant);
    setStrategyState(strategy);

    try {
      const reportJSON = await generateActionPlan(data, quadrant, strategy);
      setAiReport(reportJSON);
      
      // Save to Firestore
      if (auth.currentUser) {
        await addDoc(collection(db, 'assessments'), {
          managerId: auth.currentUser.uid,
          companyName: auth.currentUser.companyName || 'Unknown Company',
          employeeName: data.name,
          assessorEmail: data.assessorEmail,
          department: data.department,
          role: data.role,
          date: data.date,
          overallPerformance: data.overallPerformance,
          abilityScore: avgAbility,
          willingnessScore: avgWillingness,
          quadrant,
          strategy,
          remarks: data.remarks,
          aiReport: reportJSON, // Save the raw JSON
          createdAt: serverTimestamp()
        });
      }

      // Clear local cache upon successful generation
      localStorage.removeItem('bw_assessment_step');
      localStorage.removeItem('bw_assessment_data');
      
    } catch (error) {
      alert("Error generating report: " + error.message);
    }
    
    setReportGenerating(false);
  };

  const downloadPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin:       [0, 0, 0, 0],
      filename:     `BW_Performance_Report_${data.name.replace(/ /g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: 'css', before: '.page-break' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const sendEmail = async () => {
    setEmailSending(true);
    try {
      const getTemplateParams = (recipientEmail) => ({
        to_email: recipientEmail,
        employee_name: data.name,
        assessor_email: data.assessorEmail,
        quadrant: quadrantState,
        strategy: strategyState,
        executive_summary: aiReport?.executiveSummary?.overview || "Profile generated successfully."
      });

      // We send one email to the reporting manager, and one to neerajnis@gmail.com
      const recipients = [];
      if (data.reportingManager) recipients.push(data.reportingManager);
      recipients.push("neerajnis@gmail.com");

      const emailPromises = recipients.map(recipient => 
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          getTemplateParams(recipient),
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
      );

      await Promise.all(emailPromises);
      
      alert("Executive Summary sent successfully!");
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to send email. Please check EmailJS configuration.");
    }
    setEmailSending(false);
  };

  const renderMetricSliders = (metrics, categoryData, updateFn) => {
    return metrics.map(metric => (
      <div key={metric.key} className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <label className="block text-sm font-semibold mb-2">{metric.label}</label>
        <div className="flex gap-2 justify-between">
          {[1, 2, 3, 4, 5].map(score => (
            <label key={score} className={`flex-1 flex flex-col items-center justify-center p-2 rounded border cursor-pointer transition ${categoryData[metric.key] === score ? 'border-bw-navy bg-blue-100 text-bw-navy font-bold' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
              <input 
                type="radio" 
                name={metric.key} 
                value={score}
                checked={categoryData[metric.key] === score}
                onChange={() => updateFn(metric.key, score)}
                className="hidden"
              />
              <span className="text-lg">{score}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
          <span>Needs Improvement</span>
          <span>Outstanding</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6 pb-20">
      {!aiReport && (
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="p-2 bg-white rounded-full shadow-sm text-bw-navy hover:bg-gray-50 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-bw-navy">New Assessment</h2>
      </div>
      )}

      <div className={`bg-white rounded-xl shadow-sm space-y-6 ${aiReport ? 'p-0 bg-transparent shadow-none' : 'p-6'}`}>
        
        {/* Step Progress Bar */}
        {!aiReport && (
          <div className="flex items-center justify-between mb-8 relative">
             <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2"></div>
             <div className="absolute top-1/2 left-0 h-1 bg-bw-navy -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${(step-1)*25}%` }}></div>
             {[1,2,3,4,5].map(s => (
               <div key={s} className="flex flex-col items-center">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= s ? 'bg-bw-navy text-white' : 'bg-gray-200 text-gray-500'}`}>
                   {s}
                 </div>
               </div>
             ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-lg text-bw-navy border-b pb-2">1. Employee Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Assessee Name</label>
                <input type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bw-gold" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Assessor Email <span className="text-red-500">*</span></label>
                <input type="email" value={data.assessorEmail} onChange={e => setData({...data, assessorEmail: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bw-gold" placeholder="Report will be sent here" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Role/Designation</label>
                <input type="text" value={data.role} onChange={e => setData({...data, role: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bw-gold" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Department</label>
                <input type="text" value={data.department} onChange={e => setData({...data, department: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bw-gold" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Organization</label>
                <input type="text" value={data.organization} onChange={e => setData({...data, organization: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bw-gold" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Location</label>
                <input type="text" value={data.location} onChange={e => setData({...data, location: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bw-gold" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Reporting Manager</label>
                <input type="text" value={data.reportingManager} onChange={e => setData({...data, reportingManager: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bw-gold" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Date</label>
                <input type="date" value={data.date} onChange={e => setData({...data, date: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bw-gold" />
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!data.name || !data.assessorEmail} className="w-full mt-4 bg-bw-navy text-white p-3 rounded-lg font-bold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-blue-900 transition">
              Next Step <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="font-bold text-lg text-bw-navy border-b pb-2">2. Performance Context</h3>
            <p className="text-sm text-gray-500">Mention top 3 Key Result Areas (KRAs) and their overall standard.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">KRA 1</label>
                <input type="text" value={data.kra1} onChange={e => setData({...data, kra1: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bw-gold" placeholder="e.g. Increase sales by 15%" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">KRA 2</label>
                <input type="text" value={data.kra2} onChange={e => setData({...data, kra2: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bw-gold" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">KRA 3</label>
                <input type="text" value={data.kra3} onChange={e => setData({...data, kra3: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bw-gold" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Overall Performance</label>
                <select value={data.overallPerformance} onChange={e => setData({...data, overallPerformance: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bw-gold bg-white">
                  {overallPerformanceOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-200 flex items-center justify-center gap-2"><ChevronLeft className="w-5 h-5" /> Back</button>
              <button onClick={() => setStep(3)} className="flex-[2] bg-bw-navy text-white p-3 rounded-lg font-bold hover:bg-blue-900 flex items-center justify-center gap-2">Next Step <ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="font-bold text-lg text-bw-navy border-b pb-2">3. Ability (Competence)</h3>
            <p className="text-sm text-gray-500 mb-4">Rate the employee's technical skills and execution on a scale of 1-5.</p>
            {renderMetricSliders(abilityMetrics, data.ability, updateAbility)}
            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-200 flex items-center justify-center gap-2"><ChevronLeft className="w-5 h-5" /> Back</button>
              <button onClick={() => setStep(4)} className="flex-[2] bg-bw-navy text-white p-3 rounded-lg font-bold hover:bg-blue-900 flex items-center justify-center gap-2">Next Step <ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="font-bold text-lg text-bw-navy border-b pb-2">4. Willingness (Commitment)</h3>
            <p className="text-sm text-gray-500 mb-4">Rate the employee's motivation, attitude, and drive on a scale of 1-5.</p>
            {renderMetricSliders(willingnessMetrics, data.willingness, updateWillingness)}
            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(3)} className="flex-1 bg-gray-100 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-200 flex items-center justify-center gap-2"><ChevronLeft className="w-5 h-5" /> Back</button>
              <button onClick={() => setStep(5)} className="flex-[2] bg-bw-navy text-white p-3 rounded-lg font-bold hover:bg-blue-900 flex items-center justify-center gap-2">Next Step <ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        )}

        {step === 5 && !aiReport && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className="font-bold text-lg text-bw-navy border-b pb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-bw-gold" />
              5. Final Remarks & Generation
            </h3>
            <div>
              <label className="block text-sm font-semibold mb-2">Manager Remarks</label>
              <textarea 
                rows={4}
                value={data.remarks}
                onChange={e => setData({...data, remarks: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-bw-gold outline-none"
                placeholder="Achievements, specific challenges, attitude examples..."
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4 text-sm text-bw-navy">
               <strong>Ready for Profiling:</strong> The system will process this data into a comprehensive Psychometric Action Plan.
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(4)} disabled={reportGenerating} className="flex-1 bg-gray-100 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-200 flex items-center justify-center gap-2"><ChevronLeft className="w-5 h-5" /> Back</button>
              <button 
                onClick={generateReport} 
                disabled={reportGenerating}
                className="flex-[2] bg-bw-gold text-bw-navy p-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-yellow-500 transition disabled:opacity-75"
              >
                {reportGenerating ? 'Compiling Profile via AI...' : <><CheckCircle className="w-5 h-5" /> Generate Profile</>}
              </button>
            </div>
          </div>
        )}

        {aiReport && (
          <div className="space-y-6 animate-in fade-in zoom-in-95">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                   <h2 className="text-xl font-black text-bw-navy">Profiling Complete!</h2>
                   <p className="text-sm text-gray-500 font-medium">The comprehensive Blue Wisdom Psychometric Action Plan has been generated.</p>
                </div>
                <div className="flex gap-3">
                   <button onClick={downloadPDF} className="bg-bw-navy text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900 transition">
                      <Download className="w-5 h-5" /> Download PDF
                   </button>
                   <button 
                     onClick={sendEmail} 
                     disabled={emailSending}
                     className="bg-bw-gold text-bw-navy px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-500 transition disabled:opacity-70"
                   >
                      <Mail className="w-5 h-5" /> {emailSending ? 'Sending...' : 'Email to Assessor'}
                   </button>
                </div>
             </div>

             {/* The beautiful visual report component */}
             <div className="overflow-x-auto shadow-2xl rounded-lg border border-gray-200">
                <ReportDocument ref={reportRef} data={data} aiReport={aiReport} quadrant={quadrantState} strategy={strategyState} />
             </div>

             <button onClick={onCancel} className="w-full bg-gray-100 text-gray-700 p-4 rounded-lg font-bold hover:bg-gray-200 transition">
                Return to Dashboard
             </button>
          </div>
        )}

      </div>
    </div>
  );
}
