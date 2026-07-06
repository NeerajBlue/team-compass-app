import React, { useState, useEffect, useRef } from 'react';
import { Users, ArrowRight, Download } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import ReportDocument from './ReportDocument';
import html2pdf from 'html2pdf.js';

export default function Dashboard({ onNewAssessment }) {
  const [teamStats, setTeamStats] = useState({
    m4: { count: 0, label: 'High Performers', desc: 'High Ability, High Willingness', strategy: 'Delegate' },
    m3: { count: 0, label: 'Potential Performers', desc: 'High Ability, Low Willingness', strategy: 'Excite' },
    m1: { count: 0, label: 'Developing Performers', desc: 'Low Ability, High Willingness', strategy: 'Guide' },
    m2: { count: 0, label: 'Non-Performers', desc: 'Low Ability, Low Willingness', strategy: 'Direct' },
  });
  
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const hiddenReportRef = useRef();

  const downloadAssessmentPDF = (assessment) => {
    setSelectedAssessment(assessment);
    setTimeout(() => {
      if (!hiddenReportRef.current) return;
      const opt = {
        margin:       [0, 0, 0, 0],
        filename:     `BW_Performance_Report_${(assessment.employeeName || 'Employee').replace(/ /g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: 'css', before: '.page-break' }
      };
      html2pdf().set(opt).from(hiddenReportRef.current).save().then(() => {
         setSelectedAssessment(null);
      });
    }, 500);
  };

  // Fetch initial batch
  useEffect(() => {
    if (!auth.currentUser) return;
    
    // NOTE: This query requires a Composite Index (managerId ASC, createdAt DESC)
    const q = query(
      collection(db, 'assessments'), 
      where('managerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const assessments = [];
      let m4Count = 0, m3Count = 0, m1Count = 0, m2Count = 0;
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        assessments.push({ id: doc.id, ...data });
        
        if (data.quadrant?.startsWith('M4')) m4Count++;
        else if (data.quadrant?.startsWith('M3')) m3Count++;
        else if (data.quadrant?.startsWith('M1')) m1Count++;
        else if (data.quadrant?.startsWith('M2')) m2Count++;
      });
      
      setTeamStats(prev => ({
        ...prev,
        m4: { ...prev.m4, count: m4Count },
        m3: { ...prev.m3, count: m3Count },
        m1: { ...prev.m1, count: m1Count },
        m2: { ...prev.m2, count: m2Count },
      }));
      
      setRecentAssessments(assessments);
      
      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
      setHasMore(snapshot.docs.length === 10);
    }, (error) => {
      console.error("Dashboard Snapshot Error:", error);
      if (error.message.includes("requires an index")) {
        alert("Firestore Index Required! Please open the browser console, click the red Firebase link, and create the required composite index.");
      }
    });

    return () => unsubscribe();
  }, []);

  const loadMore = async () => {
    if (!lastVisible || !hasMore || !auth.currentUser) return;
    setLoadingMore(true);

    try {
      const { getDocs, startAfter } = await import('firebase/firestore');
      const nextQ = query(
        collection(db, 'assessments'),
        where('managerId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(10)
      );

      const documentSnapshots = await getDocs(nextQ);
      const newAssessments = [];
      
      documentSnapshots.forEach((doc) => {
        newAssessments.push({ id: doc.id, ...doc.data() });
      });

      setRecentAssessments(prev => [...prev, ...newAssessments]);
      
      if (documentSnapshots.docs.length > 0) {
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      }
      setHasMore(documentSnapshots.docs.length === 10);
    } catch (error) {
      console.error("Load More Error:", error);
    }
    setLoadingMore(false);
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
          {recentAssessments.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No assessments found.</div>
          ) : (
            <>
              {recentAssessments.map((assessment) => (
                <div key={assessment.id} className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-bw-navy text-white rounded-full flex items-center justify-center font-bold">
                      {assessment.employeeName ? assessment.employeeName.substring(0, 2).toUpperCase() : 'EM'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{assessment.employeeName || 'Unknown Employee'}</h4>
                      <p className="text-xs text-gray-500">
                        {assessment.date ? `Assessed on ${assessment.date}` : 'Recently Assessed'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      assessment.quadrant?.startsWith('M4') ? 'bg-yellow-100 text-yellow-700' :
                      assessment.quadrant?.startsWith('M3') ? 'bg-teal-100 text-teal-800' :
                      assessment.quadrant?.startsWith('M1') ? 'bg-pink-100 text-pink-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {assessment.quadrant ? assessment.quadrant.split(':')[0] : 'N/A'}
                    </span>
                    <button 
                       onClick={(e) => { e.stopPropagation(); downloadAssessmentPDF(assessment); }}
                       className="p-2 text-bw-navy hover:bg-blue-50 rounded-full transition flex items-center justify-center"
                       title="Download PDF"
                    >
                       <Download className="w-4 h-4" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
              {hasMore && (
                <div className="p-4 border-t border-gray-100 text-center">
                  <button 
                    onClick={loadMore} 
                    disabled={loadingMore}
                    className="text-bw-navy font-bold text-sm hover:underline disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading...' : 'Load More Assessments'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
      
      {/* Hidden Report Container for PDF Generation */}
      {selectedAssessment && (
        <div style={{ display: 'none' }}>
          <ReportDocument 
             ref={hiddenReportRef}
             data={{
                name: selectedAssessment.employeeName || 'Unknown',
                role: selectedAssessment.role || '',
                date: selectedAssessment.date || '',
                ability: selectedAssessment.ability || { jobExpertise: 3, problemSolving: 3, qualityOfWork: 3, collaboration: 3, adaptability: 3, planning: 3 },
                willingness: selectedAssessment.willingness || { proactiveness: 3, commitment: 3, positiveAttitude: 3, opennessToFeedback: 3, engagement: 3, continuousImprovement: 3 }
             }}
             aiReport={selectedAssessment.aiReport}
             quadrant={selectedAssessment.quadrant}
             strategy={selectedAssessment.strategy}
          />
        </div>
      )}
    </div>
  );
}
