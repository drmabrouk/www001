/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, ShieldCheck, Mail, Building, FileText, Check, Globe, 
  ToggleLeft, ToggleRight, BadgeAlert, Key, Link2, BookOpen, 
  AlertCircle, FileSpreadsheet, Send, CheckCircle2, Lock, Edit3,
  RefreshCw, Fingerprint, Sparkles, Upload, XCircle, Image, Award, HelpCircle
} from 'lucide-react';
import { UserProfile, AcademicRole, SentEmail, AcademicPaper } from '../types';
import { TRANSLATIONS } from '../data';

interface AuthenticationProps {
  currentLang: 'en' | 'ar';
  currentUser: UserProfile;
  users: UserProfile[];
  emails: SentEmail[];
  papers: AcademicPaper[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onRegisterNew: (profile: Omit<UserProfile, 'id' | 'registeredAt' | 'contributionsCount'>) => void;
}

export default function Authentication({
  currentLang,
  currentUser,
  users,
  emails,
  papers,
  onUpdateProfile,
  onRegisterNew,
}: AuthenticationProps) {
  const t = TRANSLATIONS[currentLang];
  const isRTL = currentLang === 'ar';

  const [registerMode, setRegisterMode] = useState(false);
  const [profileTab, setProfileTab] = useState<'info' | 'output' | 'emails'>('info');
  const [isEditing, setIsEditing] = useState(false);

  // Registration states
  const [regName, setRegName] = useState('');
  const [regNameAR, setRegNameAR] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regInstitution, setRegInstitution] = useState('');
  const [regInstitutionAR, setRegInstitutionAR] = useState('');
  const [regRole, setRegRole] = useState<AcademicRole>('researcher');
  const [regBio, setRegBio] = useState('');
  const [regBioAR, setRegBioAR] = useState('');
  const [regCredentials, setRegCredentials] = useState('');
  const [regCredentialsAR, setRegCredentialsAR] = useState('');
  const [regProfHistory, setRegProfHistory] = useState('');
  const [regProfHistoryAR, setRegProfHistoryAR] = useState('');
  const [regIsPublic, setRegIsPublic] = useState(true);

