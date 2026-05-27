/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sliders, ArrowRight, ShieldCheck, FileText, Cpu, Eye, Download, Star, ExternalLink, Award } from 'lucide-react';
import { AcademicPaper, GlobalSettings } from '../types';
import { TRANSLATIONS } from '../data';

interface SearchEngineProps {
  currentLang: 'en' | 'ar';
  papers: AcademicPaper[];
  onSelectPaper: (paper: AcademicPaper) => void;
  globalSettings: GlobalSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSwitchTab?: (tab: 'home' | 'browse' | 'dashboard' | 'submit' | 'tracker') => void;
}

export default function SearchEngine({
  currentLang,
  papers,
  onSelectPaper,
  globalSettings,
  searchQuery,
  setSearchQuery,
  onSwitchTab,
}: SearchEngineProps) {
  const t = TRANSLATIONS[currentLang];
  const isRTL = currentLang === 'ar';

  const [localQuery, setLocalQuery] = useState(() => {
    return searchQuery.trim() === ' ' ? '' : searchQuery;
  });
  const [searchFocused, setSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minCitations, setMinCitations] = useState<number>(0);

  // Sync prop changes into local state
  useEffect(() => {
    const nextVal = searchQuery.trim() === ' ' ? '' : searchQuery;
    setLocalQuery(nextVal);
  }, [searchQuery]);

  // List of unique categories for filters
  const categories = useMemo(() => {
    const list = new Set<string>();
    papers.forEach(p => {
      list.add(currentLang === 'en' ? p.categoryEN : p.categoryAR);
    });
    return Array.from(list);
  }, [papers, currentLang]);

  // Integrated Search Logic across multiple attributes
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      // Basic state filters (only exhibit approved items to general public searches unless simulated admin is working)
      if (paper.status !== 'approved') return false;

      // Category filter
      if (selectedCategory !== 'all') {
        const cat = currentLang === 'en' ? paper.categoryEN : paper.categoryAR;
        if (cat !== selectedCategory) return false;
      }

      // Citation filter
      if (paper.citationCount < minCitations) return false;

      // Query filter
      if (!localQuery.trim()) return true;

      const query = localQuery.toLowerCase().trim();
      const matchText = [
        paper.titleEN,
        paper.titleAR,
        paper.abstractEN,
        paper.abstractAR,
        paper.doi,
        paper.id,
        ...paper.authorsEN,
        ...paper.authorsAR,
        ...paper.keywordsEN,
        ...paper.keywordsAR,
        paper.journalEN,
        paper.journalAR,
        paper.categoryEN,
        paper.categoryAR
      ].join(' ').toLowerCase();

      return matchText.includes(query);
    });
  }, [papers, localQuery, selectedCategory, minCitations, currentLang]);

  // Trending hashtags click handler
  const handleHashtagClick = (val: string) => {
    setLocalQuery(val);
    setSearchQuery(val);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(localQuery);
  };

  return (
    <div className="w-full flex flex-col min-h-screen font-sans" id="search-engine-module">
      
      {/* Central Search Hub Area */}
      <main className="flex-grow flex flex-col items-center justify-center px-8 py-12 md:py-20 lg:py-28 max-w-4xl mx-auto w-full text-center">
        <div className="w-full text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-black" id="hero-title">
            {isRTL ? (
              <>
                المستودع العالمي <span className="underline decoration-4 underline-offset-8 decoration-black">للحقيقة العلمية</span>
              </>
            ) : (
              <>
                The Global Repository of <span className="underline decoration-4 underline-offset-8 decoration-black">Scientific Truth</span>
              </>
            )}
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {isRTL 
              ? 'تصفح أكثر من 4.2 مليون دراسة طبية محكمة، وتجارب عيادية، وأوراق بحثية موثوقة بالكامل.'
              : 'Access 4.2 million peer-reviewed medical studies, clinical trials, and verified research papers.'}
          </p>
          
          {/* Centralized High performance Search Engine Input Box */}
          <form onSubmit={handleSearchSubmit} className="relative group max-w-3xl mx-auto" id="search-bar-container">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400">
              <Search className="w-5 h-5 shrink-0" />
            </div>
            
            <input
              type="text"
              id="main-search-input"
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value);
                // Dynamically trigger live search as user types
                setSearchQuery(e.target.value);
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={isRTL ? 'ابحث بالرقم التسلسلي DOI، كلمة دلالية، أو اسم الباحث...' : 'Search by DOI, Keyword, or Researcher Serial...'}
              className={`w-full bg-gray-50 border-2 rounded-[24px] py-5 pl-14 pr-32 md:pr-40 text-base md:text-lg font-medium focus:outline-none transition-all placeholder-gray-300 ${
                searchFocused ? 'border-black bg-white shadow-md' : 'border-gray-100 hover:border-gray-200'
              }`}
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            />

            {/* Sub-actions layout inside the search box */}
            <div className="absolute right-3 top-3 bottom-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                  showFilters || selectedCategory !== 'all' || minCitations > 0
                    ? 'bg-black text-white'
                    : 'bg-gray-150 hover:bg-gray-200 text-gray-600'
                }`}
                title={t.advanced_filters}
              >
                <Sliders className="w-4 h-4" />
              </button>
              
              <button 
                type="submit"
                className="bg-black text-white px-5 sm:px-7 rounded-xl font-bold text-xs hover:bg-gray-800 transition-colors uppercase tracking-widest h-full flex items-center justify-center"
              >
                {isRTL ? 'بحث' : 'Search'}
              </button>
            </div>
          </form>
          
          {/* Trending hashtags styled with fine layouts */}
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>{isRTL ? 'الأكثر بحثاً:' : 'Trending:'}</span>
            <button 
              onClick={() => handleHashtagClick('SGLT2')} 
              className="text-black border-b-2 border-black hover:opacity-75 font-black uppercase"
            >
              #SGLT2
            </button>
            <button 
              onClick={() => handleHashtagClick('Retinopathy')} 
              className="text-black border-b-2 border-black hover:opacity-75 font-black uppercase"
            >
              #Retinopathy
            </button>
            <button 
              onClick={() => handleHashtagClick('Mabrouk')} 
              className="text-black border-b-2 border-black hover:opacity-75 font-black uppercase"
            >
              #Mabrouk
            </button>
            <button 
              onClick={() => handleHashtagClick('Cardiology')} 
              className="text-black border-b-2 border-black hover:opacity-75 font-black uppercase"
            >
              #Cardiology
            </button>
          </div>
        </div>
      </main>

      {/* Advanced Filter Drawer/Expander if toggled */}
      {showFilters && (
        <div className="w-full max-w-4xl mx-auto px-8 mb-10" id="advanced-filters-panel">
          <div className="bg-gray-50 border border-gray-100 rounded-[24px] p-6 text-left">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4 border-b border-gray-100 pb-2">
              {t.advanced_filters}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category selection */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  {t.category}
                </label>
                <select
                  id="filter-category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 text-sm bg-white border border-gray-100 rounded-xl focus:border-black focus:outline-none font-bold"
                >
                  <option value="all">
                    {isRTL ? 'جميع التخصصات الطبية' : 'All Disciplines'}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Citations Threshold */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  {isRTL ? 'الحد الأدنى للاقتباسات' : 'Minimum Citations'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={minCitations}
                    onChange={(e) => setMinCitations(parseInt(e.target.value))}
                    className="w-full accent-black bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold bg-white px-3 py-2 border border-gray-100 rounded-xl min-w-[3.5rem] text-center">
                    {minCitations}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conditional layout: If no queries have been typed, show the gorgeous bento content grid */}
      {!localQuery.trim() ? (
        <section className="px-8 pb-12 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: Recent Submissions widget with real-time links */}
            <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 flex flex-col justify-between text-left">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-black">
                    {isRTL ? 'آخر الأبحاث المنشورة' : 'Recent Submissions'}
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {isRTL ? 'مباشر' : 'Live state'}
                  </span>
                </div>
                
                <div className="space-y-6">
                  {papers.slice(0, 3).map((paper) => (
                    <div 
                      key={paper.id} 
                      onClick={() => onSelectPaper(paper)}
                      className="group cursor-pointer transition-all hover:translate-x-1"
                    >
                      <div className="text-[10px] text-gray-400 font-mono mb-1.5 uppercase tracking-widest flex items-center gap-2">
                        <span>REF: #{paper.id}</span>
                        <span>•</span>
                        <span>{paper.publishedAt}</span>
                      </div>
                      <div className="text-sm font-bold leading-snug text-black group-hover:underline transition-colors line-clamp-2">
                        {currentLang === 'en' ? paper.titleEN : paper.titleAR}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setLocalQuery(' ');
                  setSearchQuery(' ');
                }}
                className="mt-8 text-xs font-black text-black uppercase tracking-widest flex items-center gap-1.5 hover:opacity-70 text-left border-t border-gray-100 pt-4"
              >
                <span>{isRTL ? 'استكشاف الفهرس الأكاديمي كاملاً' : 'Browse All Library'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>

            {/* Column 2: Global Statistics / Network Integrity widget with actual progress calculations */}
            <div className="bg-black text-white rounded-[32px] p-8 text-left flex flex-col justify-between">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 text-gray-500">
                  {isRTL ? 'سلامة ومؤشرات الشبكة الأكاديمية' : 'Network Integrity'}
                </h3>
                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                  <div>
                    <div className="text-4xl font-light tracking-tighter">128k</div>
                    <div className="text-[9px] uppercase text-gray-400 font-bold tracking-wider mt-1">{isRTL ? 'الأقران الفاعلين' : 'Active Peers'}</div>
                  </div>
                  <div>
                    <div className="text-4xl font-light tracking-tighter">99.8%</div>
                    <div className="text-[9px] uppercase text-gray-400 font-bold tracking-wider mt-1">{isRTL ? 'معدل التدقيق والمصادقة' : 'Verification Rate'}</div>
                  </div>
                  <div>
                    <div className="text-4xl font-light tracking-tighter">+{papers.length}</div>
                    <div className="text-[9px] uppercase text-gray-400 font-bold tracking-wider mt-1">{isRTL ? 'سجلات المنصة الحية' : 'Platform Submissions'}</div>
                  </div>
                  <div>
                    <div className="text-4xl font-light tracking-tighter">04</div>
                    <div className="text-[9px] uppercase text-gray-400 font-bold tracking-wider mt-1">{isRTL ? 'فئات العلوم والطب الكلي' : 'Active Facets'}</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-900">
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-700" 
                    style={{ width: `${Math.min(100, (papers.filter(p => p.status === 'approved').length / Math.max(1, papers.length)) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-[9px] mt-2.5 text-gray-400 font-mono">
                  {isRTL 
                    ? `مؤشر التزامن النشط: ${(4210000 + papers.length).toLocaleString()} مدخل علمي موثق`
                    : `System indexing: ${(4210000 + papers.length).toLocaleString()} verified entries`}
                </div>
              </div>
            </div>

            {/* Column 3: Administrator Dashboard Preview / Vetting Queue */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-gray-100 text-left flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-black">
                    {isRTL ? 'طلبات التحكيم المعلقة' : 'Vetting Queue'}
                  </h3>
                  <span className="bg-amber-100 text-amber-800 text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {papers.filter(p=>p.status==='pending').length} {isRTL ? 'معلق' : 'Pending'}
                  </span>
                </div>

                <div className="space-y-4">
                  {papers.filter(p => p.status === 'pending').length === 0 ? (
                    <div className="text-center py-6 text-gray-400 font-mono text-xs border border-dashed border-gray-100 rounded-2xl bg-gray-50">
                      {isRTL ? 'خالٍ من طلبات التحكيم المعلقة ●' : 'Vetting queue is empty ●'}
                    </div>
                  ) : (
                    papers.filter(p => p.status === 'pending').slice(0, 3).map((paper) => (
                      <div key={paper.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                          <span className="text-xs font-bold text-black truncate max-w-[130px] sm:max-w-[160px]">
                            {currentLang === 'en' ? paper.titleEN : paper.titleAR}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            if (onSwitchTab) onSwitchTab('dashboard');
                          }}
                          className="text-[10px] font-black uppercase underline text-black hover:text-gray-600 transition-colors shrink-0"
                        >
                          {isRTL ? 'مراجعة' : 'Review'}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-4">
                <span className="text-[10px] text-gray-400 font-mono uppercase block">
                  {isRTL ? 'انقر مراجعة لتعديل وقبول الطلبات' : 'Click review to approve submissions'}
                </span>
              </div>
            </div>

          </div>
        </section>
      ) : (
        /* Directories Result Listing */
        <div className="max-w-5xl mx-auto px-8 pb-20 w-full" id="search-results-section">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {isRTL 
                ? `وجدت ${filteredPapers.length} من أصل ${papers.length} سجلات بحثية` 
                : `${filteredPapers.length} / ${papers.length} results found`}
            </h2>
            <span className="text-xs font-mono text-gray-300">
              {isRTL ? 'حماية وشفافية الأثر الأكاديمي' : 'Independent Peer Review Matrix'}
            </span>
          </div>

          {filteredPapers.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 border border-gray-100 border-dashed rounded-[32px]">
              <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">{t.no_results}</p>
            </div>
          ) : (
            <div className="space-y-6" id="results-feed">
              {filteredPapers.map((paper) => {
                const isJournal = paper.submissionTrack === 'journal' || paper.journalEN.toLowerCase().includes('healthdia journal');
                
                return (
                  <article
                    key={paper.id}
                    id={`paper-card-${paper.id}`}
                    onClick={() => onSelectPaper(paper)}
                    className={`group relative p-8 rounded-[32px] hover:shadow-lg transition-all duration-350 cursor-pointer text-left border ${
                      isJournal 
                        ? 'bg-gradient-to-br from-white to-blue-50/20 border-blue-200 hover:border-blue-500' 
                        : 'bg-gray-50/70 hover:bg-white border-gray-100 hover:border-black'
                    }`}
                  >
                    {/* Meta Row: ID, Tags, DOI and Seals */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-400 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                          isJournal ? 'bg-blue-900 text-white' : 'bg-black text-white'
                        }`}>
                          {paper.id}
                        </span>
                        <span className="text-gray-350">|</span>
                        <span className={`font-extrabold tracking-tight uppercase text-[10px] ${
                          isJournal ? 'text-blue-700' : 'text-black'
                        }`}>
                          {currentLang === 'en' ? paper.categoryEN : paper.categoryAR}
                        </span>
                        <span className="text-gray-350 font-normal hidden sm:inline">|</span>
                        <span className="hidden sm:inline text-gray-400 font-bold text-[10px] lowercase">
                          {t.doi}: {paper.doi}
                        </span>
                      </div>

                      {/* Tracks Badgification */}
                      {isJournal ? (
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-950 to-blue-900 border border-blue-600/50 text-[#e0f2fe] text-[9.5px] font-mono px-3 py-1.5 rounded-xl uppercase tracking-wider font-extrabold shadow-sm select-none">
                          <Award className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                          <span>Healthedia Peer-Reviewed Certification Seal</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-zinc-200 border border-zinc-300 text-zinc-900 text-[9.5px] font-mono px-3 py-1 rounded-xl uppercase tracking-wide font-black select-none">
                          <span>Republished / Referenced</span>
                        </div>
                      )}
                    </div>

                    {/* Title with sleek styling */}
                    <h3 className={`text-xl md:text-2xl font-extrabold tracking-tight leading-tight group-hover:underline transition-all ${
                      isJournal ? 'text-zinc-950' : 'text-black'
                    }`}>
                      {currentLang === 'en' ? paper.titleEN : paper.titleAR}
                    </h3>

                    {/* Authors list styling */}
                    <div className="mt-3.5 text-xs text-gray-500 font-sans flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-gray-400 uppercase text-[9px] tracking-wider font-bold">
                        {t.author}:
                      </span>
                      <span className="font-semibold text-black underline decoration-gray-200 group-hover:decoration-black">
                        {(currentLang === 'en' ? paper.authorsEN : paper.authorsAR).join(', ')}
                      </span>
                    </div>

                    {/* Dynamic Source Attribution and SEO / Indexing Verification */}
                    {!isJournal ? (
                      <div className="mt-4 p-4 bg-zinc-100 rounded-2xl border border-zinc-200/50 space-y-2.5 font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-700 font-medium">
                            <span className="font-bold text-zinc-950 text-[11px] font-mono uppercase shrink-0">Original Publication Source:</span>
                            <span className="font-serif italic text-zinc-800">{paper.originalJournal || paper.journalEN || 'External Repository Index'}</span>
                          </div>
                          
                          {(paper.originalLink || paper.doi) && (
                            <a 
                              href={paper.originalLink || `https://doi.org/${paper.doi}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-black font-semibold flex items-center gap-1 hover:underline shrink-0 bg-white border border-zinc-300 px-2.5 py-1 rounded-lg"
                            >
                              <span>{isRTL ? 'زيارة الرابط الأصلي' : 'Original Source Link'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {/* Search Engine Optimization Meta tags feedback */}
                        <div className="text-[10.5px] font-mono text-zinc-500 leading-normal flex items-center gap-2">
                          <code className="bg-zinc-200 text-zinc-800 px-1 py-0.5 rounded text-[10px]">rel="canonical"</code>
                          <span>Advising search bots (Google Scholar) that this is republished open-access metadata.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-4 bg-blue-50/40 border border-blue-150/50 rounded-2xl space-y-2 font-sans">
                        <div className="text-xs text-blue-950 font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-blue-800 shrink-0" />
                          <span>Google Scholar Primary Source Certificate: Certified original publication indexes successfully on Healthedia flagship host.</span>
                        </div>
                        <div className="text-[10.5px] font-mono text-blue-800 flex items-center gap-2">
                          <code className="bg-blue-100 text-blue-950 px-1 py-0.5 rounded text-[10px]">canonical="primary"</code>
                          <span>Weighted index factor: 2.5x ranking impact multiplier applied.</span>
                        </div>
                      </div>
                    )}

                    {/* Snapshot abstract */}
                    <p className="mt-5 text-sm text-gray-450 line-clamp-2 leading-relaxed font-sans font-light">
                      {currentLang === 'en' ? paper.abstractEN : paper.abstractAR}
                    </p>

                    {/* Journal and Metrical properties */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-black">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] tracking-widest leading-none">
                          {currentLang === 'en' ? paper.journalEN : paper.journalAR}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400 font-bold tracking-widest uppercase shrink-0">
                        <span className="flex items-center gap-1 bg-white border border-gray-100 px-3 py-1.5 rounded-full text-black">
                          <Star className="w-3.5 h-3.5 text-black shrink-0" />
                          <span><strong>{paper.citationCount}</strong> {t.citation_count}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-gray-305 shrink-0" />
                          <strong>{paper.views}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3.5 h-3.5 text-gray-305 shrink-0" />
                          <strong>{paper.downloads}</strong>
                        </span>
                        <span className="hidden sm:inline-flex bg-black text-white group-hover:scale-110 transition-transform p-1.5 rounded-full">
                          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
