/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, User, ShieldCheck, FileText, Settings, BookOpen, Layers } from 'lucide-react';
import { UserProfile } from '../types';
import { TRANSLATIONS } from '../data';

interface NavigationProps {
  currentLang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  currentTab: 'home' | 'browse' | 'dashboard' | 'submit' | 'tracker' | 'institutions';
  setTab: (tab: 'home' | 'browse' | 'dashboard' | 'submit' | 'tracker' | 'institutions') => void;
  pendingPapersCount: number;
  pendingEditsCount: number;
}

export default function Navigation({
  currentLang,
  setLang,
  currentUser,
  availableUsers,
  onSelectUser,
  currentTab,
  setTab,
  pendingPapersCount,
  pendingEditsCount,
}: NavigationProps) {
  const t = TRANSLATIONS[currentLang];
  const isRTL = currentLang === 'ar';

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50 transition-colors duration-200" id="main-navigation-header">
      {/* Simulation Banner - Sleek minimalist top bar to let users swap profiles */}
      <div className="bg-gray-50 text-[10px] font-mono text-gray-500 border-b border-gray-100 px-8 py-2 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
          <span className="font-bold uppercase tracking-wider">
            {isRTL 
              ? 'محاكاة هوية الباحث / صلاحيات الجلسة:' 
              : 'Simulate Identity / Override Permissions:'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {availableUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all uppercase tracking-wider ${
                currentUser.id === user.id
                  ? 'bg-black text-white font-black'
                  : 'bg-gray-200/60 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isRTL ? user.nameAR : user.name.split(' ').slice(-1)[0]} ({user.role})
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setTab('home')}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <div className="text-2xl font-black tracking-tighter text-black flex items-center">
                HEALTHDIA<span className="text-gray-400 group-hover:text-black transition-colors">.ORG</span>
              </div>
            </button>
          </div>

          {/* Core Navigation Items */}
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse" id="desktop-nav-links">
            <button
              id="nav-tab-home"
              onClick={() => setTab('home')}
              className={`text-sm font-bold tracking-tight py-2 transition-all ${
                currentTab === 'home'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {t.home}
            </button>
            <button
              id="nav-tab-browse"
              onClick={() => setTab('browse')}
              className={`text-sm font-bold tracking-tight py-2 transition-all ${
                currentTab === 'browse'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {t.browse}
            </button>
            <button
              id="nav-tab-institutions"
              onClick={() => setTab('institutions')}
              className={`text-sm font-bold tracking-tight py-2 transition-all ${
                currentTab === 'institutions'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {t.institutions}
            </button>
            <button
              id="nav-tab-submit"
              onClick={() => setTab('submit')}
              className={`text-sm font-bold tracking-tight py-2 transition-all ${
                currentTab === 'submit'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {t.submissions}
            </button>
            
            {(currentUser.role === 'admin' || currentUser.role === 'editor' || currentUser.role === 'reviewer') && (
              <button
                id="nav-tab-dashboard"
                onClick={() => setTab('dashboard')}
                className={`text-sm font-bold tracking-tight py-2 transition-all relative flex items-center gap-1 ${
                  currentTab === 'dashboard'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.dashboard}</span>
                {(pendingPapersCount + pendingEditsCount) > 0 && (
                  <span className="bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold tracking-tight">
                    {pendingPapersCount + pendingEditsCount}
                  </span>
                )}
              </button>
            )}

            <button
              id="nav-tab-tracker"
              onClick={() => setTab('tracker')}
              className={`text-sm font-bold tracking-tight py-2 transition-all flex items-center gap-1 ${
                currentTab === 'tracker'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t.profile}</span>
            </button>
          </nav>

          {/* Language Switcher & Profile Quick Info */}
          <div className="flex items-center gap-6">
            {/* Language Capsule Switcher matching mockup */}
            <button
              id="btn-lang-toggle"
              onClick={() => setLang(currentLang === 'en' ? 'ar' : 'en')}
              className="flex bg-gray-100 hover:bg-gray-200/80 transition-all rounded-full p-1 text-[10px] font-bold outline-none cursor-pointer"
              title="Switch Language / تبديل اللغة"
            >
              <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider transition-all ${currentLang === 'en' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}>EN</span>
              <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider transition-all ${currentLang === 'ar' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}>AR</span>
            </button>

            {/* Active User Label & Rounded Avatar */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setTab('tracker')}>
              <div className="text-right rtl:text-left font-sans hidden sm:block">
                <div className="text-xs font-bold text-black leading-none">
                  {isRTL ? currentUser.nameAR : currentUser.name}
                </div>
                <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-1.5 leading-none">
                  ID: {currentUser.id}
                </div>
              </div>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs select-none shadow-sm transition-transform hover:scale-105">
                {currentUser.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden border-t border-gray-100 py-3 justify-around" id="mobile-nav-links">
          <button
            onClick={() => setTab('home')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider font-bold ${
              currentTab === 'home' ? 'text-black' : 'text-gray-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.home}</span>
          </button>
          <button
            onClick={() => setTab('browse')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider font-bold ${
              currentTab === 'browse' ? 'text-black' : 'text-gray-400'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.browse}</span>
          </button>
          <button
            onClick={() => setTab('institutions')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider font-bold ${
              currentTab === 'institutions' ? 'text-black' : 'text-gray-400'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{t.institutions}</span>
          </button>
          <button
            onClick={() => setTab('submit')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider font-bold ${
              currentTab === 'submit' ? 'text-black' : 'text-gray-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.submissions}</span>
          </button>
          {(currentUser.role === 'admin' || currentUser.role === 'editor' || currentUser.role === 'reviewer') && (
            <button
              onClick={() => setTab('dashboard')}
              className={`flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider font-bold relative ${
                currentTab === 'dashboard' ? 'text-black' : 'text-gray-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.dashboard.split(' ')[0]}</span>
              {(pendingPapersCount + pendingEditsCount) > 0 && (
                <span className="absolute -top-1 right-2 bg-black text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {pendingPapersCount + pendingEditsCount}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setTab('tracker')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider font-bold ${
              currentTab === 'tracker' ? 'text-black' : 'text-gray-400'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t.profile.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
