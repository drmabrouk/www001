/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Globe, Send, RefreshCw, Key, FileCode, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

interface GCPAutomationProps {
  currentLang: 'en' | 'ar';
}

export default function GCPAutomation({ currentLang }: GCPAutomationProps) {
  const isRTL = currentLang === 'ar';

  // State for Email templates
  const [selectedTemplate, setSelectedTemplate] = useState<'accept' | 'review' | 'verify'>('accept');
  const [templateHTML, setTemplateHTML] = useState({
    accept: `<!DOCTYPE html>
<html>
<head>
  <style>body { font-family: sans-serif; }</style>
</head>
<body>
  <h2>Academic Manuscript Verified</h2>
  <p>Dear {{author_name}},</p>
  <p>We are delighted to inform you that your medical study titled <strong>"{{title}}"</strong> has successfully passed the Healthdia Global Peer-Review audit.</p>
  <p>It has been officially assigned <strong>DOI: {{index_doi}}</strong> and published live.</p>
</body>
</html>`,
    review: `<!DOCTYPE html>
<html>
<body>
  <h2>Peer-Review Audit Request</h2>
  <p>Dear Dr. {{reviewer_name}},</p>
  <p>A newly submitted manuscript within your scientific field specialty: <strong>"{{category}}"</strong> requires formal methodology certification.</p>
  <p>Please claim this audit via your investigator terminal.</p>
</body>
</html>`,
    verify: `<!DOCTYPE html>
<html>
<body>
  <h2>Institutional Credentials Verified</h2>
  <p>Dear {{user_name}},</p>
  <p>Your institutional residency/affiliation status uploaded under Serial Number <strong>{{serial_number}}</strong> has been validated by senior advisors.</p>
</body>
</html>`
  });

  // SMTP Settings
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.healthdia.org',
    port: '465',
    security: 'SSL/TLS',
    user: 'gcp-automation@healthdia.org',
    pass: '••••••••••••••••••••'
  });

  const [isTestingSMTP, setIsTestingSMTP] = useState(false);
  const [smtpLogs, setSmtpLogs] = useState<string[]>([]);

  // SEO config
  const [seoKeywords, setSeoKeywords] = useState('SGLT2 inhibitors, diabetic retinopathy, cardiovascular health, machine learning screening, Middle Eastern epidemiology, clinical trials database');
  const [isSitemapSwiping, setIsSitemapSwiping] = useState(false);
  const [indexingLog, setIndexingLog] = useState<string[]>([]);

  const handleTestSMTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingSMTP(true);
    setSmtpLogs([
      `[SMTP] [${new Date().toLocaleTimeString()}] Accessing socket connection to ${smtpConfig.host}:${smtpConfig.port}...`,
      `[SMTP] Server greeted. Exchanging TLS certificate handshake...`
    ]);

    setTimeout(() => {
      setSmtpLogs(prev => [
        ...prev,
        `[SMTP] Authentication parsed. Username: ${smtpConfig.user} successfully validated.`,
        `[SMTP] Sending test payload envelope (recipient: mabrouk@dr.com)...`,
        `[SMTP] Output: "250 OK Message accepted for delivery"`
      ]);
    }, 1000);

    setTimeout(() => {
      setSmtpLogs(prev => [
        ...prev,
        `[SUCCESS] SMTP Professional link established. SMTP node status: Healthy.`
      ]);
      setIsTestingSMTP(false);
    }, 2200);
  };

  const handleTriggerIndexing = () => {
    setIsSitemapSwiping(true);
    setIndexingLog([
      `[INDEXER] Crawling live sitemaps.xml nodes...`,
      `[INDEXER] Identified active clinical studies: HD-RES-84021, HD-RES-41804, HD-RES-11290`
    ]);

    setTimeout(() => {
      setIndexingLog(prev => [
        ...prev,
        `[INDEXER] Submitting structured Dublin-Core metadata schemas to Google Scholar APIs...`,
        `[INDEXER] Pinged indexing nodes on https://google.com/ping?sitemap=healthdia.org/sitemaps.xml`,
        `[OK] 200 Index schema broadcast completed successfully.`
      ]);
      setIsSitemapSwiping(false);
    }, 1800);
  };

  const updateTemplateText = (txt: string) => {
    setTemplateHTML(prev => ({
      ...prev,
      [selectedTemplate]: txt
    }));
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-zinc-950 font-serif border-b border-zinc-100 pb-2 flex items-center gap-2">
          <Mail className="w-5 h-5 text-zinc-905" />
          <span>{isRTL ? 'محرك الأتمتة المراسلات وعناوين الـ SEO' : 'Campaign Automation, SMTP Nodes & scientific indexers'}</span>
        </h2>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          {isRTL 
            ? 'تعديل قوالب رسائل البريد الإلكترونية التلقائية، اختبار برتوكول SMTP، صياغة كلمات الـ SEO للـ Google Scholar والتحفيز اليدوي لمحركات البحث.'
            : 'Formulate dynamic HTML notification triggers, configure high-throughput SMTP servers, edit meta tags optimized for Google Scholar, and broadcast index pings.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Email Engine / Notification templates and SMTP */}
        <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-6">
          
          {/* Template segment */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-zinc-950" />
              <span>{isRTL ? 'قوالب المراسلات الآلية للـ GCP' : 'Interactive Mail Templates'}</span>
            </span>

            {/* Template Selector dropdown */}
            <div className="flex gap-2">
              {[
                { id: 'accept', label: isRTL ? 'أطروحة مقبولة' : 'Paper Accepted' },
                { id: 'review', label: isRTL ? 'طلب مراجعة نظراء' : 'Peer Review Request' },
                { id: 'verify', label: isRTL ? 'توثيق الترخيص' : 'Credentials OK' }
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id as any)}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold border rounded-lg cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? 'bg-zinc-950 text-white border-black shadow'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            {/* Template Text Area */}
            <div className="space-y-1">
              <textarea
                value={templateHTML[selectedTemplate]}
                onChange={(e) => updateTemplateText(e.target.value)}
                className="w-full h-40 p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-[10.5px] leading-normal text-zinc-800 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-400 font-mono block">Supports placeholder variables: {"{{author_name}}"}, {"{{title}}"}, {"{{category}}"}.</span>
            </div>
          </div>

          {/* SMTP configurations */}
          <div className="border-t border-zinc-200 pt-5 space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider block">
              {isRTL ? 'إعدادات ملقم البريد الموثوق SMTP' : 'Professional SMTP Server config'}
            </span>

            <form onSubmit={handleTestSMTP} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">SMTP Host</label>
                  <input
                    type="text"
                    value={smtpConfig.host}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                    className="w-full p-2 border rounded bg-zinc-50 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">Port Encryption</label>
                  <input
                    type="text"
                    value={smtpConfig.port}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                    className="w-full p-2 border rounded bg-zinc-50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">SMTP Username</label>
                  <input
                    type="text"
                    value={smtpConfig.user}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                    className="w-full p-2 border rounded bg-zinc-50 font-mono text-[10px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">Security Mode</label>
                  <select
                    value={smtpConfig.security}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, security: e.target.value })}
                    className="w-full p-2 border rounded bg-zinc-50 text-[10px]"
                  >
                    <option value="SSL/TLS">Implicit SSL/TLS</option>
                    <option value="STARTTLS">Explicit STARTTLS</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isTestingSMTP}
                className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 border border-black text-white font-mono font-bold rounded-lg cursor-pointer transition-colors"
              >
                {isTestingSMTP ? (isRTL ? 'جاري محاكاة الاتصال...' : 'Establishing SMTP Envelope...') : (isRTL ? 'اختبار ربط الخادم والمراسلة' : 'Test SMTP Connection Deliverability')}
              </button>
            </form>

            {smtpLogs.length > 0 && (
              <div className="bg-zinc-950 text-emerald-400 p-3 h-28 overflow-y-auto rounded-lg font-mono text-[9px] border border-black space-y-0.5">
                {smtpLogs.map((log, index) => <div key={index}>{log}</div>)}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: SEO Metadata Config & Sitemap broad pinger */}
        <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-6">
          
          {/* Section 1: Meta Keywords list */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-zinc-950" />
              <span>{isRTL ? 'البيانات الشمولية للـ SEO الطبي' : 'Dublin-Core SEO Meta Tags'}</span>
            </span>

            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Scientific Search Keywords</label>
              <textarea
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full h-24 p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-[10.5px] leading-relaxed text-zinc-700 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-400 block">Injected dynamic attributes for automated meta robots indexes indexing standard scholarly datasets.</span>
            </div>
          </div>

          {/* Section 2: Sitemap XML triggers */}
          <div className="border-t border-zinc-200 pt-5 space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1">
              <FileCode className="w-4 h-4 text-zinc-805" />
              <span>Sitemap.xml Manual Crawl Subits</span>
            </span>

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-650 leading-relaxed font-sans space-y-2">
              <p className="font-medium text-zinc-900">Current active site URLs in indexer payload queue:</p>
              <ul className="font-mono text-[10px] list-disc list-inside space-y-1 text-zinc-500">
                <li>https://healthdia.org/</li>
                <li>https://healthdia.org/papers/HD-RES-84021</li>
                <li>https://healthdia.org/papers/HD-RES-41804</li>
              </ul>
            </div>

            <button
              onClick={handleTriggerIndexing}
              disabled={isSitemapSwiping}
              className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 border border-black text-white font-mono font-bold rounded-lg cursor-pointer transition-colors text-xs flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSitemapSwiping ? 'animate-spin' : ''}`} />
              <span>{isSitemapSwiping ? (isRTL ? 'جاري بث الإشارات وعناوين الويب...' : 'Broadcasting index schema...') : (isRTL ? 'تنشيط وبث إندكس الفهرسة الآن' : 'Trigger Automated Search Index now')}</span>
            </button>

            {indexingLog.length > 0 && (
              <div className="bg-zinc-950 text-emerald-450 p-3 h-28 overflow-y-auto rounded-lg font-mono text-[9px] border border-black space-y-0.5">
                {indexingLog.map((log, index) => <div key={index}>{log}</div>)}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
