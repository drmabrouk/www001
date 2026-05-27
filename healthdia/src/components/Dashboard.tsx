/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, UserCheck, Layers, Settings, CheckCircle, XCircle, Info, Sparkles, 
  Scale, RefreshCw, Landmark, Mail, Database, AlertCircle, Award, Clock,
  Plus, Trash2, Send, Activity, List, FileText, ChevronRight, ExternalLink, Globe
} from 'lucide-react';
import { AcademicPaper, WikipediaEdit, UserProfile, GlobalSettings, AcademicRole } from '../types';
import { TRANSLATIONS } from '../data';

// Import our modular GCP panels
import GCPOverview from './GCPOverview';
import GCPUsers from './GCPUsers';
import GCPIntelligence from './GCPIntelligence';
import GCPAesthetics from './GCPAesthetics';
import GCPAutomation from './GCPAutomation';
import GCPInfrastructure from './GCPInfrastructure';

interface DashboardProps {
  currentLang: 'en' | 'ar';
  currentUser: UserProfile;
  papers: AcademicPaper[];
  wikiEdits: WikipediaEdit[];
  users: UserProfile[];
  globalSettings: GlobalSettings;
  onUpdatePaperStatus: (paperId: string, status: 'approved' | 'rejected', notes?: string) => void;
  onUpdateEditStatus: (editId: string, status: 'approved' | 'rejected', feedback?: string) => void;
  onUpdateUserRole: (userId: string, targetRole: AcademicRole) => void;
  onUpdateUser: (userId: string, updatedFields: Partial<UserProfile>) => void;
  onSaveSettings: (settings: GlobalSettings) => void;
}

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
}

export type GCPSegment = 'overview' | 'users' | 'content' | 'intelligence' | 'aesthetics' | 'automation' | 'infrastructure';

