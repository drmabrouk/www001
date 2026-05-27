/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, Layers, ShieldCheck, UserCheck, CheckCircle2, AlertTriangle, ChevronRight, Menu, X, Trash2 } from 'lucide-react';

import { AcademicPaper, WikipediaEdit, UserProfile, GlobalSettings, AcademicRole, SentEmail } from './types';
import { INITIAL_USERS, INITIAL_PAPERS, INITIAL_EDITS, INITIAL_EMAILS, TRANSLATIONS } from './data';

import Navigation from './components/Navigation';
import SearchEngine from './components/SearchEngine';
import PaperDetail from './components/PaperDetail';
import WikiEditModal from './components/WikiEditModal';
import SubmitPaperModal from './components/SubmitPaperModal';
import Authentication from './components/Authentication';
import Dashboard from './components/Dashboard';
import InstitutionalHub, { SEED_INSTITUTIONS } from './components/InstitutionalHub';
import { Institution } from './types';

export default function App() {
  // --- Language Setup ---
  const [currentLang, setLang] = useState<'en' | 'ar'>('en');
  const isRTL = currentLang === 'ar';
  const t = TRANSLATIONS[currentLang];

  // --- Hydrate States from LocalStorage ---
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('healthdia_users_state');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('healthdia_active_user_state');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default to Mabrouk (Admin) as primary user to ensure robust workspace review
    return INITIAL_USERS.find(u => u.id === 'HD-USR-00001') || INITIAL_USERS[0];
  });

  const [papers, setPapers] = useState<AcademicPaper[]>(() => {
    const saved = localStorage.getItem('healthdia_papers_state');
    return saved ? JSON.parse(saved) : INITIAL_PAPERS;
  });

  const [wikiEdits, setWikiEdits] = useState<WikipediaEdit[]>(() => {
    const saved = localStorage.getItem('healthdia_edits_state');
    return saved ? JSON.parse(saved) : INITIAL_EDITS;
  });

  const [emails, setEmails] = useState<SentEmail[]>(() => {
    const saved = localStorage.getItem('healthdia_emails_state');
    return saved ? JSON.parse(saved) : INITIAL_EMAILS;
  });

  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    const saved = localStorage.getItem('healthdia_institutions_state');
    return saved ? JSON.parse(saved) : SEED_INSTITUTIONS;
  });

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('healthdia_settings_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          layoutSpacing: 'comfortable',
          ...parsed
        };
      } catch (err) {
        // Fallback
      }
    }
    return {
      typography: 'sans',
      fontSizeScale: 1.0,
      highPerformanceMode: true,
      allowOpenContributions: true,
      colorTheme: 'monochrome',
      layoutSpacing: 'comfortable'
    };
  });

  // --- Active Tab Routing ---
  const [currentTab, setTab] = useState<'home' | 'browse' | 'dashboard' | 'submit' | 'tracker' | 'institutions'>('home');

  // --- Focus States ---
  const [selectedPaper, setSelectedPaper] = useState<AcademicPaper | null>(null);
  const [isSuggestingEdit, setIsSuggestingEdit] = useState(false);

  // --- Dynamic App Notifications ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Synchronize LocalStorage ---
  useEffect(() => {
    localStorage.setItem('healthdia_users_state', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('healthdia_active_user_state', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('healthdia_papers_state', JSON.stringify(papers));
  }, [papers]);

  useEffect(() => {
    localStorage.setItem('healthdia_edits_state', JSON.stringify(wikiEdits));
  }, [wikiEdits]);

  useEffect(() => {
    localStorage.setItem('healthdia_emails_state', JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem('healthdia_institutions_state', JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem('healthdia_settings_state', JSON.stringify(globalSettings));
  }, [globalSettings]);

  // Handle switching simulated persona from Navbar
  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    showToast(isRTL ? `تمت محاكاة الهوية: ${user.nameAR || user.name}` : `Simulated Identity: ${user.name}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- Business Logic: Wikipedia-style Edit Verification and Document Merger ---
  const handleUpdateEditStatus = (editId: string, status: 'approved' | 'rejected', feedback?: string) => {
    if (currentUser.role === 'reviewer') {
      setWikiEdits(prev => prev.map(edit => {
        if (edit.id === editId) {
          return {
            ...edit,
            methodologyAudited: status === 'approved',
            auditedBy: currentUser.name,
            auditNotes: feedback || (status === 'approved' ? 'Wiki revision content accuracy passed clinical audit.' : 'Accrued revision concerns.')
          };
        }
        return edit;
      }));

      const emailId = `HD-EML-${Math.floor(Math.random() * 90000 + 10000)}`;
      const newEmail: SentEmail = {
        id: emailId,
        recipient: 'editorial-board@healthdia.org',
        subject: `[Peer Review Suggestion Audit] Revision ID: ${editId}`,
        body: `Attention Editorial Staff,\n\nPeer Reviewer Dr. ${currentUser.name} has audited the collaborative wiki revision proposal for ID: ${editId}.\n\nRevisor Status: ${status.toUpperCase()}\nFeedback Note: ${feedback || 'Approved content validation.'}\n\nThis revision relies on final Editorial Board approval to merge into records.`,
        sentAt: new Date().toISOString().split('T')[0],
        type: 'peer_review'
      };
      setEmails(prev => [newEmail, ...prev]);
      showToast(isRTL ? 'تم كتابة توصية التدقيق الويكي للمحررين.' : 'Reviewer wiki content validation logged.');
      return;
    }

    let targetEdit: WikipediaEdit | null = null;
    let recipientEmail = 'peer-review@healthdia.org';

    setWikiEdits(prev => prev.map(edit => {
      if (edit.id === editId) {
        targetEdit = {
          ...edit,
          status,
          reviewedBy: currentUser.id,
          reviewedByName: currentUser.name,
          reviewedAt: new Date().toISOString().split('T')[0],
          editorFeedback: feedback || (status === 'approved' ? 'Successfully approved and merged.' : 'Revision rejected.')
        };
        // resolve developer/researcher email
        const suggester = users.find(u => u.id === edit.suggestedBy);
        if (suggester) {
          recipientEmail = suggester.email;
        }
        return targetEdit;
      }
      return edit;
    }));

    // If edit is approved, MERGE the proposed change into the original paper document!
    if (status === 'approved' && targetEdit) {
      const editToMerge = targetEdit as WikipediaEdit;
      setPapers(prevPapers => prevPapers.map(paper => {
        if (paper.id === editToMerge.paperId) {
          const updatedPaper = { ...paper };
          const section = editToMerge.section;

          if (currentLang === 'en') {
            if (section === 'abstract') updatedPaper.abstractEN = editToMerge.proposedText;
            else if (section === 'methodology') updatedPaper.methodologyEN = editToMerge.proposedText;
            else if (section === 'results') updatedPaper.resultsEN = editToMerge.proposedText;
            else if (section === 'discussion') updatedPaper.discussionEN = editToMerge.proposedText;
          } else {
            if (section === 'abstract') updatedPaper.abstractAR = editToMerge.proposedText;
            else if (section === 'methodology') updatedPaper.methodologyAR = editToMerge.proposedText;
            else if (section === 'results') updatedPaper.resultsAR = editToMerge.proposedText;
            else if (section === 'discussion') updatedPaper.discussionAR = editToMerge.proposedText;
          }

          // If detail view is open for this paper, update selectedPaper reference so changes appear live!
          if (selectedPaper && selectedPaper.id === paper.id) {
            setSelectedPaper(updatedPaper);
          }

          return updatedPaper;
        }
        return paper;
      }));
    }

    if (targetEdit) {
      const editObj = targetEdit as WikipediaEdit;
      const emailId = `HD-EML-${Math.floor(Math.random() * 90000 + 10000)}`;
      const newEmail: SentEmail = {
        id: emailId,
        recipient: recipientEmail,
        subject: `[Editorial Decision] Collaborative Wiki Suggestion ${status.toUpperCase()} - ${editObj.id}`,
        body: `Dear ${editObj.suggestedByName},\n\nYour proposed collaborative wiki revision for the document "${editObj.paperTitleEN}" has been reviewed by the administrative editorial board.\n\nDecision: ${status.toUpperCase()}\nStaff Notes: ${feedback || (status === 'approved' ? 'Successfully reviewed, approved and merged into official records.' : 'Did not align with current peer verification consensus.')}\n\nThank you for contributing to Healthdia's scientific integrity.`,
        sentAt: new Date().toISOString().split('T')[0],
        type: 'editorial'
      };
      setEmails(prev => [newEmail, ...prev]);
    }

    showToast(`${t.edit_status_updated} ${status.toUpperCase()}`);
  };

  // --- Business Logic: Peer-Review Paper Manuscript Vetting ---
  const handleUpdatePaperStatus = (paperId: string, status: 'approved' | 'rejected', notes?: string) => {
    if (currentUser.role === 'reviewer') {
      setPapers(prev => prev.map(paper => {
        if (paper.id === paperId) {
          return {
            ...paper,
            methodologyAudited: status === 'approved',
            auditedBy: currentUser.name,
            auditNotes: notes || (status === 'approved' ? 'Methodology validated and certified by peer reviewer.' : 'Methodology concerns raised.')
          };
        }
        return paper;
      }));

      const emailId = `HD-EML-${Math.floor(Math.random() * 90000 + 10000)}`;
      const newEmail: SentEmail = {
        id: emailId,
        recipient: 'editorial-board@healthdia.org',
        subject: `[Peer Review Audit Logged] Paper ID: ${paperId}`,
        body: `Attention Editorial Staff,\n\nPeer Reviewer Dr. ${currentUser.name} has completed a methodological audit for Paper ID ${paperId}.\n\nAudit Recommendation: ${status.toUpperCase()}\nReviewer Notes: ${notes || 'Verified clinical integrity.'}\n\nThis paper remains in the pending queue awaiting final Editorial Board indexing or rejection decision.`,
        sentAt: new Date().toISOString().split('T')[0],
        type: 'peer_review'
      };
      setEmails(prev => [newEmail, ...prev]);
      showToast(isRTL ? 'تم تسجيل تقرير التدقيق ومراجعة النظراء بنجاح.' : 'Peer-review audit submitted to editorial desk.');
      return;
    }

    let affectedPaper: AcademicPaper | null = null;
    let recipientEmail = 'researcher@healthdia.org';
    let recipientName = 'Author';

    setPapers(prev => prev.map(paper => {
      if (paper.id === paperId) {
        affectedPaper = paper;
        const authorUser = users.find(u => u.id === paper.submittedBy);
        if (authorUser) {
          recipientEmail = authorUser.email;
          recipientName = authorUser.name;
        } else {
          recipientName = paper.submittedByName;
        }

        return {
          ...paper,
          status,
          editorNotes: notes || (status === 'approved' ? 'Approved for global archival catalog.' : 'Rejected.')
        };
      }
      return paper;
    }));

    if (affectedPaper) {
      const paperObj = affectedPaper as AcademicPaper;
      const emailId = `HD-EML-${Math.floor(Math.random() * 90000 + 10000)}`;
      const newEmail: SentEmail = {
        id: emailId,
        recipient: recipientEmail,
        subject: `[Academic Board decision] Submission Status: ${status.toUpperCase()}`,
        body: `Dear ${recipientName},\n\nWe appreciate your academic research submission to Healthdia.org.\n\nManuscript: "${paperObj.titleEN}"\nDOI Catalog Number: ${paperObj.doi}\nDecision: ${status.toUpperCase()}\nReview Board comments: ${notes || (status === 'approved' ? 'The work meets all peer criteria for clinical indexing.' : 'Vetting notes indicated that the study did not conform fully to layout parameters.')}\n\nShould you need further support, reply directly to this notice.`,
        sentAt: new Date().toISOString().split('T')[0],
        type: 'peer_review'
      };
      setEmails(prev => [newEmail, ...prev]);
    }

    showToast(`${t.paper_status_updated} ${status.toUpperCase()}`);
  };

  // --- Business Logic: Update Privileges & Ranks ---
  const handleUpdateUserRole = (userId: string, targetRole: AcademicRole) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const updated = { ...user, role: targetRole };
        if (currentUser.id === userId) {
          setCurrentUser(updated); // Sync active simulated session role
        }
        return updated;
      }
      return user;
    }));
    showToast(isRTL ? `تم تحديث رتبة الباحث إلى: ${targetRole.toUpperCase()}` : `Updated academic rank to: ${targetRole.toUpperCase()}`);
  };

  // --- Business Logic: Propose suggested Wikipedia Edit ---
  const handleProposeWikiEdit = (proposedEdit: Omit<WikipediaEdit, 'id' | 'createdAt' | 'status'>) => {
    const editId = `HD-EDT-${Math.floor(Math.random() * 90000 + 10000)}`;
    const newEdit: WikipediaEdit = {
      ...proposedEdit,
      id: editId,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setWikiEdits(prev => [newEdit, ...prev]);
    setIsSuggestingEdit(false);

    // Trigger structured automated alert for wiki suggest
    const emailId = `HD-EML-${Math.floor(Math.random() * 90000 + 10000)}`;
    const newEmail: SentEmail = {
      id: emailId,
      recipient: currentUser.email,
      subject: `Collaborative Wiki Suggestion Logged - HD-EDT-${editId.split('-')[2]}`,
      body: `Dear ${currentUser.name},\n\nYour proposed collaborative modification for section "${proposedEdit.section}" on paper ID ${proposedEdit.paperId} is safely registered. It has been designated to our Board's review queue. ID is: ${editId}.`,
      sentAt: new Date().toISOString().split('T')[0],
      type: 'submission'
    };
    setEmails(prev => [newEmail, ...prev]);

    showToast(`${t.edit_success} ${editId}`);
  };

  // --- Business Logic: Transmit New Paper Manuscript ---
  const handleAddPaper = (newPaperData: any) => {
    const paperId = `HD-RES-${Math.floor(Math.random() * 90000 + 10000)}`;
    const doi_string = `10.58210/hd.2026.${paperId.split('-')[2]}`;
    
    const isJournal = newPaperData.submissionTrack === 'journal';

    // Add default values for metadata metrics with dual-track support
    const newPaper: AcademicPaper = {
      ...newPaperData,
      id: paperId,
      doi: doi_string,
      citationCount: 0,
      views: 1,
      downloads: 0,
      status: 'pending', // Triggers vetting queue on Admin tab!
      submittedBy: currentUser.id,
      submittedByName: currentUser.name,
      publishedAt: new Date().toISOString().split('T')[0],
      journalCertifiedWeightApplied: isJournal, // Applies 2.5x ranking impact if accepted in Journal
    };

    setPapers(prev => [newPaper, ...prev]);

    // Send manuscript submission confirmation email custom-tailored to the submission Track
    const emailId = `HD-EML-${Math.floor(Math.random() * 90000 + 10000)}`;
    
    let subjectLine = `Manuscript Registration Successful - Pending Review (${paperId})`;
    let bodyText = `Dear ${currentUser.name},\n\nThank you for submitting your research manuscript "${newPaper.titleEN}".\n\nRegistered Serial: ${paperId}\nAssigned DOI: ${doi_string}\nStatus: PENDING BOARD MODERATION\n\nOur three-tier review board has been notified. You can track progress on Healthedia's dashboard.`;

    if (isJournal) {
      subjectLine = `Healthedia Flagship Journal Manuscript Submitted - Double-Blind Protocol Active (${paperId})`;
      bodyText = `Dear Dr. ${currentUser.name},\n\nWe acknowledge the receipt of your original, exclusive flagship manuscript "${newPaper.titleEN}" for the Healthedia Peer-Reviewed Journal.\n\nPaper ID: ${paperId}\nAssigned Canonical DOI: ${doi_string}\nExclusivity Attestation: SIGNED & CONFIRMED\nEthics Declaration: COMPLIANT (Declaration of Helsinki)\nAssigned Weights: 2.5x institutional ranking impact upon acceptance\n\nYour manuscript has been routed to the Journal Editorial Board for referee appointments. Thank you for choosing Healthedia as your exclusive publishing venue.`;
    } else {
      subjectLine = `Open-Access Repository Paper Deposited - Vetting Active (${paperId})`;
      bodyText = `Dear ${currentUser.name},\n\nYour existing study titled "${newPaper.titleEN}" has been successfully queued for listing in the Healthedia Research Bank repository.\n\nPaper ID: ${paperId}\nDeclared External Publisher: ${newPaper.originalJournal || 'Declared Source'}\nOriginal Link: ${newPaper.originalLink || 'N/A'}\nLicensing Confirmation: SIGNED (CC-BY Host Rights Agreement)\n\nThe Repository Monitor will verify your declared DOI and license status shortly to index the paper.`;
    }

    const newEmail: SentEmail = {
      id: emailId,
      recipient: currentUser.email,
      subject: subjectLine,
      body: bodyText,
      sentAt: new Date().toISOString().split('T')[0],
      type: 'submission'
    };
    setEmails(prev => [newEmail, ...prev]);

    setTab('browse'); // Switch to browsing tab to see queue or index
    showToast(`${t.submission_success} ${paperId}`);
  };

  // --- Business Logic: Central Academic Profiles Update ---
  const handleUpdateUserProfile = (updatedDetails: Partial<UserProfile>) => {
    const synced = { ...currentUser, ...updatedDetails };
    setCurrentUser(synced);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? synced : u));
  };

  const handleUpdateUser = (userId: string, updatedFields: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, ...updatedFields };
      }
      return u;
    }));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updatedFields }));
    }
  };

  const handleRegisterNewProfile = (newProfileDetails: any) => {
    const newId = `HD-USR-${Math.floor(Math.random() * 90000 + 10000)}`;
    const newProfile: UserProfile = {
      ...newProfileDetails,
      id: newId,
      contributionsCount: 0,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newProfile]);
    setCurrentUser(newProfile);

    // Send a real-time automated registration notification email
    const emailId = `HD-EML-${Math.floor(Math.random() * 90000 + 10000)}`;
    const newEmail: SentEmail = {
      id: emailId,
      recipient: newProfileDetails.email,
      subject: `Welcome to Healthdia - Academic Registration Activated (${newId})`,
      body: `Dear ${newProfileDetails.name},\n\nWelcome to Healthdia.org. Your academic researcher registry has been finalized.\n\nUnique ID Number: ${newId}\nYour Custom Profile URL: https://healthdia.org/${newProfileDetails.username || 'user'}\nPrivacy: ${newProfileDetails.isPublic ? 'PUBLICLY INDEXED' : 'PRIVATE PORTFOLIO'}\n\nYou can now publish, suggest revisions, and participate in collaborative scholarly peer reviews.`,
      sentAt: new Date().toISOString().split('T')[0],
      type: 'registration'
    };
    setEmails(prev => [newEmail, ...prev]);
  };

  const resetLocalStore = () => {
    localStorage.removeItem('healthdia_papers_state');
    localStorage.removeItem('healthdia_edits_state');
    localStorage.removeItem('healthdia_users_state');
    localStorage.removeItem('healthdia_settings_state');
    localStorage.removeItem('healthdia_active_user_state');
    localStorage.removeItem('healthdia_emails_state');
    localStorage.removeItem('healthdia_institutions_state');
    window.location.reload();
  };

  // --- Calculate pending indicators count for badge ---
  const pendingPapersCount = papers.filter(p => p.status === 'pending').length;
  const pendingEditsCount = wikiEdits.filter(e => e.status === 'pending').length;

  // --- Dynamic Color Theme Selectors ---
  const getThemeClass = (theme: string) => {
    switch (theme) {
      case 'high-contrast-dark':
        return 'bg-zinc-950 text-white border-zinc-900';
      case 'sand-editorial':
        return 'bg-[#faf6eb] text-zinc-900 border-[#eae3cb]';
      default:
        return 'bg-[#fafafa] text-zinc-900 border-zinc-200';
    }
  };

  // --- Font setup classes ---
  const getFontFamilyClass = (typ: string) => {
    switch (typ) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      default:
        return 'font-sans';
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col transition-colors duration-300 ${getThemeClass(globalSettings.colorTheme)} ${getFontFamilyClass(globalSettings.typography)}`} 
      style={{ fontSize: `${globalSettings.fontSizeScale}rem` }}
      id="healthdia-application-root"
    >
      
      {/* Dynamic Toast popup notifier */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 bg-zinc-950 text-white font-mono text-xs rounded-xl shadow-2xl border border-black animate-bounce flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header / Bilingual Simulator Navigator */}
      <Navigation
        currentLang={currentLang}
        setLang={setLang}
        currentUser={currentUser}
        availableUsers={users}
        onSelectUser={handleSelectUser}
        currentTab={currentTab}
        setTab={(tab) => {
          setSelectedPaper(null); // Clear selected article on navigation click
          setTab(tab);
        }}
        pendingPapersCount={pendingPapersCount}
        pendingEditsCount={pendingEditsCount}
      />

       {/* Main Content Area */}
       <main className={`flex-grow pb-16 fade-in-up transition-all duration-300 ${
         globalSettings.layoutSpacing === 'compact' 
           ? 'py-3 gap-y-3 space-y-3' 
           : globalSettings.layoutSpacing === 'relaxed' 
             ? 'py-16 gap-y-12 space-y-12' 
             : 'py-8 gap-y-6 space-y-6'
       }`}>
        
        {/* If selectedPaper is active, override view for dedicated reader */}
        {selectedPaper ? (
          <PaperDetail
            currentLang={currentLang}
            paper={selectedPaper}
            currentUser={currentUser}
            wikiEdits={wikiEdits}
            globalSettings={globalSettings}
            onBack={() => setSelectedPaper(null)}
            onSuggestEdit={() => setIsSuggestingEdit(true)}
          />
        ) : (
          /* Multi-screen Router */
          <>
            {/* Tab 1 & Tab 2: Home search engine portal / browse list */}
            {(currentTab === 'home' || currentTab === 'browse') && (
              <SearchEngine
                currentLang={currentLang}
                papers={papers}
                onSelectPaper={(paper) => setSelectedPaper(paper)}
                globalSettings={globalSettings}
                searchQuery={currentTab === 'home' ? '' : ' '} // Quick browse forces empty list check to trigger standard query results
                setSearchQuery={(query) => {
                  setTab('browse'); // Typing on home redirects seamlessly to directory result listings
                }}
                onSwitchTab={setTab}
              />
            )}

            {/* Tab 3: Author submits new manuscript or review pieces */}
            {currentTab === 'submit' && (
              <SubmitPaperModal
                currentLang={currentLang}
                currentUser={currentUser}
                onSubmit={handleAddPaper}
              />
            )}

            {/* Tab 4: Administrative governance and parameters setting desk */}
            {currentTab === 'dashboard' && (
              <div className="max-w-6xl mx-auto px-4">
                {currentUser.role === 'admin' || currentUser.role === 'editor' || currentUser.role === 'reviewer' ? (
                  <Dashboard
                    currentLang={currentLang}
                    currentUser={currentUser}
                    papers={papers}
                    wikiEdits={wikiEdits}
                    users={users}
                    globalSettings={globalSettings}
                    onUpdatePaperStatus={handleUpdatePaperStatus}
                    onUpdateEditStatus={handleUpdateEditStatus}
                    onUpdateUserRole={handleUpdateUserRole}
                    onUpdateUser={handleUpdateUser}
                    onSaveSettings={(nextSettings) => setGlobalSettings(nextSettings)}
                  />
                ) : (
                  <div className="text-center py-24 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm max-w-xl mx-auto mt-10">
                    <AlertTriangle className="w-12 h-12 text-zinc-950 mx-auto mb-4" />
                    <h2 className="text-lg font-bold font-serif text-zinc-900">
                      {isRTL ? 'غير مصرح - صلاحيات مخصصة للهيئات والمراجعين' : 'Access Restricted — Board Credentials Required'}
                    </h2>
                    <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
                      {isRTL 
                        ? 'يرجى تغيير رتبة المستخدم في المحاكاة (الشريط الرمادي بالمستعرض العلوي) إلى رتبة EDITOR أو REVIEWER أو ADMIN لتجبر النظام على فتح الصلاحيات بالكامل.'
                        : 'Please switch your simulated persona in the top gray strip to a higher rank (e.g., REVIEWER, EDITOR, or ADMIN) to bypass security guards.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Academic Identity & traceability Profile options */}
            {currentTab === 'tracker' && (
              <Authentication
                currentLang={currentLang}
                currentUser={currentUser}
                users={users}
                emails={emails}
                papers={papers}
                onUpdateProfile={handleUpdateUserProfile}
                onRegisterNew={handleRegisterNewProfile}
              />
            )}

            {/* Tab 6: Institutional Hub & Standings Leaderboard */}
            {currentTab === 'institutions' && (
              <InstitutionalHub
                currentLang={currentLang}
                papers={papers}
                users={users}
                currentUser={currentUser}
                globalSettings={globalSettings}
                institutions={institutions}
                onUpdateInstitutions={setInstitutions}
                onToast={showToast}
                onSendSystemEmail={(newMail) => {
                  const emailId = `HD-EML-${Math.floor(Math.random() * 90000 + 10000)}`;
                  const fullEmail: SentEmail = {
                    id: emailId,
                    recipient: newMail.recipient,
                    subject: newMail.subject,
                    body: newMail.body,
                    sentAt: new Date().toISOString().split('T')[0],
                    type: newMail.type || 'peer_review'
                  };
                  setEmails(prev => [fullEmail, ...prev]);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Wikipedia Suggest Edit popup modal overlay */}
      {isSuggestingEdit && selectedPaper && (
        <WikiEditModal
          currentLang={currentLang}
          paper={selectedPaper}
          currentUser={currentUser}
          onClose={() => setIsSuggestingEdit(false)}
          onSubmitProposal={handleProposeWikiEdit}
        />
      )}

      {/* Footer bar */}
      <footer className="bg-zinc-950 text-white border-t border-zinc-900 py-10 mt-auto text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left rtl:md:text-right">
          <div>
            <span className="block text-sm font-bold tracking-widest font-serif text-white uppercase mb-3">
              HEALTHDIA.ORG
            </span>
            <p className="text-zinc-400 font-sans leading-relaxed text-[11px] max-w-sm mx-auto md:mx-0">
              {isRTL 
                ? 'هيلثديا هو مستودعي الأبجدي العالمي لنشر الأبحاث والمجلات والتوثيق الموحد، نؤمن بالشفافية والتحرير التشاركي تحت رقابة الهيئات.'
                : 'Healthdia is a global academic repository dedicated to the preservation, peer-review analysis, and community-driven revision of clinical findings.'}
            </p>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center">
            <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">
              {isRTL ? 'إدارة المستودع المفتوح' : 'Scholarly Infrastructure Code'}
            </span>
            <span className="inline-block bg-zinc-900 px-3 py-1 border border-zinc-800 rounded font-semibold text-zinc-300">
              {isRTL ? 'سجلات السكيوريتي نشطة ●' : 'Security Log Status: Active ●'}
            </span>
            <button
              onClick={resetLocalStore}
              className="mt-2 text-zinc-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] underline"
            >
              <Trash2 className="w-3 h-3" />
              <span>{isRTL ? 'تصفير السجلات وإعادة تهيئة البيانات' : 'Reset Registry Database'}</span>
            </button>
          </div>

          <div className="text-zinc-500 text-[11px] leading-relaxed flex flex-col justify-between">
            <div>
              <span>EST. 2026 • HEALTH JOURNAL NET</span>
              <span className="block mt-1">Platform ID: {currentUser.id}</span>
            </div>
            <div className="pt-4 border-t border-zinc-900 text-[10px] sm:text-zinc-500">
              Built with precision for Google AI Studio. Antigravity compliant.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
