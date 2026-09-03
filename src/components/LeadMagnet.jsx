import React, { useState } from 'react';
import { Compass, ArrowRight, User, Mail, Phone, Building, CheckCircle, ExternalLink } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import emailjs from '@emailjs/browser';

export default function LeadMagnet() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Assessment State
  const [ability, setAbility] = useState(5);
  const [willingness, setWillingness] = useState(5);

  // Lead Info State
  const [leadInfo, setLeadInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const getQuadrant = (a, w) => {
    if (a >= 5 && w >= 5) return { q: 'M4: High Performer', s: 'DELEGATE', desc: 'High competence and high commitment. These are your stars.' };
    if (a >= 5 && w < 5) return { q: 'M3: Potential', s: 'EXCITE', desc: 'High competence but low commitment. They need motivation and purpose.' };
    if (a < 5 && w >= 5) return { q: 'M1: Developing', s: 'GUIDE', desc: 'Low competence but high commitment. Eager learners needing direction.' };
    return { q: 'M2: Non-Performer', s: 'DIRECT', desc: 'Low competence and low commitment. Requires urgent intervention.' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { q, s, desc } = getQuadrant(ability, willingness);
      const res = { quadrant: q, strategy: s, description: desc };

      // 1. Save to Firestore
      try {
        await addDoc(collection(db, 'leads'), {
          ...leadInfo,
          abilityScore: ability,
          willingnessScore: willingness,
          quadrant: q,
          strategy: s,
          source: 'Website Lead Magnet',
          createdAt: serverTimestamp()
        });
      } catch (fbError) {
        console.error("Firestore Error:", fbError);
        alert(`Database Error: ${fbError.message}`);
        setLoading(false);
        return;
      }

      // 2. Send Teaser Email to Lead
      try {
        const teaserSummary = `Thank you for using the Team Compass Lite Assessment.\n\nYour team member falls into ${q}. The recommended leadership strategy is to ${s}. ${desc}\n\nTo unlock the full 5-page psychometric report and custom Manager Intervention Blueprint, book an OD Diagnosis Call with us today at www.bluewisdom.in.`;
        
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: leadInfo.email,
            employee_name: "Your Assessed Team Member",
            assessor_email: leadInfo.email,
            quadrant: q,
            strategy: s,
            executive_summary: teaserSummary
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        // 3. Notify Neeraj
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: 'neerajnis@gmail.com',
            employee_name: `NEW LEAD: ${leadInfo.name} (${leadInfo.company})`,
            assessor_email: leadInfo.email,
            quadrant: q,
            strategy: s,
            executive_summary: `Phone: ${leadInfo.phone}\nCompany: ${leadInfo.company}\nThey just generated a Lite assessment.`
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } catch (emailError) {
        console.error("Email Error:", emailError);
        // Fail silently in background without showing a disruptive browser popup
      }

      // 4. Send to CRM Webhook (Zapier/Make)
      try {
        const webhookUrl = import.meta.env.VITE_CRM_WEBHOOK_URL;
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: leadInfo.name,
              email: leadInfo.email,
              phone: leadInfo.phone,
              company: leadInfo.company,
              quadrant: q,
              strategy: s,
              abilityScore: ability,
              willingnessScore: willingness,
              source: 'Team Compass Lead Magnet',
              timestamp: new Date().toISOString()
            })
          });
        }
      } catch (webhookError) {
        console.error("Webhook Error:", webhookError);
        // Silently fail if CRM webhook is down, so user experience is not impacted
      }

      setResult(res);
      setStep(3);
    } catch (error) {
      console.error("Unexpected error:", error);
      alert(`Unexpected Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-bw-navy p-6 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full" />
           <Compass className="w-10 h-10 text-bw-gold mx-auto mb-2" />
           <h1 className="text-2xl font-black text-white tracking-wide uppercase">Team Compass Lite</h1>
           <p className="text-sm text-blue-200 mt-1 font-medium">Diagnose Your Team's Performance in 60 Seconds</p>
        </div>

        <div className="p-8">
          {/* STEP 1: ASSESSMENT */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in zoom-in duration-300">
              <div>
                <label className="block text-sm font-black text-bw-navy uppercase tracking-widest mb-3">Overall Ability (Competence)</label>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-400">Low</span>
                  <input 
                    type="range" min="1" max="10" 
                    value={ability} 
                    onChange={(e) => setAbility(parseInt(e.target.value))}
                    className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-bw-navy"
                  />
                  <span className="text-xs font-bold text-gray-400">High</span>
                </div>
                <div className="text-center mt-2 font-black text-2xl text-bw-navy">{ability}/10</div>
              </div>

              <div>
                <label className="block text-sm font-black text-bw-navy uppercase tracking-widest mb-3">Overall Willingness (Commitment)</label>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-400">Low</span>
                  <input 
                    type="range" min="1" max="10" 
                    value={willingness} 
                    onChange={(e) => setWillingness(parseInt(e.target.value))}
                    className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-bw-gold"
                  />
                  <span className="text-xs font-bold text-gray-400">High</span>
                </div>
                <div className="text-center mt-2 font-black text-2xl text-bw-gold">{willingness}/10</div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full bg-bw-navy text-white font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-blue-900 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                Reveal Quadrant <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 2: LEAD CAPTURE */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6">
                <h2 className="text-lg font-black text-bw-navy uppercase">Where should we send the report?</h2>
                <p className="text-sm text-gray-500 mt-1">Enter your details to instantly view the quadrant and receive your mini-report via email.</p>
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input required type="text" placeholder="Full Name" value={leadInfo.name} onChange={e => setLeadInfo({...leadInfo, name: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bw-navy focus:border-bw-navy outline-none transition" />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input required type="email" placeholder="Work Email" value={leadInfo.email} onChange={e => setLeadInfo({...leadInfo, email: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bw-navy focus:border-bw-navy outline-none transition" />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input required type="tel" placeholder="Phone Number" value={leadInfo.phone} onChange={e => setLeadInfo({...leadInfo, phone: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bw-navy focus:border-bw-navy outline-none transition" />
              </div>

              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input required type="text" placeholder="Company Name" value={leadInfo.company} onChange={e => setLeadInfo({...leadInfo, company: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bw-navy focus:border-bw-navy outline-none transition" />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-bw-gold text-bw-navy font-black py-4 rounded-xl uppercase tracking-widest hover:bg-yellow-500 transition shadow-lg shadow-yellow-500/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing Data...' : 'Get My Report'}
              </button>
              
              <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm font-semibold text-gray-400 hover:text-bw-navy transition">
                Back
              </button>
            </form>
          )}

          {/* STEP 3: TEASER RESULT */}
          {step === 3 && result && (
            <div className="text-center space-y-6 animate-in slide-in-from-bottom duration-500">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              
              <div>
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Diagnosis Complete</h2>
                <p className="text-gray-600 text-sm">We've sent a summary to {leadInfo.email}</p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-bw-navy" />
                 <div className="text-[10px] font-black uppercase text-bw-gold tracking-widest mb-2">Quadrant Placement</div>
                 <h3 className="text-2xl font-black text-bw-navy mb-2">{result.quadrant}</h3>
                 <div className="inline-block bg-white border border-gray-200 px-3 py-1 rounded text-xs font-bold text-gray-800 shadow-sm mb-4">
                   Strategy: {result.strategy}
                 </div>
                 <p className="text-sm text-gray-600 font-medium italic">"{result.description}"</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl text-left">
                 <h4 className="font-bold text-bw-navy text-sm uppercase mb-2">Unlock the Full Blueprint</h4>
                 <p className="text-xs text-blue-900/80 mb-4 leading-relaxed">
                   The full Team Compass OS generates a 5-page Manager Intervention Blueprint, deep psychometric profiling, and tactical KRA tracking for this employee.
                 </p>
                 <a 
                   href="https://www.bluewisdom.in" 
                   target="_blank" 
                   rel="noreferrer"
                   className="inline-flex items-center gap-2 text-xs font-bold text-white bg-bw-navy px-4 py-2 rounded shadow-md hover:bg-blue-900 transition"
                 >
                   Book OD Strategy Call <ExternalLink className="w-3 h-3" />
                 </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