export default function Dashboard({
  currentLang,
  currentUser,
  papers,
  wikiEdits,
  users,
  globalSettings,
  onUpdatePaperStatus,
  onUpdateEditStatus,
  onUpdateUserRole,
  onUpdateUser,
  onSaveSettings,
}: DashboardProps) {
  const t = TRANSLATIONS[currentLang];
  const isRTL = currentLang === 'ar';

  const [activeSegment, setActiveSegment] = useState<GCPSegment>('overview');
  const [activeContentTab, setActiveContentTab] = useState<'repository' | 'journal' | 'wiki' | 'announcements'>('repository');
  const [assignedReviewers, setAssignedReviewers] = useState<Record<string, string>>({});
  const [assignedReviewersList, setAssignedReviewersList] = useState<Record<string, string[]>>({});
  
  // Editorial inputs state
  const [rejectFeedbackPaperId, setRejectFeedbackPaperId] = useState<string | null>(null);
  const [paperFeedbackInput, setPaperFeedbackInput] = useState('');
  
  const [rejectFeedbackEditId, setRejectFeedbackEditId] = useState<string | null>(null);
  const [editFeedbackInput, setEditFeedbackInput] = useState('');

  // Settings base state
  const [settingsForm, setSettingsForm] = useState<GlobalSettings>({ ...globalSettings });

  // Article State Management (dedicated section for individual articles, press releases, etc.)
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 'ART-2026-90',
      title: 'Healthdia partners with Cairo University Medical Faculty on automated Retinopathy AI research integration',
      category: 'Press Release',
      content: 'Under senior advisory review of Dr. Mabrouk Al-Hadi, Healthdia is launching experimental server portals matching academic RetinaNet with local healthcare registries across Cairo clinics to speed up early screening workflows.',
      createdAt: '2026-05-25'
    },
    {
      id: 'ART-2026-11',
      title: 'Guidelines on cardiovascular epidemiological indexing in Middle Eastern climates',
      category: 'Guidelines',
      content: 'Official directives for indexing ACS clinical trial results in heat-stress areas. Requires a random-effects meta-regression baseline.',
      createdAt: '2026-05-20'
    }
  ]);

  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState('Press Release');
  const [newArticleContent, setNewArticleContent] = useState('');

  // Separate papers & edits in active state
  const pendingPapers = papers.filter((p) => p.status === 'pending');
  const pendingEdits = wikiEdits.filter((e) => e.status === 'pending');

  const handleUpdatePaper = (paperId: string, status: 'approved' | 'rejected') => {
    onUpdatePaperStatus(paperId, status, paperFeedbackInput);
    setRejectFeedbackPaperId(null);
    setPaperFeedbackInput('');
  };

  const handleUpdateEdit = (editId: string, status: 'approved' | 'rejected') => {
    onUpdateEditStatus(editId, status, editFeedbackInput);
    setRejectFeedbackEditId(null);
    setEditFeedbackInput('');
  };

  const handleSettingsChange = (updated: Partial<GlobalSettings>) => {
    const next = { ...settingsForm, ...updated };
    setSettingsForm(next);
    onSaveSettings(next);
  };

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleTitle || !newArticleContent) return;

    const newArt: Article = {
      id: `ART-2026-${Math.floor(Math.random() * 90 + 10)}`,
      title: newArticleTitle,
      category: newArticleCategory,
      content: newArticleContent,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setArticles(prev => [newArt, ...prev]);
    setNewArticleTitle('');
    setNewArticleContent('');
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  // 7 segments listing matching GCP Structure guidelines
  const segmentsList = [
    { id: 'overview', label: isRTL ? 'لوحة القيادة والمؤشرات حيوية' : 'Nerve Center Overview', badge: 0 },
    { id: 'users', label: isRTL ? 'إدارج الهويات والتراخيص' : 'User & Identity Management', badge: 0 },
    { id: 'content', label: isRTL ? 'محرك الأبحاث والمقالات' : 'Research & Content Engine', badge: pendingPapers.length + pendingEdits.length },
    { id: 'intelligence', label: isRTL ? 'الذكاء المؤسسي والرتب' : 'Institutional Intelligence', badge: 0 },
    { id: 'aesthetics', label: isRTL ? 'لوحات التصميم وهوية الخطوط' : 'System Aesthetics (UI)', badge: 0 },
    { id: 'automation', label: isRTL ? 'الأتمتة والـ SEO والمراسلة' : 'Communication & SEO', badge: 0 },
    { id: 'infrastructure', label: isRTL ? 'البنية التحتية والتعافي' : 'Infrastructure Settings', badge: 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="admin-dashboard-container" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Dynamic Egress Warning on top for High Priority Alert */}
      <div className="bg-zinc-950 text-white rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-black gap-4 text-xs font-sans">
        <div className="flex items-center gap-3">
          <div className="bg-white text-zinc-950 p-2 rounded-xl font-bold font-mono">
            ALERT
          </div>
          <div>
            <h4 className="font-bold flex items-center gap-1">
              <span>{isRTL ? 'التحقق الأكاديمي الموحد نشط' : 'Unified GCP Security Access Active'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
            </h4>
            <span className="text-zinc-500 font-mono text-[10px] block">
              Operator: {currentUser.name} | Rank: {currentUser.role.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="font-mono text-[11px] text-zinc-400 bg-zinc-900 px-3 py-1.5 border border-zinc-800 rounded-xl leading-none">
          {isRTL ? 'رقم ترخيص الخادم: 12-BETA-3000' : 'Secure Ingress Node: PORT 3000'}
        </div>
      </div>

      {/* Grid Layout containing Sidebar and Workstation Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar Selection Column */}
        <div className="lg:col-span-1 space-y-1.5" id="dashboard-sidebar">
          {segmentsList.map((seg) => (
            <button
              key={seg.id}
              onClick={() => setActiveSegment(seg.id as any)}
              className={`w-full text-left rtl:text-right px-4 py-3.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeSegment === seg.id
                  ? 'bg-zinc-950 text-white border border-black/80 shadow-md'
                  : 'bg-zinc-100/60 text-zinc-650 hover:bg-zinc-200/50 border border-transparent'
              }`}
            >
              <span>{seg.label}</span>
              {seg.badge > 0 && (
                <span className={`px-2 py-0.5 text-[9px] font-mono rounded-full font-bold ${
                  activeSegment === seg.id ? 'bg-white text-zinc-950' : 'bg-zinc-900 text-white animate-pulse'
                }`}>
                  {seg.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Workstation Console Desktop */}
        <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 min-h-[520px]" id="dashboard-workstation-body">
          
          {/* SEC 1: Dashboard Overview (The Nerve Center) */}
          {activeSegment === 'overview' && (
            <GCPOverview
              currentLang={currentLang}
              pendingPapersCount={pendingPapers.length}
              pendingEditsCount={pendingEdits.length}
            />
          )}

          {/* SEC 2: User & Identity Management */}
          {activeSegment === 'users' && (
            <GCPUsers
              currentLang={currentLang}
              users={users}
              currentUser={currentUser}
              onUpdateUserRole={onUpdateUserRole}
              onUpdateUser={onUpdateUser}
            />
          )}

          {/* SEC 3: Research & Content Engine */}
          {activeSegment === 'content' && (
            <div className="space-y-8 font-sans">
              
              {/* Header */}
              <div>
                <h2 className="text-lg font-bold text-zinc-950 font-serif border-b border-zinc-100 pb-2 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-zinc-900" />
                  <span>{isRTL ? 'إدارة المحتوى العيادي والمراجعات والمقالات الصحفية' : 'Research & Content Moderation Desk'}</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {isRTL 
                    ? 'تدقيق الأطروحات الطبية المسلمة، إقرار تعديلات ويكيبيديا الحيوية، وكتابة الأخبار والبيانات الصحفية غير البحثية للمنصة.'
                    : 'Vet newly deposited scientific manuscripts, certify collaborative wiki adjustments, and compose non-research editorial announcements.'}
                </p>
              </div>

              {/* Nested Sub-navigation for Dual-Stream Content Engineering */}
              <div className="flex flex-wrap gap-2 border-b border-zinc-200 mb-6" id="gcp-content-sub-tabs">
                <button
                  type="button"
                  onClick={() => setActiveContentTab('repository')}
                  className={`px-4 py-2.5 text-xs font-mono font-bold uppercase transition-all border-b-2 flex items-center gap-2 ${
                    activeContentTab === 'repository'
                      ? 'border-zinc-950 text-zinc-950 bg-zinc-50/50'
                      : 'border-transparent text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Repository Monitor ({pendingPapers.filter(p => p.submissionTrack !== 'journal').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveContentTab('journal')}
                  className={`px-4 py-2.5 text-xs font-mono font-bold uppercase transition-all border-b-2 flex items-center gap-2 ${
                    activeContentTab === 'journal'
                      ? 'border-blue-600 text-blue-700 bg-blue-50/10'
                      : 'border-transparent text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Journal Editorial Board ({pendingPapers.filter(p => p.submissionTrack === 'journal').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveContentTab('wiki')}
                  className={`px-4 py-2.5 text-xs font-mono font-bold uppercase transition-all border-b-2 flex items-center gap-2 ${
                    activeContentTab === 'wiki'
                      ? 'border-zinc-950 text-zinc-950 bg-zinc-50/50'
                      : 'border-transparent text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Wikipedia Revisions ({pendingEdits.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveContentTab('announcements')}
                  className={`px-4 py-2.5 text-xs font-mono font-bold uppercase transition-all border-b-2 flex items-center gap-2 ${
                    activeContentTab === 'announcements'
                      ? 'border-zinc-950 text-zinc-950 bg-zinc-50/50'
                      : 'border-transparent text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Announcements Desk</span>
                </button>
              </div>

              {/* Workstation nested columns */}
              <div className="space-y-8">
                
                {/* 3.1: TRACK A - REPOSITORY MONITOR */}
                {activeContentTab === 'repository' && (
                  <div className="border border-zinc-200 p-6 rounded-[28px] bg-white space-y-5" id="gcp-repository-monitor">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-zinc-900 font-serif uppercase tracking-wider flex items-center gap-1.5">
                          <Globe className="w-4.5 h-4.5 text-zinc-950" />
                          <span>Repository Monitor — Track A Open-Access Bank</span>
                        </h3>
                        <p className="text-[11px] text-zinc-500 mt-1 font-sans">
                          Validate republished metadata details, verify canonical pointers to external journals, and audit digital licensing permissions before live syndication.
                        </p>
                      </div>
                      <span className="text-xs bg-zinc-100 text-zinc-800 px-3 py-1 rounded-full font-mono font-semibold">
                        {pendingPapers.filter(p => p.submissionTrack !== 'journal').length} pending
                      </span>
                    </div>

                    {pendingPapers.filter(p => p.submissionTrack !== 'journal').length === 0 ? (
                      <div className="text-center py-12 bg-zinc-50 border border-zinc-200 border-dashed rounded-2xl p-6">
                        <span className="block text-2xl mb-2">📁</span>
                        <p className="text-xs font-mono text-zinc-500">
                          All Open-Access Research Bank submissions have been audited. No pending papers in repository.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6" id="repository-monitor-stack">
                        {pendingPapers.filter(p => p.submissionTrack !== 'journal').map((paper) => (
                          <div key={paper.id} className="p-6 border border-zinc-200 hover:border-zinc-450 rounded-2xl bg-zinc-50/40 space-y-5 text-xs sm:text-sm font-sans transition-all">
                            
                            {/* Meta row */}
                            <div className="flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs border-b border-zinc-100 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 bg-zinc-950 text-white font-bold rounded text-[10px]">
                                  {paper.id}
                                </span>
                                <span className="text-zinc-600 font-bold uppercase text-[10px]">
                                  {currentLang === 'en' ? paper.categoryEN : paper.categoryAR}
                                </span>
                              </div>
                              <span className="text-zinc-400 text-[11px]">
                                Submitted by: <strong className="text-zinc-800 font-semibold">{paper.submittedByName}</strong> ({paper.submittedBy})
                              </span>
                            </div>

                            {/* Details of paper */}
                            <div>
                              <h4 className="text-base font-extrabold text-zinc-900 mb-1.5 font-serif leading-snug">
                                {currentLang === 'en' ? paper.titleEN : paper.titleAR}
                              </h4>
                              <p className="text-zinc-500 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                                <strong>Abstract Snapshot:</strong> {currentLang === 'en' ? paper.abstractEN : paper.abstractAR}
                              </p>
                            </div>

                            {/* EXPLICIT TRANSACTED METADATA FOR TRACK A */}
                            <div className="p-4 bg-white border border-zinc-200 rounded-xl space-y-3 font-mono text-xs">
                              <div className="text-xs font-bold text-zinc-900 uppercase border-b border-zinc-100 pb-1.5 flex items-center justify-between">
                                <span>Declared Metadata From Original Publication:</span>
                                <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wide">
                                  Track A Open-Access Approved
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <span className="text-zinc-450 block text-[9.5px] uppercase">Original Journal/Publisher:</span>
                                  <span className="font-bold text-zinc-900">{paper.originalJournal || paper.journalEN || 'Not declared'}</span>
                                </div>
                                <div>
                                  <span className="text-zinc-455 block text-[9.5px] uppercase">Original Publication Date:</span>
                                  <span className="font-bold text-zinc-850">{paper.originalPubDate || 'Not declared'}</span>
                                </div>
                                <div>
                                  <span className="text-zinc-455 block text-[9.5px] uppercase">Original Link:</span>
                                  {paper.originalLink ? (
                                    <a href={paper.originalLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-bold flex items-center gap-1 hover:text-blue-900">
                                      <span className="truncate max-w-[190px]">{paper.originalLink}</span>
                                      <ExternalLink className="w-3 h-3 text-blue-700 shrink-0" />
                                    </a>
                                  ) : (
                                    <span className="text-zinc-400 italic">Not provided</span>
                                  )}
                                </div>
                                <div>
                                  <span className="text-zinc-455 block text-[9.5px] uppercase">Declared DOI:</span>
                                  <span className="font-bold text-zinc-850">{paper.doi}</span>
                                </div>
                                <div>
                                  <span className="text-zinc-455 block text-[9.5px] uppercase">License Status:</span>
                                  <span className="font-bold text-zinc-850 bg-zinc-100 px-1.5 py-0.5 rounded">{paper.originalCopyrightStatus || 'CC-BY-4.0 Open Access'}</span>
                                </div>
                                <div>
                                  <span className="text-zinc-455 block text-[9.5px] uppercase font-mono font-bold">Open Access Signed:</span>
                                  <span className="text-emerald-700 font-bold">YES, Digitally Signed Agreement (CC-BY Host Rights Proof)</span>
                                </div>
                              </div>
                            </div>

                            {/* Verification Checklist */}
                            <div className="p-4 bg-zinc-100/60 rounded-xl space-y-2 border border-zinc-200">
                              <span className="text-[10px] font-mono text-zinc-550 block uppercase tracking-wider font-bold">Administrative Task Vetting Checklist:</span>
                              <div className="space-y-1.5 text-xs text-zinc-700">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" defaultChecked className="rounded border-zinc-350 focus:ring-0 text-black w-3.5 h-3.5" />
                                  <span>Verify declared external DOI matches canonical databases (Crossref/PubMed)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" defaultChecked className="rounded border-zinc-350 focus:ring-0 text-black w-3.5 h-3.5" />
                                  <span>Confirm copyright permits institutional indexation under CC-BY declaration</span>
                                </label>
                              </div>
                            </div>

                            {/* Actions block */}
                            <div className="pt-3 border-t border-zinc-100 flex flex-wrap gap-2.5 justify-end">
                              {rejectFeedbackPaperId === paper.id ? (
                                <div className="w-full space-y-3 bg-white p-3 border border-zinc-200 rounded-lg">
                                  <label className="block text-xs font-semibold text-zinc-700">Specify rejection criteria:</label>
                                  <input
                                    type="text"
                                    value={paperFeedbackInput}
                                    onChange={(e) => setPaperFeedbackInput(e.target.value)}
                                    className="w-full text-xs p-2.5 border border-zinc-350 rounded-lg focus:outline-none font-sans"
                                    placeholder="Missing licensing signature, source URL does not resolve, incorrect metadata..."
                                  />
                                  <div className="flex justify-end gap-2 text-xs font-mono">
                                    <button onClick={() => setRejectFeedbackPaperId(null)} className="px-2.5 py-1.5 border border-zinc-250 rounded-lg">Cancel</button>
                                    <button onClick={() => handleUpdatePaper(paper.id, 'rejected')} className="px-3 py-1.5 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg mr-2">Confirm Rejection</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <button onClick={() => setRejectFeedbackPaperId(paper.id)} className="px-3.5 py-1.5 text-xs font-mono font-bold text-zinc-650 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl flex items-center gap-1 cursor-pointer">
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    <span>Flag Concerns / Reject</span>
                                  </button>
                                  <button onClick={() => handleUpdatePaper(paper.id, 'approved')} className="px-4 py-2 text-xs font-mono font-bold bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl flex items-center gap-1 transition-colors cursor-pointer" id={`approve-repo-${paper.id}`}>
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span>Approve & Sync to Research Bank</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3.1b: TRACK B - JOURNAL EDITORIAL BOARD */}
                {activeContentTab === 'journal' && (
                  <div className="border border-blue-200 p-6 rounded-[28px] bg-gradient-to-br from-white to-blue-50/10 space-y-5" id="gcp-journal-editorial-board">
                    <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-blue-955 font-serif uppercase tracking-wider flex items-center gap-1.5 font-serif">
                          <Award className="w-4.5 h-4.5 text-blue-800" />
                          <span>Journal Editorial Board — Track B Flagship Manuscripts</span>
                        </h3>
                        <p className="text-[11px] text-zinc-500 mt-1 font-sans">
                          Manage original manuscripts submitted exclusively to Healthedia. Appoint double-blind peer reviewers, oversee ethics policies, and authorize certified gold weight index factors.
                        </p>
                      </div>
                      <span className="text-xs bg-blue-100/50 text-blue-900 border border-blue-200/50 px-3 py-1 rounded-full font-mono font-semibold">
                        {pendingPapers.filter(p => p.submissionTrack === 'journal').length} awaiting panel
                      </span>
                    </div>

                    {pendingPapers.filter(p => p.submissionTrack === 'journal').length === 0 ? (
                      <div className="text-center py-12 bg-zinc-50 border border-zinc-200 border-dashed rounded-2xl p-6">
                        <span className="block text-2xl mb-2">🏆</span>
                        <p className="text-xs font-mono text-zinc-500">
                          No pending original manuscripts. All submittals have been fully peer-reviewed or accepted.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6" id="journal-editorial-stack">
                        {pendingPapers.filter(p => p.submissionTrack === 'journal').map((paper) => {
                          const currentReviewerInput = assignedReviewers[paper.id] || '';
                          const reviewersList = assignedReviewersList[paper.id] || [];
                          
                          return (
                            <div key={paper.id} className="p-6 border border-blue-150 rounded-2xl bg-white hover:border-blue-400 space-y-5 text-xs sm:text-sm font-sans transition-all shadow-sm">
                              
                              {/* Meta Details header */}
                              <div className="flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs border-b border-blue-100 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-1 bg-blue-900 text-white font-bold rounded text-[10px]">
                                    {paper.id}
                                  </span>
                                  <span className="text-blue-700 font-extrabold uppercase text-[10px] tracking-wide">
                                    {currentLang === 'en' ? paper.categoryEN : paper.categoryAR}
                                  </span>
                                </div>
                                <span className="text-zinc-400 text-[11px]">
                                  Submitted by (Original Creator): <strong className="text-zinc-800 font-semibold">{paper.submittedByName}</strong> ({paper.submittedBy})
                                </span>
                              </div>

                              {/* Title & abstract */}
                              <div>
                                <h4 className="text-base font-extrabold text-blue-955 mb-1.5 font-serif leading-snug">
                                  {currentLang === 'en' ? paper.titleEN : paper.titleAR}
                                </h4>
                                <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed font-sans">
                                  <strong>Manuscript Abstract:</strong> {currentLang === 'en' ? paper.abstractEN : paper.abstractAR}
                                </p>
                              </div>

                              {/* EXCLUSIVITY & REVIEWS TRACK */}
                              <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-xl space-y-3 font-mono text-xs">
                                <div className="text-xs font-bold text-blue-955 uppercase border-b border-blue-100/50 pb-1 flex items-center justify-between">
                                  <span>Healthedia Exclusivity Protocol Status:</span>
                                  <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">PASSED ATTESTATION</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-750 leading-normal">
                                  <div>
                                    <span className="text-zinc-450 block text-[9.5px]">Digital Copyright:</span>
                                    <span className="font-bold text-zinc-900">Exclusivity Assigned to Healthedia Editorial Board</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-450 block text-[9.5px]">Peer Review Model:</span>
                                    <span className="font-bold text-zinc-900">Double-Blind Academic Trial Evaluation</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-450 block text-[9.5px]">Clinical Ethics Clause:</span>
                                    <span className="font-bold text-emerald-800 font-sans">✓ signed & verified (WMA Declaration of Helsinki compliance)</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-455 block text-[9.5px]">Certified Weight Multiplier:</span>
                                    <span className="font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded text-[10px]">2.5x weight multiplication for ranking</span>
                                  </div>
                                </div>
                              </div>

                              {/* DYNAMIC PEER REVIEWER / REFEREE ASSIGNMENTS */}
                              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-3">
                                <span className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-tight">
                                  Double-Blind Referees & Peer Reviewer Assignments:
                                </span>
                                
                                {reviewersList.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5 pb-1">
                                    {reviewersList.map((revName, idx) => (
                                      <span key={idx} className="bg-blue-950 text-[#e0f2fe] text-[10.5px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                                        <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
                                        <span>Dr. {revName}</span>
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            const filterReviews = [...reviewersList];
                                            filterReviews.splice(idx, 1);
                                            setAssignedReviewersList({ ...assignedReviewersList, [paper.id]: filterReviews });
                                          }}
                                          className="ml-1 text-blue-300 hover:text-white"
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs font-sans text-zinc-450 italic">
                                    No reviewer assignments registered. Use form below to attach credentials.
                                  </p>
                                )}

                                {/* Form to add referee */}
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="text"
                                    value={currentReviewerInput}
                                    placeholder="e.g., Al-Hadi Mabrouk, Ahmed Sabry"
                                    className="p-2 border border-blue-250 bg-white rounded-lg text-xs leading-none flex-1 focus:outline-none font-sans"
                                    onChange={(e) => setAssignedReviewers({ ...assignedReviewers, [paper.id]: e.target.value })}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const name = currentReviewerInput.trim();
                                        if (name) {
                                          setAssignedReviewersList({
                                            ...assignedReviewersList,
                                            [paper.id]: [...reviewersList, name]
                                          });
                                          setAssignedReviewers({ ...assignedReviewers, [paper.id]: '' });
                                        }
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const name = currentReviewerInput.trim();
                                      if (name) {
                                        setAssignedReviewersList({
                                          ...assignedReviewersList,
                                          [paper.id]: [...reviewersList, name]
                                        });
                                        setAssignedReviewers({ ...assignedReviewers, [paper.id]: '' });
                                      }
                                    }}
                                    className="p-2 px-3 bg-blue-900 hover:bg-blue-950 text-white font-mono font-bold text-xs rounded-lg cursor-pointer shrink-0"
                                  >
                                    Assign Referee
                                  </button>
                                </div>
                              </div>

                              {/* Checklist and Action approvals */}
                              <div className="pt-3 border-t border-zinc-100 flex flex-wrap gap-2.5 justify-end">
                                {rejectFeedbackPaperId === paper.id ? (
                                  <div className="w-full space-y-3 bg-white p-3 border border-zinc-200 rounded-lg">
                                    <label className="block text-xs font-semibold text-zinc-700">Audit Negative Feedback:</label>
                                    <input
                                      type="text"
                                      value={paperFeedbackInput}
                                      onChange={(e) => setPaperFeedbackInput(e.target.value)}
                                      className="w-full text-xs p-2.5 border border-zinc-350 rounded-lg focus:outline-none font-sans"
                                      placeholder="Ethical concern raised, methodology lacks random-effects indices..."
                                    />
                                    <div className="flex justify-end gap-2 text-xs font-mono">
                                      <button onClick={() => setRejectFeedbackPaperId(null)} className="px-2.5 py-1.5 border border-zinc-250 rounded-lg">Cancel</button>
                                      <button onClick={() => handleUpdatePaper(paper.id, 'rejected')} className="px-3 py-1.5 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg mr-2">Reject manuscript</button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <button onClick={() => setRejectFeedbackPaperId(paper.id)} className="px-3.5 py-1.5 text-xs font-mono font-bold text-zinc-650 hover:text-zinc-955 hover:bg-zinc-100 rounded-xl flex items-center gap-1 cursor-pointer">
                                      <XCircle className="w-4 h-4 text-red-500" />
                                      <span>Log Critical Critique</span>
                                    </button>
                                    <button 
                                      onClick={() => handleUpdatePaper(paper.id, 'approved')}
                                      className="px-4 py-2 text-xs font-mono font-bold bg-blue-900 hover:bg-blue-955 text-white rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                                      id={`approve-journal-${paper.id}`}
                                    >
                                      <CheckCircle className="w-4 h-4 text-emerald-300" />
                                      <span>Accept & Certify to Journal (2.5x Weight applied)</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 3.2: Wikipedia Revision Proposals Queue */}
                <div className="border border-zinc-200 p-5 rounded-2xl bg-white space-y-4">
                  <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                    <Sparkles className="w-4 h-4 text-zinc-950" />
                    <span>{isRTL ? 'اقتراحات تعديل الويكي الطبية المعلقة' : 'Medical Wikipedia Revision proposals'}</span>
                  </span>

                  {pendingEdits.length === 0 ? (
                    <div className="text-center py-8 bg-zinc-50 border border-zinc-200 border-dashed rounded-xl p-6">
                      <span className="block text-xl mb-1">☑</span>
                      <p className="text-xs font-mono text-zinc-500">
                        {t.no_pending_edits}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5" id="vetting-edits-stack">
                      {pendingEdits.map((edit) => (
                        <div key={edit.id} className="p-5 border border-zinc-300 rounded-xl bg-zinc-50 space-y-4 text-xs sm:text-sm font-sans">
                          
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono border-b border-zinc-200 pb-2">
                            <span className="px-2 py-0.5 bg-zinc-900 text-white font-bold rounded">
                              {edit.id}
                            </span>
                            <span className="text-zinc-400">{edit.createdAt}</span>
                          </div>

                          <p className="font-serif italic font-bold text-zinc-900 leading-snug">
                            {isRTL ? edit.paperTitleAR : edit.paperTitleEN} ({edit.paperId})
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-3 bg-white border border-zinc-200 rounded-lg">
                              <span className="block text-[9px] font-mono uppercase tracking-wider text-zinc-450 mb-1.5 font-bold">
                                {t.original_text}
                              </span>
                              <p className="text-zinc-550 leading-relaxed font-sans line-clamp-3">
                                {edit.originalText}
                              </p>
                            </div>
                            <div className="p-3 bg-zinc-950 text-zinc-100 rounded-lg">
                              <span className="block text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5 font-bold">
                                {t.proposed_text}
                              </span>
                              <p className="leading-relaxed font-sans text-white line-clamp-3">
                                {edit.proposedText}
                              </p>
                            </div>
                          </div>

                          <div className="text-[11px] font-mono text-zinc-500">
                            {isRTL ? `مقترح بواسطة الزميل: ${edit.suggestedByName}` : `Offered by: ${edit.suggestedByName}`} ({edit.suggestedBy})
                          </div>

                          <div className="pt-3 border-t border-zinc-109 flex flex-wrap gap-2.5 justify-end">
                            {rejectFeedbackEditId === edit.id ? (
                              <div className="w-full space-y-3 bg-white p-3 border border-zinc-200 rounded-lg">
                                <label className="block text-xs font-semibold text-zinc-700">
                                  {currentUser.role === 'reviewer' ? (isRTL ? 'سجل ملاحظة التدقيق المنهجي للتعديل' : 'Register Wiki Peer CritiqueNotes') : (isRTL ? 'إرسال ملاحظة للمعدل' : 'Add feedback to contributor')}
                                </label>
                                <input
                                  type="text"
                                  value={editFeedbackInput}
                                  onChange={(e) => setEditFeedbackInput(e.target.value)}
                                  className="w-full text-xs p-2.5 border border-zinc-300 rounded-lg focus:outline-none"
                                  placeholder={isRTL ? 'وضح سبب الاستباق العلمي أو العيوب...' : 'Specify peer critique feedback...'}
                                />
                                <div className="flex justify-end gap-2 text-xs font-mono">
                                  <button
                                    onClick={() => setRejectFeedbackEditId(null)}
                                    className="px-2.5 py-1.5 border border-zinc-200 rounded-lg"
                                  >
                                    {isRTL ? 'إلغاء' : 'Cancel'}
                                  </button>
                                  <button
                                    onClick={() => handleUpdateEdit(edit.id, 'rejected')}
                                    className="px-3 py-1.5 bg-zinc-950 text-white font-bold rounded-lg"
                                  >
                                    {currentUser.role === 'reviewer' ? (isRTL ? 'إرسال التوصية السلبية' : 'Log Critique Notes') : (isRTL ? 'إتمام الرفض' : 'Confirm Reject')}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => setRejectFeedbackEditId(edit.id)}
                                  className="px-3.5 py-1.5 text-xs font-mono font-bold text-zinc-650 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl flex items-center gap-1 cursor-pointer"
                                >
                                  <XCircle className="w-4 h-4 text-red-500" />
                                  <span>{currentUser.role === 'reviewer' ? (isRTL ? 'تحفظ على التعديل' : 'Flag inaccuracy') : t.reject}</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateEdit(edit.id, 'approved')}
                                  className="px-4 py-2 text-xs font-mono font-bold bg-zinc-950 hover:bg-zinc-950 text-white rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                                  <span>{currentUser.role === 'reviewer' ? (isRTL ? 'إقرار صحة المحتوى' : 'Certify Revision') : t.approve}</span>
                                </button>
                              </>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3.3: Article Management (for individual non-research news releases/guidelines) */}
                <div className="border border-zinc-200 p-5 rounded-2xl bg-white space-y-5">
                  <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                    <FileText className="w-4 h-4 text-zinc-900" />
                    <span>{isRTL ? 'إدارة الأخبار والبيانات الصحفية والمقالات الأكاديمية' : 'Platform Article & Press Release desk'}</span>
                  </span>

                  {/* Create article form */}
                  <form onSubmit={handleAddArticle} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-3 font-sans">
                    <h4 className="font-bold text-zinc-950">{isRTL ? 'صياغة بيان صحفي جديد' : 'Write new Educational Announcement'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] uppercase font-mono text-zinc-400">{isRTL ? 'عنوان المقال / الخبر' : 'Article Title'}</label>
                        <input
                          type="text"
                          required
                          value={newArticleTitle}
                          onChange={(e) => setNewArticleTitle(e.target.value)}
                          placeholder="e.g., Clinical guidelines update regarding SGLT2 nephropathy paths"
                          className="w-full p-2 border bg-white rounded focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono text-zinc-400">{isRTL ? 'التصنيف' : 'News category'}</label>
                        <select
                          value={newArticleCategory}
                          onChange={(e) => setNewArticleCategory(e.target.value)}
                          className="w-full p-2 border bg-white rounded"
                        >
                          <option value="Press Release">Press Release</option>
                          <option value="Guidelines">Clinical Guideline</option>
                          <option value="News">Scholarly News Updates</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-zinc-400">{isRTL ? 'المحتوى النصي للخبر' : 'Announcement content text'}</label>
                      <textarea
                        required
                        value={newArticleContent}
                        onChange={(e) => setNewArticleContent(e.target.value)}
                        placeholder="Complete markdown or plain text details for live publishing..."
                        className="w-full h-24 p-2 border bg-white rounded focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-white font-mono font-bold rounded-lg cursor-pointer"
                      >
                        {isRTL ? 'نشر المقال فورياً' : 'Publish Article Live'}
                      </button>
                    </div>
                  </form>

                  {/* Articles Catalog list */}
                  <div className="space-y-3 font-sans text-xs">
                    {articles.map((art) => (
                      <div key={art.id} className="p-3.5 border border-zinc-200 rounded-xl bg-zinc-50/50 flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <span className="px-1.5 py-0.5 bg-zinc-205 border border-zinc-300 rounded font-bold">{art.category}</span>
                            <span className="text-zinc-400">{art.createdAt}</span>
                          </div>
                          <h5 className="font-bold text-zinc-950 text-sm font-serif">{art.title}</h5>
                          <p className="text-zinc-500 font-sans text-xs leading-relaxed max-w-xl">{art.content}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1 px-1.5 border border-zinc-200 hover:border-zinc-950 text-red-650 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* SEC 4: Institutional Intelligence Module */}
          {activeSegment === 'intelligence' && (
            <GCPIntelligence currentLang={currentLang} />
          )}

          {/* SEC 5: System Configuration & Aesthetics (Design Core) */}
          {activeSegment === 'aesthetics' && (
            <GCPAesthetics
              currentLang={currentLang}
              settingsForm={settingsForm}
              handleSettingsChange={handleSettingsChange}
            />
          )}

          {/* SEC 6: Communication & Automated Workflow */}
          {activeSegment === 'automation' && (
            <GCPAutomation currentLang={currentLang} />
          )}

          {/* SEC 7: Platform Settings (Infrastructure) */}
          {activeSegment === 'infrastructure' && (
            <GCPInfrastructure currentLang={currentLang} />
          )}

        </div>
      </div>
    </div>
  );
}
