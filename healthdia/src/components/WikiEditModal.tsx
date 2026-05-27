/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Globe, Clipboard, ShieldAlert, BadgeInfo } from 'lucide-react';
import { AcademicPaper, UserProfile, WikipediaEdit } from '../types';
import { TRANSLATIONS } from '../data';

interface WikiEditModalProps {
  currentLang: 'en' | 'ar';
  paper: AcademicPaper;
  currentUser: UserProfile;
  onClose: () => void;
  onSubmitProposal: (proposal: Omit<WikipediaEdit, 'id' | 'createdAt' | 'status'>) => void;
}

export default function WikiEditModal({
  currentLang,
  paper,
  currentUser,
  onClose,
  onSubmitProposal,
}: WikiEditModalProps) {
  const t = TRANSLATIONS[currentLang];
  const isRTL = currentLang === 'ar';

  const [section, setSection] = useState<'abstract' | 'methodology' | 'results' | 'discussion'>('abstract');
  const [proposedText, setProposedText] = useState('');
  const [justification, setJustification] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-populate current text when section changes
  const originalText = useEffect(() => {
    let text = '';
    if (section === 'abstract') text = currentLang === 'en' ? paper.abstractEN : paper.abstractAR;
    else if (section === 'methodology') text = currentLang === 'en' ? paper.methodologyEN : paper.methodologyAR;
    else if (section === 'results') text = currentLang === 'en' ? paper.resultsEN : paper.resultsAR;
    else if (section === 'discussion') text = currentLang === 'en' ? paper.discussionEN : paper.discussionAR;
    setProposedText(text);
  }, [section, paper, currentLang]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!proposedText.trim()) {
      setErrorMsg(isRTL ? 'يرجى تقديم المقترح التعديلي للنص.' : 'Proposed text cannot be blank.');
      return;
    }
    if (!justification.trim() || justification.length < 15) {
      setErrorMsg(isRTL ? 'الرجاء كتابة تعليل أكاديمي رصين لا يقل عن 15 حرفاً.' : 'Justification must be at least 15 characters.');
      return;
    }

    onSubmitProposal({
      paperId: paper.id,
      paperTitleEN: paper.titleEN,
      paperTitleAR: paper.titleAR,
      suggestedBy: currentUser.id,
      suggestedByName: currentUser.name,
      section,
      originalText: section === 'abstract' 
        ? (currentLang === 'en' ? paper.abstractEN : paper.abstractAR)
        : section === 'methodology' 
          ? (currentLang === 'en' ? paper.methodologyEN : paper.methodologyAR)
          : section === 'results' 
            ? (currentLang === 'en' ? paper.resultsEN : paper.resultsAR)
            : (currentLang === 'en' ? paper.discussionEN : paper.discussionAR),
      proposedText,
      justification,
    });
  };

  const getSectionLabel = (sect: string) => {
    switch(sect) {
      case 'abstract': return t.abstract;
      case 'methodology': return t.methodology;
      case 'results': return t.results;
      case 'discussion': return t.discussion;
      default: return sect;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" id="wiki-edit-modal-wrapper">
      <div className="bg-white border border-zinc-300 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Header bar */}
        <div className="bg-zinc-950 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              {t.wikipedia_system_title}
            </span>
            <h2 className="text-sm sm:text-base font-serif font-bold text-white truncate max-w-lg">
              {t.propose_edit_for}: {currentLang === 'en' ? paper.titleEN : paper.titleAR}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner / Traceability notice */}
        <div className="bg-zinc-50 border-b border-zinc-200 p-4 flex gap-3 text-xs text-zinc-600">
          <ShieldAlert className="w-5 h-5 text-zinc-950 shrink-0" />
          <div>
            <span className="block font-bold text-zinc-900 font-mono">
              {t.academic_id} Traceability Active
            </span>
            <p className="mt-0.5 leading-relaxed">
              {isRTL 
                ? `سيتم حفظ وتثبيت هذا المقترح التعديلي تحت رقم الهوية الرقمية الأكاديمية الخاص بك ${currentUser.id}. مسارات التدقيق تضمن عدم العبث بالأبحاث.`
                : `Your suggestion is tied permanently to your official credential ID: ${currentUser.id} (${currentUser.name}). Revisions undergo strict multi-tier editorial vetting before database cataloging.`}
            </p>
          </div>
        </div>

        {/* Dynamic form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
          
          {/* Form grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Section selector */}
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-700 uppercase mb-2">
                {isRTL ? 'القسم المستهدف بالتعديل' : 'Target Manuscript Section'}
              </label>
              <select
                id="edit-section-target"
                value={section}
                onChange={(e) => setSection(e.target.value as any)}
                className="w-full text-sm p-3 border border-zinc-200 rounded-xl bg-white focus:border-zinc-950 font-sans focus:outline-none focus:ring-1 focus:ring-zinc-950"
              >
                <option value="abstract">{t.abstract}</option>
                <option value="methodology">{t.methodology}</option>
                <option value="results">{t.results}</option>
                <option value="discussion">{t.discussion}</option>
              </select>
            </div>

            {/* Simulated environment preview */}
            <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <BadgeInfo className="w-4 h-4 text-zinc-700 shrink-0" />
              <span>
                {isRTL 
                  ? 'يتطلب الترقية مستندات داعمة لفرز مخرجات البحث.' 
                  : 'Wikipedia community edits need strict evidence of accuracy.'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Original Text display (Read-only) */}
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-700 uppercase mb-2">
                {t.original_text} ({getSectionLabel(section)})
              </label>
              <div 
                className="w-full text-xs sm:text-sm p-4 border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-500 overflow-y-auto max-h-[160px] leading-relaxed font-sans"
              >
                {section === 'abstract' 
                  ? (currentLang === 'en' ? paper.abstractEN : paper.abstractAR)
                  : section === 'methodology' 
                    ? (currentLang === 'en' ? paper.methodologyEN : paper.methodologyAR)
                    : section === 'results' 
                      ? (currentLang === 'en' ? paper.resultsEN : paper.resultsAR)
                      : (currentLang === 'en' ? paper.discussionEN : paper.discussionAR)}
              </div>
            </div>

            {/* Proposed text editor */}
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-900 uppercase mb-2">
                {t.proposed_text}
              </label>
              <textarea
                id="edit-proposed-textarea"
                value={proposedText}
                onChange={(e) => setProposedText(e.target.value)}
                rows={6}
                className="w-full text-xs sm:text-sm p-4 border border-zinc-300 rounded-xl bg-white focus:border-zinc-950 font-sans focus:outline-none focus:ring-1 focus:ring-zinc-950 max-h-[160px] leading-relaxed"
                placeholder={isRTL ? 'اكتب الصياغة الأكاديمية المقترحة هنا...' : 'Input proposed scientific wording here...'}
              />
            </div>
          </div>

          {/* Edit summary justification */}
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-900 uppercase mb-2">
              {t.justification} <span className="text-zinc-500">({isRTL ? 'الحد الأدنى 15 حرفاً' : 'Minimum 15 letters'})</span>
            </label>
            <textarea
              id="edit-justification-textarea"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={3}
              className="w-full text-xs sm:text-sm p-3 border border-zinc-300 rounded-xl bg-white focus:border-zinc-950 font-sans focus:outline-none focus:ring-1 focus:ring-zinc-950 leading-relaxed"
              placeholder={isRTL 
                ? 'قدم شرحاً موجزاً لسبب التغيير، مثلاً: "تحديث معالم التحليل التلوي وفق دراسة DAPA-CKD الأخيرة لعام 2024..."' 
                : 'Explain scholarly reasons or reference citation, e.g., "Updated RCT meta-regression outputs incorporating regional clinical data from CUMC..."'}
            />
          </div>

          {errorMsg && (
            <div className="bg-zinc-50 text-zinc-900 font-mono text-xs border border-zinc-200 p-3 rounded-xl">
              <strong>Error:</strong> {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-zinc-200 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              id="submit-proposal-btn"
              className="px-5 py-2 text-sm font-bold bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              {t.submit_proposal}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
