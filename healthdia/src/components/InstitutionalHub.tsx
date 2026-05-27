/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  BookOpen, 
  Users, 
  Award, 
  Star, 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  ArrowUpRight, 
  FileText, 
  User, 
  Calendar, 
  Info,
  Sliders,
  Sparkles,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { Institution, InstitutionReview, AcademicPaper, UserProfile, GlobalSettings } from '../types';

interface InstitutionalHubProps {
  currentLang: 'en' | 'ar';
  papers: AcademicPaper[];
  users: UserProfile[];
  currentUser: UserProfile;
  globalSettings: GlobalSettings;
  institutions: Institution[];
  onUpdateInstitutions: (newInsts: Institution[]) => void;
  onSendSystemEmail: (email: { recipient: string; subject: string; body: string; type: 'peer_review' | 'editorial' | 'registration' | 'submission' }) => void;
  onToast: (msg: string) => void;
}

// Internal default set of institutions in case parent passes an empty array or we need robust backstops
export const SEED_INSTITUTIONS: Institution[] = [
  {
    id: 'INS-001',
    name: 'University of Health Sciences & Medical Research',
    nameAR: 'جامعة العلوم الصحية والبحوث الطبية',
    logoLetters: 'UHS',
    flag: '🇬🇧',
    country: 'United Kingdom',
    countryAR: 'المملكة المتحدة',
    region: 'Europe',
    regionAR: 'أوروبا',
    studentBody: 14200,
    facultyCount: 1840,
    baseCitations: 5500,
    baseResearchOutput: 18,
    disciplines: ['Medicine', 'Clinical Research', 'Public Health'],
    summaryEN: 'An elite bio-medical and health research pioneer operating at the intersection of cardiovascular medicine and epidemiological studies. UHS boasts world-class facilities and is the home institution of our Chief Director Dr. Mabrouk Al-Hadi.',
    summaryAR: 'رائد في أبحاث العلوم الطبية والبيولوجية يعمل في تقاطع طرق طب القلب والأوعية الدموية والدراسات الوبائية. وتفتخر المؤسسة بمرافقها عالمية المستوى وهي الجامعة الأم لمشرفنا الأكاديمي أ.د. مبروك الهادي.',
    reviews: [
      {
        id: 'REV-001',
        reviewerId: 'HD-USR-00001',
        reviewerName: 'Dr. Mabrouk Al-Hadi',
        reviewerNameAR: 'أ.د. مبروك الهادي',
        reviewerRole: 'Senior Advisor & Professor',
        affiliationType: 'faculty',
        curriculumRating: 5,
        facilitiesRating: 5,
        researchSupportRating: 5,
        comment: 'Exceptional standards of academic freedom, massive multi-tier clinical trial setups, and absolute adherence to peer review guidelines.',
        commentAR: 'معايير استثنائية للحرية الأكاديمية، وإعداد تجارب سريرية ضخمة متعددة المستويات، والتزام مطلق بمبادئ مراجعة النظراء والتدقيق المنهجي.',
        timestamp: '2025-12-01',
        isVerified: true,
        verificationLevel: 'HE-TRUST'
      }
    ]
  },
  {
    id: 'INS-002',
    name: 'Alexandria Faculty of Medicine',
    nameAR: 'كلية الطب بجامعة الإسكندرية',
    logoLetters: 'ALX',
    flag: '🇪🇬',
    country: 'Egypt',
    countryAR: 'جمهورية مصر العربية',
    region: 'Middle East',
    regionAR: 'الشرق الأوسط',
    studentBody: 18500,
    facultyCount: 2100,
    baseCitations: 3800,
    baseResearchOutput: 12,
    disciplines: ['Medicine', 'Clinical Research', 'Public Health'],
    summaryEN: 'Historically acclaimed medical center and research beacon in North Africa. Noted for SGLT2 drug pathways research, diabetic nephropathy pathways, and metabolic endocrinology trials.',
    summaryAR: 'صرح طبي عريق ومنارة بحثية معترف بها دولياً في شمال إفريقيا. تشتهر بأبحاث مسارات أدوية SGLT2 ودراسات اعتلال الكلية السكري والغدد الصم.',
    reviews: [
      {
        id: 'REV-002',
        reviewerId: 'HD-USR-22841',
        reviewerName: 'Ahmad Al-Masri, PhD',
        reviewerNameAR: 'د. أحمد المصري',
        reviewerRole: 'Lead Investigator',
        affiliationType: 'researcher',
        curriculumRating: 5,
        facilitiesRating: 4,
        researchSupportRating: 4,
        comment: 'Very intensive clinical research environment. Highly focused on pioneering endocrinology and novel bio-regulators.',
        commentAR: 'بيئة بحث سريري مكثفة تهدف إلى الريادة دوماً. مستوى تدريب متميز وأعضاء هيئة تدريس على أعلى المستويات الأكاديمية العالمية.',
        timestamp: '2026-03-10',
        isVerified: true,
        verificationLevel: 'PROVISIONAL'
      }
    ]
  },
  {
    id: 'INS-003',
    name: 'Cairo Medical University',
    nameAR: 'جامعة القاهرة بكلية الطب والتمريض',
    logoLetters: 'CAI',
    flag: '🇪🇬',
    country: 'Egypt',
    countryAR: 'جمهورية مصر العربية',
    region: 'Middle East',
    regionAR: 'الشرق الأوسط',
    studentBody: 22000,
    facultyCount: 2800,
    baseCitations: 4200,
    baseResearchOutput: 14,
    disciplines: ['Medicine', 'Bio-Medical Engineering', 'Public Health'],
    summaryEN: 'A powerhouse of clinical learning and digital diagnostics research. Home to the ground-breaking RetinaNet deep computer vision screening models for automated screening.',
    summaryAR: 'قوة سريرية عظمى ومنارة علمية لتعليم الطب وبحوث التشخيص الرقمي. تحتضن أبحاث شبكات RetinaNet المتطورة للرؤية الحاسوبية والتشخيص التلقائي لقاع العين والشبكية.',
    reviews: [
      {
        id: 'REV-003',
        reviewerId: 'HD-USR-99402',
        reviewerName: 'Layla Mahmoud',
        reviewerNameAR: 'ليلى محمود',
        reviewerRole: 'Medical Resident Researcher',
        affiliationType: 'student',
        curriculumRating: 4,
        facilitiesRating: 4,
        researchSupportRating: 5,
        comment: 'Superb support for engineering students incorporating machine learning benchmarks in public health.',
        commentAR: 'دعم عظيم لطلاب كليات القطاع الصحي لدمج خوارزميات الذكاء الاصطناعي مع خطوط الرعاية الوقائية الأولية.',
        timestamp: '2026-04-18',
        isVerified: true,
        verificationLevel: 'SELF-CLAIM'
      }
    ]
  },
  {
    id: 'INS-004',
    name: 'Royal College of Endocrinology',
    nameAR: 'الكلية الملكية لأمراض الغدد الصماء',
    logoLetters: 'RCE',
    flag: '🇬🇧',
    country: 'United Kingdom',
    countryAR: 'المملكة المتحدة',
    region: 'Europe',
    regionAR: 'أوروبا',
    studentBody: 8200,
    facultyCount: 950,
    baseCitations: 4900,
    baseResearchOutput: 10,
    disciplines: ['Medicine', 'Clinical Research'],
    summaryEN: 'A globally recognized specialty institution spearheading modern metabolic health policies, thyroid oncology studies, and cellular hormone signaling assays.',
    summaryAR: 'مؤسسة تخصصية معترف بها عالمياً تقود سياسات الصحة الأيضية الحديثة ودراسات أورام الغدد الصم والمسارات الخلوية لإشارات الهرمونات.',
    reviews: [
      {
        id: 'REV-004',
        reviewerId: 'HD-USR-10042',
        reviewerName: 'Dr. Sarah Jenkins',
        reviewerNameAR: 'د. سارة جينكينز',
        reviewerRole: 'Associate Professor',
        affiliationType: 'faculty',
        curriculumRating: 5,
        facilitiesRating: 4,
        researchSupportRating: 5,
        comment: 'Excellent clinical trials workspace and state-of-the-art diagnostic labs. Strongly recommended for fellowships.',
        commentAR: 'مختبرات ممتازة ومعامل جزيئية متكاملة لدراسة الأنشطة الهرمونية، ترابط أكاديمي محفز وبيئة تدقيق متميزة.',
        timestamp: '2026-02-28',
        isVerified: true,
        verificationLevel: 'HE-TRUST'
      }
    ]
  },
  {
    id: 'INS-005',
    name: 'Harvard Medical School',
    nameAR: 'كلية طب هارفارد',
    logoLetters: 'HMS',
    flag: '🇺🇸',
    country: 'United States',
    countryAR: 'الولايات المتحدة الأمريكية',
    region: 'North America',
    regionAR: 'أمريكا الشمالية',
    studentBody: 6400,
    facultyCount: 1200,
    baseCitations: 12500,
    baseResearchOutput: 34,
    disciplines: ['Medicine', 'Clinical Research'],
    summaryEN: 'A premier global medical education institution renowned for pioneering surgical procedures, molecular genetics research, and establishing golden standard protocols.',
    summaryAR: 'المؤسسة الرائدة عالمياً في كليات الطب البشري والتعليم الأكاديمي، وتشتهر بريادتها في الإجراءات الجراحية وأبحاث علم الوراثة الجزيئية والمعايير الطبية.',
    reviews: []
  },
  {
    id: 'INS-006',
    name: 'Johns Hopkins Bloomberg School of Public Health',
    nameAR: 'كلية جونز هوبكنز بلومبرج للصحة العامة',
    logoLetters: 'JHSPH',
    flag: '🇺🇸',
    country: 'United States',
    countryAR: 'الولايات المتحدة الأمريكية',
    region: 'North America',
    regionAR: 'أمريكا الشمالية',
    studentBody: 5800,
    facultyCount: 1100,
    baseCitations: 11200,
    baseResearchOutput: 29,
    disciplines: ['Public Health'],
    summaryEN: 'The world\'s largest and most cited school of public health, dedicated to community disease mitigation, epidemiology modeling, and global health equity.',
    summaryAR: 'الكلية الأكبر والأكثر اقتباساً عالمياً في دراسات وأبحاث الصحة العامة والوبائيات، ومكرسة لمكافحة الأوبئة وصياغة سياسات الوقاية والعدالة الصحية العالمية.',
    reviews: []
  },
  {
    id: 'INS-007',
    name: 'MIT Department of Biological Engineering',
    nameAR: 'قسم الهندسة البيولوجية بمعهد ماساتشوستس',
    logoLetters: 'MIT',
    flag: '🇺🇸',
    country: 'United States',
    countryAR: 'الولايات المتحدة الأمريكية',
    region: 'North America',
    regionAR: 'أمريكا الشمالية',
    studentBody: 4500,
    facultyCount: 850,
    baseCitations: 10450,
    baseResearchOutput: 26,
    disciplines: ['Bio-Medical Engineering'],
    summaryEN: 'An exceptional academic cluster leading innovations in genetic circuitry design, bio-computational tissue engineering, and ultra-high-resolution diagnostics.',
    summaryAR: 'تجمع أكاديمي استثنائي رائد في تصميم الدوائر الجينية، وهندسة الأنسجة الحاسوبية الحيوية، وأدوات التشخيص فائقة الدقة.',
    reviews: []
  },
  {
    id: 'INS-008',
    name: 'Keio University Sports Medicine Research Center',
    nameAR: 'مركز أبحاث الطب الرياضي بجامعة كيو',
    logoLetters: 'KSM',
    flag: '🇯🇵',
    country: 'Japan',
    countryAR: 'اليابان',
    region: 'Asia',
    regionAR: 'آسيا',
    studentBody: 2100,
    facultyCount: 340,
    baseCitations: 2800,
    baseResearchOutput: 8,
    disciplines: ['Human Performance'],
    summaryEN: 'East Asia\'s benchmark center for human biomechanics, cardiopulmonary stress testing, and musculoskeletal athletic rehabilitation frameworks.',
    summaryAR: 'المركز المرجعي الأبرز في شرق آسيا المخصص للميكانيكا الحيوية البشرية، واختبارات الإجهاد القلبي الرئوي، والتأهيل الحركي العضلي والرياضي.',
    reviews: []
  }
];

