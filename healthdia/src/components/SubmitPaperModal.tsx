/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  BookOpen, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  BadgeInfo, 
  ShieldCheck, 
  Scale, 
  Copyright,
  Sparkles,
  ChevronRight,
  Info,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { AcademicPaper, UserProfile } from '../types';
import { TRANSLATIONS } from '../data';

interface SubmitPaperModalProps {
  currentLang: 'en' | 'ar';
  currentUser: UserProfile;
  onSubmit: (paper: Omit<AcademicPaper, 'id' | 'citationCount' | 'views' | 'downloads' | 'status' | 'submittedBy' | 'submittedByName' | 'doi' | 'publishedAt'>) => void;
}

export default function SubmitPaperModal({
  currentLang,
  currentUser,
  onSubmit,
}: SubmitPaperModalProps) {
  const t = TRANSLATIONS[currentLang];
  const isRTL = currentLang === 'ar';

  // Wizard Step Tracker: 1 = Selection, 2 = Core Metadata & Classification, 3 = Narrative Text, 4 = Results & Declarations
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Core Track selection state
  const [submissionTrack, setSubmissionTrack] = useState<'repository' | 'journal'>('repository');

  // Core metadata states
  const [titleEN, setTitleEN] = useState('');
  const [titleAR, setTitleAR] = useState('');
  const [abstractEN, setAbstractEN] = useState('');
  const [abstractAR, setAbstractAR] = useState('');
  
  const [authorsEN, setAuthorsEN] = useState(currentUser.name);
  const [authorsAR, setAuthorsAR] = useState(currentUser.nameAR || currentUser.name);
  
  const [journalEN, setJournalEN] = useState('Healthedia Open Index Repository');
  const [journalAR, setJournalAR] = useState('مستودع هيلثديا المفتوح للأبحاث');
  
  const [categoryEN, setCategoryEN] = useState('Critical Care & Medicine');
  const [categoryAR, setCategoryAR] = useState('العناية المركزة والطب السريري');
  
  const [methodologyEN, setMethodologyEN] = useState('');
  const [methodologyAR, setMethodologyAR] = useState('');
  
  const [resultsEN, setResultsEN] = useState('');
  const [resultsAR, setResultsAR] = useState('');
  
  const [discussionEN, setDiscussionEN] = useState('');
  const [discussionAR, setDiscussionAR] = useState('');
  
  const [keywordsEN, setKeywordsEN] = useState('');
  const [keywordsAR, setKeywordsAR] = useState('');

  // ========= TRACK A: OPEN ACCESS REPOSITORY SPECIFIC METADATA =========
  const [originalJournal, setOriginalJournal] = useState('');
  const [originalPubDate, setOriginalPubDate] = useState('');
  const [originalLink, setOriginalLink] = useState('');
  const [originalCopyrightStatus, setOriginalCopyrightStatus] = useState('CC-BY-4.5');
  const [licensingAgreementSigned, setLicensingAgreementSigned] = useState(false);

  // ========= TRACK B: HEALTHEDIA JOURNAL SPECIFIC METADATA =========
  const [exclusivitySigned, setExclusivitySigned] = useState(false);
  const [ethicsAgreementSigned, setEthicsAgreementSigned] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [showDeclarationPopup, setShowDeclarationPopup] = useState(false);

  // Track switching automatic field defaults adjust
  const handleSelectTrack = (track: 'repository' | 'journal') => {
    setSubmissionTrack(track);
    if (track === 'journal') {
      setJournalEN('Healthedia Journal of Advanced Clinical Medicine');
      setJournalAR('مجلة هيلثديا لعلوم الطب السريري المتقدمة');
    } else {
      setJournalEN('Healthedia Open Index Repository');
      setJournalAR('مستودع هيلثديا المفتوح للأبحاث');
    }
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      // Validate step 2 fields
      if (!titleEN.trim() || !titleAR.trim()) {
        setErrorMsg(isRTL ? 'الرجاء إدخال عنوان الدراسة باللغتين العربية والإنجليزية.' : 'Title is required in both English and Arabic.');
        return;
      }
      if (!authorsEN.trim() || !authorsAR.trim()) {
        setErrorMsg(isRTL ? 'الرجاء إضافة أسماء الباحثين.' : 'Investigators fields must be filled.');
        return;
      }

      // Track A mandatory validations
      if (submissionTrack === 'repository') {
        if (!originalJournal.trim() || !originalPubDate.trim() || !originalLink.trim()) {
          setErrorMsg(isRTL 
            ? 'يتطلب مستودع الأبحاث المفتوح ملء بيانات "مصدر النشر الأصلي" بالكامل.' 
            : 'Open-Access Repository track requires complete "Original Publication Source" details.');
          return;
        }
      }

      setStep(3);
      return;
    }

    if (step === 3) {
      // Validate step 3 fields
      if (!abstractEN.trim() || !abstractAR.trim()) {
        setErrorMsg(isRTL ? 'ملخص الدراسة باللغتين العربية والإنجليزية إلزامي.' : 'Study abstracts are required in both English and Arabic.');
        return;
      }
      if (!methodologyEN.trim() || !methodologyAR.trim()) {
        setErrorMsg(isRTL ? 'سياق منهجية البحث والتحضير العلمي مطلوب.' : 'Methodology description is required in both languages.');
        return;
      }
      setStep(4);
      return;
    }
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    if (step === 4) setStep(3);
    else if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const processSubmission = () => {
    setErrorMsg('');

    // Pre-flight checks
    if (submissionTrack === 'repository') {
      if (!licensingAgreementSigned) {
        setErrorMsg(isRTL 
          ? 'يجب توقيع والموافقة على اتفاقية الترخيص الرقمي للنشر المفتوح.' 
          : 'You must review and sign the digital declaration for Open Access publishing.');
        return;
      }
    } else {
      if (!exclusivitySigned || !ethicsAgreementSigned) {
        setErrorMsg(isRTL 
          ? 'يرجى تأكيد الالتزام بالملكية الحصرية للمجلة والمواقف الأخلاقية الطبية المعتمدة.' 
          : 'Please guarantee manuscript exclusivity and certify compliance with clinical ethical guidelines.');
        return;
      }
    }

    // Dynamic submission schema payload
    const submissionPayload: any = {
      titleEN,
      titleAR,
      abstractEN,
      abstractAR,
      authorsEN: authorsEN.split(',').map(a => a.trim()).filter(Boolean),
      authorsAR: authorsAR.split(',').map(a => a.trim()).filter(Boolean),
      journalEN,
      journalAR,
      categoryEN,
      categoryAR,
      methodologyEN,
      methodologyAR,
      resultsEN,
      resultsAR,
      discussionEN,
      discussionAR,
      keywordsEN: keywordsEN.split(',').map(k => k.trim()).filter(Boolean),
      keywordsAR: keywordsAR.split(',').map(k => k.trim()).filter(Boolean),
      
      // Dual-track extra metadata
      submissionTrack,
      originalJournal: submissionTrack === 'repository' ? originalJournal : undefined,
      originalPubDate: submissionTrack === 'repository' ? originalPubDate : undefined,
      originalLink: submissionTrack === 'repository' ? originalLink : undefined,
      originalCopyrightStatus: submissionTrack === 'repository' ? originalCopyrightStatus : undefined,
      licensingAgreementSigned: submissionTrack === 'repository' ? licensingAgreementSigned : undefined,
      ethicsAgreementSigned: submissionTrack === 'journal' ? ethicsAgreementSigned : undefined,
      reviewerAssignments: submissionTrack === 'journal' ? [] : undefined
    };

    onSubmit(submissionPayload);

    // Hard reset fields
    setTitleEN('');
    setTitleAR('');
    setAbstractEN('');
    setAbstractAR('');
    setMethodologyEN('');
    setMethodologyAR('');
    setResultsEN('');
    setResultsAR('');
    setDiscussionEN('');
    setDiscussionAR('');
    setKeywordsEN('');
    setKeywordsAR('');
    setOriginalJournal('');
    setOriginalPubDate('');
    setOriginalLink('');
    setLicensingAgreementSigned(false);
    setExclusivitySigned(false);
    setEthicsAgreementSigned(false);
    setStep(1);
    setShowDeclarationPopup(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" id="manuscript-wizard-container" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Dynamic Header & Progress Breadcrumb */}
      <div className="mb-6 border-b border-zinc-200 pb-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">
              <Layers className="w-3.5 h-3.5 text-black shrink-0" />
              <span>Smart Manuscript Wizard</span>
            </div>
            <h1 className="text-2xl sm:text-3.5xl font-serif font-black text-black tracking-tight select-none">
              {isRTL ? 'إيداع وتحكيم الأوراق والمخطوطات' : 'Academic Submission Hub'}
            </h1>
          </div>
          
          {/* Progress gauge */}
          <div className="flex items-center gap-2 bg-zinc-100 p-2 rounded-xl border border-zinc-200 text-xs font-mono font-bold leading-none shrink-0" style={{ direction: 'ltr' }}>
            <span className={`px-2 py-1 rounded ${step === 1 ? 'bg-black text-white' : 'text-zinc-400'}`}>1</span>
            <span className="text-zinc-300">/</span>
            <span className={`px-2 py-1 rounded ${step === 2 ? 'bg-black text-white' : 'text-zinc-400'}`}>2</span>
            <span className="text-zinc-300">/</span>
            <span className={`px-2 py-1 rounded ${step === 3 ? 'bg-black text-white' : 'text-zinc-400'}`}>3</span>
            <span className="text-zinc-300">/</span>
            <span className={`px-2 py-1 rounded ${step === 4 ? 'bg-black text-white' : 'text-zinc-400'}`}>4</span>
          </div>
        </div>
        
        <p className="text-xs text-zinc-400 mt-2 font-sans">
          {isRTL 
            ? 'أودع عملك الجديد أو انشر بحثاً مسجلاً في المجلات الأخرى للاقتباس والمطابقة في الفهرس الطبي الموحد.'
            : 'Submit clinical research studies, meta-analysis databases, or active original diagnostics. System routes your paper dynamically based on channel specs.'}
        </p>
      </div>

      {/* Professional Traceability Ribbon */}
      <div className="mb-6 bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed text-zinc-650">
        <BadgeInfo className="w-5 h-5 text-black shrink-0 mt-0.5" />
        <div>
          <span className="block font-bold text-black font-mono">
            TRACEABILITY CHAIN ID: {currentUser.id}
          </span>
          <p className="mt-0.5">
            {isRTL 
              ? `يتم رصد وحفظ هذه المساهمة الأكاديمية ونسبها إلى ملفك المصدق بشكل دائم ودون رجعة.`
              : `This submission is strictly tied to your institutional academic registry. Real-time logging enforces intellectual protection and prevents double-attribution conflicts.`}
          </p>
        </div>
      </div>

      {/* Interactive Error Alert Panel */}
      {errorMsg && (
        <div className="mb-6 bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex items-start gap-3 text-xs text-zinc-800 font-mono">
          <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
          <div>
            <span className="block font-bold">WIZARD PRE-FLIGHT BLOCK</span>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* STEP 1: TRACK SELECTION GATE */}
      {/* ========================================================================================= */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in" id="wizard-step-1">
          <div className="text-center max-w-xl mx-auto py-2">
            <h2 className="text-sm font-mono font-bold text-zinc-400 uppercase tracking-widest">{isRTL ? 'الخطوة الأولى: تحديد مسار النشر' : 'Step 1: Choose Submission Channel'}</h2>
            <p className="text-base sm:text-lg font-serif font-semibold text-black mt-2">
              {isRTL ? 'هل هذا مجهود بحثي مسبق النشر، أم دراسة أصيلة تود نشرها حصرياً؟' : 'Is this an original study for Healthedia Journal or an existing work for the Research Bank?'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* Card A: Research Bank (Open-Access Index) */}
            <div 
              onClick={() => handleSelectTrack('repository')}
              className={`p-6 border rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[300px] ${
                submissionTrack === 'repository'
                  ? 'bg-white border-black ring-1 ring-black shadow-md'
                  : 'bg-zinc-50 hover:bg-zinc-100/50 border-zinc-250 opacity-80'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-lg ${submissionTrack === 'repository' ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-700'}`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  {submissionTrack === 'repository' && (
                    <span className="bg-zinc-100 text-zinc-950 px-2 py-0.5 text-[9px] font-mono rounded border border-black uppercase font-black">
                      Active
                    </span>
                  )}
                </div>

                <h3 className="text-base font-serif font-black text-black">
                  {isRTL ? 'مستودع الأبحاث المفتوح' : 'Track A: Research Bank'}
                </h3>
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-zinc-400 block mt-1">
                  {isRTL ? 'مستودع المعرفة الطويلة والتعاضدية' : 'Open-Access Scholarly Repository'}
                </span>

                <ul className="text-xs text-zinc-500 mt-4 space-y-2 leading-relaxed">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                    <span>{isRTL ? 'غير حصري (أبحاثك المنشورة مسبقاً في دوريات أخرى)' : 'Non-exclusive. Perfect for previously published work'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                    <span>{isRTL ? 'يتطلب توثيق مصدر النشر الأصلي وخطوط وسم DOI مسبقة' : 'Requires original DOI and publisher source details'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                    <span>{isRTL ? 'علامة "مستند مستنسخ وموثق" للمحافظة على الأمانة' : 'Marked with transparent "Republished/Referenced" tags'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-100 font-mono text-[10px] flex justify-between items-center text-zinc-400">
                <span>{isRTL ? 'وزن التصنيف: قياسي (1x)' : 'Ranking Weight: Standard (1x)'}</span>
                <span className="underline font-bold text-zinc-950 uppercase">{isRTL ? 'مفتوح للجميع' : 'Open Access'}</span>
              </div>
            </div>

            {/* Card B: Healthedia Journal (Certified Exclusive) */}
            <div 
              onClick={() => handleSelectTrack('journal')}
              className={`p-6 border rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[300px] ${
                submissionTrack === 'journal'
                  ? 'bg-white border-emerald-500 ring-1 ring-emerald-500 shadow-md'
                  : 'bg-zinc-50 hover:bg-zinc-100/50 border-zinc-250 opacity-80'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-lg ${submissionTrack === 'journal' ? 'bg-emerald-950 text-emerald-350' : 'bg-zinc-200 text-zinc-700'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                  {submissionTrack === 'journal' && (
                    <span className="bg-emerald-100 text-emerald-950 px-2 py-0.5 text-[9px] font-mono rounded border border-emerald-500 uppercase font-black">
                      Active
                    </span>
                  )}
                </div>

                <h3 className="text-base font-serif font-black text-black">
                  {isRTL ? 'مجلة هيلثديا للتحكيم النظير' : 'Track B: Healthedia Journal'}
                </h3>
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-emerald-650 block mt-1">
                  {isRTL ? 'دورية تخصصية مصدقة ومحكّمة' : 'Peer-Reviewed Flagship Journal'}
                </span>

                <ul className="text-xs text-zinc-500 mt-4 space-y-2 leading-relaxed">
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{isRTL ? 'حصرية وسرية مطلقة (عمل أصيل لم ينشر مطلقاً مسبقاً)' : 'Strict exclusivity. Original unpublished work only'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{isRTL ? 'تمر بمراحل المراجعة الثلاثية المحكمة والمكثفة لمجلس التحرير' : 'Undergoes rigorous multi-tier diagnostic board audits'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{isRTL ? 'وسام هيلثديا الذهبي للأوراق المعتمدة عالية الأثر' : 'Awards "Healthedia Peer-Reviewed" Certified Seal'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-100 font-mono text-[10px] flex justify-between items-center text-emerald-650">
                <span>{isRTL ? 'وزن التصنيف: عالي الأثر (2.5x)' : 'Ranking Weight: High Impact (2.5x)'}</span>
                <span className="underline font-bold uppercase">{isRTL ? 'خاضع للتحكيم' : 'Editorial Board'}</span>
              </div>
            </div>

          </div>

          {/* Guidelines disclaimer */}
          <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-xs text-zinc-500 leading-relaxed font-sans">
            <Info className="w-4 h-4 text-black inline-block mr-1 gap-1" />
            <span>
              {isRTL 
                ? 'ملاحظة قانونية: أي ورقة تسجل ضمن الكلية حصرياً (Track B) وتقبل للنشر تصبح خاضعة لملكية فكرية تابعة لهيلثديا. أما أوراق المستودع (Track A) فيشترط أن يملك الباحث فيها رخصة المشاع الإبداعي (CC) لإعادة النشر ومطابقة المحتوى المعرفي.' 
                : 'Scientific integrity advisory: Submitting to Track B demands thorough certification that research data has not been cross-disclosed. Track A records are crawled with standard canonical attributes to guide search indexes responsibly.'}
            </span>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNextStep}
              className="px-5 py-3 font-mono font-bold text-xs sm:text-sm bg-black text-white hover:bg-zinc-900 rounded-xl shadow cursor-pointer flex items-center gap-2"
            >
              <span>{isRTL ? 'الاستمرار للبيانات الوصفية' : 'Continue to Metadata'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* STEP 2: METADATA, AUTHTORSHIP & TRACK ATTRIBUTION */}
      {/* ========================================================================================= */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in" id="wizard-step-2">
          
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
            <div className="border-b border-zinc-150 pb-2 flex justify-between items-center">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                {isRTL ? '1. العناوين والتصنيفات العامة' : 'Section 1: Basic Study Diagnostics'}
              </h3>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${submissionTrack === 'journal' ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-200' : 'bg-zinc-100 text-zinc-700 font-bold'}`}>
                {submissionTrack === 'journal' ? (isRTL ? 'دورية تخصصية' : 'Flagship Journal Target') : (isRTL ? 'مستودع الأبحاث' : 'Repository Target')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{t.title_en} *</label>
                <input
                  type="text"
                  value={titleEN}
                  onChange={(e) => setTitleEN(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-250 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white rounded-xl focus:border-black focus:outline-none transition-all font-sans"
                  placeholder="e.g., Efficacy of SGLT2 Pathways on Heart Failure..."
                  style={{ direction: 'ltr' }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{t.title_ar} *</label>
                <input
                  type="text"
                  value={titleAR}
                  onChange={(e) => setTitleAR(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-250 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white rounded-xl focus:border-black focus:outline-none transition-all font-sans"
                  placeholder="مثال: فعالية مسارات SGLT2 على قصور القلب..."
                  style={{ direction: 'rtl' }}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{isRTL ? 'الباحثون والكتاب (EN، مفصولين بفاصلة)' : 'Research Investigators (EN) *'}</label>
                <input
                  type="text"
                  value={authorsEN}
                  onChange={(e) => setAuthorsEN(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-250 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white rounded-xl focus:border-black focus:outline-none transition-all font-mono"
                  placeholder="e.g., Sarah Jenkins, Ahmad Al-Masri"
                  style={{ direction: 'ltr' }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{isRTL ? 'الباحثون والكتاب (AR، مفصولين بفاصلة) *' : 'Research Investigators (AR) *'}</label>
                <input
                  type="text"
                  value={authorsAR}
                  onChange={(e) => setAuthorsAR(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-250 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white rounded-xl focus:border-black focus:outline-none transition-all font-sans"
                  placeholder="مثال: أحمد المصري، سارة جينكينز"
                  style={{ direction: 'rtl' }}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{isRTL ? 'التصنيف والمحور الطبي (EN) *' : 'Scholarly Category (EN) *'}</label>
                <input
                  type="text"
                  value={categoryEN}
                  onChange={(e) => setCategoryEN(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-250 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white rounded-xl focus:border-black focus:outline-none transition-all"
                  style={{ direction: 'ltr' }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{isRTL ? 'التصنيف والمحور الطبي (AR) *' : 'Scholarly Category (AR) *'}</label>
                <input
                  type="text"
                  value={categoryAR}
                  onChange={(e) => setCategoryAR(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-250 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white rounded-xl focus:border-black focus:outline-none transition-all"
                  style={{ direction: 'rtl' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* ==================== CONDITIONAL FIELDS DEPENDING ON TRACKS ==================== */}
          
          {/* TRACK A: RESEARCH BANK MANDATORY ATTRIBUTION */}
          {submissionTrack === 'repository' && (
            <div className="bg-zinc-50 border border-zinc-250 rounded-2xl p-6 space-y-4" id="track-a-optional-fields">
              <div className="border-b border-zinc-200 pb-2 flex items-center gap-2">
                <Copyright className="w-4 h-4 text-black shrink-0" />
                <h3 className="text-xs font-mono font-black uppercase text-black">
                  {isRTL ? 'بيانات مصدر النشر الأصلي الإلزامية (Track A)' : 'Mandatory Original Publication Attribution (Track A)'}
                </h3>
              </div>

              <p className="text-[11px] text-zinc-500 leading-relaxed -mt-1 font-sans">
                {isRTL 
                  ? 'يرجى تقديم بيانات المصدر والناشر الأصلي لتجنب قضايا انتهاك الملكية الفكرية وسحب الدراسة.' 
                  : 'Since this research was published elsewhere previously, complete original credentials must be cited below. This enforces canonical search references.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">{isRTL ? 'اسم المجلة/الناشر الأصلي *' : 'Original Journal / Publisher Name *'}</label>
                  <input
                    type="text"
                    value={originalJournal}
                    onChange={(e) => setOriginalJournal(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl bg-white focus:border-black focus:outline-none font-sans"
                    placeholder="e.g., The New England Journal of Medicine, Nature"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">{isRTL ? 'تاريخ النشر الأصلي *' : 'Original Publication Date *'}</label>
                  <input
                    type="date"
                    value={originalPubDate}
                    onChange={(e) => setOriginalPubDate(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl bg-white focus:border-black focus:outline-none font-sans"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">{isRTL ? 'رابط المعرّف الرقمي (DOI) أو رابط النشر *' : 'DOI / Original Permalink *'}</label>
                  <input
                    type="text"
                    value={originalLink}
                    onChange={(e) => setOriginalLink(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl bg-white focus:border-black focus:outline-none font-mono"
                    placeholder="e.g., https://doi.org/10.1056/NEJMoa2007621"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">{isRTL ? 'حالة وشروط الملكية الفكرية والترخيص' : 'Copyright / Distribution Status'}</label>
                  <select
                    value={originalCopyrightStatus}
                    onChange={(e) => setOriginalCopyrightStatus(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl bg-white focus:border-black focus:outline-none font-sans"
                  >
                    <option value="CC-BY-4.5">Creative Commons Attribution 4.0 (CC BY)</option>
                    <option value="CC-BY-NC">Creative Commons Attribution-NonCommercial (CC BY-NC)</option>
                    <option value="AUTHOR-RETAINED">Author-Retained Institutional Sharing License</option>
                    <option value="PUBLIC-DOMAIN">Public Domain / Open Access Government Resource</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TRACK B: HEALTHEDIA JOURNAL MANDATORY COVENANT */}
          {submissionTrack === 'journal' && (
            <div className="bg-emerald-50/50 border border-emerald-250 rounded-2xl p-6 space-y-4 animate-fade-in" id="track-b-optional-fields">
              <div className="border-b border-emerald-200 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-850 shrink-0" />
                <h3 className="text-xs font-mono font-black uppercase text-emerald-950">
                  {isRTL ? 'إقرار حصرية البحث ومراجعة النظراء (Track B)' : 'Exclusivity & Double-Blind Review Covenant (Track B)'}
                </h3>
              </div>

              <p className="text-[11px] text-emerald-900 leading-relaxed font-sans">
                {isRTL 
                  ? 'يلتزم الأطباء والباحثون بتقديم مخطوطات خام لم تنشر مسبقاً وتخضع لتقييم مجلس تحرير هيلثديا الموثق.' 
                  : 'By targeting Healthedia flagship peer-review track, you declare that this is an original primary clinical source. It will undergo a closed-loop review queue.'}
              </p>

              <div className="space-y-3 font-sans mt-3">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={exclusivitySigned}
                    onChange={(e) => setExclusivitySigned(e.target.checked)}
                    className="mt-1 border-emerald-400 text-emerald-700 focus:ring-emerald-500 rounded cursor-pointer"
                  />
                  <span className="text-xs text-zinc-805">
                    {isRTL 
                      ? 'أضمن بشكل قاطع بأن هذا العمل أصيل بنسبة 100٪ ولم يتم نشره أو إرساله للفحص في أي مجلة طبية أخرى.' 
                      : 'I guarantee this manuscript contains entirely original scientific outputs and has NOT been submitted elsewhere.'}
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={ethicsAgreementSigned}
                    onChange={(e) => setEthicsAgreementSigned(e.target.checked)}
                    className="mt-1 border-emerald-400 text-emerald-700 focus:ring-emerald-500 rounded cursor-pointer"
                  />
                  <span className="text-xs text-zinc-805">
                    {isRTL 
                      ? 'أوافق على إحالة الدراسة لمراجعين عشوائيين معتمدين والتزم بالقواعد الأخلاقية للرعاية والسريرية.' 
                      : 'I agree to undergo standard double-blind review and certify full compliance with international declarations of clinical ethics.'}
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
            <button
              onClick={handlePrevStep}
              className="px-4 py-2.5 font-mono text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isRTL ? 'الرجوع ومسار النشر' : 'Back to Track'}</span>
            </button>
            <button
              onClick={handleNextStep}
              className="px-5 py-3 font-mono font-bold text-xs sm:text-sm bg-black text-white hover:bg-zinc-900 rounded-xl shadow cursor-pointer flex items-center gap-2"
            >
              <span>{isRTL ? 'الاستمرار للخطوة التالية' : 'Continue to Abstracts'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================================= */}
      {/* STEP 3: NARRATIVE ABSTRACTS & METHODOLOGY */}
      {/* ========================================================================================= */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in" id="wizard-step-3">
          
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100 pb-2">
              {isRTL ? 'الملخص العلمي والمنهجية المتبعة' : '2. Structured Abstract & Technical Methodology'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{t.abstract_en} *</label>
                <textarea
                  value={abstractEN}
                  onChange={(e) => setAbstractEN(e.target.value)}
                  rows={5}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white focus:border-black focus:outline-none transition-all font-sans"
                  placeholder="Background, Objectives, Methods, Outcomes, Discussion..."
                  style={{ direction: 'ltr' }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{t.abstract_ar} *</label>
                <textarea
                  value={abstractAR}
                  onChange={(e) => setAbstractAR(e.target.value)}
                  rows={5}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white focus:border-black focus:outline-none transition-all font-sans"
                  placeholder="الخلفية، الأهداف المبرمجة، الخطوات العلاجية، النتائج، الاستبصار..."
                  style={{ direction: 'rtl' }}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{t.methodology_en} *</label>
                <textarea
                  value={methodologyEN}
                  onChange={(e) => setMethodologyEN(e.target.value)}
                  rows={5}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white focus:border-black focus:outline-none transition-all font-sans"
                  placeholder="Specify clinical dataset source, exclusion ratios, cell signaling assays, or statistic algorithms..."
                  style={{ direction: 'ltr' }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{t.methodology_ar} *</label>
                <textarea
                  value={methodologyAR}
                  onChange={(e) => setMethodologyAR(e.target.value)}
                  rows={5}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white focus:border-black focus:outline-none transition-all font-sans"
                  placeholder="وضح التجارب السريرية، تقسيم العينات العشوائية، قياسات السلامة، ومخططات الكلية..."
                  style={{ direction: 'rtl' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
            <button
              onClick={handlePrevStep}
              className="px-4 py-2.5 font-mono text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isRTL ? 'الرجوع والهوية' : 'Back to Identity'}</span>
            </button>
            <button
              onClick={handleNextStep}
              className="px-5 py-3 font-mono font-bold text-xs sm:text-sm bg-black text-white hover:bg-zinc-900 rounded-xl shadow cursor-pointer flex items-center gap-2"
            >
              <span>{isRTL ? 'متابعة لمتن النتائج' : 'Continue to Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================================= */}
      {/* STEP 4: TRIAL RESULTS, DISCUSSION & OPEN ACCESS LICENSING popup / SIGNATURE */}
      {/* ========================================================================================= */}
      {step === 4 && (
        <div className="space-y-6 animate-fade-in" id="wizard-step-4">
          
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100 pb-2">
              {isRTL ? 'متن النتائج والوقائع الإحصائية والمفاتيح المرجعية' : '3. Manuscript Body & Scientific Terminology'}
            </h3>

            {/* Trial Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{t.results_en}</label>
                <textarea
                  value={resultsEN}
                  onChange={(e) => setResultsEN(e.target.value)}
                  rows={3}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl focus:border-black focus:outline-none focus:ring-1 focus:ring-black font-sans"
                  placeholder="State statistical hazard rates, standard deviation bounds, and p-value indices."
                  style={{ direction: 'ltr' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{t.results_ar}</label>
                <textarea
                  value={resultsAR}
                  onChange={(e) => setResultsAR(e.target.value)}
                  rows={3}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl focus:border-black focus:outline-none focus:ring-1 focus:ring-black font-sans"
                  placeholder="أضف نسب المخاطر المقاسة ومخرجات الأجهزة ونسب التماثل الطبية..."
                  style={{ direction: 'rtl' }}
                />
              </div>
            </div>

            {/* Discussion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{t.discussion_en}</label>
                <textarea
                  value={discussionEN}
                  onChange={(e) => setDiscussionEN(e.target.value)}
                  rows={3}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl focus:border-black focus:outline-none focus:ring-1 focus:ring-black font-sans"
                  placeholder="Describe physiological mechanisms, clinical limitations, and general practice implications."
                  style={{ direction: 'ltr' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{t.discussion_ar}</label>
                <textarea
                  value={discussionAR}
                  onChange={(e) => setDiscussionAR(e.target.value)}
                  rows={3}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl focus:border-black focus:outline-none focus:ring-1 focus:ring-black font-sans"
                  placeholder="وضح آليات ومحددات الاستقراء وتطبيقات الفرز السريري داخل الكلينيك..."
                  style={{ direction: 'rtl' }}
                />
              </div>
            </div>

            {/* Indexing Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{t.keywords_en}</label>
                <input
                  type="text"
                  value={keywordsEN}
                  onChange={(e) => setKeywordsEN(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-350 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white focus:border-black focus:outline-none transition-all"
                  placeholder="e.g., Cardiology, SGLT2 Pathways, Endocrinology"
                  style={{ direction: 'ltr' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">{t.keywords_ar}</label>
                <input
                  type="text"
                  value={keywordsAR}
                  onChange={(e) => setKeywordsAR(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-zinc-350 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white focus:border-black focus:outline-none transition-all"
                  placeholder="مثال: الغدد الصماء، السكري، أمراض القلب وبائيات"
                  style={{ direction: 'rtl' }}
                />
              </div>
            </div>
          </div>

          {/* ==================== MANDATORY COMPLIANCE DISCLOSURE BLOCK PANEL ==================== */}
          <div className="bg-zinc-50 border border-zinc-300 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-mono font-bold text-zinc-950 uppercase tracking-widest border-b border-zinc-200 pb-2">
              {isRTL ? '4. التوقيع الرقمي واتفاقية النشر القانونية والسريرية' : 'Section 4: Legal Consent & Academic Attestation'}
            </h4>

            {submissionTrack === 'repository' ? (
              /* Track A Declaration: Open Access Declaration */
              <div className="space-y-3 font-sans" id="licensing-declaration-box">
                <p className="text-xs text-zinc-650 leading-relaxed">
                  {isRTL 
                    ? 'يتطلب مستودع أبحاث هيلثديا المفتوح تقديم تصريح بملكية النشر وموافقة مشاع إبداعي تتيح لطلاب وعملاء الكلية قراءة ومطابقة المحتوى ونقله.'
                    : 'The Open Access Declaration protects Healthedia against liability by ensuring the submitting researcher guarantees they possess appropriate licensing coefficients for this metadata.'}
                </p>

                <div className="bg-white border border-zinc-200 rounded-xl p-4 text-[11px] text-zinc-500 font-mono h-24 overflow-y-auto leading-relaxed scrollbar-thin">
                  {isRTL 
                    ? 'أقر بصفتي الباحث المودع أنني أمتلك الصلاحية القانونية والملكية الفكرية الكاملة لمشاركة هذا المخطوط وإيداعه في مستودع هيلثديا لإتاحة الوصول المفتوح للأقران، وتبرير الفهرسة الأكاديمية دون الإخلال بحقوق دور النشر الأصلية.'
                    : 'During upload, the user digitally signs this agreement stating they have the legal right to share this content and that it is available for Open Access use within the Healthedia network.'}
                </div>

                <label className="flex items-start gap-3 cursor-pointer select-none ring-1 ring-zinc-200 p-3 rounded-lg hover:bg-zinc-100 transition-all">
                  <input
                    type="checkbox"
                    id="open-access-sign-checkbox"
                    checked={licensingAgreementSigned}
                    onChange={(e) => setLicensingAgreementSigned(e.target.checked)}
                    className="mt-1 border-zinc-300 text-black focus:ring-black rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-black font-sans">
                    {isRTL 
                      ? 'أوافق وأوقع رقمياً على إعلان إقرار النشر المفتوح ومبررات الملكية.' 
                      : 'I digitally sign the Open Access Declaration showing legal upload rights.'}
                  </span>
                </label>
              </div>
            ) : (
              /* Track B Declaration: Exclusive Ethics Declaration & Multi-tier approval */
              <div className="space-y-4 font-sans" id="ethics-declaration-box">
                <div className="p-4 bg-emerald-50 text-emerald-950 rounded-xl text-xs space-y-1.5 border border-emerald-150">
                  <span className="font-bold block uppercase font-mono tracking-wider">{isRTL ? 'بيان مصنف: خاضع للأمانة النظيرة' : 'Flagship Review Track Bound'}</span>
                  <p className="leading-relaxed">
                    {isRTL 
                      ? 'مخطوطتك ستُحال فوراً إلى لجنة الاختصاص العشوائي من مجلس حكماء ومحققي الكليات المعتمدة لفصح النتائج وتقييم المنهجية المتبعة.' 
                      : 'This manuscript is classified as an exclusive proprietary submission. Acceptances undergo sequential multi-tier peer-review as documented in Healthedia directives.'}
                  </p>
                </div>
                
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {isRTL 
                    ? 'لمتابعة النشر، المرجو مراجعة قسم الخطوط والأخلاقيات بالهوية الأكاديمية والمصادقة المبرمة.' 
                    : 'Clinical standards certification: Ensure that patient identities remain anonymous, data sets are traceable, and diagnostic parameters do not violate international healthcare data sharing guidelines.'}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
            <button
              onClick={handlePrevStep}
              className="px-4 py-2.5 font-mono text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isRTL ? 'السابق والمنهجية' : 'Back to Abstracts'}</span>
            </button>
            <button
              onClick={processSubmission}
              id="submit-to-queue-wizard-btn"
              className="px-6 py-3 font-mono font-bold text-xs sm:text-sm bg-black hover:bg-zinc-900 text-white rounded-xl shadow cursor-pointer flex items-center gap-2 transition-all hover:scale-[1.02] border border-black"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isRTL ? 'إرسال المخطوطة للتدقيق' : 'Compile & Transmit Manuscript'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
