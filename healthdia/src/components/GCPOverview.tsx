/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, AlertCircle, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SupportTicket {
  id: string;
  category: string;
  sender: string;
  subject: string;
  status: 'active' | 'solved';
  createdAt: string;
}

interface GCPOverviewProps {
  currentLang: 'en' | 'ar';
  pendingPapersCount: number;
  pendingEditsCount: number;
}

export default function GCPOverview({
  currentLang,
  pendingPapersCount,
  pendingEditsCount,
}: GCPOverviewProps) {
  const isRTL = currentLang === 'ar';

  // State for simulated live readers and server specs
  const [concurrentUsers, setConcurrentUsers] = useState(14);
  const [cpuUsage, setCpuUsage] = useState(38);
  const [latency, setLatency] = useState(2.4);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Execution terminal logging
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] Launching Healthedia secure control nodes...',
    '[OK] Linked MongoDB Cloud Cluster indices (Latency: 2.4ms)',
    '[OK] Google Scholar Indexer connection established',
    '[STABLE] Gateway port 3000 running in secure egress mode',
    '[CRON] Periodic index consistency check scheduled (10:00:00)'
  ]);

  // Support tickets local state
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'HD-TCK-8902',
      category: 'Affiliation Sync',
      sender: 'Dr. Ahmad Al-Masri',
      subject: 'My verification serial ID does not link to ORCID database correctly.',
      status: 'active',
      createdAt: '2026-05-26 21:12'
    },
    {
      id: 'HD-TCK-1049',
      category: 'DOI Registry',
      sender: 'Dr. Sarah Jenkins',
      subject: 'Requesting emergency schema correction for SGLT2 metadata DOI.',
      status: 'solved',
      createdAt: '2026-05-25 11:44'
    },
    {
      id: 'HD-TCK-5510',
      category: 'Access Credentials',
      sender: 'Dr. Mabrouk Al-Hadi',
      subject: 'Granting senior editor permissions to the Cairo University clinical chair.',
      status: 'active',
      createdAt: '2026-05-27 01:30'
    }
  ]);

  // Simulate traffic fluctuate
  useEffect(() => {
    const interval = setInterval(() => {
      setConcurrentUsers(prev => {
        const offset = Math.floor(Math.random() * 5) - 2;
        const next = prev + offset;
        return next > 5 ? next : 8;
      });
      setCpuUsage(prev => {
        const offset = Math.floor(Math.random() * 11) - 5;
        const next = prev + offset;
        return next > 20 && next < 85 ? next : 35;
      });
      setLatency(prev => {
        const offset = (Math.random() * 0.6) - 0.3;
        const next = parseFloat((prev + offset).toFixed(2));
        return next > 1.0 && next < 5.0 ? next : 2.1;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Run Ranking calibration trigger simulate
  const handleRunCalibration = () => {
    if (isCalibrating) return;
    setIsCalibrating(true);
    
    setTerminalLogs(prev => [
      ...prev,
      `[EXEC] [${new Date().toLocaleTimeString()}] Initializing ranking weight algorithm recalculation...`,
      `[EXEC] Loading university evaluation metrics & crowdsourced parameters...`
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[COMPUTE] Scanned 4 global universities and research institutes`,
        `[COMPUTE] Calibration weights balanced (60% Research Research Volume, 40% Satisfaction)`
      ]);
    }, 1200);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[SUCCESS] [${new Date().toLocaleTimeString()}] Ranks updated. High-performance caching invalidated. Grid synced.`,
        `[OK] GCP Nerve Center is steady.`
      ]);
      setIsCalibrating(false);
    }, 2500);
  };

  const toggleTicketStatus = (id: string) => {
    setTickets(prev => prev.map(tck => {
      if (tck.id === id) {
        return { ...tck, status: tck.status === 'active' ? 'solved' : 'active' };
      }
      return tck;
    }));
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Visual Header */}
      <div>
        <h2 className="text-lg font-bold text-zinc-950 font-serif border-b border-zinc-100 pb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-zinc-900" />
          <span>{isRTL ? 'لوحة القيادة والمؤشرات الحيوية للـ GCP' : 'GCP Nerve Center & System Health'}</span>
        </h2>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          {isRTL 
            ? 'مراقبة حركة المنصة، قياس كفاءة الخادم، تتبع العمليات السحابية ومعالجة بطاقات الدعم الأكاديمي الحالية.'
            : 'Operational gateway log. Track active telemetry, monitor concurrent clinical workloads, and resolve pending investigator support requests.'}
        </p>
      </div>

      {/* Numerical Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{isRTL ? 'الزوار النشطين حالياً' : 'Live Global Readers'}</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-serif text-zinc-950">{concurrentUsers}</span>
            <span className="text-[9px] text-zinc-500 font-mono">{isRTL ? 'متصلين' : 'Active peers'}</span>
          </div>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{isRTL ? 'حمل المعالج' : 'Simulated CPU'}</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-serif text-zinc-950">{cpuUsage}%</span>
            <span className="text-[9px] text-zinc-500 font-mono">Running</span>
          </div>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{isRTL ? 'زمن استجابة الشبكة' : 'Database Latency'}</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-serif text-zinc-950">{latency} ms</span>
            <span className="text-[9px] text-zinc-500 font-mono">Real-time IO</span>
          </div>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{isRTL ? 'صحة خادم الاتصال' : 'Port Router'}</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-serif text-emerald-800">PORT 3000</span>
            <span className="text-[9px] text-emerald-700 font-mono">Active Ingress</span>
          </div>
        </div>
      </div>

      {/* Actionable Pending Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            label: isRTL ? 'أطروحات في قائمة الانتظار' : 'Pending Research Papers', 
            count: pendingPapersCount, 
            status: pendingPapersCount > 0 ? 'text-zinc-950 font-bold bg-zinc-100 border-zinc-900 ring-1 ring-zinc-900' : 'text-zinc-500 bg-zinc-50'
          },
          { 
            label: isRTL ? 'تعديلات ويكي معلقة' : 'Pending Wiki Revisions', 
            count: pendingEditsCount, 
            status: pendingEditsCount > 0 ? 'text-zinc-950 font-bold bg-zinc-100 border-zinc-900 ring-1 ring-zinc-900' : 'text-zinc-500 bg-zinc-50'
          },
          { 
            label: isRTL ? 'بطاقات الدعم المفتوحة' : 'Support Tickets Logged', 
            count: tickets.filter(t => t.status === 'active').length, 
            status: 'text-zinc-950 bg-zinc-50'
          }
        ].map((item, idx) => (
          <div key={idx} className={`p-4 border rounded-xl flex items-center justify-between ${item.status}`}>
            <span className="text-xs font-semibold leading-relaxed">{item.label}</span>
            <span className="text-lg font-black font-serif px-2.5 py-1 bg-white border rounded">{item.count}</span>
          </div>
        ))}
      </div>

      {/* Main double column Workspace mapping */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Core telemetry system and live execution cron logs */}
        <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1">
              <Server className="w-4 h-4 text-zinc-900" />
              <span>{isRTL ? 'معالج المهام وخوارزميات الرتب' : 'Automated Task scheduler logs'}</span>
            </span>
            <button
              onClick={handleRunCalibration}
              disabled={isCalibrating}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase border rounded-lg cursor-pointer transition-colors ${
                isCalibrating ? 'bg-zinc-100 text-zinc-400 border-zinc-200' : 'bg-zinc-950 text-white hover:bg-zinc-900 border-black'
              }`}
            >
              {isCalibrating ? (isRTL ? 'جاري الحساب...' : 'Recalibrating...') : (isRTL ? 'تشغيل الخوارزمية' : 'Run Rank Calibration')}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 text-xs">
              <div className="space-y-1 w-1/2">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Nginx Proxy</span>
                <div className="bg-zinc-50 border p-2.5 rounded-lg font-mono text-[10px] text-zinc-700 flex items-center justify-between">
                  <span>Host: 0.0.0.0</span>
                  <span className="text-emerald-700 font-bold">● ONLINE</span>
                </div>
              </div>
              <div className="space-y-1 w-1/2">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">SMTP Node</span>
                <div className="bg-zinc-50 border p-2.5 rounded-lg font-mono text-[10px] text-zinc-700 flex items-center justify-between">
                  <span>Host: smtp.sec.org</span>
                  <span className="text-emerald-700 font-bold">● ONLINE</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Terminal */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">System stdout channel</span>
              <div className="bg-zinc-950 text-emerald-450 p-4 rounded-xl h-52 overflow-y-auto font-mono text-[10px] leading-relaxed space-y-1 select-none border border-black shadow-inner">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="hover:bg-zinc-900/40">
                    <span className="text-zinc-600 mr-2">[{new Date().toLocaleDateString()}]</span>
                    <span>{log}</span>
                  </div>
                ))}
                {isCalibrating && (
                  <div className="text-emerald-300 animate-pulse">Calculating weighted scores... (D3-scale recalculations)</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Support Tickets list */}
        <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-zinc-900" />
              <span>{isRTL ? 'تذكرة الدعم الأكاديمي' : 'Investigator Support Desk'}</span>
            </span>
            <span className="px-2 py-0.5 bg-zinc-100 text-zinc-800 text-[9px] font-mono font-bold border rounded">
              {tickets.filter(t => t.status === 'active').length} {isRTL ? 'نشطة' : 'unresolved'}
            </span>
          </div>

          <div className="space-y-3 max-h-[295px] overflow-y-auto pr-1">
            {tickets.map((tck) => (
              <div key={tck.id} className="p-3.5 border border-zinc-200 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300 transition-all text-xs font-sans space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-zinc-900 text-white font-mono text-[9px] rounded font-bold">{tck.id}</span>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold">{tck.category}</span>
                  </div>
                  <button
                    onClick={() => toggleTicketStatus(tck.id)}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold cursor-pointer border ${
                      tck.status === 'active' 
                        ? 'bg-zinc-100 hover:bg-zinc-200/60 border-zinc-300 text-zinc-950' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    {tck.status === 'active' ? (isRTL ? 'تحديد كمحلولة' : 'Mark Solved') : (isRTL ? 'إعادة فتح' : 'Reopen Ticket')}
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 font-serif">{tck.subject}</h4>
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
                    <span>From: {tck.sender}</span>
                    <span>{tck.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