export default function InstitutionalHub({
  currentLang,
  papers,
  users,
  currentUser,
  globalSettings,
  institutions = SEED_INSTITUTIONS,
  onUpdateInstitutions,
  onSendSystemEmail,
  onToast
}: InstitutionalHubProps) {
  const isRTL = currentLang === 'ar';

  // State
  const [activeInstitutionId, setActiveInstitutionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  // Review Form state
  const [curriculumRating, setCurriculumRating] = useState(5);
  const [facilitiesRating, setFacilitiesRating] = useState(5);
  const [researchSupportRating, setResearchSupportRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewCommentAR, setReviewCommentAR] = useState('');
  const [reviewerAffiliation, setReviewerAffiliation] = useState<'student' | 'faculty' | 'alumni' | 'researcher'>('student');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Dynamic lookup mappings
  const mappedPapersByInstitution = useMemo(() => {
    const map: Record<string, AcademicPaper[]> = {};
    
    institutions.forEach(inst => {
      // Find papers matching researchers affiliated with this institution
      const instPapers = papers.filter(p => {
        if (p.status !== 'approved') return false;
        
        // 1. Check if the submitting researcher is from this school
        const submitter = users.find(u => u.id === p.submittedBy);
        if (submitter && submitter.institution.trim().toLowerCase() === inst.name.trim().toLowerCase()) {
          return true;
        }

        // 2. Check if the author names match any users affiliated with this school
        const matchAuthor = p.authorsEN.some(author => {
          const matchedUser = users.find(u => u.name.toLowerCase() === author.toLowerCase());
          return matchedUser && matchedUser.institution.trim().toLowerCase() === inst.name.trim().toLowerCase();
        });

        if (matchAuthor) return true;

        // 3. Simple fuzzy index matching
        if (p.submittedByName && users.some(u => u.name === p.submittedByName && u.institution.trim().toLowerCase() === inst.name.trim().toLowerCase())) {
          return true;
        }

        return false;
      });

      map[inst.id] = instPapers;
    });

    return map;
  }, [institutions, papers, users]);

  // Compute dynamic HRA score metrics for each institution
  const computedInstitutions = useMemo(() => {
    return institutions.map(inst => {
      const instPapers = mappedPapersByInstitution[inst.id] || [];
      const dynamicResearchPapersCount = inst.baseResearchOutput + instPapers.length;
      
      const papersCitations = instPapers.reduce((acc, p) => acc + p.citationCount, 0);
      const dynamicCitationsCount = inst.baseCitations + papersCitations;

      // HRA Component 1: Academic Output (40% weight)
      // Base output + 1.5 pts per paper in repository + 0.1 pts per citation
      const academicOutputRaw = (dynamicResearchPapersCount * 2.5) + (dynamicCitationsCount * 0.05);
      const academicOutputScore = Math.min(100, Math.max(30, academicOutputRaw));

      // HRA Component 2: User Satisfaction & Quality (25% weight)
      // Aggregate scores of reviews. If no reviews exist, we fall back to a base rate of 85.
      let satisfactionScore = 85; 
      let avgCurriculum = 4.5;
      let avgFacilities = 4.3;
      let avgResearchSupport = 4.4;

      if (inst.reviews.length > 0) {
        const sumCurriculum = inst.reviews.reduce((acc, r) => acc + r.curriculumRating, 0);
        const sumFacilities = inst.reviews.reduce((acc, r) => acc + r.facilitiesRating, 0);
        const sumResearchSupport = inst.reviews.reduce((acc, r) => acc + r.researchSupportRating, 0);
        
        avgCurriculum = sumCurriculum / inst.reviews.length;
        avgFacilities = sumFacilities / inst.reviews.length;
        avgResearchSupport = sumResearchSupport / inst.reviews.length;

        // Multiply averaged ratings by 20 to get score out of 100
        satisfactionScore = ((avgCurriculum + avgFacilities + avgResearchSupport) / 3) * 20;
      }

      // HRA Component 3: Impact Factor & Peer Activity (20% weight)
      // Reflects citations per paper and peer activities of affiliates
      const citationsPerPaper = dynamicResearchPapersCount > 0 ? (dynamicCitationsCount / dynamicResearchPapersCount) : 0;
      const baseImpactFactor = (citationsPerPaper * 4) + (avgResearchSupport * 8);
      const impactFactorScore = Math.min(100, Math.max(40, baseImpactFactor));

      // HRA Component 4: Scale Metric (15% weight)
      // Calculated from size of student body and faculty size
      const scaleRaw = (Math.log10(inst.studentBody) * 12) + (inst.facultyCount / 40);
      const scaleScore = Math.min(100, Math.max(35, scaleRaw));

      // Final Automated HRA Aggregated Score
      const finalHRAScore = (academicOutputScore * 0.40) + 
                            (satisfactionScore * 0.25) + 
                            (impactFactorScore * 0.20) + 
                            (scaleScore * 0.15);

      return {
        ...inst,
        dynamicResearchPapersCount,
        dynamicCitationsCount,
        avgCurriculum,
        avgFacilities,
        avgResearchSupport,
        academicOutputScore,
        satisfactionScore,
        impactFactorScore,
        scaleScore,
        finalHRAScore: Math.round(finalHRAScore * 10) / 10
      };
    });
  }, [institutions, mappedPapersByInstitution]);

  // Sort by final HRA score descending to get standings ranks
  const rankedInstitutions = useMemo(() => {
    return [...computedInstitutions].sort((a, b) => b.finalHRAScore - a.finalHRAScore);
  }, [computedInstitutions]);

  // Apply filters and searches
  const filteredInstitutions = useMemo(() => {
    return rankedInstitutions.filter(inst => {
      // 1. Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        inst.name.toLowerCase().includes(searchLower) ||
        inst.nameAR.includes(searchTerm) ||
        inst.country.toLowerCase().includes(searchLower) ||
        inst.countryAR.includes(searchTerm) ||
        inst.logoLetters.toLowerCase().includes(searchLower);

      // 2. Discipline filter
      const matchesDiscipline = selectedDiscipline === 'All' || 
        inst.disciplines.includes(selectedDiscipline as any);

      // 3. Region filter
      const matchesRegion = selectedRegion === 'All' || 
        inst.region === selectedRegion;

      return matchesSearch && matchesDiscipline && matchesRegion;
    });
  }, [rankedInstitutions, searchTerm, selectedDiscipline, selectedRegion]);

  // Selected active institution details
  const activeInstitution = useMemo(() => {
    if (!activeInstitutionId) return null;
    return computedInstitutions.find(i => i.id === activeInstitutionId) || null;
  }, [activeInstitutionId, computedInstitutions]);

  // Find rank of active institution
  const activeRankPos = useMemo(() => {
    if (!activeInstitutionId) return 0;
    return rankedInstitutions.findIndex(i => i.id === activeInstitutionId) + 1;
  }, [activeInstitutionId, rankedInstitutions]);

  // Find researchers from users matching active institution
  const activeResearchers = useMemo(() => {
    if (!activeInstitution) return [];
    return users.filter(u => u.institution.trim().toLowerCase() === activeInstitution.name.trim().toLowerCase());
  }, [activeInstitution, users]);

  // Verification status of the current user for the selected institution
  const userAffiliationStatus = useMemo(() => {
    if (!activeInstitution) return null;
    
    const isGuest = currentUser.id.startsWith('guest-') || currentUser.role === 'student' && currentUser.email === 'guest';
    const isMatchingAffiliation = currentUser.institution.trim().toLowerCase() === activeInstitution.name.trim().toLowerCase();
    
    const isVerifiedBiometric = currentUser.isDigitallyVerified === true || currentUser.verificationIDStatus === 'verified';
    const emailDomain = currentUser.email.split('@')[1] || '';
    const universityDomainKeywords = ['ox.ac.uk', 'harvard.edu', 'univ.edu', 'healthsciences.org', 'cu.edu.eg', 'alexu.edu.eg'];
    const isVerifiedDomain = universityDomainKeywords.some(keyword => emailDomain.includes(keyword)) || currentUser.isEmailDomainVerified;

    return {
      isGuest,
      isMatchingAffiliation,
      isVerifiedBiometric,
      isVerifiedDomain,
      // Evaluation weight multiplier
      evaluationWeightMultiplier: isVerifiedBiometric ? 1.0 : isVerifiedDomain ? 0.75 : 0.30
    };
  }, [activeInstitution, currentUser]);

  // Handlers
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInstitution) return;

    if (!userAffiliationStatus || !userAffiliationStatus.isMatchingAffiliation) {
      onToast(isRTL 
        ? 'عذراً! لا تطابق المؤسسة في ملفك الأكاديمي مع الكيان الحالي. قم بتحديث معلوماتك أولاً.' 
        : 'Affiliation Mismatch! Please update your active institution affiliation to submit reviews.');
      return;
    }

    setIsSubmittingReview(true);

    let vLevel: 'HE-TRUST' | 'PROVISIONAL' | 'SELF-CLAIM' = 'SELF-CLAIM';
    if (userAffiliationStatus.isVerifiedBiometric) {
      vLevel = 'HE-TRUST';
    } else if (userAffiliationStatus.isVerifiedDomain) {
      vLevel = 'PROVISIONAL';
    }

    const newReview: InstitutionReview = {
      id: `REV-${Math.floor(Math.random() * 90000 + 10000)}`,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerNameAR: currentUser.nameAR || currentUser.name,
      reviewerRole: currentUser.credentials || (currentUser.role.toUpperCase() === 'RESEARCHER' ? 'Academic Investigator' : currentUser.role.toUpperCase()),
      affiliationType: reviewerAffiliation,
      curriculumRating,
      facilitiesRating,
      researchSupportRating,
      comment: reviewComment || 'Scholarly audit of curriculum facilities and peer review environment completed.',
      commentAR: reviewCommentAR || 'تم إجراء التدقيق الأكاديمي للمنهج الدراسي والدعم البحثي والبيئة التعليمية بنجاح.',
      timestamp: new Date().toISOString().split('T')[0],
      isVerified: true,
      verificationLevel: vLevel
    };

    const updatedInstitutions = institutions.map(inst => {
      if (inst.id === activeInstitution.id) {
        return {
          ...inst,
          reviews: [newReview, ...inst.reviews]
        };
      }
      return inst;
    });

    onUpdateInstitutions(updatedInstitutions);
    
    // Send automated system verification receipt email
    onSendSystemEmail({
      recipient: currentUser.email,
      subject: `Evaluation Indexed Successfully - Certified Affiliate (${activeInstitution.logoLetters})`,
      body: `Dear ${currentUser.name},\n\nYour crowdsourced peer evaluation for "${activeInstitution.name}" has been registered successfully on our core leaderboards.\n\nEvaluation ID: ${newReview.id}\nVerification Weight: ${Math.round(userAffiliationStatus.evaluationWeightMultiplier * 100)}% (${vLevel})\n\nThis contribution has updated the university average satisfaction metrics and recalculated the dynamic Healthedia Ranking Algorithm (HRA) standings in real-time. Thank you for maintaining scientific integrity.`,
      type: 'peer_review'
    });

    // Reset review form
    setReviewComment('');
    setReviewCommentAR('');
    setIsSubmittingReview(false);
    onToast(isRTL 
      ? 'تم تسجيل تقييمك بنجاح وتحديث معايير الترتيب التلقائي!' 
      : 'Crowdsourced review compiled. Universal rankings updated instantly!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4" id="institutional-intelligence-engine">
      
      {/* Dynamic Header */}
      <div className="border-b border-zinc-200 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest">
            <Award className="w-4 h-4 text-black shrink-0" />
            <span>Autonomous Evaluation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-black tracking-tight leading-none">
            {isRTL ? 'محرك التقييم والتصنيف المؤسسي الشامل' : 'Healthedia Global Institutional Intelligence'}
          </h1>
          <p className="text-xs text-zinc-400 mt-2 font-sans max-w-2xl">
            {isRTL 
              ? 'أول منصة تصنيف طاقة وقدرات الطب البشري، العلوم البيولوجية والبحوث التقييمية التشاركية مدعومة بخوارزمية HRA المحكمة ومستوى التحقق من الهوية الرقمية.' 
              : 'The world\'s definitive verified reference for academic clinics and health research institutions. Dynamic, decentralized, and governed by academic ID credentials.'}
          </p>
        </div>

        {activeInstitutionId && (
          <button 
            onClick={() => setActiveInstitutionId(null)}
            className="px-3 py-1.5 border border-black hover:bg-black hover:text-white transition-all text-xs font-mono rounded-lg flex items-center gap-1.5 cursor-pointer uppercase font-bold tracking-tight"
          >
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {isRTL ? 'الرجوع إلى لوحة التصنيف' : 'Standings Leaderboard'}
          </button>
        )}
      </div>

      {!activeInstitution ? (
        /* ==================== SCREEN A: LEADERBOARD VIEW ==================== */
        <div className="space-y-6">
          
          {/* Controls Panel - Search & Filter */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Search input with sleek custom search badge */}
              <div className="relative flex-grow">
                <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400`} />
                <input
                  type="text"
                  placeholder={isRTL ? 'ابحث عن الكلية بالاسم، البلد، أو الرمز...' : 'Search institutions by name, country, region...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-250 py-3.5 ${isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} text-xs sm:text-sm rounded-xl focus:border-zinc-950 focus:outline-none transition-all font-sans`}
                />
              </div>

              {/* Region Quick Select Filter */}
              <div className="flex items-center gap-2 shrink-0">
                <Sliders className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">{isRTL ? 'الإقليم:' : 'Region:'}</span>
                <div className="flex flex-wrap gap-1 bg-zinc-150 p-1 rounded-xl border border-zinc-200">
                  {['All', 'North America', 'Europe', 'Middle East', 'Asia'].map((reg) => {
                    const regionalLabel = () => {
                      if (!isRTL) return reg;
                      if (reg === 'All') return 'الكل';
                      if (reg === 'North America') return 'أمريكا الشمالية';
                      if (reg === 'Europe') return 'أوروبا';
                      if (reg === 'Middle East') return 'الشرق الأوسط';
                      return 'آسيا';
                    };
                    return (
                      <button
                        key={reg}
                        onClick={() => setSelectedRegion(reg)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          selectedRegion === reg
                            ? 'bg-black text-white'
                            : 'text-zinc-500 hover:text-black hover:bg-zinc-200'
                        }`}
                      >
                        {regionalLabel()}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Discipline Categories Tabs */}
            <div className="border-t border-zinc-100 pt-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mr-2">{isRTL ? 'التخصص الطبي:' : 'Discipline:'}</span>
              {['All', 'Medicine', 'Public Health', 'Clinical Research', 'Human Performance', 'Bio-Medical Engineering'].map((dis) => {
                const disciplineLabel = () => {
                  if (!isRTL) return dis;
                  if (dis === 'All') return 'جميع التصنيفات الطبية';
                  if (dis === 'Medicine') return 'الطب البشري والجراحة';
                  if (dis === 'Public Health') return 'الصحة العامة والوبائيات';
                  if (dis === 'Clinical Research') return 'الأبحاث السريرية والصحه الأيضية';
                  if (dis === 'Human Performance') return 'النشاط البشري والتأهيل';
                  return 'الهندسة الطبية الحيوية والماتيريال';
                };
                return (
                  <button
                    key={dis}
                    onClick={() => setSelectedDiscipline(dis)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                      selectedDiscipline === dis
                        ? 'bg-black border-black text-white'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    {disciplineLabel()}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Dynamic Stands Leaderboards Table */}
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-zinc-50/80 px-6 py-4 border-b border-zinc-200 flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase text-zinc-650 tracking-wider">
                {isRTL ? `المجموعات المطابقة: ${filteredInstitutions.length}` : `Standings matches: ${filteredInstitutions.length}`}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{isRTL ? 'محدث تلقائيا عبر HRA' : 'HRA Updated Live'}</span>
              </div>
            </div>

            {filteredInstitutions.length === 0 ? (
              <div className="py-20 text-center text-zinc-400 font-sans">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-zinc-300" />
                <p className="text-sm font-semibold">{isRTL ? 'لم نعثر على أي مؤسسة أكاديمية تطابق الكلمات أو المعايير المدخلة.' : 'No institutions match the current search filters.'}</p>
                <p className="text-xs text-zinc-400 mt-1">{isRTL ? 'حاول تعديل خيارات البحث الجغرافي أو تصفية التخصصات الطبية.' : 'Try adjusting the discipline or geographic filters.'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/50 text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
                      <th className="py-4 px-6 text-center w-16">{isRTL ? 'الترتيب' : 'Rank'}</th>
                      <th className="py-4 px-4">{isRTL ? 'المؤسسة الأكاديمية والكلية' : 'Institution & Country'}</th>
                      <th className="py-4 px-4 text-center hidden md:table-cell">{isRTL ? 'الأوراق المقبولة هيلثديا' : 'Repository Papers'}</th>
                      <th className="py-4 px-4 text-center hidden md:table-cell">{isRTL ? 'إجمالي الاقتباسات الموثقة' : 'Global Citations'}</th>
                      <th className="py-4 px-4 text-center hidden sm:table-cell">{isRTL ? 'تقييم النظراء رضى' : 'User Satisfaction'}</th>
                      <th className="py-4 px-4 text-center w-28">{isRTL ? 'مؤشر HRA التلقائي' : 'HRA Score'}</th>
                      <th className="py-4 px-6 text-center w-24"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 font-sans">
                    {filteredInstitutions.map((inst, index) => {
                      const overallRank = rankedInstitutions.findIndex(i => i.id === inst.id) + 1;
                      
                      // Check if any authors from this school wrote papers
                      const papersOfThisSchool = mappedPapersByInstitution[inst.id] || [];

                      return (
                        <tr 
                          key={inst.id} 
                          className="hover:bg-zinc-50/40 transition-colors duration-200 group"
                        >
                          {/* Rank number badge styling based on tier */}
                          <td className="py-6 px-6 text-center">
                            <span className={`inline-flex items-center justify-center font-mono font-bold text-xs w-7 h-7 rounded-lg ${
                              overallRank === 1 
                                ? 'bg-black text-white font-black scale-110 shadow-sm' 
                                : overallRank === 2
                                  ? 'bg-zinc-800 text-zinc-100'
                                  : overallRank === 3
                                    ? 'bg-zinc-400 text-black'
                                    : 'bg-zinc-100 text-zinc-600'
                            }`}>
                              {overallRank}
                            </span>
                          </td>

                          {/* Institution Meta Summary */}
                          <td className="py-6 px-4">
                            <div className="flex items-center gap-3">
                              {/* High contrast custom badge logo */}
                              <div className="w-10 h-10 bg-black text-white shrink-0 rounded-xl flex items-center justify-center font-bold font-mono text-xs select-none shadow-sm capitalize border border-black group-hover:bg-zinc-900">
                                {inst.logoLetters}
                              </div>
                              <div>
                                <h3 
                                  onClick={() => setActiveInstitutionId(inst.id)} 
                                  className="text-xs sm:text-sm font-bold text-black hover:underline cursor-pointer tracking-tight"
                                >
                                  {isRTL ? inst.nameAR : inst.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-500 font-mono">
                                  <span>{inst.flag} {isRTL ? inst.countryAR : inst.country}</span>
                                  <span className="text-zinc-300">•</span>
                                  <span>{isRTL ? inst.regionAR : inst.region}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Repository papers count */}
                          <td className="py-6 px-4 text-center hidden md:table-cell">
                            <div className="font-mono text-xs text-black font-semibold">
                              {inst.dynamicResearchPapersCount}
                            </div>
                            {papersOfThisSchool.length > 0 && (
                              <div className="text-[9px] text-emerald-500 font-bold mt-1 uppercase tracking-tight">
                                +{papersOfThisSchool.length} {isRTL ? 'ورقة عيادية' : 'live added'}
                              </div>
                            )}
                          </td>

                          {/* Global citations citation body */}
                          <td className="py-6 px-4 text-center hidden md:table-cell font-mono text-xs text-zinc-500">
                            {inst.dynamicCitationsCount.toLocaleString()}
                          </td>

                          {/* User satisfaction reviews rating stars */}
                          <td className="py-6 px-4 text-center hidden sm:table-cell">
                            {inst.reviews.length > 0 ? (
                              <div className="inline-flex flex-col items-center">
                                <div className="flex items-center gap-0.5 text-zinc-950">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-3 h-3 ${i < Math.round((inst.avgCurriculum + inst.avgFacilities + inst.avgResearchSupport) / 3) ? 'fill-black text-black' : 'text-zinc-200'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-[10px] font-mono text-zinc-500 mt-1">
                                  {Math.round(((inst.avgCurriculum + inst.avgFacilities + inst.avgResearchSupport) / 3) * 10) / 10} / 5.0 ({inst.reviews.length})
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-zinc-400 font-mono italic">{isRTL ? 'لا تقييمات مكتوبة' : 'No evaluations'}</span>
                            )}
                          </td>

                          {/* Dynamic HRA Algorithm Standings bar index */}
                          <td className="py-6 px-4 text-center">
                            <div className="inline-block text-right">
                              <span className="font-mono font-bold text-xs sm:text-sm text-black bg-zinc-100 px-2 py-1 rounded border border-zinc-200 block text-center">
                                {inst.finalHRAScore}
                              </span>
                              
                              {/* Small micro bar */}
                              <div className="w-16 h-1 bg-zinc-100 rounded-full mt-1.5 overflow-hidden mx-auto">
                                <div 
                                  className="h-full bg-black rounded"
                                  style={{ width: `${inst.finalHRAScore}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          {/* Interactive examine chevron */}
                          <td className="py-6 px-6 text-center">
                            <button 
                              onClick={() => setActiveInstitutionId(inst.id)}
                              className="px-2.5 py-1.5 border border-zinc-200 text-zinc-500 hover:text-black hover:border-black rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono whitespace-nowrap"
                            >
                              <span>{isRTL ? 'الملف الأكاديمي' : 'Examine'}</span>
                              <ChevronRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''} group-hover:translate-x-0.5 transition-transform`} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
          </div>

        </div>
      ) : (
        /* ==================== SCREEN B: INSTITUTIONAL HUB DETAILS VIEW ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Institution Details & Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Core Profile Banner with Unsplash/Sleek design */}
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-28 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 flex items-end justify-between relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-15 select-none text-[150px] font-black tracking-tighter text-white leading-none -mt-10 mr-[-20px] font-mono">
                  {activeInstitution.logoLetters}
                </div>
                
                {/* Custom high-trust verification badge and rank indicator */}
                <div className="z-10 bg-white text-zinc-950 border border-black px-3 py-1 font-mono text-[10px] sm:text-xs font-black rounded-lg flex items-center gap-1.5 leading-none uppercase tracking-wider">
                  <span>HRA STANDING: #{activeRankPos} GLOBALLY</span>
                </div>
              </div>

              <div className="p-6 relative">
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  
                  <div className="flex gap-4">
                    {/* Floating styled logo letters */}
                    <div className="w-14 h-14 bg-black text-white shrink-0 rounded-2xl flex items-center justify-center font-bold font-mono text-lg select-none shadow-sm -mt-12 border-2 border-white">
                      {activeInstitution.logoLetters}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-black tracking-tight leading-none mt-1">
                        {isRTL ? activeInstitution.nameAR : activeInstitution.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 mt-2 font-mono text-[10px] sm:text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{activeInstitution.flag} {isRTL ? activeInstitution.countryAR : activeInstitution.country}</span>
                        </span>
                        <span>•</span>
                        <span>{isRTL ? activeInstitution.regionAR : activeInstitution.region}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-950 px-2 py-0.5 rounded font-black text-[9px] uppercase">
                          {activeInstitution.logoLetters}-ID
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Categories Badge Chips */}
                <div className="flex flex-wrap gap-1.5 mt-5 border-t border-zinc-100 pt-4">
                  {activeInstitution.disciplines.map((dis, idx) => {
                    const disciplineText = () => {
                      if (!isRTL) return dis;
                      if (dis === 'Medicine') return 'الطب البشري';
                      if (dis === 'Public Health') return 'الصحة العامة';
                      if (dis === 'Clinical Research') return 'الأبحاث السريرية';
                      if (dis === 'Human Performance') return 'النشاط الحركي';
                      return 'الهندسة الطبية';
                    };
                    return (
                      <span 
                        key={idx} 
                        className="bg-zinc-100 text-zinc-950 font-bold px-2.5 py-1 text-[10px] rounded-lg tracking-tight uppercase border border-zinc-200"
                      >
                        {disciplineText()}
                      </span>
                    );
                  })}
                </div>

                {/* Professional summary text */}
                <p className="mt-4 text-xs sm:text-sm text-zinc-650 leading-relaxed font-sans border-t border-zinc-100 pt-4">
                  {isRTL ? activeInstitution.summaryAR : activeInstitution.summaryEN}
                </p>

                {/* Core Demographic Parameters Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 bg-zinc-50 p-4 border border-zinc-200 rounded-xl">
                  <div>
                    <span className="block text-[8px] font-mono text-zinc-400 uppercase tracking-widest mb-1">{isRTL ? 'إجمالي الدارسين:' : 'Student Body:'}</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-black">{activeInstitution.studentBody.toLocaleString()}</span>
                    <span className="block text-[9px] font-sans text-zinc-400 mt-0.5">{isRTL ? 'صحة مسجلة' : 'Enrollment count'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-zinc-400 uppercase tracking-widest mb-1">{isRTL ? 'أعضاء هيئة التدريس:' : 'Faculty Scale:'}</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-black">{activeInstitution.facultyCount.toLocaleString()}</span>
                    <span className="block text-[9px] font-sans text-zinc-400 mt-0.5">{isRTL ? 'أستاذ ومحقق' : 'Active scholars'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-zinc-400 uppercase tracking-widest mb-1">{isRTL ? 'الأوراق المقبولة:' : 'Repository Papers:'}</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-zinc-900">{activeInstitution.dynamicResearchPapersCount}</span>
                    <span className="block text-[9px] font-sans text-emerald-500 font-bold mt-0.5">{isRTL ? 'مفهرسة بالكامل' : 'Dynamically indexed'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-zinc-400 uppercase tracking-widest mb-1">{isRTL ? 'إجمالي الاقتباسات:' : 'Indexed Citations:'}</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-black">{activeInstitution.dynamicCitationsCount.toLocaleString()}</span>
                    <span className="block text-[9px] font-sans text-zinc-400 mt-0.5">{isRTL ? 'مرجع معتمد' : 'Cumulative citations'}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Dynamic Research Output Archive in Repository */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-zinc-100 pb-3">
                <h3 className="text-sm sm:text-base font-bold font-serif text-black flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-black shrink-0" />
                  <span>{isRTL ? 'أطلس الأبحاث المفهرسة ومسودات الكلية' : 'Affiliated Publications Repository'}</span>
                </h3>
                <span className="font-mono text-xs bg-black text-white px-2 py-0.5 rounded font-bold">
                  {(mappedPapersByInstitution[activeInstitution.id] || []).length} {isRTL ? 'أوراق علمية' : 'Papers'}
                </span>
              </div>

              {(mappedPapersByInstitution[activeInstitution.id] || []).length === 0 ? (
                <div className="py-8 text-center text-zinc-400 font-sans text-xs">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                  <p>{isRTL ? 'لم يتم العثور على أوراق معتمدة مسجلة لباحثين كلياتنا بالوقت الحالي.' : 'No live papers are currently mapped to affiliates in this repository.'}</p>
                  <p className="text-zinc-400 mt-1">{isRTL ? 'تقديم الأوراق عبر علامة تبويب "تقديم دراسة" وسيرتبط باسم الكلية تلقائياً.' : 'Submit research using the "Submissions" tab to link files instantly.'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(mappedPapersByInstitution[activeInstitution.id] || []).map((paper, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 border border-zinc-200 hover:border-black rounded-xl transition-all space-y-2 bg-zinc-50/20"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <span className="inline-block bg-black text-white border text-[8px] font-bold px-2 py-0.5 font-mono rounded-md shrink-0">
                          {paper.id}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {paper.publishedAt}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-black tracking-tight leading-snug">
                        {isRTL ? paper.titleAR : paper.titleEN}
                      </h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                        {isRTL ? paper.abstractAR : paper.abstractEN}
                      </p>
                      <div className="flex justify-between items-center pt-2 border-t border-zinc-100 font-mono text-[9px] text-zinc-500">
                        <span>{isRTL ? 'المحقق:' : 'Affiliate:'} <strong className="text-black">{isRTL ? paper.authorsAR.join(', ') : paper.authorsEN.join(', ')}</strong></span>
                        <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-950 font-bold flex items-center gap-0.5">
                          {paper.citationCount} {isRTL ? 'اقتباس' : 'Cites'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verified Field Researchers Affiliation Atlas */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-zinc-100 pb-3">
                <h3 className="text-sm sm:text-base font-bold font-serif text-black flex items-center gap-2">
                  <Users className="w-4 h-4 text-black shrink-0" />
                  <span>{isRTL ? 'دليل الباحثين المقرين والمسؤولين' : 'Verified Affiliate Directory'}</span>
                </h3>
                <span className="font-mono text-xs text-zinc-500">
                  {activeResearchers.length} {isRTL ? 'مدرجين' : 'Registered Users'}
                </span>
              </div>

              {activeResearchers.length === 0 ? (
                <div className="py-6 text-center text-zinc-400 font-sans text-xs">
                  <User className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                  <p>{isRTL ? 'لم يتم العثور على حسابات باحثين مفعلين في السجلات بهذه المؤسسة.' : 'No active researchers currently select this affiliate in their profiles.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeResearchers.map((resUserProfile, index) => {
                    const citations = resUserProfile.academicMetrics?.citations || 0;
                    return (
                      <div 
                        key={index}
                        className="p-3 border border-zinc-200 rounded-xl bg-zinc-50/50 flex items-center gap-3 transition-colors hover:border-black"
                      >
                        <div className="w-9 h-9 bg-black text-white shrink-0 rounded-full flex items-center justify-center font-bold text-xs">
                          {resUserProfile.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-black truncate flex items-center gap-1.5 leading-none">
                            <span>{isRTL ? resUserProfile.nameAR || resUserProfile.name : resUserProfile.name}</span>
                            {resUserProfile.isDigitallyVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" title="AI Biometric Certified" />
                            )}
                          </h4>
                          <span className="text-[10px] text-zinc-400 font-mono block truncate mt-1">
                            {resUserProfile.credentials || resUserProfile.role.toUpperCase()}
                          </span>
                          <span className="text-[9px] text-zinc-400 font-mono block truncate uppercase mt-0.5">
                            Citations: {citations}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* list reviews list */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-3">
                <h3 className="text-sm sm:text-base font-bold font-serif text-black flex items-center gap-2">
                  <Star className="w-4 h-4 fill-black text-black shrink-0" />
                  <span>{isRTL ? 'الآراء الأكاديمية وتقييمات المنتسبين' : 'Verified Community Reviews'}</span>
                </h3>
                <span className="font-mono text-xs bg-zinc-105 border border-zinc-200 text-zinc-700 font-bold px-2 py-0.5 rounded">
                  {activeInstitution.reviews.length} {isRTL ? 'مراجعة نظراء' : 'Evaluations'}
                </span>
              </div>

              {activeInstitution.reviews.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 font-sans text-xs">
                  <GraduationCap className="w-10 h-10 mx-auto mb-2 text-zinc-300" />
                  <p className="font-bold">{isRTL ? 'لم يتم تقديم أي مراجعة أو تقييم رقمي بعد.' : 'No crowdsourced peer reviews have been submitted yet.'}</p>
                  <p className="text-zinc-400 mt-1">{isRTL ? 'كن أول من يقيم مؤسستك الطبية من خلال نموذج الإدخال المجاور!' : 'Be the first to evaluate this health program via the submission panel.'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeInstitution.reviews.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="p-5 border border-zinc-200 rounded-xl space-y-3 bg-white hover:shadow-sm transition-all"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-zinc-950 text-white font-bold text-[10px] flex items-center justify-center uppercase">
                            {rev.reviewerName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-black flex items-center gap-1.5 leading-none">
                              {isRTL ? rev.reviewerNameAR || rev.reviewerName : rev.reviewerName}
                            </span>
                            <span className="text-[9px] text-zinc-400 font-mono block mt-1 uppercase tracking-wider">
                              {rev.reviewerRole} • {rev.affiliationType}
                            </span>
                          </div>
                        </div>

                        {/* Verification badge stamp */}
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            rev.verificationLevel === 'HE-TRUST'
                              ? 'bg-black text-white border-black'
                              : rev.verificationLevel === 'PROVISIONAL'
                                ? 'bg-zinc-100 text-zinc-950 border-zinc-300'
                                : 'bg-zinc-50 text-zinc-400 border-zinc-200'
                          }`}>
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            {rev.verificationLevel === 'HE-TRUST' ? 'HE-TRUST CERTIFIED' : rev.verificationLevel === 'PROVISIONAL' ? 'EMAIL VERIFIED' : 'SELF-CLAIMED'}
                          </span>
                          <span className="block text-[8px] text-zinc-450 font-mono mt-1">{rev.timestamp}</span>
                        </div>
                      </div>

                      {/* Sub-Ratings parameters display breakdown */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[10px] bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-500 uppercase">{isRTL ? 'المنهج:' : 'Curriculum:'}</span>
                          <span className="font-bold text-black">{rev.curriculumRating}★</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-500 uppercase">{isRTL ? 'مرافق العمل:' : 'Facilities:'}</span>
                          <span className="font-bold text-black">{rev.facilitiesRating}★</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-500 uppercase">{isRTL ? 'دعم البحث:' : 'Research Support:'}</span>
                          <span className="font-bold text-black">{rev.researchSupportRating}★</span>
                        </div>
                      </div>

                      {/* Comment body */}
                      <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-sans">
                        {isRTL ? rev.commentAR || rev.comment : rev.comment}
                      </p>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR: HRA ALGORITHM METRICS breakdown & EVALUATE FORM */}
          <div className="space-y-6">

            {/* THE Proprietary Healthedia Ranking Algorithm (HRA) Audit Panel */}
            <div className="bg-black text-white border border-black rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5 select-none text-[150px] font-bold tracking-tighter text-white leading-none -mt-4 mr-[-20px] font-mono">
                %
              </div>
              
              <div className="border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
                  <Sliders className="w-3 h-3 text-white" />
                  <span>Algorithm Metrology</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold font-serif tracking-tight flex items-center justify-between">
                  <span>{isRTL ? 'تفاصيل قياس معيار الترتيب HRA' : 'Acoustic Standings (HRA Score)'}</span>
                  <span className="bg-white text-black font-mono font-black text-xs sm:text-sm px-2.5 py-1 rounded">
                    {activeInstitution.finalHRAScore}
                  </span>
                </h3>
              </div>

              <div className="space-y-4 font-mono text-[11px] leading-relaxed">
                
                {/* Score Component 1: Academic Output */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-zinc-400 uppercase">{isRTL ? '1. المخرجات الأكاديمية (40%):' : '1. Academic Output (40%):'}</span>
                    <span className="font-bold text-white">{Math.round(activeInstitution.academicOutputScore * 10) / 10} / 100</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded"
                      style={{ width: `${activeInstitution.academicOutputScore}%` }}
                    ></div>
                  </div>
                  <span className="block text-[9px] text-zinc-550 mt-1 font-sans">
                    {isRTL ? 'قوة النشر المفهرسة وصحة الاقتباسات في المستودع' : 'Indexed publication count + dynamic repository citations.'}
                  </span>
                </div>

                {/* Score Component 2: User Satisfaction */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-zinc-400 uppercase">{isRTL ? '2. تقييم المنتسبين (25%):' : '2. Satisfaction Index (25%):'}</span>
                    <span className="font-bold text-white">{Math.round(activeInstitution.satisfactionScore * 10) / 10} / 100</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded"
                      style={{ width: `${activeInstitution.satisfactionScore}%` }}
                    ></div>
                  </div>
                  <span className="block text-[9px] text-zinc-550 mt-1 font-sans">
                    {isRTL ? 'متوسط تقييمات الطلاب والأكاديميين المحققة برمجياً' : 'Aggregated rating of verified peer evaluations.'}
                  </span>
                </div>

                {/* Score Component 3: Impact Factor */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-zinc-400 uppercase">{isRTL ? '3. عامل التأثير وعلاقات النشر (20%):' : '3. Impact Factor (20%):'}</span>
                    <span className="font-bold text-white">{Math.round(activeInstitution.impactFactorScore * 10) / 10} / 100</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded"
                      style={{ width: `${activeInstitution.impactFactorScore}%` }}
                    ></div>
                  </div>
                  <span className="block text-[9px] text-zinc-550 mt-1 font-sans">
                    {isRTL ? 'معدل قياس متوسط الاقتباس الدولي لكل ورقة منشورة' : 'Citations per publication + certified support index.'}
                  </span>
                </div>

                {/* Score Component 4: Scale Value */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-zinc-400 uppercase">{isRTL ? '4. الحجم والسعة البشرية (15%):' : '4. Scale Index (15%):'}</span>
                    <span className="font-bold text-white">{Math.round(activeInstitution.scaleScore * 10) / 10} / 100</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded"
                      style={{ width: `${activeInstitution.scaleScore}%` }}
                    ></div>
                  </div>
                  <span className="block text-[9px] text-zinc-550 mt-1 font-sans">
                    {isRTL ? 'لوغاريتم حجم الدارسين الإجمالي ومجموع العلماء والأساتذة' : 'Student enrollment log ratio + researcher density.'}
                  </span>
                </div>

              </div>
              
              {/* Formula explanation in box shape */}
              <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-400 font-mono leading-relaxed bg-zinc-950 p-3 rounded-lg border border-zinc-900">
                <span className="text-white block font-bold mb-1">Automated HRA stand formula:</span>
                <span>(Academic * 0.40) + (Satisfaction * 0.25) + (Impact * 0.20) + (Scale * 0.15)</span>
              </div>

            </div>

            {/* Verified Peer Evaluation Portal Form */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="text-sm sm:text-base font-bold font-serif text-black flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-black shrink-0" />
                  <span>{isRTL ? 'بوابة المساهمة العكسية والتقييم' : 'Submit Peer Evaluation'}</span>
                </h3>
                <p className="text-[11px] text-zinc-400 font-sans mt-1">
                  {isRTL ? 'شارك في تدقيق معايير الجودة الأكاديمية لمؤسستك.' : 'Contribute to the evaluation of curriculum and services as a verified affiliate.'}
                </p>
              </div>

              {/* Strict registration checker layer */}
              {!userAffiliationStatus || !userAffiliationStatus.isMatchingAffiliation ? (
                /* USER DOES NOT BELONG TO UNIVERSITY BLOCKED STAMP */
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                  <div className="flex gap-2 text-zinc-800">
                    <AlertCircle className="w-5 h-5 text-zinc-950 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold font-sans text-black leading-tight">
                        {isRTL ? 'تضارب الهوية الأكاديمية!' : 'Identity Affiliation Mismatch'}
                      </h4>
                      <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">
                        {isRTL 
                          ? `حسابك الحالي مسجل بالتبعية لـ "${currentUser.institution || 'لا يوجد'}". لا يمكنك كتابة تقييمات كأكاديمي معتمد لـ "${activeInstitution.name}" إلا إذا قمت بمطابقة جهة التبعية أولاً.` 
                          : `Your active profile is listed as an affiliate of "${currentUser.institution || 'Guest Session'}". You are not authorized to write reviews for "${activeInstitution.name}" to prevent bias or fraudulent evaluation.`}
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-200 leading-normal">
                    {isRTL 
                      ? '● لتعديل التبعية والجامعة، تفضل بزيارة علامة تبويب "الملف الأكاديمي" لتحديث المعطيات وإدراج مستندات التحقق الرقمي.' 
                      : '● Visit the "Register Profile / My Academic Profile" tab to adjust your affiliation or complete AI-OCR ID scanner to overwrite security indicators.'}
                  </div>
                </div>
              ) : (
                /* AUTHORIZED AFFILIATE SUBMISSION ENTRY FORM */
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  
                  {/* Verification Status Banner Indicator */}
                  <div className={`p-3 rounded-xl border flex items-start gap-2 text-[10px] font-mono ${
                    userAffiliationStatus.isVerifiedBiometric
                      ? 'bg-zinc-50 border-black text-black'
                      : userAffiliationStatus.isVerifiedDomain
                        ? 'bg-zinc-50 border-zinc-300 text-zinc-700'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-black mt-0.5" />
                    <div>
                      <div className="font-bold text-black uppercase">
                        {userAffiliationStatus.isVerifiedBiometric 
                          ? 'HIGH-TRUST BIOMETRIC ID SIGNATURE APPROVED' 
                          : userAffiliationStatus.isVerifiedDomain 
                            ? 'PROVISIONAL EMAIL DOMAIN STATUS ENROLLED' 
                            : 'SELF-CLAIMED ACCOUNT STATUS'}
                      </div>
                      <div className="text-[9px] mt-0.5 leading-relaxed text-zinc-500">
                        {isRTL 
                          ? `بصمة هويتك الرقمية تعطي لتقييمك وزن إحصائي يعادل ${Math.round(userAffiliationStatus.evaluationWeightMultiplier * 100)}% طبقاً للتصنيف المتكامل.` 
                          : `Your verification score allows this valuation to weigh exactly ${Math.round(userAffiliationStatus.evaluationWeightMultiplier * 100)}% on dynamic leaderboard standing.`}
                      </div>
                    </div>
                  </div>

                  {/* Affiliation Type Pick */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">{isRTL ? 'صفة التبعية الكلية:' : 'Your Academic Role:'}</label>
                    <select
                      value={reviewerAffiliation}
                      onChange={(e) => setReviewerAffiliation(e.target.value as any)}
                      className="w-full bg-zinc-50 border border-zinc-200 font-sans p-3 text-xs rounded-xl focus:border-zinc-950 focus:outline-none transition-all"
                    >
                      <option value="student">{isRTL ? 'طالب / طبيب مقامتة (Active Student)' : 'Active Student'}</option>
                      <option value="faculty">{isRTL ? 'عضو هيئة تدريس / أستاذ (Faculty)' : 'Faculty / Professor'}</option>
                      <option value="researcher">{isRTL ? 'باحث بمراكز الكلية (Researcher)' : 'Clinical Researcher'}</option>
                      <option value="alumni">{isRTL ? 'خريج سابق / زمالة منتهية (Alumni)' : 'Alumni / Scholar'}</option>
                    </select>
                  </div>

                  {/* Slider/Ratings metrics (1-5 range) */}
                  <div className="space-y-3 font-mono text-[11px] bg-zinc-50/50 p-4 border border-zinc-200 rounded-xl">
                    
                    {/* Curve 1: Curriculum */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="uppercase text-zinc-550">{isRTL ? 'المنهج الدراسي والتعليم:' : 'Curriculum:'}</span>
                        <span className="font-bold text-black">{curriculumRating} / 5★</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        value={curriculumRating} 
                        onChange={(e) => setCurriculumRating(parseInt(e.target.value))}
                        className="w-full accent-black cursor-pointer bg-zinc-200 h-1 rounded-full cursor-pointer appearance-none"
                      />
                    </div>

                    {/* Curve 2: Facilities */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="uppercase text-zinc-550">{isRTL ? 'المختبرات والمستشفى الجامعي:' : 'Facilities:'}</span>
                        <span className="font-bold text-black">{facilitiesRating} / 5★</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        value={facilitiesRating} 
                        onChange={(e) => setFacilitiesRating(parseInt(e.target.value))}
                        className="w-full accent-black cursor-pointer bg-zinc-200 h-1 rounded-full cursor-pointer appearance-none"
                      />
                    </div>

                    {/* Curve 3: Research Support */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="uppercase text-zinc-550">{isRTL ? 'دعم الأبحاث وفرص التمويل:' : 'Research Support:'}</span>
                        <span className="font-bold text-black">{researchSupportRating} / 5★</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        value={researchSupportRating} 
                        onChange={(e) => setResearchSupportRating(parseInt(e.target.value))}
                        className="w-full accent-black cursor-pointer bg-zinc-200 h-1 rounded-full cursor-pointer appearance-none"
                      />
                    </div>

                  </div>

                  {/* Bilingual feedbacks */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">{isRTL ? 'ملاحظة التدقيق الأكاديمي (English):' : 'Evaluation details (English):'}</label>
                    <textarea
                      required
                      placeholder={isRTL ? 'أكتب رأيك التفصيلي ومبرراته باللغة الإنجليزية...' : 'Describe curriculum, laboratories, peer-activities...'}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                      className="w-full bg-zinc-50 border border-zinc-200 font-sans p-3 text-xs rounded-xl focus:border-zinc-950 focus:outline-none transition-all placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">{isRTL ? 'تفاصيل التقييم (العربية):' : 'Evaluation details (Arabic):'}</label>
                    <textarea
                      required
                      placeholder="أضف مبررات التقييم باللغة العربية للباحثين والطلاب الإقليميين..."
                      value={reviewCommentAR}
                      onChange={(e) => setReviewCommentAR(e.target.value)}
                      rows={3}
                      className="w-full bg-zinc-50 border border-zinc-200 font-sans p-3 text-xs rounded-xl focus:border-zinc-950 focus:outline-none transition-all placeholder:text-zinc-400 text-right"
                      style={{ direction: 'rtl' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full bg-black hover:bg-zinc-900 text-white font-mono text-xs uppercase font-black py-4.5 rounded-xl cursor-pointer shadow-sm transition-all focus:outline-none disabled:opacity-50"
                  >
                    {isSubmittingReview ? (isRTL ? 'جار الفهرسة والتدقيق...' : 'Indexing with system...') : (isRTL ? 'إدراج تقييم النظراء للترتيب العام' : 'Transmit Evaluation & Update Standings')}
                  </button>

                </form>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
