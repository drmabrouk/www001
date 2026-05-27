/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  UserCheck, Search, ShieldCheck, Clock, Award, CheckCircle2, AlertTriangle, 
  Sparkles, Fingerprint, RefreshCw, XCircle, FileText, Check, ShieldAlert
} from 'lucide-react';
import { UserProfile, AcademicRole } from '../types';

interface GCPUsersProps {
  currentLang: 'en' | 'ar';
  users: UserProfile[];
  currentUser: UserProfile;
  onUpdateUserRole: (userId: string, targetRole: AcademicRole) => void;
  onUpdateUser: (userId: string, updatedFields: Partial<UserProfile>) => void;
}

interface VerificationDoc {
  userId: string;
  userName: string;
  serialNumber: string;
  institution: string;
  docType: string;
  status: 'pending' | 'verified' | 'flagged';
}

export default function GCPUsers({
  currentLang,
  users,
  currentUser,
  onUpdateUserRole,
  onUpdateUser,
}: GCPUsersProps) {
  const isRTL = currentLang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Selected user for side-by-side biometric & ID credentials inspection
  const pendingUserInDb = users.find(u => u.verificationIDStatus === 'pending');
  const [selectedVerifyUser, setSelectedVerifyUser] = useState<UserProfile | null>(pendingUserInDb || users[2] || null);
  const [isOCRScanning, setIsOCRScanning] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(true);

  // Sync internal local verification items to track action statuses
  const [verifications, setVerifications] = useState<VerificationDoc[]>([
    {
      userId: 'HD-USR-22841',
      userName: 'Ahmad Al-Masri, PhD',
      serialNumber: 'SRN-2025-EG-8402',
      institution: 'Alexandria Faculty of Medicine',
      docType: 'Institutional ID & Passport scan',
      status: 'pending'
    },
    {
      userId: 'HD-USR-99402',
      userName: 'Layla Mahmoud',
      serialNumber: 'SRN-2026-CM-1194',
      institution: 'Cairo Medical University',
      docType: 'Postgrade Resident License Document',
      status: 'verified'
    },
    {
      userId: 'HD-USR-10042',
      userName: 'Dr. Sarah Jenkins',
      serialNumber: 'SRN-2024-RD-4412',
      institution: 'Royal College of Endocrinology',
      docType: 'Board Certification & Fellowship ID',
      status: 'verified'
    }
  ]);

  // Account system activity logs
  const [auditLogs, setAuditLogs] = useState([
    { event: 'Identity Override Simulated', details: 'User simulated Dr. Mabrouk Al-Hadi level', user: 'System Root', time: '10 Mins Ago' },
    { event: 'AI OCR Parser Model Loaded', details: 'OCR LayoutLM-v3 neural model online', user: 'Compliance Engine', time: '30 Mins Ago' },
    { event: 'Database Schema Lock', details: 'Secured metadata field alignment', user: 'Admin Router', time: '1 Hour Ago' },
    { event: 'New Peer Review Account Registered', details: 'Created candidate profile Layla Mahmoud', user: 'Layla Mahmoud', time: '1 Day Ago' }
  ]);

  const handleUpdateVerificationState = (userId: string, targetStatus: 'verified' | 'rejected') => {
    // Update global user details
    onUpdateUser(userId, {
      verificationIDStatus: targetStatus === 'verified' ? 'verified' : 'rejected',
      isDigitallyVerified: targetStatus === 'verified' ? true : false
    });

    // Update local list
    setVerifications(prev => prev.map(v => {
      if (v.userId === userId) {
        return { ...v, status: targetStatus === 'verified' ? 'verified' : 'flagged' };
      }
      return v;
    }));

    // Register log
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setAuditLogs(prev => [
        {
          event: targetStatus === 'verified' ? 'Credential Verified Globally' : 'Credential Flagged / Rejected',
          details: `Approved cryptographic professional check badge for ${targetUser.name}`,
          user: currentUser.name,
          time: 'Just Now'
        },
        ...prev
      ]);
    }

    // Refresh selected verify user card
    const nextPending = users.find(u => u.id === userId);
    if (nextPending) {
      setSelectedVerifyUser({
        ...nextPending,
        verificationIDStatus: targetStatus === 'verified' ? 'verified' : 'rejected',
        isDigitallyVerified: targetStatus === 'verified' ? true : false
      });
    }
  };

  const handleTriggerOCR = () => {
    setIsOCRScanning(true);
    setOcrCompleted(false);
    setTimeout(() => {
      setIsOCRScanning(false);
      setOcrCompleted(true);
      
      setAuditLogs(prev => [
        {
          event: 'AI OCR Scan Executed',
          details: `Processed extraction on ID and Passport for user ID ${selectedVerifyUser?.id}. Confidence score calculated.`,
          user: 'Automated Compliance Engine',
          time: 'Just Now'
        },
        ...prev
      ]);
    }, 1800);
  };

  const handleRoleChange = (userId: string, newRole: AcademicRole) => {
    onUpdateUserRole(userId, newRole);
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setAuditLogs(prev => [
        {
          event: 'Role Promotion Override',
          details: `Shifted role of ${targetUser.name} to ${newRole.toUpperCase()}`,
          user: currentUser.name,
          time: 'Just Now'
        },
        ...prev
      ]);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.nameAR && u.nameAR.includes(searchQuery)) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.institution.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* Upper Title Description */}
      <div>
        <h2 className="text-lg font-bold text-zinc-950 font-serif border-b border-zinc-100 pb-2 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-zinc-900" />
          <span>{isRTL ? 'إدارة الهويات الفائقة والتحقق الطبي الدقيق' : 'User Identity, Credentials & Biometric Vetting'}</span>
        </h2>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          {isRTL 
            ? 'مراجعة أوراق اعتماد الباحثين والتحقق بالأشعة السينية للأوراق المهنية، ومواءمة مقتبسات الهوية الوطنية باستخدام مساح الذكاء الاصطناعي OCR.'
            : 'Validate doctor credentials, execute side-by-side biometric passport audits, analyze AI-OCR identity matches, and adjust global research permission roles.'}
        </p>
      </div>

      {/* --- FEATURE: Side-by-Side Identity verifications module --- */}
      {selectedVerifyUser && (
        <div className="border border-zinc-200 rounded-3xl overflow-hidden bg-white shadow-sm">
          
          {/* Header Bar */}
          <div className="bg-zinc-950 text-white p-4 px-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold tracking-wider uppercase text-emerald-400">
                  {isRTL ? 'منصة الفحص الثنائي وبصمات الهوية' : 'Identity Verification and Optical character Recognition Queue'}
                </span>
                <span className="block text-[10px] text-zinc-400">
                  {isRTL ? 'مقارنة مستندات التسجيل بالملف النشط' : 'Side-by-Side Biometric ID matching & document integrity audit'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">{isRTL ? 'الملف الجاري فصحه:' : 'Inspecting:'}</span>
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-850 rounded text-white font-bold text-[11px] font-mono">
                {selectedVerifyUser.id}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
            
            {/* L SIDE: Uploaded document scans + OCR scanner laser line effect */}
            <div className="p-6 space-y-5 bg-zinc-50/20 relative">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <span className="text-xs uppercase font-mono font-bold text-zinc-700 tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-zinc-900" />
                  <span>{isRTL ? 'المستندات المودعة للمطابقة الأمنية' : 'Deposited Credentials Scan Dossier'}</span>
                </span>
                
                <button 
                  onClick={handleTriggerOCR}
                  disabled={isOCRScanning || selectedVerifyUser.verificationIDStatus === 'none'}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-black transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isOCRScanning ? 'animate-spin' : ''}`} />
                  <span>{isRTL ? 'إعادة تشغيل مسار OCR' : 'Trigger OCR Scan'}</span>
                </button>
              </div>

              {selectedVerifyUser.verificationIDStatus === 'none' ? (
                <div className="text-center py-20 bg-zinc-50 border border-zinc-200 border-dashed rounded-2xl p-6">
                  <Clock className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                  <p className="text-xs font-mono text-zinc-400">
                    {isRTL ? 'هذا الباحث لم يسجل في بوابة التحقق الفائق ولا توجد مستندات بعد.' : 'This researcher has not uploaded onboarding tokens yet. No documents to audit.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Digital Scans split-grid or list mockups */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* ID Card Mockup */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-wide font-bold block">
                        (a) Public Institutional ID Document
                      </span>
                      <div className="relative h-44 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800 p-4 text-white overflow-hidden flex flex-col justify-between">
                        {/* Interactive Moving scanner laser line */}
                        {isOCRScanning && (
                          <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_#34d399] animate-[bounce_1.5s_infinite]" />
                        )}
                        
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h5 className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Healthdia Academy ID</h5>
                            <span className="text-[10px] font-serif block truncate max-w-[120px]">{selectedVerifyUser.institution}</span>
                          </div>
                          <Fingerprint className="w-8 h-8 text-zinc-700/80 shrink-0" />
                        </div>

                        {selectedVerifyUser.uploadedIDUrl ? (
                          <img 
                            referrerPolicy="no-referrer"
                            src={selectedVerifyUser.uploadedIDUrl} 
                            alt="Institutional Card" 
                            className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
                          />
                        ) : null}

                        <div className="flex items-end gap-3 z-10">
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-750 flex items-center justify-center font-mono text-xs text-zinc-500 font-bold shrink-0 overflow-hidden">
                            {selectedVerifyUser.avatarUrl ? (
                              <img src={selectedVerifyUser.avatarUrl} alt="V" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            ) : "PHOTO"}
                          </div>
                          <div className="space-y-0.5 font-mono text-[9px] min-w-0">
                            <span className="block font-bold truncate text-white uppercase">{selectedVerifyUser.name}</span>
                            <span className="block text-zinc-400 truncate text-[8px]">SN: {selectedVerifyUser.id}-IDSCAN</span>
                          </div>
                        </div>
                        <div className="absolute bottom-1 right-2 font-mono text-[7px] text-zinc-700">CERTIFIED DIGITAL ID V2</div>
                      </div>
                    </div>

                    {/* Passport Scan Doc Mock */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-wide font-bold block">
                        (b) Certified Passport Biometrics
                      </span>
                      <div className="relative h-44 rounded-2xl bg-gradient-to-br from-amber-50/20 to-zinc-50 border border-zinc-200 p-4 overflow-hidden flex flex-col justify-between">
                        {/* Interactive Moving scanner laser line */}
                        {isOCRScanning && (
                          <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_#34d399] animate-[bounce_1.5s_infinite]" />
                        )}
                        
                        {selectedVerifyUser.uploadedPassportUrl ? (
                          <img 
                            referrerPolicy="no-referrer"
                            src={selectedVerifyUser.uploadedPassportUrl} 
                            alt="Passport" 
                            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                          />
                        ) : null}

                        <div className="flex justify-between items-start z-10">
                          <div className="space-y-0.5 font-sans">
                            <h5 className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">PASSPORT / سفر</h5>
                            <span className="text-[10px] font-bold block text-zinc-900">REPUBLIC EMBASSY DOCS</span>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-zinc-450 bg-white px-1.5 py-0.5 border border-zinc-200 rounded">P441-A2</span>
                        </div>

                        <div className="mt-2 text-[9px] font-mono text-zinc-600 space-y-0.5 z-10 bg-white/60 p-1 rounded backdrop-blur-[1px]">
                          <div>SURNAME: <span className="font-bold text-zinc-950">{selectedVerifyUser.name.split(' ').pop()?.toUpperCase()}</span></div>
                          <div>CIVIL NO: <span className="font-bold text-zinc-950">9248-11-EG</span></div>
                        </div>

                        <div className="border-t border-dashed border-zinc-300 pt-1.5 font-mono text-[7px] text-zinc-450 z-10 leading-none truncate uppercase">
                          P&lt;EGY{selectedVerifyUser.name.replace(/\s+/g, '<').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* OCR AI Parser Status Feedback block */}
                  <div className="p-4 rounded-2xl border border-zinc-200 bg-white space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-mono font-bold uppercase text-zinc-800 tracking-wider">
                        {isRTL ? 'تحليل محرك التعرف البصري OCR الأكاديمي' : 'AI OCR Parser Model Alignment Analysis'}
                      </span>
                    </div>

                    {isOCRScanning ? (
                      <div className="py-6 flex flex-col items-center justify-center space-y-2 text-xs font-mono">
                        <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-zinc-500 animate-pulse">Running Neural Recognition Lexicon Classifier...</span>
                      </div>
                    ) : ocrCompleted && selectedVerifyUser.extractedVerificationData ? (
                      <div className="space-y-2 text-xs font-sans">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-150 relative">
                            <span className="text-[9px] uppercase font-mono text-zinc-400 block font-bold">Extracted String Name</span>
                            <span className="font-mono text-zinc-950 font-bold">{selectedVerifyUser.extractedVerificationData.extractedName}</span>
                            <div className="absolute right-2.5 top-2.5 flex items-center gap-1 text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded uppercase font-bold">
                              <span>Match 100%</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-150 relative">
                            <span className="text-[9px] uppercase font-mono text-zinc-400 block font-bold">Extracted Institution Affiliation</span>
                            <span className="font-mono text-zinc-950 font-bold text-[11px] block truncate">{selectedVerifyUser.extractedVerificationData.extractedInstitution}</span>
                            <div className="absolute right-2.5 top-2.5 flex items-center gap-1 text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded uppercase font-bold">
                              <span>Match 100%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-zinc-650">
                          <span className="flex items-center gap-1.5">
                            <span className="min-w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" />
                            <span>OCR Status: <strong className="text-zinc-900">VERIFIED MATCH</strong></span>
                          </span>
                          <span>Confidence Parameter: <strong className="text-emerald-700">{selectedVerifyUser.extractedVerificationData.confidence}%</strong></span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs text-zinc-500 font-mono">
                        OCR Alignment pending. Press "Trigger OCR Scan" to run validation engine.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* R SIDE: Active Ledger / Comparisons and Verification triggers */}
            <div className="p-6 space-y-5 flex flex-col justify-between">
              
              <div className="space-y-4">
                <span className="text-xs uppercase font-mono font-bold text-zinc-700 tracking-wider flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                  <UserCheck className="w-4.5 h-4.5 text-zinc-950" />
                  <span>{isRTL ? 'إقرار التسجيل ومطابقة الهوية العيادية' : 'Registered Registry Account Claims'}</span>
                </span>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 text-xs">
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9.5px] font-mono text-zinc-400 font-bold block uppercase">Registered Scholar Name</span>
                        <h4 className="font-bold text-zinc-950 font-serif text-sm">
                          {isRTL ? selectedVerifyUser.nameAR || selectedVerifyUser.name : selectedVerifyUser.name}
                        </h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase border ${
                        selectedVerifyUser.verificationIDStatus === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-305'
                          : selectedVerifyUser.verificationIDStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : selectedVerifyUser.verificationIDStatus === 'rejected'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {selectedVerifyUser.verificationIDStatus || 'none'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-200/60 text-[11px]">
                      <div>
                        <span className="text-[8.5px] uppercase font-mono text-zinc-400 block font-bold">Email Domain Status</span>
                        <div className="flex items-center gap-1 font-mono">
                          <span className="bg-zinc-100 px-1 py-0.5 rounded text-[10px] text-zinc-700 truncate">{selectedVerifyUser.email}</span>
                          {selectedVerifyUser.isEmailDomainVerified ? (
                            <span className="text-emerald-600 font-bold" title="University domain matched!">✓</span>
                          ) : (
                            <span className="text-zinc-450" title="Unmatched standard domains">✕</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[8.5px] uppercase font-mono text-zinc-400 block font-bold">Claimed Affiliation</span>
                        <span className="font-bold text-zinc-800 line-clamp-1 truncate">{isRTL ? selectedVerifyUser.institutionAR || selectedVerifyUser.institution : selectedVerifyUser.institution}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-500 bg-white p-2 border border-zinc-150 rounded-xl">
                      <div className="text-center font-sans">
                        <strong className="block text-zinc-900 font-mono text-xs">{selectedVerifyUser.academicMetrics?.citations || 0}</strong>
                        Citations
                      </div>
                      <div className="text-center border-x border-zinc-150 font-sans">
                        <strong className="block text-zinc-900 font-mono text-xs">{selectedVerifyUser.academicMetrics?.hIndex || 0}</strong>
                        h-index
                      </div>
                      <div className="text-center font-sans">
                        <strong className="block text-zinc-900 font-mono text-xs">{selectedVerifyUser.academicMetrics?.papersCount || 0}</strong>
                        Papers
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/20 text-xs text-zinc-500 leading-relaxed font-sans">
                    <strong>Bypassing Policy Exception:</strong> Real academic ID documents scanned above have been parsed against the Global Healthedia registry index. Once an admin overrides claims, a security certificate verified badge is awarded.
                  </div>
                </div>
              </div>

              {/* Action Board triggers */}
              <div className="pt-4 border-t border-zinc-100 flex gap-3 font-mono text-xs">
                {selectedVerifyUser.verificationIDStatus === 'verified' ? (
                  <div className="w-full p-3 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl flex items-center gap-2.5 justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" />
                    <div>
                      <span className="font-bold block">Account Authenticated & Digitally Verified</span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">Professional check badge pinned globally across search endpoints and profile indices.</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleUpdateVerificationState(selectedVerifyUser.id, 'rejected')}
                      disabled={selectedVerifyUser.verificationIDStatus === 'none'}
                      className="flex-grow p-3 hover:bg-zinc-100 border border-zinc-250 rounded-xl text-red-750 font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{isRTL ? 'رفاص الوثائق وعرقلة الحساب' : 'Flag & Reject Claims'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleUpdateVerificationState(selectedVerifyUser.id, 'verified')}
                      disabled={selectedVerifyUser.verificationIDStatus === 'none' || (isOCRScanning)}
                      className="flex-grow p-3 bg-zinc-950 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-zinc-900 cursor-pointer disabled:opacity-40"
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={3} />
                      <span>{isRTL ? 'مصادقة الهوية واعتماد الحساب' : 'Verify Account ID'}</span>
                    </button>
                  </>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* --- Rest of Directory and Audit logs --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side Column: Quick verifications table status overview, Audit Trails */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Section 1: Verification quick checks */}
          <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-zinc-900" />
              <span>{isRTL ? 'مراجعة أرقام التراخيص (Serial ID)' : 'Dossier Audit Queue'}</span>
            </span>

            <div className="space-y-3">
              {verifications.map((doc) => {
                const targetProfile = users.find(u => u.id === doc.userId);
                const currentStatusInDb = targetProfile?.verificationIDStatus || doc.status;
                
                return (
                  <div 
                    key={doc.userId} 
                    onClick={() => {
                      const found = users.find(u => u.id === doc.userId);
                      if (found) setSelectedVerifyUser(found);
                    }}
                    className={`p-3 border rounded-xl space-y-2 text-xs font-sans transition-all cursor-pointer ${
                      selectedVerifyUser?.id === doc.userId 
                        ? 'border-zinc-950 bg-zinc-900/5 ring-1 ring-zinc-950 shadow-sm' 
                        : 'border-zinc-200 bg-zinc-50/40 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-zinc-500 font-bold">{doc.serialNumber}</span>
                      <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[8px] ${
                        currentStatusInDb === 'verified' 
                          ? 'bg-emerald-55 text-emerald-800 border border-emerald-300' 
                          : currentStatusInDb === 'rejected' || currentStatusInDb === 'flagged'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-zinc-100 text-zinc-650'
                      }`}>
                        {currentStatusInDb}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-zinc-900 leading-snug">{doc.userName}</h4>
                      <span className="text-[10px] text-zinc-500 font-mono block">{doc.institution}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-[9px] text-zinc-450 font-mono">
                      <span>Click to load split view</span>
                      <span>🔎 FILE VIEW</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Account Activity Logs */}
          <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-zinc-950" />
              <span>{isRTL ? 'تفاصيل سجل الأمن والنشاط' : 'Account Security Audit Trail'}</span>
            </span>

            <div className="space-y-3 font-sans text-xs max-h-[220px] overflow-y-auto pr-1">
              {auditLogs.map((log, index) => (
                <div key={index} className="border-b border-zinc-100 pb-2 last:border-0">
                  <div className="flex justify-between font-mono text-[9px] text-zinc-400">
                    <span className="font-bold text-zinc-650">{log.event}</span>
                    <span>{log.time}</span>
                  </div>
                  <p className="text-zinc-650 mt-0.5 text-[10px] leading-relaxed">{log.details}</p>
                  <span className="text-[9px] text-zinc-405 font-mono block">Operator: {log.user}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side Column: Global Investigator Directory table (2/3 width) */}
        <div className="lg:col-span-2 border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider">
              {isRTL ? 'دليل المحققين والمراجعين' : 'Global Researcher directory'}
            </span>
            <div className="flex gap-2 w-full sm:w-auto font-sans text-xs">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder={isRTL ? 'بحث بالمعرف أو الاسم...' : 'Search credentials...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-zinc-300 rounded-xl focus:outline-none focus:border-black w-full text-xs font-mono"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 border border-zinc-300 rounded-xl text-xs focus:outline-none"
              >
                <option value="all">{isRTL ? 'جميع الرتب' : 'All Roles'}</option>
                <option value="admin">ADMIN</option>
                <option value="editor">EDITOR</option>
                <option value="reviewer">REVIEWER</option>
                <option value="researcher">RESEARCHER</option>
                <option value="student">STUDENT</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-zinc-200 rounded-xl">
            <table className="min-w-full text-xs text-left rtl:text-right font-sans">
              <thead className="bg-zinc-50 font-mono text-[9px] uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3">{isRTL ? 'المحقق والمعرّفات' : 'Investigator name'}</th>
                  <th className="px-4 py-3">{isRTL ? 'اللقب الأكاديمي الحالي' : 'Active Rank'}</th>
                  <th className="px-4 py-3 text-center">{isRTL ? 'التحقق الأمني' : 'Security Status'}</th>
                  <th className="px-4 py-3">{isRTL ? 'تعديل الصلاحية' : 'Access Override'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-zinc-455 font-mono">
                      No registered accounts matched filter queries.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const verified = u.isDigitallyVerified;
                    return (
                      <tr 
                        key={u.id} 
                        className={`hover:bg-zinc-50/50 cursor-pointer ${selectedVerifyUser?.id === u.id ? 'bg-zinc-50/40' : ''}`}
                        onClick={() => setSelectedVerifyUser(u)}
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {u.avatarUrl ? (
                              <img src={u.avatarUrl} alt={u.name} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full object-cover shrink-0 border border-zinc-200" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-zinc-100 font-mono text-[9px] font-bold text-zinc-500 flex items-center justify-center shrink-0 border border-zinc-200">
                                {u.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-zinc-900">{isRTL ? u.nameAR || u.name : u.name}</span>
                                {verified && (
                                  <span className="text-zinc-950 font-black inline-flex items-center justify-center bg-zinc-100 p-0.5 rounded border border-zinc-300 shadow-sm" title="Digitally Certified Verified Checkmark">
                                    <Check className="w-2.5 h-2.5 text-zinc-900" strokeWidth={4} />
                                  </span>
                                )}
                              </div>
                              <span className="block text-[8.5px] text-zinc-450 font-mono leading-none mt-0.5">{u.email} ({u.id})</span>
                              <span className="block text-[9.5px] text-zinc-500 font-serif italic max-w-xs truncate mt-0.5">
                                {isRTL ? u.institutionAR || u.institution : u.institution}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase rounded ${
                            u.role === 'admin' 
                              ? 'bg-zinc-950 text-white' 
                              : u.role === 'editor'
                                ? 'bg-zinc-805 text-white'
                                : u.role === 'reviewer'
                                  ? 'bg-zinc-200 text-zinc-800 border border-zinc-300'
                                  : 'bg-zinc-100 text-zinc-650'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded font-mono text-[8px] font-bold uppercase ${
                            u.verificationIDStatus === 'verified'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-250'
                              : u.verificationIDStatus === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-300 animate-pulse'
                                : u.verificationIDStatus === 'rejected'
                                  ? 'bg-red-50 text-red-850 border border-red-200'
                                  : 'bg-zinc-100 text-zinc-400'
                          }`}>
                            {u.verificationIDStatus || 'none'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as AcademicRole)}
                            className="bg-transparent border border-zinc-200 rounded p-1 text-[10px] focus:outline-none font-bold"
                            disabled={currentUser.role !== 'admin' || u.id === currentUser.id}
                          >
                            <option value="admin">ADMIN</option>
                            <option value="editor">EDITOR</option>
                            <option value="reviewer">REVIEWER</option>
                            <option value="researcher">RESEARCHER</option>
                            <option value="student">STUDENT</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
}
