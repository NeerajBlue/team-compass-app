import React, { forwardRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Sparkles, BookOpen, Target, AlertTriangle, TrendingUp, Compass, Award, Activity, Zap, Shield, User, Star } from 'lucide-react';

const ReportDocument = forwardRef(({ data, aiReport, quadrant, strategy }, ref) => {
  if (!data || !aiReport || !aiReport.executiveSummary) return null;

  const renderBoldText = (text) => {
    if (typeof text !== 'string') return text;
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold">{part}</strong>;
      }
      return part;
    });
  };

  const abilityData = [
    { subject: 'Job Expertise', A: data.ability.jobExpertise, fullMark: 5 },
    { subject: 'Problem Solving', A: data.ability.problemSolving, fullMark: 5 },
    { subject: 'Quality of Work', A: data.ability.qualityOfWork, fullMark: 5 },
    { subject: 'Collaboration', A: data.ability.collaboration, fullMark: 5 },
    { subject: 'Adaptability', A: data.ability.adaptability, fullMark: 5 },
    { subject: 'Planning', A: data.ability.planning, fullMark: 5 },
  ];

  const willingnessData = [
    { subject: 'Proactiveness', A: data.willingness.proactiveness, fullMark: 5 },
    { subject: 'Commitment', A: data.willingness.commitment, fullMark: 5 },
    { subject: 'Positive Attitude', A: data.willingness.positiveAttitude, fullMark: 5 },
    { subject: 'Feedback Openness', A: data.willingness.opennessToFeedback, fullMark: 5 },
    { subject: 'Engagement', A: data.willingness.engagement, fullMark: 5 },
    { subject: 'Continuous Imp.', A: data.willingness.continuousImprovement, fullMark: 5 },
  ];

  const FrozenHeader = ({ title }) => (
    <div className="frozen-header" style={{ backgroundColor: '#003366', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #f1c40f', flexShrink: 0, width: '100%', boxSizing: 'border-box' }}>
      <img src="/images/1.png" alt="Logo" style={{ maxHeight: '40px', filter: 'brightness(0) invert(1)' }} />
      <div style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '14px', color: 'white', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>{title || 'Performance & Psychometric Profile'}</div>
    </div>
  );

  const FrozenFooter = ({ pageNum }) => (
    <div className="frozen-footer" style={{ flexShrink: 0, marginTop: 'auto', display: 'flex', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ background: '#f1c40f', color: '#003366', padding: '15px 40px', fontWeight: 700, fontFamily: '"Montserrat", sans-serif', fontSize: '12px' }}>BLUE WISDOM</div>
      <div style={{ background: '#003366', color: 'white', padding: '15px 40px', flexGrow: 1, textAlign: 'right', fontSize: '12px', fontFamily: '"Montserrat", sans-serif' }}>www.bluewisdom.in  |  Page {pageNum}</div>
    </div>
  );

  const Page = ({ children, pageNum, isCover }) => (
    <div className="page font-sans">
      {!isCover && <FrozenHeader />}
      <div className="page-content" style={isCover ? { backgroundColor: '#003366', color: 'white', padding: '50px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' } : {}}>
        {children}
      </div>
      {!isCover && <FrozenFooter pageNum={pageNum} />}
    </div>
  );

  return (
    <div ref={ref} className="pdf-container bg-gray-200">
      
      {/* PAGE 1: COVER PAGE */}
      <Page isCover={true} pageNum={1}>
         <div className="flex-1 flex flex-col items-center justify-center text-center relative border-4 border-bw-gold p-10 rounded-2xl">
            <img src="/images/1.png" alt="Blue Wisdom" className="w-48 mb-8 filter brightness-0 invert" />
            <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-2 font-['Montserrat']">Executive Profile</h1>
            <h2 className="text-xl font-bold text-bw-gold tracking-widest uppercase mb-12">Performance & Psychometric Analysis</h2>
            
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 w-full max-w-lg mb-10 shadow-2xl">
               <User className="w-16 h-16 text-bw-gold mx-auto mb-4" />
               <h3 className="text-3xl font-black uppercase text-white mb-1">{data.name}</h3>
               <div className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-6 border-b border-white/20 pb-4">{data.role}</div>
               
               <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-bw-navy/50 p-4 rounded-lg border border-bw-navy">
                     <div className="text-[10px] uppercase tracking-widest text-bw-gold font-bold mb-1">Matrix Quadrant</div>
                     <div className="text-lg font-black text-white leading-tight">{quadrant}</div>
                  </div>
                  <div className="bg-bw-navy/50 p-4 rounded-lg border border-bw-navy">
                     <div className="text-[10px] uppercase tracking-widest text-bw-gold font-bold mb-1">Intervention Focus</div>
                     <div className="text-lg font-black text-bw-gold leading-tight">{strategy}</div>
                  </div>
               </div>
            </div>

            <div className="text-sm text-gray-300 font-medium italic max-w-xl mx-auto mb-10 leading-relaxed border-l-4 border-bw-gold pl-4 text-left">
               "{aiReport.executiveSummary.overview}"
            </div>

            <div className="mt-auto pt-8 border-t border-white/20 w-full flex justify-between items-center">
               <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Prepared For Internal Review</div>
               <div className="text-xs font-bold text-bw-gold uppercase tracking-widest">Date: {data.date}</div>
            </div>
         </div>
      </Page>

      {/* PAGE 2: BEHAVIORAL & DRIVERS */}
      <Page pageNum={2}>
         <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-100">
            <Activity className="w-5 h-5 text-bw-navy" />
            <h3 className="text-lg font-black text-bw-navy uppercase tracking-wide font-['Montserrat']">Executive Drivers & Risks</h3>
         </div>

         <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border-l-4 border-bw-navy p-4 rounded-r-xl shadow-sm">
               <h4 className="font-bold text-bw-navy text-[11px] uppercase tracking-wide mb-2 flex items-center gap-2"><Zap className="w-3 h-3 text-bw-gold"/> Key Drivers</h4>
               <ul className="space-y-2">
                 {aiReport.executiveSummary.keyDrivers.map((point, i) => (
                    <li key={i} className="text-[12px] text-gray-800 font-medium leading-tight">{point}</li>
                 ))}
               </ul>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
               <h4 className="font-bold text-red-800 text-[11px] uppercase tracking-wide mb-2 flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-red-500"/> Critical Risks</h4>
               <ul className="space-y-2">
                 {aiReport.executiveSummary.criticalRisks.map((point, i) => (
                    <li key={i} className="text-[12px] text-red-900 font-medium leading-tight">{point}</li>
                 ))}
               </ul>
            </div>
         </div>

         <div className="bg-white border-2 border-gray-100 rounded-xl p-5 shadow-sm relative overflow-hidden flex-1">
             <div className="absolute top-0 right-0 w-2 h-full bg-bw-gold" />
             <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100">
                 <Shield className="w-5 h-5 text-bw-navy" />
                 <h3 className="text-md font-black text-bw-navy uppercase tracking-wide font-['Montserrat']">Behavioral & Motivation Analysis</h3>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                   <div>
                       <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Dominant Traits</h4>
                       <div className="flex flex-wrap gap-1.5">
                          {aiReport.quadrantAnalysis.traits.map((trait, i) => (
                             <span key={i} className="bg-gray-100 border border-gray-200 px-2 py-1 rounded text-[11px] font-bold text-bw-navy">{trait}</span>
                          ))}
                       </div>
                   </div>

                   <div>
                       <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Motivation Engine</h4>
                       <p className="text-[12px] text-gray-800 font-semibold bg-gray-50 p-2 border-l-2 border-bw-navy rounded-r">{aiReport.quadrantAnalysis.motivationStyle}</p>
                   </div>
                   
                   <div>
                       <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Behavior Under Pressure</h4>
                       <p className="text-[12px] text-gray-800 font-semibold bg-red-50 p-2 border-l-2 border-red-400 rounded-r">{aiReport.quadrantAnalysis.behaviorUnderPressure}</p>
                   </div>
                </div>
                
                <div>
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Strategy Justification: {strategy}</h4>
                   <ul className="space-y-2">
                     {aiReport.quadrantAnalysis.strategyJustification.map((just, i) => (
                        <li key={i} className="text-[12px] text-gray-700 font-medium flex items-start gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                           <div className="w-1.5 h-1.5 bg-bw-gold rounded-full mt-1 flex-shrink-0" />
                           <span className="leading-tight">{renderBoldText(just)}</span>
                        </li>
                     ))}
                   </ul>
                </div>
             </div>
         </div>
      </Page>

      {/* PAGE 3: PERFORMANCE METRICS */}
      <Page pageNum={3}>
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-100">
           <Target className="w-5 h-5 text-bw-navy" />
           <h3 className="text-lg font-black text-bw-navy uppercase tracking-wide font-['Montserrat']">Performance Metric Profiling</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
           <div className="bg-white border-2 border-gray-100 rounded-xl shadow-sm p-3 flex flex-col items-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-bw-navy rounded-t-xl" />
              <h4 className="text-[11px] font-black text-bw-navy uppercase tracking-wide mb-1">Ability (Competence)</h4>
              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={abilityData}>
                    <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#0f3460', fontSize: 9, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 8, fill: '#9ca3af' }} />
                    <Radar name="Ability" dataKey="A" stroke="#0f3460" strokeWidth={2} fill="#0f3460" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white border-2 border-gray-100 rounded-xl shadow-sm p-3 flex flex-col items-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-bw-gold rounded-t-xl" />
              <h4 className="text-[11px] font-black text-bw-navy uppercase tracking-wide mb-1">Willingness (Commitment)</h4>
              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={willingnessData}>
                    <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#0f3460', fontSize: 9, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 8, fill: '#9ca3af' }} />
                    <Radar name="Willingness" dataKey="A" stroke="#e2b04a" strokeWidth={2} fill="#e2b04a" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="bg-bw-navy text-white rounded-lg p-3 mb-4 shadow-sm flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-bw-gold">Methodology:</span>
            <span className="text-[10px] text-gray-200">Ratings on a 1-5 scale. Spikes indicate core strengths, depressions highlight vulnerabilities.</span>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-full">
               <h4 className="font-black text-bw-navy uppercase mb-3 text-[11px] tracking-widest border-b border-gray-300 pb-1">Cognitive Superpowers</h4>
               <ul className="space-y-2">
                 {aiReport.competencyDevelopment.superPowers.map((s, i) => (
                    <li key={i} className="text-[12px] text-gray-800 font-medium leading-tight">{renderBoldText(s)}</li>
                 ))}
               </ul>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-full">
               <h4 className="font-black text-bw-navy uppercase mb-3 text-[11px] tracking-widest border-b border-gray-300 pb-1">Cognitive Blindspots</h4>
               <ul className="space-y-2">
                 {aiReport.competencyDevelopment.blindSpots.map((b, i) => (
                    <li key={i} className="text-[12px] text-gray-800 font-medium leading-tight">{renderBoldText(b)}</li>
                 ))}
               </ul>
             </div>
        </div>
      </Page>

      {/* PAGE 4: TACTICAL EXECUTION */}
      <Page pageNum={4}>
         <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-100">
           <TrendingUp className="w-5 h-5 text-bw-navy" />
           <h3 className="text-lg font-black text-bw-navy uppercase tracking-wide font-['Montserrat']">KRA Tactical Execution</h3>
         </div>

         <div className="flex flex-col gap-4 flex-1">
           {aiReport.kraPlans.slice(0, 3).map((kra, index) => (
             <div key={index} className="border-2 border-gray-100 rounded-xl overflow-hidden shadow-sm relative bg-white flex-1 flex flex-col">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-bw-navy" />
               <div className="p-4 pl-6 flex-1 flex flex-col">
                 
                 <div className="flex justify-between items-center mb-2">
                    <div>
                       <div className="text-[9px] font-black uppercase tracking-widest text-bw-gold leading-none mb-1">Key Result Area {index + 1}</div>
                       <h4 className="text-[14px] font-bold text-bw-navy leading-tight">{kra.title}</h4>
                    </div>
                    <div className="bg-blue-50 text-blue-900 px-2 py-1 rounded text-[10px] font-bold border border-blue-100 max-w-[40%] text-right truncate">
                       Impact: {kra.impact}
                    </div>
                 </div>
                 
                 <div className="flex-1">
                   <strong className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Tactical Action Steps</strong>
                   <ul className="space-y-1.5">
                     {kra.actionSteps.map((step, i) => (
                       <li key={i} className="text-[11px] font-medium text-gray-700 bg-gray-50 p-2 rounded-md border border-gray-100 leading-tight">{renderBoldText(step)}</li>
                     ))}
                   </ul>
                 </div>

                 <div className="grid grid-cols-2 gap-3 mt-3 bg-gray-50 border border-gray-200 p-2 rounded-lg">
                    <div>
                      <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Lead Indicator (Daily/Weekly)</div>
                      <div className="text-[11px] font-bold text-bw-navy leading-tight truncate">{kra.leadIndicator}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Lag Indicator (Monthly/Qtr)</div>
                      <div className="text-[11px] font-bold text-bw-gold leading-tight truncate">{kra.lagIndicator}</div>
                    </div>
                 </div>
               </div>
             </div>
           ))}
         </div>
      </Page>

      {/* PAGE 5: MANAGER BLUEPRINT */}
      <Page pageNum={5}>
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-100">
           <BookOpen className="w-5 h-5 text-bw-navy" />
           <h3 className="text-lg font-black text-bw-navy uppercase tracking-wide font-['Montserrat']">Manager Intervention Blueprint</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
           <div className="bg-bw-navy text-white rounded-xl p-5 shadow-md relative overflow-hidden h-full">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-bl-full" />
               <h4 className="text-[12px] font-black text-bw-gold mb-3 uppercase tracking-wide flex items-center gap-2"><Star className="w-3 h-3"/> Coaching Tactics</h4>
               <ul className="space-y-2.5">
                 {aiReport.competencyDevelopment.coachingTactics.map((tactic, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                       <div className="mt-1 w-1.5 h-1.5 bg-bw-gold rounded-full flex-shrink-0" />
                       <span className="text-[12px] text-gray-100 font-medium leading-tight">{renderBoldText(tactic)}</span>
                    </li>
                 ))}
               </ul>
           </div>

           <div className="flex flex-col gap-4 h-full">
              <div className="bg-white border-2 border-gray-100 rounded-xl p-4 shadow-sm">
                 <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Engagement Level</h4>
                    <div className="text-[12px] font-bold text-bw-navy bg-blue-50 px-2 py-0.5 rounded">{aiReport.willingnessAndMindset.engagementLevel}</div>
                 </div>
                 <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Flight Risk</h4>
                    <div className="text-[12px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">{aiReport.willingnessAndMindset.retentionRisk}</div>
                 </div>
              </div>
              
              <div className="bg-white border-2 border-gray-100 rounded-xl p-4 shadow-sm flex-1">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Urgent Interventions</h4>
                 <ul className="space-y-2">
                    {aiReport.willingnessAndMindset.managerInterventions.map((inv, idx) => (
                       <li key={idx} className="text-[12px] font-medium text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 leading-tight">{renderBoldText(inv)}</li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>

        <div className="bg-white border-2 border-gray-100 p-4 rounded-xl shadow-sm mb-4">
           <h4 className="text-[12px] font-black text-bw-navy mb-3 uppercase tracking-wide">3-Week Manager Checklist</h4>
           <div className="grid grid-cols-3 gap-3">
              {aiReport.managerActionItems.slice(0, 3).map((item, idx) => (
                 <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="text-[9px] font-black uppercase text-bw-gold tracking-widest mb-1.5 bg-white inline-block px-1.5 py-0.5 rounded border border-gray-100">Week {idx + 1}</div>
                    <div className="text-[11px] text-gray-800 font-semibold leading-tight">{renderBoldText(item)}</div>
                 </div>
              ))}
           </div>
        </div>

        <div className="bg-white border-2 border-gray-100 p-4 rounded-xl shadow-sm flex-1">
           <h4 className="text-[12px] font-black text-bw-navy mb-3 uppercase tracking-wide">Recommended Resources</h4>
           <div className="grid grid-cols-2 gap-3">
              {aiReport.recommendedResources.map((res, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 p-2 rounded-lg flex gap-2 items-center">
                   <div className="text-lg opacity-80">{res.type.split(' ')[0]}</div>
                   <div>
                      <div className="font-black text-bw-navy text-[11px] leading-tight">{res.title}</div>
                      <div className="text-[9px] text-gray-500 font-medium leading-tight mt-0.5">{res.reason}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </Page>

      {/* PAGE 6: VISUALS & DISCLAIMER */}
      <Page pageNum={6}>
        <div className="mb-6 text-center">
          <h3 className="text-xl font-black text-bw-navy uppercase tracking-widest mb-1 font-['Montserrat']">Team Compass Blueprint</h3>
          <p className="text-[11px] text-gray-500 font-medium">Visual strategies for continuous development and team growth.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 flex-1 items-center">
           <img src="/images/od-assessment/spark_poster_1782008819550.png" alt="Spark Poster" className="rounded-lg shadow-sm w-full object-cover max-h-48" />
           <img src="/images/od-assessment/momentum_poster_1782008845231.png" alt="Momentum Poster" className="rounded-lg shadow-sm w-full object-cover max-h-48" />
           <img src="/images/od-assessment/forge_poster_1782008833028.png" alt="Forge Poster" className="rounded-lg shadow-sm w-full object-cover max-h-48" />
           <img src="/images/od-assessment/journey_poster_1782008870447.png" alt="Journey Poster" className="rounded-lg shadow-sm w-full object-cover max-h-48" />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6 text-[9px] text-gray-500 text-justify leading-relaxed">
           <strong>CONFIDENTIALITY NOTICE & DISCLAIMER:</strong> This document and the psychometric analysis contained herein are strictly confidential and intended solely for the authorized reporting manager and human resources personnel. The insights provided by the Blue Wisdom™ Assessment platform are generated through algorithmic analysis based on inputted performance metrics. While intended to provide actionable developmental guidance, this report does not constitute definitive psychological evaluation or absolute guarantees of future performance. Management decisions regarding compensation, termination, or formal disciplinary action should incorporate this analysis only as one of several data points, alongside formal performance reviews, documented feedback, and company policy guidelines. Distribution, reproduction, or unauthorized sharing of this document is strictly prohibited.
        </div>
        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-gray-400 text-[9px] font-bold uppercase tracking-widest">
           <div>Generated by Blue Wisdom OS</div>
           <div>Confidential & Proprietary</div>
        </div>
      </Page>

    </div>
  );
});

export default ReportDocument;
