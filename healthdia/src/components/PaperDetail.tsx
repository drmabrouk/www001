/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Edit3, ShieldCheck, History, Search, Download, Star, Eye, Calendar, Award, FileSpreadsheet, Globe, Check, ExternalLink } from 'lucide-react';
import { AcademicPaper, UserProfile, WikipediaEdit, GlobalSettings } from '../types';
import { TRANSLATIONS } from '../data';

interface PaperDetailProps {
  currentLang: 'en' | 'ar';
  paper: AcademicPaper;
  currentUser: UserProfile;
  wikiEdits: WikipediaEdit[];
  globalSettings: GlobalSettings;
  onBack: () => void;
  onSuggestEdit: () => void;
}

export default function PaperDetail({
  currentLang,
  paper,
  currentUser,
  wikiEdits,
  globalSettings,
  onBack,
  onSuggestEdit,
}: PaperDetailProps) {
  const t = TRANSLATIONS[currentLang];
  const isRTL = currentLang === 'ar';

  const [activeTab, setActiveTab] = useState<'abstract' | 'methodology' | 'results' | 'discussion' | 'wiki' | 'seo' | 'print'>('abstract');
  const [copiedDoi, setCopiedDoi] = useState(false);

  // Filter Wikipedia edits for this paper
  const paperEdits = wikiEdits.filter(edit => edit.paperId === paper.id);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDoi(true);
    setTimeout(() => setCopiedDoi(false), 2000);
  };

  // SEO Snippet Variables
  const siteUrl = `https://healthdia.org/article/${paper.id}`;
  const displayTitle = paper.seoTitle || (currentLang === 'en' ? paper.titleEN : paper.titleAR);
  const displayDesc = paper.seoDescription || (currentLang === 'en' ? paper.abstractEN : paper.abstractAR);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" id={`paper-detail-viewer-${paper.id}`}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-all focus:outline-none"
        id="btn-back-to-index"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        <span>{isRTL ? 'العودة للمستودع الأكاديمي' : 'Back to Repository Index'}</span>
      </button>

      {/* Main Container */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        
        {/* Paper Primary Header Sheet */}
        <div className={`p-6 sm:p-8 border-b border-zinc-200 ${
          (paper.submissionTrack === 'journal' || paper.journalEN.toLowerCase().includes('healthdia journal'))
            ? 'bg-gradient-to-r from-blue-50/20 to-zinc-50/50'
            : 'bg-zinc-50'
        }`}>
          
          {/* Top Tagline / Peer Review Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] tracking-widest uppercase ${
                (paper.submissionTrack === 'journal' || paper.journalEN.toLowerCase().includes('healthdia journal'))
                  ? 'bg-blue-900 text-white'
                  : 'bg-zinc-950 text-white'
              }`}>
                {paper.id}
              </span>
              <span className="text-zinc-300">|</span>
              <span className="text-zinc-600 font-bold uppercase">
                {currentLang === 'en' ? paper.categoryEN : paper.categoryAR}
              </span>
            </div>

            {/* Seals & Badging */}
            {(paper.submissionTrack === 'journal' || paper.journalEN.toLowerCase().includes('healthdia journal')) ? (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-950 to-blue-900 border border-blue-600/40 text-blue-100 text-[10px] font-mono px-3 py-1.5 rounded-lg uppercase tracking-wider font-extrabold shadow-sm">
                <Award className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>Healthedia Peer-Reviewed Gold Seal</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-zinc-200 border border-zinc-300 text-zinc-900 text-[10px] font-mono px-2.5 py-1 rounded-lg uppercase tracking-wide font-black">
                <span>Republished / Referenced</span>
              </div>
            )}
          </div>

          {/* Paper Title */}
          <h1 className="text-2xl sm:text-3.5xl font-extrabold text-zinc-950 leading-tight font-serif antialiased pb-2">
            {currentLang === 'en' ? paper.titleEN : paper.titleAR}
          </h1>

          {/* Primary Investigators */}
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-sm text-zinc-700 font-sans">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              {t.author}:
            </span>
            <span className="font-semibold underline decoration-zinc-400">
              {(currentLang === 'en' ? paper.authorsEN : paper.authorsAR).join(', ')}
            </span>
          </div>

          {/* Source and DOI information */}
          <div className="mt-6 pt-5 border-t border-zinc-200/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-zinc-500">
            <div className="flex items-start gap-2">
              <Award className="w-4 h-4 text-zinc-950 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase text-zinc-400">{t.academic_journal}</span>
                <span className="font-serif font-bold text-zinc-800 italic text-xs sm:text-sm">
                  {currentLang === 'en' ? paper.journalEN : paper.journalAR}
                </span>
                {paper.submissionTrack === 'journal' && (
                  <span className="block text-[9px] text-emerald-700 font-sans font-semibold mt-0.5">
                    ★ Flagship Double-Blind Publication Status
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileSpreadsheet className="w-4 h-4 text-zinc-950 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase text-zinc-400">{t.doi}</span>
                <button 
                  onClick={() => copyToClipboard(paper.doi)}
                  className="text-zinc-800 font-mono text-xs font-bold underline hover:text-zinc-950 flex items-center gap-1.5"
                >
                  <span>{paper.doi}</span>
                  {copiedDoi ? <Check className="w-3.5 h-3.5 text-zinc-600" /> : <span className="text-[10px] text-zinc-400 font-normal">({isRTL ? 'نسخ' : 'copy'})</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Dynamic Track A Original Source Block */}
          {paper.submissionTrack === 'repository' && (
            <div className="mt-5 p-4 bg-zinc-100 border border-zinc-200/80 rounded-xl space-y-3 font-sans">
              <div className="flex items-center gap-2 mb-1 border-b border-zinc-250 pb-1 text-zinc-900 font-mono text-xs font-bold uppercase">
                <Globe className="w-4 h-4" />
                <span>Original Publication Source (Track A Repository)</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[9.5px] uppercase font-mono">Original Journal</span>
                  <span className="font-bold text-zinc-800">{paper.originalJournal || 'External Indexed Publisher'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[9.5px] uppercase font-mono">Date Published</span>
                  <span className="font-bold text-zinc-850">{paper.originalPubDate || paper.publishedAt}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[9.5px] uppercase font-mono">License Agreement</span>
                  <span className="font-bold text-zinc-850">{paper.originalCopyrightStatus || 'CC-BY Open Access'}</span>
                </div>
              </div>

              {paper.originalLink && (
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-[10.5px] text-emerald-800 font-semibold font-sans flex items-center gap-1">
                    ✓ Digital Licensing Agreement signed (Open Access Authorized)
                  </span>
                  <a 
                    href={paper.originalLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-zinc-900 font-bold underline hover:text-black flex items-center gap-1 text-[11px]"
                  >
                    <span>Visit Original Study</span>
                    <ExternalLink className="w-3.5 h-3.5 inline" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Metrics bar */}
          <div className="mt-6 flex flex-wrap items-center gap-5 pt-4 border-t border-zinc-200/60 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-zinc-700" />
              <span>{t.published}: <strong>{paper.publishedAt}</strong></span>
            </span>
            <span className="text-zinc-300">|</span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-zinc-950" />
              <span>{t.citation_count}: <strong>{paper.citationCount}</strong></span>
            </span>
            <span className="text-zinc-300">|</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-zinc-600" />
              <span>{t.views}: <strong>{paper.views + 128}</strong></span>
            </span>
            <span className="text-zinc-300">|</span>
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4 text-zinc-600" />
              <span>{t.downloads}: <strong>{paper.downloads + 32}</strong></span>
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Tabs inside Paper display */}
        <div className="bg-zinc-100 border-b border-zinc-200 px-4 sm:px-6 flex flex-wrap gap-1" id="paper-view-tabs">
          {[
            { id: 'abstract', label: t.abstract },
            { id: 'methodology', label: t.methodology },
            { id: 'results', label: t.results },
            { id: 'discussion', label: t.discussion },
            { id: 'wiki', label: `${t.edit_history} (${paperEdits.length})` },
            { id: 'seo', label: t.seo_preview.split(' ')[0] },
            { id: 'print', label: isRTL ? 'عرض ورقي (PDF)' : 'PDF Proof' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-3 text-xs sm:text-sm font-medium tracking-tight border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-zinc-950 text-zinc-950 font-bold bg-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Paper Main content panel */}
        <div className="p-6 sm:p-8" id="paper-main-content-panel">
          
          {/* Abstract Tab */}
          {activeTab === 'abstract' && (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-zinc-700 text-sm sm:text-base leading-relaxed font-sans first-letter:text-3xl first-letter:font-bold">
                  {currentLang === 'en' ? paper.abstractEN : paper.abstractAR}
                </p>
              </div>

              {/* Research search keywords indicators */}
              <div className="border-t border-zinc-100 pt-5">
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
                  {isRTL ? 'الكلمات المفتاحية للفهرسة الطبية:' : 'Indexed Medical Descriptors:'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(currentLang === 'en' ? paper.keywordsEN : paper.keywordsAR).map((kw) => (
                    <span key={kw} className="px-3 py-1 font-mono text-xs bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-800">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Methodology Tab */}
          {activeTab === 'methodology' && (
            <div className="space-y-4 font-sans">
              <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-2">
                {t.methodology}
              </h3>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {currentLang === 'en' ? paper.methodologyEN : paper.methodologyAR}
              </p>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-4 font-sans">
              <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-2">
                {t.results}
              </h3>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {currentLang === 'en' ? paper.resultsEN : paper.resultsAR}
              </p>
            </div>
          )}

          {/* Discussion Tab */}
          {activeTab === 'discussion' && (
            <div className="space-y-4 font-sans">
              <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-2">
                {t.discussion}
              </h3>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {currentLang === 'en' ? paper.discussionEN : paper.discussionAR}
              </p>
            </div>
          )}

          {/* Wikipedia Style Audit history tab */}
          {activeTab === 'wiki' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-zinc-950 font-serif">
                    {t.wikipedia_system_title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-tight">
                    {t.wikipedia_system_desc}
                  </p>
                </div>

                {globalSettings.allowOpenContributions ? (
                  <button
                    onClick={onSuggestEdit}
                    id="propose-wiki-edit-btn"
                    className="px-4 py-2 text-xs font-bold bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t.suggest_wiki_edit}</span>
                  </button>
                ) : (
                  <span className="px-2.5 py-1.5 bg-zinc-100 text-zinc-500 font-mono text-[11px] rounded-lg border border-zinc-200">
                    {isRTL ? 'التحرير التشاركي مغلق حالياً من الإدارة' : 'Wiki Contribution Lock Engaged'}
                  </span>
                )}
              </div>

              {/* Wikipedia List representation */}
              {paperEdits.length === 0 ? (
                <div className="text-center py-10 bg-zinc-50 border border-zinc-200 rounded-xl border-dashed">
                  <p className="text-sm text-zinc-500 font-mono">
                    {t.no_history}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paperEdits.map((edit) => (
                    <div 
                      key={edit.id} 
                      className={`p-4 rounded-xl border text-xs sm:text-sm font-sans relative transition-all ${
                        edit.status === 'approved' 
                          ? 'border-zinc-200 bg-white' 
                          : edit.status === 'rejected'
                            ? 'border-zinc-200 bg-zinc-50/50 opacity-70'
                            : 'border-zinc-300 bg-zinc-50 border-dashed animate-pulse'
                      }`}
                    >
                      {/* Meta information row */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs text-zinc-500 mb-2 border-b border-zinc-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            edit.status === 'approved' 
                              ? 'bg-zinc-900 text-white' 
                              : edit.status === 'rejected'
                                ? 'bg-zinc-200 text-zinc-600'
                                : 'bg-zinc-200 text-zinc-800'
                          }`}>
                            {edit.status === 'approved' 
                              ? t.academic_verification 
                              : edit.status === 'rejected' 
                                ? 'REJECTED REVISION'
                                : t.pending_verification}
                          </span>
                          <span className="text-zinc-300">|</span>
                          <span className="text-zinc-900 font-bold">{edit.id}</span>
                        </div>
                        <span className="text-zinc-400">{edit.createdAt}</span>
                      </div>

                      {/* Detail attributes */}
                      <div className="space-y-2">
                        <p className="leading-relaxed">
                          <strong className="font-mono text-[11px] text-zinc-500 uppercase block">{t.edit_by}:</strong>
                          <span className="font-semibold underline text-zinc-900">{edit.suggestedByName}</span> ({edit.suggestedBy})
                        </p>
                        
                        <p className="leading-relaxed">
                          <strong className="font-mono text-[11px] text-zinc-500 uppercase block">{isRTL ? 'القسم المعدل:' : 'Altered Section:'}</strong>
                          <span className="font-mono font-bold text-zinc-850 bg-zinc-100 px-1.5 py-0.5 rounded text-[11px] uppercase">
                            {edit.section}
                          </span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 pt-2 bg-zinc-50/50 p-3 rounded-lg border border-zinc-100">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 block mb-0.5">
                              {isRTL ? 'نص المقترح المعتمد:' : 'Proposed text consensus:'}
                            </span>
                            <p className="text-xs text-zinc-700 italic border-l-2 border-zinc-900 pl-2 rtl:border-l-0 rtl:border-r-2 rtl:pr-2 leading-relaxed font-sans">
                              {edit.proposedText}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 block mb-0.5">
                              {t.justification}:
                            </span>
                            <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                              {edit.justification}
                            </p>
                          </div>
                        </div>

                        {/* Editor verification note */}
                        {edit.editorFeedback && (
                          <div className="mt-2.5 p-2.5 bg-zinc-100 rounded-lg text-xs leading-relaxed flex gap-2 items-start font-sans text-zinc-700 border border-zinc-200">
                            <strong>{isRTL ? 'رأي المحرر:' : 'Editorial Response:'}</strong>
                            <span>{edit.editorFeedback}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SEO Preview Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6" id="seo-preview-tool-section">
              <div>
                <h3 className="text-base font-bold text-zinc-950 font-serif">
                  {t.seo_preview}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  {t.seo_explainer}
                </p>
              </div>

              {/* Digital Mock of Google Result */}
              <div 
                className="p-6 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-2 text-left" 
                style={{ direction: 'ltr' }} // SERP always matches this styling
              >
                <div className="text-[11px] font-mono text-zinc-400 leading-none">
                  Google Search Engine Simulation
                </div>
                <div className="space-y-1">
                  {/* Google Breadcrumb */}
                  <div className="text-xs text-[#202124] flex items-center gap-1.5 truncate">
                    <span className="underline select-none">healthdia.org</span>
                    <span className="text-[10px] text-zinc-400">› articles › {paper.id.toLowerCase()}</span>
                  </div>

                  {/* Blue Title Link */}
                  <a href="#" className="text-[19px] sm:text-[20px] text-[#1a0dab] hover:underline font-serif leading-snug block font-medium">
                    {displayTitle} - Healthdia.org Peer Review Database
                  </a>

                  {/* Description Meta */}
                  <div className="text-xs sm:text-[13px] text-[#4d5156] leading-relaxed max-w-[620px]">
                    <span className="text-zinc-500 font-mono text-[11px] select-none">May 27, 2026 — </span>
                    {displayDesc.length > 155 ? `${displayDesc.substring(0, 155).trim()}...` : displayDesc}
                  </div>
                </div>
              </div>

              {/* Editable Fields for SEO preview tuning */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-150 pb-2">
                  <span className="block text-xs font-mono font-bold uppercase text-zinc-400">
                    SEO Meta Adjuster & Indexing Directives
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    paper.submissionTrack === 'journal' ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {paper.submissionTrack === 'journal' ? 'Primary Original Source' : 'Republished Index'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">{t.meta_title}</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none"
                      value={displayTitle}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">{t.meta_desc}</label>
                    <textarea
                      rows={2}
                      className="w-full text-xs p-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none"
                      value={displayDesc}
                      readOnly
                    />
                  </div>
                </div>

                {/* Simulated Meta Canonical Directive Box */}
                <div className="bg-zinc-950 text-[#a7f3d0] p-4 rounded-xl font-mono text-xs space-y-2 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase tracking-wider font-bold">
                    Biomedical Index crawler headers (Google Scholar compliance)
                  </span>
                  {paper.submissionTrack === 'repository' ? (
                    <div className="space-y-1">
                      <p className="text-zinc-350">{`<!-- Inform search engines that this is a republished copy -->`}</p>
                      <p className="text-amber-300 font-bold">{`<link rel="canonical" href="${paper.originalLink || 'https://external-publisher.org/' + paper.doi}" />`}</p>
                      <p className="text-zinc-400 text-[11px] leading-relaxed pt-1 select-none">
                        ✓ Index signal: <code>REPUBLISHED_ARCHIVE</code>. Google Scholar consolidates citation metrics automatically onto the original target publisher.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-zinc-350">{`<!-- Inform search engines that this is the original primary host -->`}</p>
                      <p className="text-emerald-400 font-bold">{`<link rel="canonical" href="https://healthdia.org/article/${paper.id}" />`}</p>
                      <p className="text-zinc-400 text-[11px] leading-relaxed pt-1 select-none">
                        ✓ Index signal: <code>ORIGINAL_PRIMARY_SOURCE</code>. Certified with Healthedia flagship DOI metadata.
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-zinc-500 font-mono leading-tight">
                  {isRTL 
                    ? 'أدوات السيو مفعلة تلقائياً في الواجهة الخلفية لضمان فهرسة المخطوطات الطبية بدقة في غوغل شولر وبَب-ميد.'
                    : 'Search Engine Optimization components render canonical URLs and index protocols for Google Scholar compliance.'}
                </div>
              </div>
            </div>
          )}

          {/* Print Draft PDF Layout */}
          {activeTab === 'print' && (
            <div className="space-y-6" id="simulated-pdf-section">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-zinc-950 font-serif">
                    {isRTL ? 'معاينة المسودة الورقية المعتمدة' : 'Archival Manuscript Proof'}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-tight">
                    {isRTL ? 'هيكل تقليدي ثنائي العمود يحاكي المطبوعات الطبية والمجلات العالمية.' : 'Double-column layout mirroring classic scientific biomedical printing sheets.'}
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 text-xs font-mono font-bold border border-zinc-950 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer"
                >
                  {isRTL ? 'طباعة المستند (Print)' : 'Print Sheet 📄'}
                </button>
              </div>

              {/* Double Column Sheet Simulator */}
              <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-xl font-serif text-zinc-900 leading-normal text-xs sm:text-sm shadow-inner" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="max-w-[650px] mx-auto space-y-6 bg-white p-8 border border-zinc-300 shadow-sm relative overflow-hidden">
                  
                  {/* Ledger header */}
                  <div className="text-center border-b border-zinc-300 pb-4 font-mono text-[9px] text-zinc-500 tracking-widest uppercase flex justify-between items-center">
                    <span>HEALTHDIA RESEARCH BANK</span>
                    <span>ISSN: 2984-1029</span>
                    <span>HD-{paper.id}</span>
                  </div>

                  {/* Centered Document details */}
                  <div className="text-center pt-2 space-y-2">
                    <h2 className="text-xl font-bold font-serif leading-tight">
                      {currentLang === 'en' ? paper.titleEN : paper.titleAR}
                    </h2>
                    <p className="font-sans font-medium text-zinc-700 italic text-[11px]">
                      {(currentLang === 'en' ? paper.authorsEN : paper.authorsAR).join(', ')}
                    </p>
                    <p className="font-mono text-[9px] text-zinc-500 uppercase">
                      DOI: https://doi.org/{paper.doi} • {paper.publishedAt}
                    </p>
                  </div>

                  {/* Document Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 text-[11.5px] leading-relaxed text-zinc-800 text-justify">
                    <div>
                      <h4 className="font-bold font-serif text-zinc-950 uppercase border-b border-zinc-200 mb-1">
                        I. {isRTL ? 'ملخص مقتضب' : 'ABSTRACT STUDY'}
                      </h4>
                      <p className="mb-4">
                        {currentLang === 'en' ? paper.abstractEN : paper.abstractAR}
                      </p>

                      <h4 className="font-bold font-serif text-zinc-950 uppercase border-b border-zinc-200 mb-1 mt-3">
                        II. {isRTL ? 'المنهجية والتحليل' : 'METHODOLOGY'}
                      </h4>
                      <p>
                        {currentLang === 'en' ? paper.methodologyEN : paper.methodologyAR}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold font-serif text-zinc-950 uppercase border-b border-zinc-200 mb-1">
                        III. {isRTL ? 'مخرجات البحث' : 'ANALYSIS RESULTS'}
                      </h4>
                      <p className="mb-4">
                        {currentLang === 'en' ? paper.resultsEN : paper.resultsAR}
                      </p>

                      <h4 className="font-bold font-serif text-zinc-950 uppercase border-b border-zinc-200 mb-1 mt-3">
                        IV. {isRTL ? 'مناقشة علمية' : 'DISCUSSION'}
                      </h4>
                      <p>
                        {currentLang === 'en' ? paper.discussionEN : paper.discussionAR}
                      </p>
                    </div>
                  </div>

                  {/* Print footer tracking */}
                  <div className="border-t border-zinc-200 pt-4 mt-8 flex justify-between items-center text-[9px] font-mono text-zinc-400">
                    <span>OFFICIAL SCHOLARLY RELEASE • HEALTHDIA</span>
                    <span>SERIAL: {paper.id}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