  // Edit states for existing profile
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editBioAR, setEditBioAR] = useState(currentUser.bioAR || '');
  const [editCredentials, setEditCredentials] = useState(currentUser.credentials || '');
  const [editCredentialsAR, setEditCredentialsAR] = useState(currentUser.credentialsAR || '');
  const [editHistory, setEditHistory] = useState(currentUser.professionalHistory || '');
  const [editHistoryAR, setEditHistoryAR] = useState(currentUser.professionalHistoryAR || '');
  const [editUsername, setEditUsername] = useState(currentUser.username || '');
  const [editPassword, setEditPassword] = useState(currentUser.password || 'SecurePass123_#');

  const [notif, setNotif] = useState('');
  const [errorNotif, setErrorNotif] = useState('');

  // Dynamic Academic portal verifications states
  const [showVerifyPortal, setShowVerifyPortal] = useState(false);
  const [isUploadingID, setIsUploadingID] = useState(false);
  const [isUploadingPassport, setIsUploadingPassport] = useState(false);
  const [uploadedIDName, setUploadedIDName] = useState('');
  const [uploadedPassportName, setUploadedPassportName] = useState('');
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  // Sync state indices
  const [isSyncingScholar, setIsSyncingScholar] = useState(false);
  const [isSyncingORCID, setIsSyncingORCID] = useState(false);
  const [isSyncingPubMed, setIsSyncingPubMed] = useState(false);

  // Biometric avatar cropper
  const [isOptimizingPhoto, setIsOptimizingPhoto] = useState(false);

  // Synchronize editing state if user switched via top simulator bar
  React.useEffect(() => {
    setEditBio(currentUser.bio || '');
    setEditBioAR(currentUser.bioAR || '');
    setEditCredentials(currentUser.credentials || '');
    setEditCredentialsAR(currentUser.credentialsAR || '');
    setEditHistory(currentUser.professionalHistory || '');
    setEditHistoryAR(currentUser.professionalHistoryAR || '');
    setEditUsername(currentUser.username || '');
    setEditPassword(currentUser.password || 'SecurePass123_#');
    setIsEditing(false);
    setNotif('');
    setErrorNotif('');
  }, [currentUser]);

  // Validation rules
  const validateUsername = (uname: string, excludeId?: string): { valid: boolean; reason: string } => {
    const trimmed = uname.trim();
    if (trimmed.length < 4) {
      return { valid: false, reason: isRTL ? 'يجب أن لا يقل اسم المستخدم عن 4 رموز.' : 'Vanity handle must be at least 4 characters long.' };
    }
    if (trimmed.length > 20) {
      return { valid: false, reason: isRTL ? 'يجب أن لا يزيد اسم المستخدم عن 20 رمزاً.' : 'Vanity handle must not exceed 20 characters.' };
    }
    const safeRegex = /^[a-zA-Z0-9_-]+$/;
    if (!safeRegex.test(trimmed)) {
      return { valid: false, reason: isRTL ? 'يسمح فقط بالأحرف، الأرقام، والشرطة السفلى (- _).' : 'Only alphanumeric, hyphens, and underscores permitted.' };
    }
    // Check duplicate
    const exists = users.some(u => u.username?.toLowerCase() === trimmed.toLowerCase() && u.id !== excludeId);
    if (exists) {
      return { valid: false, reason: isRTL ? 'إشارة Vanity مستخدمة مسبقاً لباحث آخر.' : 'This vanity handle is already claimed by another researcher.' };
    }
    return { valid: true, reason: '' };
  };

  const validateEmail = (mail: string): { valid: boolean; reason: string } => {
    const trimmed = mail.trim();
    if (trimmed.length > 40) {
      return { valid: false, reason: isRTL ? 'البريد الإلكتروني طويل جداً (الحد الأقصى 40 حرفاً).' : 'Email length must not exceed 40 characters.' };
    }
    if (!trimmed.includes('@') || !trimmed.includes('.')) {
      return { valid: false, reason: isRTL ? 'عنوان البريد الإلكتروني غير صالح.' : 'Invalid academic email address format.' };
    }
    return { valid: true, reason: '' };
  };

  const validatePassword = (pass: string): { valid: boolean; reason: string } => {
    if (pass.length < 5) {
      return { valid: false, reason: isRTL ? 'الرمز السري ضعيف جداً (الحد الأدنى 5 رموز).' : 'Password parameter must be at least 5 characters.' };
    }
    if (pass.length > 30) {
      return { valid: false, reason: isRTL ? 'أمان التشفير محدد بـ 30 رمزاً كحد أقصى.' : 'Security policy sets a maximum of 30 characters for passwords.' };
    }
    return { valid: true, reason: '' };
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotif('');
    setErrorNotif('');

    if (!regName.trim() || !regEmail.trim() || !regInstitution.trim() || !regUsername.trim()) {
      setErrorNotif(isRTL ? 'يرجى تعبئة كافة الحقول الإلزامية لتسجيل معرّفك.' : 'Please enter all mandatory fields to generate your academic identity.');
      return;
    }

    // Run validations
    const uCheck = validateUsername(regUsername);
    if (!uCheck.valid) {
      setErrorNotif(uCheck.reason);
      return;
    }

    const eCheck = validateEmail(regEmail);
    if (!eCheck.valid) {
      setErrorNotif(eCheck.reason);
      return;
    }

    const pCheck = validatePassword(regPassword || 'DefaultSecure_99#');
    if (!pCheck.valid) {
      setErrorNotif(pCheck.reason);
      return;
    }

    onRegisterNew({
      email: regEmail.trim(),
      name: regName.trim(),
      nameAR: regNameAR.trim() || regName.trim(),
      institution: regInstitution.trim(),
      institutionAR: regInstitutionAR.trim() || regInstitution.trim(),
      role: regRole,
      bio: regBio.trim() || 'No active clinical bibliography specified.',
      bioAR: regBioAR.trim() || 'لا توجد سيرة مخبرية أكاديمية مسجلة.',
      username: regUsername.trim().toLowerCase(),
      password: regPassword || 'DefaultSecure_99#',
      credentials: regCredentials.trim() || 'Certified Scholar',
      credentialsAR: regCredentialsAR.trim() || 'باحث أكاديمي معتمد',
      professionalHistory: regProfHistory.trim() || 'No history provided.',
      professionalHistoryAR: regProfHistoryAR.trim() || 'لا توجد سجلات تاريخية.',
      isPublic: regIsPublic,
    });

    setNotif(isRTL ? 'تهانينا! تم إنشاء شهادة الهوية الطبية الموحدة بنجاح.' : 'Success! Your permanent academic serial & profile has been issued.');
    setRegisterMode(false);
    setProfileTab('info');
    
    // Clear registration fields
    setRegName(''); setRegNameAR(''); setRegEmail(''); setRegUsername(''); setRegPassword('');
    setRegInstitution(''); setRegInstitutionAR(''); setRegBio(''); setRegBioAR('');
    setRegCredentials(''); setRegCredentialsAR(''); setRegProfHistory(''); setRegProfHistoryAR('');
  };

  const handleSaveProfileUpdates = (e: React.FormEvent) => {
    e.preventDefault();
    setNotif('');
    setErrorNotif('');

    // If editing critical username handle
    if (editUsername !== currentUser.username) {
      const uCheck = validateUsername(editUsername, currentUser.id);
      if (!uCheck.valid) {
        setErrorNotif(uCheck.reason);
        return;
      }
    }

    const pCheck = validatePassword(editPassword);
    if (!pCheck.valid) {
      setErrorNotif(pCheck.reason);
      return;
    }

    onUpdateProfile({
      bio: editBio,
      bioAR: editBioAR,
      credentials: editCredentials,
      credentialsAR: editCredentialsAR,
      professionalHistory: editHistory,
      professionalHistoryAR: editHistoryAR,
      username: editUsername.trim().toLowerCase(),
      password: editPassword,
    });

    setNotif(isRTL ? 'تم حفظ التغييرات الأكاديمية بنجاح وتحديث نظام الربط (SEO).' : 'Scholarly credentials and index metrics updated successfully.');
    setIsEditing(false);
    setTimeout(() => setNotif(''), 4000);
  };

  // Find user's academic papers
  const myPapers = papers.filter(p => p.submittedBy === currentUser.id);

  // Find outbound mock emails
  const myEmails = emails.filter(m => m.recipient.toLowerCase() === currentUser.email.toLowerCase());

  // Cropping & image compression engine simulator
  const handleOptimizePhoto = () => {
    setIsOptimizingPhoto(true);
    setNotif(isRTL ? 'جارٍ الضغط والقص التلقائي لخلفة الصورة...' : 'Initializing server-side compression & aspect-ratio cropper...');
    setTimeout(() => {
      onUpdateProfile({
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
      });
      setIsOptimizingPhoto(false);
      setNotif(isRTL ? 'تم تحسين أبعاد الصورة للوجه الدائري وضغطها بنجاح للتحميل الفائق!' : 'Image compression & circular crop successfully applied (WebP format optimized to 85% lossiness bounds).');
    }, 1200);
  };

  // External Indices Connectors (Mock Synchronizers with real state modification)
  const handleSyncScholar = () => {
    setIsSyncingScholar(true);
    setNotif(isRTL ? 'اتصال خريطة استشهادات Google Scholar...' : 'Querying Google Scholar profiles databases...');
    setTimeout(() => {
      const currentMetrics = currentUser.academicMetrics || { citations: 94, hIndex: 6, papersCount: 3 };
      onUpdateProfile({
        academicMetrics: {
          citations: currentMetrics.citations + 45,
          hIndex: currentMetrics.hIndex + 2,
          papersCount: currentMetrics.papersCount + 1
        },
        googleScholarId: 'G-Scholar-' + currentUser.id
      });
      setIsSyncingScholar(false);
      setNotif(isRTL ? 'تم التزامن مع Google Scholar بنجاح! تم تحديث النقاط.' : 'Google Scholar integration successfully synchronized. Index citation indicators updated.');
    }, 1200);
  };

  const handleSyncORCID = () => {
    setIsSyncingORCID(true);
    setNotif(isRTL ? 'جارٍ الاتصال ببوابة المقالة المفتوحة ORCID...' : 'Syncing live metadata registry from ORCID database...');
    setTimeout(() => {
      const currentMetrics = currentUser.academicMetrics || { citations: 94, hIndex: 6, papersCount: 3 };
      onUpdateProfile({
        academicMetrics: {
          citations: currentMetrics.citations + 18,
          hIndex: currentMetrics.hIndex + 1,
          papersCount: currentMetrics.papersCount + 2
        },
        orcidId: '0000-0002-8409-' + Math.floor(Math.random() * 9000 + 1000)
      });
      setIsSyncingORCID(false);
      setNotif(isRTL ? 'تم تحديث مقتبسات ORCID بنجاح وتحميل سجلات النشر!' : 'ORCID persistent publication history retrieved. Synchronized citations count successfully.');
    }, 1200);
  };

  const handleSyncPubMed = () => {
    setIsSyncingPubMed(true);
    setNotif(isRTL ? 'بحث خادم PubMed Central وقلم المقتبسات...' : 'Connecting to National Library of Medicine (PubMed/NCBI) servers...');
    setTimeout(() => {
      const currentMetrics = currentUser.academicMetrics || { citations: 94, hIndex: 6, papersCount: 3 };
      onUpdateProfile({
        academicMetrics: {
          citations: currentMetrics.citations + 32,
          hIndex: currentMetrics.hIndex + 1,
          papersCount: currentMetrics.papersCount + 1
        },
        pubmedId: 'PMID-8840-' + Math.floor(Math.random() * 9000 + 1000)
      });
      setIsSyncingPubMed(false);
      setNotif(isRTL ? 'تم سحب فهرس مجلة PubMed وإضافتها بنجاح!' : 'PubMed indices alignment successful. Peer-reviewed journal citations mapped.');
    }, 1200);
  };

  // High-trust credentials uploads simulators
  const emailDomain = currentUser.email.split('@')[1]?.toLowerCase() || '';
  const recognizedUniversalDomains = ['ox.ac.uk', 'harvard.edu', 'univ.edu', 'healthsciences.org', 'cu.edu.eg', 'alexu.edu.eg'];
  const hasMatchedEmailDomain = recognizedUniversalDomains.includes(emailDomain);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleUploadIDMock = () => {
    setIsUploadingID(true);
    setNotif(isRTL ? 'بدء فحص الامتثال وحماية المستندات...' : 'Compliance Engine: Scanning institutional ID copy for corruption and malicious code...');
    setTimeout(() => {
      setIsUploadingID(false);
      setUploadedIDName('academic_id_card.png');
      setNotif(isRTL ? 'اكتمل فحص الامتثال: المستند سليم ومعتمد.' : 'Compliance check COMPLETE: ID document safe and verified standard format.');
    }, 1200);
  };

  const handleUploadPassportMock = () => {
    setIsUploadingPassport(true);
    setNotif(isRTL ? 'تنظيف التهديدات الرقمية وفحص سلامة الميتا...' : 'Executing document scan - scanning passive passport biometrics schemas...');
    setTimeout(() => {
      setIsUploadingPassport(false);
      setUploadedPassportName('passport_biometrics_scan.pdf');
      setNotif(isRTL ? 'اكتمل فحص جواز السفر: تم التطهير والاعتماد.' : 'File scans finished. Compliance engine verified standard academic layout.');
    }, 1200);
  };

  const handleExecuteInteractiveOCR = () => {
    setIsOCRProcessing(true);
    setOcrSuccess(false);
    setTimeout(() => {
      setIsOCRProcessing(false);
      setOcrSuccess(true);
      onUpdateProfile({
        uploadedIDUrl: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=400',
        uploadedPassportUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        verificationIDStatus: 'pending',
        isDigitallyVerified: false, // Pending admin manual confirmation
        extractedVerificationData: {
          extractedName: currentUser.name,
          extractedInstitution: currentUser.institution,
          nameMatched: true,
          institutionMatched: true,
          confidence: 97
        }
      });
      setNotif(isRTL ? 'تمت مطابقة OCR بنجاح بنسبة 100%! ملفك بانتظار إقرار الإدارة.' : 'AI OCR match completed with 100% accuracy. Target dossiers posted to verification queue.');
    }, 2000);
  };

  // Real-time username check state helper
  const resolvedRegUsernameValid = regUsername.trim() ? validateUsername(regUsername) : null;
  const resolvedEditUsernameValid = (isEditing && editUsername.trim() && editUsername !== currentUser.username) 
    ? validateUsername(editUsername, currentUser.id) 
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" id="profile-identity-hub" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Title block */}
      <div className="mb-8 border-b border-zinc-200 pb-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left rtl:sm:text-right">
          <h1 className="text-3xl font-extrabold text-zinc-950 font-serif tracking-tight">
            {registerMode 
              ? (isRTL ? 'توليد هوية باحث جديدة' : 'Scholarly Registration Board')
              : (isRTL ? 'سجل الهوية والتبعية العلمية' : 'Central Research Identity Portfolio')}
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
            {isRTL 
              ? 'نظام إصدار الأرقام الأكاديمية الموحدة وقنوات الاتصال المرتبطة بـ SEO والـ XML Sitemaps العالمية للتغطية الطبية.'
              : 'Permanent ID assigner, credentials engine, and automated SEO visibility matrices.'}
          </p>
        </div>
        
        {!registerMode && (
          <button
            onClick={() => setRegisterMode(!registerMode)}
            className="px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer border border-black shrink-0"
          >
            {isRTL ? 'تسجيل كباحث جديد +' : 'Register Alternate Identity +'}
          </button>
        )}
      </div>

      {/* Notifications bar */}
      {notif && (
        <div className="mb-6 bg-zinc-950 text-white font-mono text-xs border border-transparent p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in" id="profile-success-notif">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
          <span className="flex-grow">{notif}</span>
          <button onClick={() => setNotif('')} className="text-zinc-400 font-bold hover:text-white shrink-0 px-2" aria-label="Dismiss">×</button>
        </div>
      )}

      {errorNotif && (
        <div className="mb-6 bg-red-50 text-red-900 border border-red-200 font-sans text-xs p-4 rounded-xl flex items-start gap-3 shadow-sm animate-shake" id="profile-error-notif">
          <BadgeAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-grow font-semibold">{errorNotif}</div>
          <button onClick={() => setErrorNotif('')} className="text-red-550 font-bold hover:text-red-950 shrink-0 px-1" aria-label="Dismiss">×</button>
        </div>
      )}

      {/* RENDER PROFILE VIEWS */}
      {!registerMode ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Side capsule summary */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-center shadow-xs">
              
              {/* Circular Biometric Photo with crop simulation trigger */}
              <div 
                className="relative w-20 h-20 mx-auto mb-4 group cursor-pointer" 
                onClick={handleOptimizePhoto}
                title="Click to auto-crop to circular aspect ratio and trigger compressed server upload"
              >
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt="Avatar" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover border border-zinc-200 shadow-sm" 
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-100 group-hover:bg-zinc-200 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-900 font-extrabold text-2xl tracking-tighter shadow-inner transition-colors">
                    {currentUser.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
                
                {/* Crop Hover overlay helper */}
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[8px] font-mono uppercase font-bold text-center leading-tight p-1 select-none">
                  <Image className="w-4 h-4 text-emerald-300 mb-0.5" />
                  <span>{isOptimizingPhoto ? 'Cropping...' : (isRTL ? 'تحسين وقص' : 'Crop Circle')}</span>
                </div>
              </div>

              <h2 className="text-md font-bold font-serif text-zinc-950 mb-0.5 tracking-tight flex items-center gap-1.5 justify-center">
                <span>{isRTL ? currentUser.nameAR || currentUser.name : currentUser.name}</span>
                {currentUser.isDigitallyVerified && (
                  <span className="text-zinc-950 font-black inline-flex items-center justify-center bg-zinc-105 p-0.5 rounded border border-zinc-300 shadow-sm" title="Digitally Certified checkmark namely globally">
                    <Check className="w-2.5 h-2.5 text-zinc-900 font-black" strokeWidth={5} />
                  </span>
                )}
              </h2>
              
              <p className="text-[10px] font-mono font-semibold uppercase text-zinc-400 mb-3 tracking-wider">
                {currentUser.role}
              </p>

              <div className="inline-block px-2.5 py-1 bg-zinc-100 border border-zinc-200 rounded-lg text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-800 leading-none">
                ID: {currentUser.id}
              </div>

              {/* Verified Badge */}
              <div className="mt-4 pt-4 border-t border-zinc-105 flex flex-col items-center justify-center gap-1.5 font-mono text-[9px]">
                {currentUser.isDigitallyVerified ? (
                  <div className="flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-250 px-2 py-1 rounded-xl w-full justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold uppercase text-[8px] tracking-wider">{isRTL ? 'معرَف موثق نشط' : 'Verified Elite'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-zinc-500 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-xl w-full justify-center">
                    <HelpCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="font-bold uppercase text-[8px] tracking-wider">{isRTL ? 'باحث غير مصادق' : 'Self Claimed'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sub Tabs navigation list */}
            <div className="bg-white border border-zinc-200 p-2 rounded-2xl flex flex-col gap-1 shadow-xs font-mono text-xs">
              <button
                onClick={() => setProfileTab('info')}
                className={`w-full p-3 rounded-xl text-left rtl:text-right font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  profileTab === 'info' 
                    ? 'bg-zinc-950 text-white' 
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>{isRTL ? 'البيانات الشخصية والتبعية' : 'Identity & Credentials'}</span>
              </button>

              <button
                onClick={() => setProfileTab('output')}
                className={`w-full p-3 rounded-xl text-left rtl:text-right font-bold transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                  profileTab === 'output' 
                    ? 'bg-zinc-950 text-white' 
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>{isRTL ? 'الأطروحات والمخرجات' : 'Academic Output'}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${profileTab === 'output' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-700'}`}>
                  {myPapers.length}
                </span>
              </button>

              <button
                onClick={() => setProfileTab('emails')}
                className={`w-full p-3 rounded-xl text-left rtl:text-right font-bold transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                  profileTab === 'emails' 
                    ? 'bg-zinc-950 text-white' 
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>{isRTL ? 'سجل الإشعارات الأكاديمية' : 'Automated Email Log'}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${profileTab === 'emails' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-700'}`}>
                  {myEmails.length}
                </span>
              </button>
            </div>
          </div>

          {/* Core Panel */}
          <div className="md:col-span-3 space-y-6">
            
            {/* SUB-TAB 1: BIOGRAPHY AND SYSTEM CREDENTIAL REGISTRATION */}
            {profileTab === 'info' && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                
                <div className="flex justify-between items-center border-b border-zinc-150 pb-4">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-zinc-950">
                      {isRTL ? 'البيانات وسجلات البحث والتوثيق' : 'Scholarly Index credentials'}
                    </h3>
                    <p className="text-[11px] font-mono text-zinc-400">
                      {isRTL ? 'أرّشِف سِمتك العلمية ووثق درجاتك لعامة محركات القراءة الطبية.' : 'Validate and lock clinical certificates for public SEO querying.'}
                    </p>
                  </div>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 border border-zinc-250 hover:bg-zinc-50 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isRTL ? 'تعديل السيرة' : 'Edit Credentials'}</span>
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  /* READ ONLY DISPLAY MODE */
                  <div className="space-y-6">
                    
                    {/* Unique Serial & Vanity URLs Panel (MOCKUP DEMO) */}
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/60 font-mono text-xs space-y-3.5">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-zinc-200 pb-3">
                        <div>
                          <span className="block text-[10px] text-zinc-400 uppercase tracking-widest">{isRTL ? 'حساب المعرف الدائم (Unique ID)' : 'Permanent Scholar ID'}</span>
                          <span className="text-zinc-950 font-bold text-sm tracking-tight">{currentUser.id}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-zinc-400 uppercase tracking-widest">{isRTL ? 'البريد الأكاديمي الرقمي' : 'Registered email (Max 40 Chars)'}</span>
                          <span className="text-zinc-950 font-bold whitespace-nowrap">{currentUser.email}</span>
                        </div>
                      </div>

                      {/* Display customized vanity link */}
                      <div className="bg-white p-3.5 rounded-xl border border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2 text-zinc-950">
                          <Link2 className="w-4 h-4 text-zinc-400 shrink-0" />
                          <div className="leading-tight">
                            <span className="block text-[9px] uppercase tracking-wider text-zinc-400">{isRTL ? 'عنوان Vanity الموثق (SEO Canonical Link)' : 'Visual Domain Map URL (Seemless Routing)'}</span>
                            <span className="text-xs font-bold text-zinc-900 break-all">
                              healthdia.org/{currentUser.username || currentUser.id.toLowerCase()}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-zinc-900 text-white rounded text-[8px] font-bold tracking-widest uppercase">
                          {isRTL ? 'تم التحقق' : 'ROUTABLE INDEXED'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Academic Degrees & Credentials */}
                      <div className="p-4 bg-zinc-50/50 hover:bg-zinc-100/30 transition-all rounded-xl border border-zinc-200 flex flex-col">
                        <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 mb-2 tracking-wide flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-black" />
                          {isRTL ? 'الشهادات والدرجات الأكاديمية' : 'Credentials & Medical Degrees'}
                        </span>
                        <p className="text-sm font-sans font-bold text-zinc-950 flex-grow leading-relaxed">
                          {isRTL 
                            ? (currentUser.credentialsAR || currentUser.credentials || 'باحث عام باللائحة') 
                            : (currentUser.credentials || 'Certified Academic Researcher')}
                        </p>
                      </div>

                      {/* Professional History */}
                      <div className="p-4 bg-zinc-50/50 hover:bg-zinc-100/30 transition-all rounded-xl border border-zinc-200 flex flex-col">
                        <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 mb-2 tracking-wide flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-black" />
                          {isRTL ? 'التاريخ المهني والأبحاث السابقة' : 'Scholarly Background / Clinical History'}
                        </span>
                        <p className="text-xs font-sans text-zinc-700 flex-grow leading-relaxed">
                          {isRTL 
                            ? (currentUser.professionalHistoryAR || currentUser.professionalHistory || 'لا يوجد ملف توثيقي مسبق.') 
                            : (currentUser.professionalHistory || 'Not documented.')}
                        </p>
                      </div>
                    </div>

                    {/* Standard bio abstracts */}
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block mb-2 tracking-wide">{t.bio}</span>
                      <div className="p-4 border border-zinc-200 rounded-xl leading-relaxed text-zinc-800 text-xs sm:text-sm font-sans bg-zinc-50/30">
                        {isRTL ? (currentUser.bioAR || currentUser.bio) : (currentUser.bio || 'Please edit credentials to insert academic summary.')}
                      </div>
                    </div>

                    {/* --- REQ FEATURE: Academic Achievement Metrics & Syncher Dashboard --- */}
                    <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4 shadow-sm" id="academic-elite-syncher-panel">
                      <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                        <div>
                          <span className="text-xs uppercase font-mono font-bold text-zinc-800 tracking-wider flex items-center gap-1.5">
                            <Award className="w-4.5 h-4.5 text-zinc-950" />
                            <span>{isRTL ? 'لوحة تحكم وتزامن المقاييس العلمية' : 'Academic Elite Metrics Dashboard'}</span>
                          </span>
                          <span className="block text-[10px] text-zinc-400 mt-0.5">{isRTL ? 'ربط وتحديث بيانات الاستشهاد من المستوعبات المعتمدة.' : 'Sync citations profiles from ORCID, Google Scholar, and PubMed.'}</span>
                        </div>
                      </div>

                      {/* Display Numbers */}
                      <div className="grid grid-cols-3 gap-3 text-center bg-zinc-50 border border-zinc-150 p-4 rounded-xl">
                        <div className="font-sans">
                          <span className="text-[10px] uppercase font-mono text-zinc-400 block font-bold">{isRTL ? 'إجمالي المقتبسات' : 'Total Citations'}</span>
                          <span className="text-xl sm:text-2xl font-black text-zinc-955 font-mono">
                            {currentUser.academicMetrics?.citations || 0}
                          </span>
                        </div>
                        <div className="font-sans border-x border-zinc-200">
                          <span className="text-[10px] uppercase font-mono text-zinc-400 block font-bold">h-index</span>
                          <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
                            {currentUser.academicMetrics?.hIndex || 0}
                          </span>
                        </div>
                        <div className="font-sans">
                          <span className="text-[10px] uppercase font-mono text-zinc-400 block font-bold">{isRTL ? 'منشور مدقق' : 'Indexed Papers'}</span>
                          <span className="text-xl sm:text-2xl font-black text-zinc-955 font-mono">
                            {currentUser.academicMetrics?.papersCount || 0}
                          </span>
                        </div>
                      </div>

                      {/* Linkage Channels Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-none">
                        
                        {/* Scholar Sync Box */}
                        <div className="p-3 bg-zinc-50/40 border border-zinc-150 rounded-xl flex flex-col justify-between gap-3">
                          <div className="space-y-1">
                            <span className="font-bold text-zinc-900 block font-serif">Google Scholar</span>
                            <span className="font-mono text-[9px] text-zinc-400 block truncate">
                              {currentUser.googleScholarId ? `Verified: ${currentUser.googleScholarId}` : 'Not Linked'}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={handleSyncScholar}
                            disabled={isSyncingScholar}
                            className="w-full py-1.5 bg-white border border-zinc-200 hover:border-black rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                          >
                            <RefreshCw className={`w-3 h-3 ${isSyncingScholar ? 'animate-spin' : ''}`} />
                            <span>{isSyncingScholar ? 'Querying...' : (currentUser.googleScholarId ? 'Resync' : 'Integrate')}</span>
                          </button>
                        </div>

                        {/* ORCID Sync Box */}
                        <div className="p-3 bg-zinc-50/40 border border-zinc-150 rounded-xl flex flex-col justify-between gap-3">
                          <div className="space-y-1">
                            <span className="font-bold text-zinc-900 block font-serif">ORCID Registry</span>
                            <span className="font-mono text-[9px] text-zinc-400 block truncate">
                              {currentUser.orcidId ? `Verified: ${currentUser.orcidId}` : 'Not Linked'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handleSyncORCID}
                            disabled={isSyncingORCID}
                            className="w-full py-1.5 bg-white border border-zinc-200 hover:border-black rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                          >
                            <RefreshCw className={`w-3 h-3 ${isSyncingORCID ? 'animate-spin' : ''}`} />
                            <span>{isSyncingORCID ? 'Syncing...' : (currentUser.orcidId ? 'Resync' : 'Integrate')}</span>
                          </button>
                        </div>

                        {/* PubMed Sync Box */}
                        <div className="p-3 bg-zinc-50/40 border border-zinc-150 rounded-xl flex flex-col justify-between gap-3">
                          <div className="space-y-1">
                            <span className="font-bold text-zinc-900 block font-serif">PubMed Central</span>
                            <span className="font-mono text-[9px] text-zinc-400 block truncate">
                              {currentUser.pubmedId ? `Verified: ${currentUser.pubmedId}` : 'Not Linked'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handleSyncPubMed}
                            disabled={isSyncingPubMed}
                            className="w-full py-1.5 bg-white border border-zinc-200 hover:border-black rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                          >
                            <RefreshCw className={`w-3 h-3 ${isSyncingPubMed ? 'animate-spin' : ''}`} />
                            <span>{isSyncingPubMed ? 'Aligning...' : (currentUser.pubmedId ? 'Resync' : 'Integrate')}</span>
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* --- REQ FEATURE: Secure Identity Verification & OCR Portal Gateway --- */}
                    <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4" id="identity-verification-portal-card">
                      
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                        <div>
                          <span className="text-xs uppercase font-mono font-bold text-zinc-800 tracking-wider flex items-center gap-1.5">
                            <Fingerprint className="w-4.5 h-4.5 text-zinc-900" />
                            <span>{isRTL ? 'بوابة التحقق الثنائي وإصدار الشارة الكريبتوغرافية' : 'Secure Verification & Audit Gateway'}</span>
                          </span>
                          <span className="block text-[10px] text-zinc-400 font-sans mt-0.5">
                            {isRTL ? 'بوابة امتثال الهوية لأوراق اعتماد الباحثين والتحقق بالأشعة السينية' : 'Compliance validation, side-by-side ID verification, and AI-OCR checking.'}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase border ${
                          currentUser.verificationIDStatus === 'verified'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-250'
                            : currentUser.verificationIDStatus === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                              : currentUser.verificationIDStatus === 'rejected'
                                ? 'bg-red-50 text-red-750 border-red-200'
                                : 'bg-zinc-100 text-zinc-500'
                        }`}>
                          {currentUser.verificationIDStatus || 'unverified'}
                        </span>
                      </div>

                      {currentUser.verificationIDStatus === 'verified' ? (
                        <div className="p-4 bg-emerald-50/55 border border-emerald-200 rounded-xl text-xs space-y-2 text-emerald-950">
                          <p className="font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" fill="currentColor" />
                            <span>Cryptographic Credentials Verified (Elite Status Awarded)</span>
                          </p>
                          <p className="text-[11px] leading-relaxed font-sans text-emerald-800">
                            {isRTL 
                              ? 'تمت مصادقة هوية الأستاذ ورقابة الترخيص بنجاح. تم تفعيل الشارة السوداء والتحقق ثنائي القنوات عبر الفحص التلقائي.'
                              : 'Your digital credentialing dossier has been manual verified by internal GCP governance and authenticated via compliance OCR layout matching. The checked certified shield is pinned globally next to your index vanity URL.'}
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Prompt to expand portal */}
                          {!showVerifyPortal ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl leading-relaxed text-xs">
                              <div className="space-y-0.5 font-sans text-zinc-650 max-w-md">
                                <span className="font-bold text-zinc-900 block">{isRTL ? 'ابدأ عملية توثيق الهوية المهنية' : 'Elevate to Digitally Verified Status'}</span>
                                <span>{isRTL ? 'قدم بطاقتك الأكاديمية وصورة جواز السفر لدخول دليل النخبة التلقائي.' : 'Upload official institutional ID cards & passports scans to run AI-OCR layout comparison sweeps.'}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowVerifyPortal(true)}
                                className="px-3.5 py-1.5 bg-zinc-950 text-white font-mono font-bold text-[10px] rounded-lg border border-black hover:bg-zinc-900 hover:border-zinc-900 cursor-pointer shrink-0"
                              >
                                {isRTL ? 'بدأ بورد التحقق' : 'Begin Audit Dossier Onboarding'}
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-5 border-t border-zinc-100 pt-4 font-sans text-xs">
                              
                              {/* Part A: Domain automated scan */}
                              <div className="space-y-1.5">
                                <span className="text-[10px] uppercase font-mono text-zinc-400 block font-bold tracking-wider">
                                  Part I: Academic Email Domain checking
                                </span>
                                
                                {hasMatchedEmailDomain ? (
                                  <div className="p-3 bg-emerald-50/60 border border-emerald-150 rounded-xl flex items-center gap-2 text-emerald-900 leading-snug">
                                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0" />
                                    <div>
                                      <span>Domain verified: <strong>@{emailDomain}</strong> is on recognized elite medical school whitelists.</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900 leading-snug">
                                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shrink-0" />
                                    <div>
                                      <span>Domain deferred: <strong>@{emailDomain || 'unknown'}</strong> is a consumer/default domain. Standard review queue will evaluate uploaded documents.</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Part B: File upload and drag zones */}
                              <div className="space-y-2">
                                <span className="text-[10px] uppercase font-mono text-zinc-400 block font-bold tracking-wider">
                                  Part II: Secure Upload Onboarding Portal
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  
                                  {/* Zone 1: ID Card */}
                                  <div 
                                    onDragOver={handleDragOver}
                                    onClick={handleUploadIDMock}
                                    className="border-2 border-dashed border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50/20 p-5 rounded-xl text-center transition-all cursor-pointer relative overflow-hidden"
                                  >
                                    <Upload className="w-5 h-5 text-zinc-400 mx-auto mb-1.5" />
                                    
                                    {isUploadingID ? (
                                      <div className="space-y-1">
                                        <div className="h-1 bg-zinc-100 rounded-full overflow-hidden w-24 mx-auto">
                                          <div className="h-full bg-emerald-500 animate-[pulse_1s_infinite] w-full" />
                                        </div>
                                        <span className="text-[9px] text-zinc-500 font-mono block">Scanning file parameters...</span>
                                      </div>
                                    ) : uploadedIDName ? (
                                      <div className="space-y-0.5">
                                        <span className="text-emerald-700 font-bold font-mono text-[10px] block">✓ {uploadedIDName}</span>
                                        <span className="text-[8px] text-zinc-400 block">Threat Sweep Secure (85kb Compressed pdf)</span>
                                      </div>
                                    ) : (
                                      <div>
                                        <span className="font-bold text-zinc-800 block text-[10px]">Institutional Student/Faculty ID</span>
                                        <span className="text-[9px] text-zinc-400">Drag file or click to simulate 10MB upload bounds</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Zone 2: Passport scan */}
                                  <div 
                                    onDragOver={handleDragOver}
                                    onClick={handleUploadPassportMock}
                                    className="border-2 border-dashed border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50/20 p-5 rounded-xl text-center transition-all cursor-pointer relative overflow-hidden"
                                  >
                                    <Upload className="w-5 h-5 text-zinc-400 mx-auto mb-1.5" />

                                    {isUploadingPassport ? (
                                      <div className="space-y-1">
                                        <div className="h-1 bg-zinc-100 rounded-full overflow-hidden w-24 mx-auto">
                                          <div className="h-full bg-emerald-500 animate-[pulse_1s_infinite] w-full" />
                                        </div>
                                        <span className="text-[9px] text-zinc-500 font-mono block">Running dimensions sweeps...</span>
                                      </div>
                                    ) : uploadedPassportName ? (
                                      <div className="space-y-0.5">
                                        <span className="text-emerald-700 font-bold font-mono text-[10px] block">✓ {uploadedPassportName}</span>
                                        <span className="text-[8px] text-zinc-400 block">Threat Sweep Secure (1.2mb WebP Optimized)</span>
                                      </div>
                                    ) : (
                                      <div>
                                        <span className="font-bold text-zinc-800 block text-[10px]">National Travel Passport Biometrics</span>
                                        <span className="text-[9px] text-zinc-400">Drag document or click to run integrity threat audit</span>
                                      </div>
                                    )}
                                  </div>

                                </div>
                              </div>

                              {/* Part C: OCR Alignment Match Trigger */}
                              <div className="space-y-2.5 border-t border-zinc-100 pt-4">
                                <span className="text-[10px] uppercase font-mono text-zinc-400 block font-bold tracking-wider">
                                  Part III: Automated AI OCR verification
                                </span>

                                {isOCRProcessing ? (
                                  <div className="p-4 rounded-xl border border-zinc-250 bg-zinc-900 text-white font-mono text-xs space-y-2 relative overflow-hidden">
                                    {/* Neon Laser Moving Overlay */}
                                    <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-[bounce_1s_infinite] top-0" />
                                    <span className="loading block text-emerald-400 animate-pulse">Running Neural Recognition Lexicon Classifier...</span>
                                    <div className="text-[9px] text-zinc-400 space-y-0.5">
                                      <div>&gt; Extracting bounding parameters with LayoutLM-v3...</div>
                                      <div>&gt; Aligning extracted entity string: &ldquo;{currentUser.name}&rdquo;</div>
                                      <div>&gt; Cross checking institution: &ldquo;{currentUser.institution}&rdquo;</div>
                                    </div>
                                  </div>
                                ) : ocrSuccess ? (
                                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 text-emerald-950 font-sans">
                                    <div className="flex items-center gap-1.5">
                                      <Sparkles className="w-4 h-4 text-emerald-600" />
                                      <span className="font-bold font-mono text-[10px] uppercase tracking-wider text-zinc-800">OCR Extraction Completed (Certified 97% Confidence)</span>
                                    </div>
                                    <p className="text-[11px] leading-relaxed text-zinc-700">
                                      Match checked: Registered account name aligns 100% with uploaded document passport parameters. Bounded dossier promoted to GCP queues. Verification state adjusted to <strong>PENDING</strong> on platform database.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="flex justify-between items-center gap-3">
                                    <p className="text-[10px] text-zinc-400 max-w-sm">
                                      Compliance file threat scanners must pass sars-integrity before running OCR. Press verify to execute laser scanning.
                                    </p>
                                    
                                    <button
                                      type="button"
                                      onClick={handleExecuteInteractiveOCR}
                                      disabled={!uploadedIDName || !uploadedPassportName}
                                      className="px-4 py-2 bg-zinc-950 text-white font-mono font-bold text-[10px] rounded-lg border border-black hover:bg-zinc-900 hover:border-zinc-900 cursor-pointer shrink-0 disabled:bg-zinc-102 disabled:border-transparent disabled:opacity-40"
                                    >
                                      Run OCR Match Audit
                                    </button>
                                  </div>
                                )}

                              </div>

                              {/* Form Footer Controls */}
                              <div className="flex justify-end pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowVerifyPortal(false);
                                    setOcrSuccess(false);
                                  }}
                                  className="text-[10px] font-mono text-zinc-500 hover:text-zinc-950 font-bold"
                                >
                                  Close Verification Portal
                                </button>
                              </div>

                            </div>
                          )}
                        </>
                      )}

                    </div>

                    {/* Security credentials indicators */}
                    <div className="p-4 border border-zinc-200 bg-white rounded-xl flex items-start gap-3 text-xs text-zinc-500 font-mono">
                      <Lock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-zinc-900 block mb-0.5">Password Security Parameter (Max 30 Chars)</span>
                        <span>Locked with SHA-256 simulation protocol: </span>
                        <span className="text-zinc-900 block break-all font-semibold font-mono bg-zinc-100 px-1 py-0.5 rounded inline-block mt-1">
                          {currentUser.password ? '•'.repeat(Math.min(currentUser.password.length, 20)) : '••••••••••••'} (Encrypted)
                        </span>
                      </div>
                    </div>

                    {/* Basic Privacy Info display */}
                    <div className="pt-4 border-t border-zinc-150 flex justify-between items-center text-xs font-mono">
                      <span className="text-zinc-400">{isRTL ? 'حالة الظهور والزحف على جوجل (XML Sitemap):' : 'SEO Web Crawler Status:'}</span>
                      <span className={`px-2 py-1 rounded font-bold uppercase ${currentUser.isPublic ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' : 'bg-amber-50 text-amber-800 border border-amber-250'}`}>
                        {currentUser.isPublic ? (isRTL ? 'مفهرس محلياً و SEO فعال' : 'Public & Crawler-active') : (isRTL ? 'مخفي من قنوات الزحف' : 'Private & Deindexed')}
                      </span>
                    </div>

                  </div>
                ) : (
                  /* EDITING FORM INPUT PANEL */
                  <form onSubmit={handleSaveProfileUpdates} className="space-y-4 font-sans text-xs">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Vanity Handle & validated username */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-bold text-zinc-700">Vanity Username Handle * (4-20 Chars)</label>
                          <span className="text-[10px] font-mono text-zinc-400">{editUsername.length}/20</span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-[11px] font-mono text-zinc-400">healthdia.org/</span>
                          <input
                            type="text"
                            value={editUsername}
                            maxLength={20}
                            onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                            className="w-full text-xs p-3 pl-28 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none font-mono"
                            placeholder="username"
                            required
                          />
                        </div>
                        {resolvedEditUsernameValid !== null && (
                          <p className={`mt-1 font-mono text-[10px] ${resolvedEditUsernameValid.valid ? 'text-emerald-700' : 'text-red-750'}`}>
                            {resolvedEditUsernameValid.valid ? '✓ Vanity username verified and available.' : `✗ ${resolvedEditUsernameValid.reason}`}
                          </p>
                        )}
                      </div>

                      {/* Password validation max 30 chars */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-bold text-zinc-700">Interactive Secure Password * (Max 30 Chars)</label>
                          <span className="text-[10px] font-mono text-zinc-400">{editPassword.length}/30</span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={30}
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none font-mono"
                            placeholder="Password max 30 chars"
                            required
                          />
                        </div>
                        {editPassword.length > 30 && (
                          <p className="mt-1 text-red-600 text-[10px] font-mono">
                            Password is capped at 30 characters maximum.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* English and Arabic Credentials */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">Degrees & Credentials (English)</label>
                        <input
                          type="text"
                          value={editCredentials}
                          onChange={(e) => setEditCredentials(e.target.value)}
                          className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                          placeholder="e.g., M.D., PhD., Board Certified Endocrinologist"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">الشهادات والدرجات الطبية (عربي)</label>
                        <input
                          type="text"
                          value={editCredentialsAR}
                          onChange={(e) => setEditCredentialsAR(e.target.value)}
                          className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                          placeholder="مثال: دكتوراة، استشاري الغدد الصم والسكري"
                          style={{ direction: 'rtl' }}
                        />
                      </div>
                    </div>

                    {/* English and Arabic Professional Histories */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">Professional Clinical History (English)</label>
                        <textarea
                          value={editHistory}
                          onChange={(e) => setEditHistory(e.target.value)}
                          rows={2}
                          className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                          placeholder="Summary of medical advisory roles or previous institutional milestones..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">التاريخ الطبي المهني السابق (عربي)</label>
                        <textarea
                          value={editHistoryAR}
                          onChange={(e) => setEditHistoryAR(e.target.value)}
                          rows={2}
                          className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                          placeholder="أدوارك الطبية والبحثية السابقة ومواقع العمل المعتمدة..."
                          style={{ direction: 'rtl' }}
                        />
                      </div>
                    </div>

                    {/* English and Arabic Bio Abstracts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">About Me (English)</label>
                        <textarea
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          rows={3}
                          className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                          placeholder="Short general background bio..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">تفريغ السيرة الذاتية (عربي)</label>
                        <textarea
                          value={editBioAR}
                          onChange={(e) => setEditBioAR(e.target.value)}
                          rows={3}
                          className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                          placeholder="نبذة عامة مختصرة..."
                          style={{ direction: 'rtl' }}
                        />
                      </div>
                    </div>

                    {/* Submit Edit Buttons */}
                    <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-zinc-200 rounded-xl hover:bg-zinc-100 cursor-pointer"
                      >
                        {isRTL ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 hover:bg-zinc-900 bg-zinc-950 text-white font-bold rounded-xl transition-all cursor-pointer border border-black"
                      >
                        {isRTL ? 'حفظ وإقفال السجل' : 'Save Scientific Identity'}
                      </button>
                    </div>

                  </form>
                )}

              </div>
            )}

            {/* SUB-TAB 2: ACADEMIC OUTPUT BIBLIOGRAPHY */}
            {profileTab === 'output' && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif text-zinc-950">
                    {isRTL ? 'الأطروحات والمخرجات الأكاديمية' : 'Indexed Publications & Academic Output'}
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400">
                    {isRTL ? 'قائمة الاستشهادات والأعمال الطبية الموثقة التي نشرتها تحت معرفك الشخصي.' : 'Official catalogue of peer-reviewed clinical documents submitted by this account.'}
                  </p>
                </div>

                {myPapers.length > 0 ? (
                  <div className="space-y-4" id="portfolio-output-list">
                    {myPapers.map((paper) => (
                      <div 
                        key={paper.id} 
                        className="p-4 border border-zinc-200 hover:border-zinc-400 bg-zinc-50/20 hover:bg-white rounded-xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div className="space-y-1 text-left rtl:text-right">
                          <span className="inline-block px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-650 rounded text-[9px] font-mono font-semibold tracking-wider uppercase">
                            {paper.id}
                          </span>
                          <h4 className="text-sm font-bold font-serif text-zinc-950 leading-snug">
                            {isRTL ? paper.titleAR || paper.titleEN : paper.titleEN}
                          </h4>
                          <span className="block text-[10px] font-mono text-zinc-400">
                            DOI: {paper.doi} • Pub Date: {paper.publishedAt}
                          </span>
                        </div>

                        <div className="flex sm:flex-col items-end gap-2 text-right font-mono shrink-0">
                          <span className={`px-2.5 py-1 text-[9px] font-bold rounded uppercase ${
                            paper.status === 'approved' 
                              ? 'bg-zinc-950 text-white' 
                              : paper.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-zinc-105 border border-zinc-300 text-zinc-600'
                          }`}>
                            {paper.status}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {paper.citationCount} {isRTL ? 'إحالات' : 'citations'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-zinc-200 rounded-2xl p-6 bg-zinc-50/50">
                    <FileText className="w-12 h-12 text-zinc-350 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-zinc-900 font-serif">
                      {isRTL ? 'لا توجد أطروحات مؤرشفة حالياً' : 'No Indexed Manuscripts Registered'}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
                      {isRTL 
                        ? 'يرجى تقديم مخطوطتك العلمية عبر بوابات التقديم المتاحة، وسيقوم النظام فوراً بنشر العمل في المنصة بعد مراجعة النظراء.'
                        : 'Submit your clinical abstracts and randomized medical trial reports via the Submissions tab in the main header to begin attribution tracing.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 3: INTEGRATED DYNAMIC SCHOLARLY OUTBOUND EMAIL MONITOR */}
            {profileTab === 'emails' && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif text-zinc-950">
                    {isRTL ? 'وحدة الاتصال ومراقبة البريد الإلكتروني الآلي (Email Stream)' : 'Automated Scholarly Email Alert Logs'}
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400">
                    {isRTL 
                      ? 'مراقبة فورية للبرقيات الصادرة تلقائياً بنظام هيلثديا عند توقيت التسجيل، أو قبول مراجعة النظراء أو التعديلات.' 
                      : 'Live audit track of programmatic emails transmitted to your security inbox for registrations, approvals, and reviews.'}
                  </p>
                </div>

                {myEmails.length > 0 ? (
                  <div className="space-y-4 font-mono text-[11px]" id="email-notif-terminal-output">
                    {myEmails.map((email) => (
                      <div 
                        key={email.id} 
                        className="bg-zinc-950 text-zinc-100 p-4 sm:p-5 rounded-2xl shadow-xl border border-black space-y-3.5 relative overflow-hidden"
                      >
                        {/* Elegant background ambient identifier */}
                        <div className="absolute top-0 right-0 bg-zinc-900 border-l border-b border-zinc-800 px-3 py-1 text-[8px] tracking-wider uppercase font-extrabold text-zinc-400">
                          {email.id}
                        </div>

                        {/* Mail Envelope Headers */}
                        <div className="border-b border-zinc-800 pb-3 space-y-1.5 pt-1.5">
                          <div className="flex justify-between items-center text-zinc-450">
                            <span>From: postmaster@healthdia.org</span>
                            <span>{email.sentAt}</span>
                          </div>
                          <div>
                            <span className="text-zinc-400">To: </span>
                            <span className="text-white font-bold">{email.recipient}</span>
                          </div>
                          <div>
                            <span className="text-zinc-400 font-bold">Subject: </span>
                            <span className="text-emerald-400 font-bold">{email.subject}</span>
                          </div>
                        </div>

                        {/* Body contents */}
                        <div className="text-zinc-300 whitespace-pre-line leading-relaxed pl-1">
                          {email.body}
                        </div>

                        {/* Status feedback */}
                        <div className="pt-2 border-t border-zinc-900 flex flex-wrap justify-between items-center text-[9px] text-zinc-500 gap-2">
                          <span className="uppercase tracking-widest text-[#a1a1aa] font-black">
                            Alert Class: {email.type.replace('_', ' ')}
                          </span>
                          <span className="text-emerald-555 font-bold flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            DELIVERED VIA SECURE SMTP DIALECTS
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-zinc-200 rounded-2xl p-6 bg-zinc-50/50">
                    <Mail className="w-12 h-12 text-zinc-350 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-zinc-900 font-serif">
                      {isRTL ? 'صندوق الصادر البريدي خالٍ تماماً' : 'No Automated Alerts Issued for Current Scholar'}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
                      {isRTL 
                        ? 'قم بإرسال دراسة تخصصية، أو اقتراح تعديل في المتصفح لترى كيف يقوم محرك هيلثديا بإصدار إشعارات فورية.'
                        : 'Simulate editorial actions (e.g. submit a paper, propose wiki audits, or register an alternate researcher profile) to inspect automatic email streams.'}
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      ) : (
        /* REGISTRATION FORM COMPONENT */
        <form onSubmit={handleRegisterSubmit} className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6" id="new-identity-form">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-lg font-bold text-zinc-950 font-serif leading-none mb-1">
              {isRTL ? 'بورد تسجيل المعرف الطبي الرقمي الموحد' : 'Certified Academic Registration Profile'}
            </h3>
            <p className="text-xs text-zinc-505">
              {isRTL ? 'املأ الحقول لتوليد ملفك الشخصي وعنوان الـ Vanity واختبار محرك الإشعار التلقائي.' : 'Provide certified clinical attributes to test dynamic indexing & SMTP alerts.'}
            </p>
          </div>

          <div className="space-y-4 font-sans text-xs text-zinc-800">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Scholar Full Name (English) *</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                  placeholder="e.g., Prof. Sarah Jenkins"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">الاسم الأكاديمي ثلاثي (بالعربية) *</label>
                <input
                  type="text"
                  value={regNameAR}
                  onChange={(e) => setRegNameAR(e.target.value)}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                  placeholder="مثال: أ.د. سارة جينكينز"
                  style={{ direction: 'rtl' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Vanity Handle validation: 4 to 20 chars */}
              <div className="md:col-span-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-zinc-700">Vanity Username *</label>
                  <span className="text-[10px] font-mono text-zinc-400">{regUsername.length}/20</span>
                </div>
                <input
                  type="text"
                  maxLength={20}
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none font-mono"
                  placeholder="e.g., sarahj"
                  required
                />
                {resolvedRegUsernameValid !== null && (
                  <p className={`mt-1 font-mono text-[9px] leading-tight ${resolvedRegUsernameValid.valid ? 'text-emerald-700' : 'text-red-750'}`}>
                    {resolvedRegUsernameValid.valid ? '✓ Available' : `✗ ${resolvedRegUsernameValid.reason}`}
                  </p>
                )}
              </div>

              {/* Email validation (max 40 chars) */}
              <div className="md:col-span-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-zinc-700">Email Address *</label>
                  <span className="text-[10px] font-mono text-zinc-400">{regEmail.length}/40</span>
                </div>
                <input
                  type="email"
                  maxLength={40}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                  placeholder="e.g., s.j@auth.edu"
                  required
                />
                {regEmail.length > 40 && (
                  <p className="mt-1 text-red-650 font-mono text-[9px]">Length cannot exceed 40.</p>
                )}
              </div>

              {/* Password constraint max 30 chars */}
              <div className="md:col-span-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-zinc-700">Password Security *</label>
                  <span className="text-[10px] font-mono text-zinc-400">{regPassword.length}/30</span>
                </div>
                <input
                  type="password"
                  maxLength={30}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none font-mono"
                  placeholder="Max 30 character limit"
                  required
                />
                {regPassword.length > 30 && (
                  <p className="mt-1 text-red-650 font-mono text-[9px]">Length cannot exceed 30.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Degrees & Credentials (English) *</label>
                <input
                  type="text"
                  value={regCredentials}
                  onChange={(e) => setRegCredentials(e.target.value)}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                  placeholder="e.g., M.D., Ph.D., Board Certified Cardiology"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">الشهادات الطبية الرسمية (بالعربية) *</label>
                <input
                  type="text"
                  value={regCredentialsAR}
                  onChange={(e) => setRegCredentialsAR(e.target.value)}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                  placeholder="استشاري أمراض الباطنية والغدد صماء"
                  style={{ direction: 'rtl' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Primary Institutional Affiliation (EN) *</label>
                <input
                  type="text"
                  value={regInstitution}
                  onChange={(e) => setRegInstitution(e.target.value)}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                  placeholder="Mayo Clinic Endocrine Center"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">الجامعة أو المركز الطبي التابع له (عربي)</label>
                <input
                  type="text"
                  value={regInstitutionAR}
                  onChange={(e) => setRegInstitutionAR(e.target.value)}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                  placeholder="كلية طب جامعة القاهرة"
                  style={{ direction: 'rtl' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Professional History (English)</label>
                <textarea
                  value={regProfHistory}
                  onChange={(e) => setRegProfHistory(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                  placeholder="Clinical research overview, past committee milestones and review roles..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">السجل والخبرات المهنية الطبية (بالعربية)</label>
                <textarea
                  value={regProfHistoryAR}
                  onChange={(e) => setRegProfHistoryAR(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                  placeholder="مواقع ومخططات التوظيف والأدوار الاستشارية السابقة..."
                  style={{ direction: 'rtl' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">About Me / Biography (English)</label>
                <textarea
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                  placeholder="General research focus area..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">نبذة عن أعمالي باللغة العربية</label>
                <textarea
                  value={regBioAR}
                  onChange={(e) => setRegBioAR(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-3 border border-zinc-300 rounded-xl focus:border-zinc-950 focus:outline-none"
                  placeholder="الكتابة المساعدة وتلخيص الأطروحات..."
                  style={{ direction: 'rtl' }}
                />
              </div>
            </div>

            {/* Role select & toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-100 pt-4">
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-700 mb-1 uppercase">{t.role}</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as AcademicRole)}
                  className="w-full text-xs p-3 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-950"
                >
                  <option value="student">STUDENT (طالب طب)</option>
                  <option value="researcher">RESEARCHER (باحث علمي)</option>
                  <option value="editor">EDITOR (محرر علمي محكم)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50/50">
                <div>
                  <span className="block text-[10px] font-mono tracking-wider font-bold text-zinc-650 uppercase">
                    {isRTL ? 'إذن الفهرسة ومحركات البحث' : 'SEO Search Engine Crawler Index'}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {isRTL ? 'تفعيل الزحف العام من Google بملف XML.' : 'Allows global search engine crawling.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRegIsPublic(!regIsPublic)}
                  className="focus:outline-none shrink-0"
                >
                  {regIsPublic ? (
                    <ToggleRight className="w-8 h-8 text-zinc-950 cursor-pointer" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-zinc-350 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={() => setRegisterMode(false)}
              className="px-4 py-2 border border-zinc-200 rounded-xl hover:bg-zinc-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 hover:bg-zinc-900 bg-zinc-950 text-white border border-black hover:border-zinc-900 font-bold rounded-xl transition-all cursor-pointer"
            >
              {isRTL ? 'إصدار الهوية الطبية الموحدة' : 'Generate Certified ID'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
