/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sliders, Database, AlertTriangle, ShieldCheck, RefreshCw, Landmark, HelpCircle, 
  Plus, Trash2, MailCheck, ToggleLeft, ToggleRight
} from 'lucide-react';
import { FloatingInput } from './FloatingInput';

interface University {
  id: string;
  name: string;
  nameAR: string;
  researchScore: number;       // out of 100
  satisfactionScore: number;   // out of 100
  ratingCount: number;
  finalScore: number;          // calculated
  rank: number;
}

interface AnomalousFlag {
  id: string;
  targetInstitute: string;
  ipAddress: string;
  flagType: string;
  evaluationScore: number;
  createdAt: string;
  status: 'active' | 'dismissed' | 'voided';
}

interface RecognizedDomain {
  id: string;
  domain: string;
  institution: string;
  institutionAR: string;
}

interface GCPIntelligenceProps {
  currentLang: 'en' | 'ar';
}

export default function GCPIntelligence({ currentLang }: GCPIntelligenceProps) {
  const isRTL = currentLang === 'ar';

  // --- 1. Algorithm Calibration Weights ---
  const [researchWeight, setResearchWeight] = useState(60); // %
  const [satisfactionWeight, setSatisfactionWeight] = useState(30); // %
  const [professorActivityWeight, setProfessorActivityWeight] = useState(10); // % (The newly requested Professor activity ranking logic weight)
  const [useProfessorHIndexBonus, setUseProfessorHIndexBonus] = useState(true); // Toggles advanced ranking logic parameter
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 2. Official Universities Directory ---
  const [institutes, setInstitutes] = useState<University[]>([
    {
      id: 'HE-INS-001',
      name: 'University of Health Sciences & Medical Research',
      nameAR: 'جامعة العلوم الصحية والبحوث الطبية',
      researchScore: 95,
      satisfactionScore: 92,
      ratingCount: 142,
      finalScore: 93.8,
      rank: 1
    },
    {
      id: 'HE-INS-002',
      name: 'Cairo Medical University',
      nameAR: 'جامعة القاهرة بكلية الطب والتمريض',
      researchScore: 91,
      satisfactionScore: 86,
      ratingCount: 184,
      finalScore: 89.0,
      rank: 2
    },
    {
      id: 'HE-INS-003',
      name: 'Royal College of Endocrinology',
      nameAR: 'الكلية الملكية لأمراض الغدد الصماء',
      researchScore: 88,
      satisfactionScore: 94,
      ratingCount: 68,
      finalScore: 90.4,
      rank: 3
    },
    {
      id: 'HE-INS-004',
      name: 'Alexandria Faculty of Medicine',
      nameAR: 'كلية الطب بجامعة الإسكندرية',
      researchScore: 84,
      satisfactionScore: 89,
      ratingCount: 95,
      finalScore: 86.0,
      rank: 4
    }
  ]);

  // --- 3. Recognized University Domains Manager (Academic Elite Verification) ---
  const [recognizedDomains, setRecognizedDomains] = useState<RecognizedDomain[]>([
    { id: 'DOM-001', domain: 'healthdia.org', institution: 'Healthdia Board Office', institutionAR: 'مقر إدارة معايير منصة هيلثديا' },
    { id: 'DOM-002', domain: 'univ.edu', institution: 'Alexandria Faculty of Medicine', institutionAR: 'كلية الطب بجامعة الإسكندرية' },
    { id: 'DOM-003', domain: 'student.net', institution: 'Cairo Medical University', institutionAR: 'جامعة القاهرة بكلية الطب' },
    { id: 'DOM-004', domain: 'ox.ac.uk', institution: 'University of Oxford Medical Sciences', institutionAR: 'علوم الطب بجامعة أكسفورد' },
    { id: 'DOM-005', domain: 'harvard.edu', institution: 'Harvard Medical School', institutionAR: 'كلية طب هارفارد الأكاديمية' }
  ]);

  // Form states
  const [newDomainString, setNewDomainString] = useState('');
  const [newDomainInstitution, setNewDomainInstitution] = useState('');
  const [newDomainInstAR, setNewDomainInstAR] = useState('');

  const [newInstName, setNewInstName] = useState('');
  const [newInstNameAR, setNewInstNameAR] = useState('');
  const [newInstResearch, setNewInstResearch] = useState(80);
  const [newInstSatis, setNewInstSatis] = useState(80);

  // --- 4. Crowd rating anomaly checking logs ---
  const [flags, setFlags] = useState<AnomalousFlag[]>([
    {
      id: 'FLG-102',
      targetInstitute: 'Alexandria Faculty of Medicine',
      ipAddress: '197.34.112.42',
      flagType: 'Multiple rapid evaluations (Likely botnet)',
      evaluationScore: 1.0,
      createdAt: '2026-05-26 23:40',
      status: 'active'
    },
    {
      id: 'FLG-409',
      targetInstitute: 'Cairo Medical University',
      ipAddress: '43.201.55.90',
      flagType: 'Rating coordinates mismatch (Proxy route detected)',
      evaluationScore: 10.0,
      createdAt: '25th May 2026',
      status: 'dismissed'
    }
  ]);

  // --- Weight balance sliders adjustments ---
  // Balancing research & satisfaction while respecting the new professor activity weight
  const handleResearchWeightChange = (val: number) => {
    setResearchWeight(val);
    // Dynamic remaining allocation to satisfaction
    const remaining = 100 - val - professorActivityWeight;
    if (remaining >= 0) {
      setSatisfactionWeight(remaining);
    } else {
      // Shave off the professor weight if research is extremely dominant
      setProfessorActivityWeight(Math.max(0, 100 - val));
      setSatisfactionWeight(0);
    }
  };

  const handleSatisfactionWeightChange = (val: number) => {
    setSatisfactionWeight(val);
    const remaining = 100 - val - researchWeight;
    if (remaining >= 0) {
      setProfessorActivityWeight(remaining);
    } else {
      setResearchWeight(Math.max(0, 100 - val));
      setProfessorActivityWeight(0);
    }
  };

  const handleProfessorWeightChange = (val: number) => {
    setProfessorActivityWeight(val);
    const remaining = 100 - val - researchWeight;
    if (remaining >= 0) {
      setSatisfactionWeight(remaining);
    } else {
      setResearchWeight(Math.max(0, 100 - val));
      setSatisfactionWeight(0);
    }
  };

  // Compute live ranking index
  const handleRecalibrate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated = institutes.map(inst => {
        // Advanced algorithmic evaluation including professor activity contribution
        // E.g., multiplier is derived from researchScore offset or a simulated professor activity metric
        const professorBonusScore = useProfessorHIndexBonus ? 5.2 : 0;
        const baseScore = 
          (inst.researchScore * (researchWeight / 100)) + 
          (inst.satisfactionScore * (satisfactionWeight / 100)) +
          (professorBonusScore * (professorActivityWeight / 100));

        const final = parseFloat(Math.min(100, Math.max(0, baseScore)).toFixed(1));
        return {
          ...inst,
          finalScore: final
        };
      });

      // Re-sort and rank descending
      const sorted = [...updated].sort((a, b) => b.finalScore - a.finalScore);
      const ranked = sorted.map((inst, index) => ({
        ...inst,
        rank: index + 1
      }));

      setInstitutes(ranked);
      setIsProcessing(false);
    }, 1200);
  };

  const handleOverrideScore = (id: string, field: 'researchScore' | 'satisfactionScore', value: number) => {
    setInstitutes(prev => prev.map(inst => {
      if (inst.id === id) {
        const updatedInst = {
          ...inst,
          [field]: Math.min(Math.max(value, 0), 100)
        };
        const professorBonusScore = useProfessorHIndexBonus ? 5.2 : 0;
        updatedInst.finalScore = parseFloat(
          ((updatedInst.researchScore * (researchWeight / 100)) + 
          (updatedInst.satisfactionScore * (satisfactionWeight / 100)) +
          (professorBonusScore * (professorActivityWeight / 100))).toFixed(1)
        );
        return updatedInst;
      }
      return inst;
    }));
  };

  // --- Add Recognized Academic Domains ---
  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainString || !newDomainInstitution) return;

    // Standardize domain format (remove @)
    const cleanedDomain = newDomainString.replace('@', '').trim().toLowerCase();
    
    const newDomain: RecognizedDomain = {
      id: `DOM-${Math.floor(Math.random() * 900 + 100)}`,
      domain: cleanedDomain,
      institution: newDomainInstitution,
      institutionAR: newDomainInstAR || newDomainInstitution
    };

    setRecognizedDomains(prev => [newDomain, ...prev]);
    setNewDomainString('');
    setNewDomainInstitution('');
    setNewDomainInstAR('');
  };

  const handleDeleteDomain = (id: string) => {
    setRecognizedDomains(prev => prev.filter(d => d.id !== id));
  };

  // --- Add brand new Higher Education Medical Institute ---
  const handleAddNewInstitute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstName) return;

    const newUniversity: University = {
      id: `HE-INS-${Math.floor(Math.random() * 900 + 100)}`,
      name: newInstName,
      nameAR: newInstNameAR || newInstName,
      researchScore: newInstResearch,
      satisfactionScore: newInstSatis,
      ratingCount: 1,
      finalScore: parseFloat(((newInstResearch * (researchWeight / 100)) + (newInstSatis * (satisfactionWeight / 100))).toFixed(1)),
      rank: institutes.length + 1
    };

    setInstitutes(prev => [...prev, newUniversity]);
    setNewInstName('');
    setNewInstNameAR('');
  };

  const handleFlagAction = (flagId: string, action: 'dismissed' | 'voided') => {
    setFlags(prev => prev.map(fg => {
      if (fg.id === flagId) {
        return { ...fg, status: action };
      }
      return fg;
    }));
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Visual Header */}
      <div>
        <h2 className="text-lg font-bold text-zinc-950 font-serif border-b border-zinc-100 pb-2 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-zinc-900" />
          <span>{isRTL ? 'معايرة خوارزمية الذكاء الأكاديمي والرتب والتقييمات' : 'Institutional & Academic Governance Desk'}</span>
        </h2>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          {isRTL 
            ? 'تعديل أوزان الترتيب العالمي، مواءمة نقاط تأثير هوسوف الأستاذة الحيوية h-index، وإدارة التراخيص ونطاقات البريد الإلكتروني للجامعات (Recognized Domains).'
            : 'Configure algorithm weights, analyze professor activity index influences, audit crowd evaluation spam alerts, and manage verified university email domains.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Calibration weights & Data anomaly flag monitoring */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Section 1: Algorithm Calibrator & Professor Activity dials */}
          <div className="border border-zinc-200 rounded-3xl p-5 bg-white space-y-5">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
              <Sliders className="w-4 h-4 text-zinc-950" />
              <span>{isRTL ? 'معايرة أوزان الترتيب الأكاديمي' : 'Calibration & Ranking Logic Weights'}</span>
            </span>

            <div className="space-y-4">
              {/* Slider 1: Research volume weight */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-zinc-700">{isRTL ? 'وزن مخرجات البحث العلمي' : 'Research Output Vol'}</span>
                  <span className="font-bold text-zinc-950">{researchWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={researchWeight}
                  onChange={(e) => handleResearchWeightChange(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-150 rounded-lg appearance-none cursor-pointer accent-zinc-950"
                />
              </div>

              {/* Slider 2: Satisfaction Weight */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-zinc-700">{isRTL ? 'وزن رضا البيئة التعليمية' : 'Academic Satisfaction'}</span>
                  <span className="font-bold text-zinc-950">{satisfactionWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={satisfactionWeight}
                  onChange={(e) => handleSatisfactionWeightChange(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-150 rounded-lg appearance-none cursor-pointer accent-zinc-950"
                />
              </div>

              {/* REQ FEATURE: Slider 3: Professor Activity Weight dial */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-zinc-750 flex items-center gap-0.5">
                    <span>{isRTL ? 'وزن نشاط وحيوية الأساتذة' : 'Professor Activity Weight'}</span>
                    <HelpCircle className="w-3.5 h-3.5 text-zinc-400" title="Weight of professors publications indices (h-Index, citations) on the final university rank" />
                  </span>
                  <span className="font-bold text-emerald-700">{professorActivityWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={professorActivityWeight}
                  onChange={(e) => handleProfessorWeightChange(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-150 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Logical Toggles */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-150 text-xs">
                <div className="max-w-[150px]">
                  <span className="font-bold text-zinc-800 block">{isRTL ? 'تضمين معامل هيرش الأستاذ' : 'Sync h-Index Impact'}</span>
                  <span className="text-[10px] text-zinc-400 block">{isRTL ? 'مكافأة النشر للأطروحات النشطة' : 'Reward published h-index streams'}</span>
                </div>
                
                <button 
                  onClick={() => setUseProfessorHIndexBonus(!useProfessorHIndexBonus)}
                  className="focus:outline-none cursor-pointer text-zinc-950"
                >
                  {useProfessorHIndexBonus ? (
                    <ToggleRight className="w-9 h-9 text-zinc-950" fill="currentColor" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 text-zinc-300" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono p-1 bg-zinc-50 border rounded-lg">
                <span className="text-zinc-500">Target Total balance:</span>
                <span className={`font-bold ${researchWeight + satisfactionWeight + professorActivityWeight === 100 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {researchWeight + satisfactionWeight + professorActivityWeight}% / 100%
                </span>
              </div>

              {/* Compute trigger */}
              <button
                onClick={handleRecalibrate}
                disabled={isProcessing || researchWeight + satisfactionWeight + professorActivityWeight !== 100}
                className="w-full py-3 bg-zinc-950 hover:bg-zinc-900 text-white font-bold rounded-2xl text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-zinc-200"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>{isProcessing ? (isRTL ? 'تقييم المصفوفة...' : 'Recalculating indexes...') : (isRTL ? 'إقرار وإعادة احتساب الرتب فوراً' : 'Recalibrate Rank Algorithms')}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Suspicious evaluations flags block */}
          <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
              <AlertTriangle className="w-4 h-4 text-zinc-900" />
              <span>{isRTL ? 'مراقب موثوقية التقييمات التشاركية' : 'Evaluation Integrity validation'}</span>
            </span>

            <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
              {flags.map((fg) => (
                <div key={fg.id} className="p-3 border border-zinc-150 rounded-xl bg-zinc-50/50 space-y-2 text-xs font-sans">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-zinc-500 font-bold">{fg.id}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[8px] ${
                      fg.status === 'active' 
                        ? 'bg-red-50 text-red-750 border border-red-200' 
                        : fg.status === 'voided' 
                          ? 'bg-zinc-900 text-white' 
                          : 'bg-zinc-105 text-zinc-500'
                    }`}>
                      {fg.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-zinc-800 leading-snug">{fg.targetInstitute}</h4>
                    <p className="text-[10px] text-zinc-405 font-mono">IP: {fg.ipAddress} | Score: {fg.evaluationScore}/10</p>
                    <p className="text-[10px] text-zinc-650 leading-tight bg-white p-1.5 border border-zinc-150 rounded mt-1 truncate">{fg.flagType}</p>
                  </div>

                  {fg.status === 'active' && (
                    <div className="flex gap-1 justify-end font-mono text-[9px] pt-1">
                      <button
                        onClick={() => handleFlagAction(fg.id, 'dismissed')}
                        className="px-2 py-1 border border-zinc-200 text-zinc-650 font-bold rounded hover:bg-zinc-100 cursor-pointer"
                      >
                        {isRTL ? 'تجاهل البلاغ' : 'Dismiss'}
                      </button>
                      <button
                        onClick={() => handleFlagAction(fg.id, 'voided')}
                        className="px-2 py-1 bg-zinc-950 text-white font-bold rounded hover:bg-zinc-900 cursor-pointer"
                      >
                        {isRTL ? 'إلغاء التقييم' : 'Void Vote'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: official directory & Recognized domains manager */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SEC 3.1: REQ FEATURE: Recognized University Domains manager and register */}
          <div className="border border-zinc-200 rounded-3xl p-5 bg-white space-y-4 shadow-sm">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
              <MailCheck className="w-4.5 h-4.5 text-zinc-950" />
              <span>{isRTL ? 'بوابة تصنيفات البريد الإلكتروني الأكاديمي والتحقق التلقائي' : 'Recognized University Domains manager'}</span>
            </span>

            <p className="text-xs text-zinc-500 leading-relaxed font-sans">
              {isRTL 
                ? 'تنظيم مكتبة النطاقات الجامعية الموثوقة. أي باحث يبادر بالتسجيل ببريد يطابق هذه العناوين يُمنح التوثيق التلقائي للمؤسسة (Email verified).'
                : 'Manage recognized administrative domains. When a researcher registers with a matching institutional domain signature, their workplace is verified instantly.'}
            </p>

            {/* Addition Form */}
            <form onSubmit={handleAddDomain} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs space-y-3 font-sans">
              <h4 className="font-bold text-zinc-950 flex items-center gap-1">
                <Plus className="w-4 h-4 text-zinc-900" />
                <span>{isRTL ? 'إدراج نطاق جامعي موثق جديد' : 'Whitelist New University Domain'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <FloatingInput 
                    label="Domain (e.g., ox.ac.uk)" 
                    required 
                    value={newDomainString}
                    onChange={(e) => setNewDomainString(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1">
                  <FloatingInput 
                    label="School Name (EN)" 
                    required 
                    value={newDomainInstitution}
                    onChange={(e) => setNewDomainInstitution(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1">
                  <FloatingInput 
                    label="School Name (AR)" 
                    value={newDomainInstAR}
                    onChange={(e) => setNewDomainInstAR(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-white font-mono font-bold rounded-xl cursor-pointer"
                >
                  {isRTL ? 'إضافة النطاق للقائمة' : 'Add Domain to Whitelist'}
                </button>
              </div>
            </form>

            {/* Recognized Domain Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[170px] overflow-y-auto pr-1">
              {recognizedDomains.map((d) => (
                <div key={d.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div className="space-y-0.5 font-sans min-w-0">
                    <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold block whitespace-nowrap overflow-x-auto">
                      @{d.domain}
                    </span>
                    <span className="text-[10px] text-zinc-550 block font-bold truncate max-w-[170px]">
                      {isRTL ? d.institutionAR : d.institution}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteDomain(d.id)}
                    className="p-1 px-1.5 border border-zinc-200 hover:border-zinc-950 text-red-600 rounded-lg cursor-pointer shrink-0 ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SEC 3.2: University directory table with Manual Overrides & Add Institute widget */}
          <div className="border border-zinc-200 rounded-3xl p-5 bg-white space-y-5 shadow-sm">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
              <Database className="w-4.5 h-4.5 text-zinc-950" />
              <span>{isRTL ? 'قاعدة بيانات الهيئة الطبية وبوابة التسجيل والتعديل' : 'Official Academic Directory & Overrides'}</span>
            </span>

            {/* Add Institutional Registry form */}
            <form onSubmit={handleAddNewInstitute} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs space-y-3 font-sans">
              <h4 className="font-bold text-zinc-950 flex items-center gap-1">
                <Plus className="w-4 h-4 text-zinc-950" />
                <span>{isRTL ? 'إيداع صرح طبي جديد في ترتيب الرتب' : 'Register New Medical University to Rank DB'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FloatingInput 
                  label="New School of Medicine (EN)" 
                  required 
                  value={newInstName}
                  onChange={(e) => setNewInstName(e.target.value)}
                />
                <FloatingInput 
                  label="اسم الكلية باللغة العربية" 
                  value={newInstNameAR}
                  onChange={(e) => setNewInstNameAR(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <label className="text-[10px] block mb-1 text-zinc-400 uppercase font-mono">Baseline Research Score (0-100)</label>
                  <input 
                    type="number" 
                    min="10" 
                    max="100" 
                    value={newInstResearch}
                    onChange={(e) => setNewInstResearch(parseInt(e.target.value) || 80)}
                    className="w-full p-2 border bg-white rounded-xl focus:outline-none focus:border-black font-mono text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] block mb-1 text-zinc-400 uppercase font-mono">Baseline Satisfaction Score (0-100)</label>
                  <input 
                    type="number" 
                    min="10" 
                    max="100" 
                    value={newInstSatis}
                    onChange={(e) => setNewInstSatis(parseInt(e.target.value) || 80)}
                    className="w-full p-2 border bg-white rounded-xl focus:outline-none focus:border-black font-mono text-center"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-white font-mono font-bold rounded-xl cursor-pointer"
                >
                  {isRTL ? 'تسجيل الكلية فورياً' : 'Add University to Registry'}
                </button>
              </div>
            </form>

            <div className="overflow-x-auto border border-zinc-200 rounded-xl">
              <table className="min-w-full text-xs text-left rtl:text-right font-sans">
                <thead className="bg-zinc-50 font-mono text-[9px] uppercase text-zinc-500">
                  <tr>
                    <th className="px-3 py-3 w-16 text-center">{isRTL ? 'الرتبة' : 'Rank'}</th>
                    <th className="px-3 py-3">{isRTL ? 'المؤسسة الطبية' : 'Institute Organization'}</th>
                    <th className="px-3 py-3 w-28 text-center">{isRTL ? 'نشاط الأبحاث' : 'Research Score'}</th>
                    <th className="px-3 py-3 w-28 text-center">{isRTL ? 'مستوى الرضا' : 'Satisfaction'}</th>
                    <th className="px-3 py-3 w-20 text-center">{isRTL ? 'النتيجة الكلية' : 'Final Score'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {institutes.map((inst) => (
                    <tr key={inst.id} className="hover:bg-zinc-50/50">
                      <td className="px-3 py-4 text-center whitespace-nowrap">
                        <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full font-mono font-black border text-xs ${
                          inst.rank === 1 
                            ? 'bg-zinc-950 text-white border-black' 
                            : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                        }`}>
                          #{inst.rank}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <span className="font-bold text-zinc-900 block leading-tight">
                          {isRTL ? inst.nameAR : inst.name}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400 mt-0.5 block whitespace-nowrap">
                          Serial: {inst.id} | Indexed Ratings: {inst.ratingCount}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 justify-center bg-zinc-50 px-1.5 py-1 border rounded font-mono text-xs">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={inst.researchScore}
                            onChange={(e) => handleOverrideScore(inst.id, 'researchScore', parseInt(e.target.value) || 0)}
                            className="w-10 text-center font-bold text-zinc-950 focus:outline-none bg-transparent"
                          />
                          <span className="text-[10px] text-zinc-400">/100</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 justify-center bg-zinc-50 px-1.5 py-1 border rounded font-mono text-xs">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={inst.satisfactionScore}
                            onChange={(e) => handleOverrideScore(inst.id, 'satisfactionScore', parseInt(e.target.value) || 0)}
                            className="w-10 text-center font-bold text-zinc-950 focus:outline-none bg-transparent"
                          />
                          <span className="text-[10px] text-zinc-400">/100</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center font-serif font-black text-xs text-zinc-900 whitespace-nowrap">
                        {inst.finalScore}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[10px] leading-relaxed text-zinc-500 font-mono">
              {isRTL 
                ? 'تلتزم الواجهة بمعادلة GCP الرياضية: النتيجة الكلية = (نقاط الأبحاث × نسبة الوزن الكلي) + (نقاط الرضا × نسبة رضا الطالب الكلي) + (مؤشر نشاط الأستاذ × الوزن الكلي لنشاط الأساتذة). ضبط الأرقام يدوياً هنا يعيد صياغة المؤشرات على الفور.'
                : 'Computed according to: Final = (Research × ResearchWeight) + (Satisfaction × SatisfactionWeight) + (ProfessorBonus × ProfessorWeight). Customizing inputs forces system-wide database index shifts instantly.'}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
