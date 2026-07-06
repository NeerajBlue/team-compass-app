import React, { forwardRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Sparkles, BookOpen, Target, AlertTriangle, TrendingUp, Compass, Award, Activity, Zap, Shield, User, Star } from 'lucide-react';

const ReportDocument = forwardRef(({ data, aiReport, quadrant, strategy }, ref) => {
  if (!data || !aiReport || !aiReport.executiveSummary) return null;

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

  const PageHeader = () => (
    <div className="flex justify-between items-center border-b-[3px] border-bw-gold pb-4 mb-8">
      <div className="flex items-center gap-3">
         <img src="/images/od-assessment/media__1782068252944.png" alt="Blue Wisdom Logo" className="w-12 h-12 object-contain" />
         <div>
            <h1 className="text-2xl font-black text-bw-navy tracking-tight uppercase leading-none">Blue Wisdom</h1>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-bw-gold mt-1">Transforming Intellectually</div>
         </div>
      </div>
      <div className="text-right">
         <div className="text-sm font-black tracking-widest text-gray-500 uppercase">Performance & Psychometric Profile</div>
         <div className="text-xs font-semibold text-gray-400 mt-1 uppercase">Date of Issue: {data.date}</div>
      </div>
    </div>
  );

  const Page = ({ children }) => (
    <div className="page-break bg-white p-10 mx-auto relative shadow-2xl overflow-hidden" style={{ width: '210mm', boxSizing: 'border-box' }}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-bw-navy opacity-[0.03] rounded-bl-full pointer-events-none -z-10" />
      <PageHeader />
      {children}
    </div>
  );

  return (
    <div ref={ref} className="pdf-container bg-gray-200 text-gray-800 font-sans">
      
      {/* PAGE 1: Executive Profile */}
      <Page>
         <div className="flex gap-8 mb-12">
            <div className="w-1/3 bg-bw-navy text-white rounded-2xl p-8 shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-bw-gold" />
               <User className="w-16 h-16 text-bw-gold mb-4" opacity={0.8} />
               <h2 className="text-2xl font-black uppercase mb-1">{data.name}</h2>
               <div className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-6">{data.role}</div>
               
               <div className="w-full bg-white/10 rounded-lg p-4 mb-4 backdrop-blur-sm border border-white/20">
                  <div className="text-[10px] uppercase tracking-widest text-bw-gold font-bold mb-1">Matrix Quadrant</div>
                  <div className="text-xl font-black">{quadrant}</div>
               </div>
               
               <div className="w-full bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                  <div className="text-[10px] uppercase tracking-widest text-bw-gold font-bold mb-1">Intervention Focus</div>
                  <div className="text-xl font-black text-bw-gold">{strategy}</div>
               </div>
            </div>

            <div className="w-2/3 flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 text-bw-navy" />
                  <h3 className="text-2xl font-black text-bw-navy uppercase tracking-wide">Executive Profile</h3>
               </div>
               <p className="text-gray-700 text-lg leading-relaxed font-medium mb-6 italic border-l-4 border-bw-gold pl-4">
                 "{aiReport.executiveSummary.overview}"
               </p>

               <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                    <h4 className="font-bold text-bw-navy text-sm uppercase tracking-wide mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-bw-gold"/> Key Drivers</h4>
                    <ul className="space-y-3">
                      {aiReport.executiveSummary.keyDrivers.map((point, i) => (
                         <li key={i} className="text-sm text-gray-700 font-medium leading-tight">{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-100 p-5 rounded-xl">
                    <h4 className="font-bold text-red-800 text-sm uppercase tracking-wide mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500"/> Critical Risks</h4>
                    <ul className="space-y-3">
                      {aiReport.executiveSummary.criticalRisks.map((point, i) => (
                         <li key={i} className="text-sm text-red-900 font-medium leading-tight">{point}</li>
                      ))}
                    </ul>
                  </div>
               </div>
            </div>
         </div>

         {/* Behavioral & Motivation Style */}
         <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mt-4 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-2 h-full bg-bw-navy" />
             <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
                 <Shield className="w-6 h-6 text-bw-navy" />
                 <h3 className="text-xl font-black text-bw-navy uppercase tracking-wide">Behavioral & Motivation Analysis</h3>
             </div>
             
             <div className="grid grid-cols-2 gap-8">
                <div>
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Dominant Traits</h4>
                   <div className="flex flex-wrap gap-2 mb-6">
                      {aiReport.quadrantAnalysis.traits.map((trait, i) => (
                         <span key={i} className="bg-white border border-gray-200 px-3 py-1.5 rounded-md text-sm font-bold text-bw-navy shadow-sm">{trait}</span>
                      ))}
                   </div>

                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Motivation Engine</h4>
                   <p className="text-sm text-gray-800 font-semibold bg-white p-3 border-l-2 border-bw-gold rounded-r-md">{aiReport.quadrantAnalysis.motivationStyle}</p>
                </div>
                
                <div>
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Behavior Under Pressure</h4>
                   <p className="text-sm text-gray-800 font-semibold bg-white p-3 border-l-2 border-red-400 rounded-r-md mb-6">{aiReport.quadrantAnalysis.behaviorUnderPressure}</p>

                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Strategy Justification ({strategy})</h4>
                   <ul className="space-y-2">
                     {aiReport.quadrantAnalysis.strategyJustification.map((just, i) => (
                        <li key={i} className="text-sm text-gray-700 font-medium flex items-start gap-2">
                           <div className="w-1.5 h-1.5 bg-bw-gold rounded-full mt-1.5 flex-shrink-0" />
                           {just}
                        </li>
                     ))}
                   </ul>
                </div>
             </div>
         </div>
      </Page>

      {/* PAGE 2: Data Visualization */}
      <Page>
        <div className="flex items-center gap-3 mb-6">
           <Target className="w-6 h-6 text-bw-navy" />
           <h3 className="text-2xl font-black text-bw-navy uppercase tracking-wide">Performance Metric Profiling</h3>
        </div>

        <div className="bg-bw-navy text-white rounded-xl p-6 mb-8 flex justify-between items-center shadow-lg">
           <div>
              <div className="text-xs uppercase tracking-widest font-bold text-bw-gold mb-1">Methodology</div>
              <div className="text-sm text-gray-300">Ratings are standardized on a 1-5 scale. Visual spikes indicate core strengths, while depressions highlight structural vulnerabilities.</div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
           <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-md p-6 flex flex-col items-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-bw-navy rounded-t-2xl" />
              <h4 className="text-lg font-black text-bw-navy uppercase tracking-wide mb-2">Ability (Competence)</h4>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={abilityData}>
                    <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#0f3460', fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Radar name="Ability" dataKey="A" stroke="#0f3460" strokeWidth={3} fill="#0f3460" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-md p-6 flex flex-col items-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-bw-gold rounded-t-2xl" />
              <h4 className="text-lg font-black text-bw-navy uppercase tracking-wide mb-2">Willingness (Commitment)</h4>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={willingnessData}>
                    <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#0f3460', fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Radar name="Willingness" dataKey="A" stroke="#e2b04a" strokeWidth={3} fill="#e2b04a" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8">
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
               <h4 className="font-black text-bw-navy uppercase mb-4 text-sm tracking-widest border-b border-gray-300 pb-2">Cognitive Superpowers</h4>
               <ul className="space-y-3">
                 {aiReport.competencyDevelopment.superPowers.map((s, i) => (
                    <li key={i} className="text-sm text-gray-800 font-medium">{s}</li>
                 ))}
               </ul>
             </div>
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
               <h4 className="font-black text-bw-navy uppercase mb-4 text-sm tracking-widest border-b border-gray-300 pb-2">Cognitive Blindspots</h4>
               <ul className="space-y-3">
                 {aiReport.competencyDevelopment.blindSpots.map((b, i) => (
                    <li key={i} className="text-sm text-gray-800 font-medium">{b}</li>
                 ))}
               </ul>
             </div>
        </div>
      </Page>

      {/* PAGE 3: KRA Tactical Execution */}
      <Page>
         <div className="flex items-center gap-3 mb-8">
           <TrendingUp className="w-6 h-6 text-bw-navy" />
           <h3 className="text-2xl font-black text-bw-navy uppercase tracking-wide">KRA Tactical Execution</h3>
         </div>

         <div className="space-y-8">
           {aiReport.kraPlans.map((kra, index) => (
             <div key={index} className="border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm relative">
               <div className="absolute left-0 top-0 bottom-0 w-2 bg-bw-navy" />
               <div className="p-6 pl-8 bg-white">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <div className="text-xs font-black uppercase tracking-widest text-bw-gold mb-1">Key Result Area {index + 1}</div>
                       <h4 className="text-xl font-bold text-bw-navy">{kra.title}</h4>
                    </div>
                 </div>
                 
                 <div className="bg-blue-50 text-blue-900 p-3 rounded-lg text-sm font-medium mb-6">
                    <span className="font-bold uppercase tracking-wider text-xs opacity-70 mr-2">Impact:</span> {kra.impact}
                 </div>
                 
                 <div className="mb-6">
                   <strong className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">Tactical Action Steps</strong>
                   <ul className="space-y-3">
                     {kra.actionSteps.map((step, i) => (
                       <li key={i} className="text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm">{step}</li>
                     ))}
                   </ul>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 border border-gray-200 p-4 rounded-xl">
                    <div>
                      <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Lead Indicator (Daily/Weekly)</div>
                      <div className="text-sm font-bold text-bw-navy">{kra.leadIndicator}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Lag Indicator (Monthly/Qtr)</div>
                      <div className="text-sm font-bold text-bw-gold">{kra.lagIndicator}</div>
                    </div>
                 </div>
               </div>
             </div>
           ))}
         </div>
      </Page>

      {/* PAGE 4: Manager Intervention & Blueprint */}
      <Page>
        <div className="flex items-center gap-3 mb-8">
           <BookOpen className="w-6 h-6 text-bw-navy" />
           <h3 className="text-2xl font-black text-bw-navy uppercase tracking-wide">Manager Intervention Blueprint</h3>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10">
           <div className="bg-bw-navy text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full" />
               <h4 className="text-lg font-black text-bw-gold mb-6 uppercase tracking-wide flex items-center gap-2"><Star className="w-5 h-5"/> Coaching Tactics</h4>
               <ul className="space-y-4">
                 {aiReport.competencyDevelopment.coachingTactics.map((tactic, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                       <div className="mt-1 w-2 h-2 bg-bw-gold rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(226,176,74,0.8)]" />
                       <span className="text-sm text-gray-200 font-medium leading-relaxed">{tactic}</span>
                    </li>
                 ))}
               </ul>
           </div>

           <div className="flex flex-col gap-6">
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm">
                 <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Engagement Level</h4>
                 <div className="text-lg font-bold text-bw-navy mb-4">{aiReport.willingnessAndMindset.engagementLevel}</div>
                 
                 <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Flight/Retention Risk</h4>
                 <div className="text-sm font-bold bg-gray-50 p-3 rounded border-l-4 border-bw-gold text-gray-800">{aiReport.willingnessAndMindset.retentionRisk}</div>
              </div>
              
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm flex-1">
                 <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Urgent Interventions</h4>
                 <ul className="space-y-3">
                    {aiReport.willingnessAndMindset.managerInterventions.map((inv, idx) => (
                       <li key={idx} className="text-sm font-medium text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">{inv}</li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>

        <h4 className="text-lg font-black text-bw-navy mb-6 border-b-2 border-gray-200 pb-2 uppercase tracking-wide">3-Week Manager Checklist</h4>
        <div className="grid grid-cols-3 gap-4 mb-10">
           {aiReport.managerActionItems.slice(0, 3).map((item, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
                 <div className="text-[10px] font-black uppercase text-bw-gold tracking-widest mb-2 bg-white inline-block px-2 py-1 rounded border border-gray-100">Week {idx + 1}</div>
                 <div className="text-sm text-gray-800 font-semibold">{item}</div>
              </div>
           ))}
        </div>

        <h4 className="text-lg font-black text-bw-navy mb-4 border-b-2 border-gray-200 pb-2 uppercase tracking-wide">Recommended Resources</h4>
        <div className="grid grid-cols-2 gap-4">
           {aiReport.recommendedResources.map((res, idx) => (
             <div key={idx} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex gap-3 items-center">
                <div className="text-2xl">{res.type.split(' ')[0]}</div>
                <div>
                   <div className="font-black text-bw-navy text-sm">{res.title}</div>
                   <div className="text-xs text-gray-500 font-medium mt-0.5">{res.reason}</div>
                </div>
             </div>
           ))}
        </div>
      </Page>

      {/* PAGE 5: Post Assessment Visuals & Disclaimer */}
      <Page>
        <div className="mb-10 text-center">
          <h3 className="text-3xl font-black text-bw-navy uppercase tracking-widest mb-2">Team Compass Blueprint</h3>
          <p className="text-sm text-gray-500 font-medium">Visual strategies for continuous development and team growth.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-12">
           <img src="/images/od-assessment/spark_poster_1782008819550.png" alt="Spark Poster" className="rounded-xl shadow-md w-full object-cover" />
           <img src="/images/od-assessment/momentum_poster_1782008845231.png" alt="Momentum Poster" className="rounded-xl shadow-md w-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-12">
           <img src="/images/od-assessment/forge_poster_1782008833028.png" alt="Forge Poster" className="rounded-xl shadow-md w-full object-cover" />
           <img src="/images/od-assessment/journey_poster_1782008870447.png" alt="Journey Poster" className="rounded-xl shadow-md w-full object-cover" />
        </div>

        <div className="bg-gray-100 p-6 rounded-xl border border-gray-200 mt-16 text-[10px] text-gray-500 text-justify">
           <strong>CONFIDENTIALITY NOTICE & DISCLAIMER:</strong> This document and the psychometric analysis contained herein are strictly confidential and intended solely for the use of the authorized reporting manager and human resources personnel. The insights provided by the Blue Wisdom Assessment platform are generated through algorithmic analysis based on inputted performance metrics. While intended to provide actionable developmental guidance, this report does not constitute definitive psychological evaluation or absolute guarantees of future performance. Management decisions regarding compensation, termination, or formal disciplinary action should incorporate this analysis only as one of several data points, alongside formal performance reviews, documented feedback, and company policy guidelines. Distribution, reproduction, or unauthorized sharing of this document is strictly prohibited.
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
           <div>Generated by Blue Wisdom OS</div>
           <div>Confidential & Proprietary</div>
        </div>
      </Page>

    </div>
  );
});

export default ReportDocument;
