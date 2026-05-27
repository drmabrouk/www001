/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, ShieldCheck, Lock, HardDrive, Plus, Trash2, Key, HelpCircle, RefreshCw } from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  token: string;
  scope: string;
  createdAt: string;
}

interface BackupSnapshot {
  id: string;
  size: string;
  schemaVersion: string;
  type: 'auto' | 'manual';
  createdAt: string;
}

interface GCPInfrastructureProps {
  currentLang: 'en' | 'ar';
}

export default function GCPInfrastructure({ currentLang }: GCPInfrastructureProps) {
  const isRTL = currentLang === 'ar';

  // Toggle MFAs
  const [isMfaEnforced, setIsMfaEnforced] = useState(true);

  // API keys board state
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 'KEY-091',
      name: 'Google Translate API',
      token: 'sk_live_51Mv320hP9Cka10Pq...',
      scope: 'Live Bilingual Abstract Translator',
      createdAt: '2024-11-12'
    },
    {
      id: 'KEY-504',
      name: 'Auth0 Secure Authentication',
      token: 'oauth_client_0x82841ff9ab2...',
      scope: 'OIDC Identity verification logs',
      createdAt: '2025-05-18'
    }
  ]);

  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('');

  // Backup snaps
  const [backups, setBackups] = useState<BackupSnapshot[]>([
    {
      id: 'HD-SNAP-2026-05-15_00-00_AUTO',
      size: '14.2 MB',
      schemaVersion: '1.8.4',
      type: 'auto',
      createdAt: '2026-05-15 00:00'
    },
    {
      id: 'HD-SNAP-2026-05-24_15-30_MANUAL',
      size: '14.8 MB',
      schemaVersion: '1.9.0',
      type: 'manual',
      createdAt: '2026-05-24 15:30'
    }
  ]);

  const [backupLogs, setBackupLogs] = useState<string[]>([]);
  const [isGeneratingBackup, setIsGeneratingBackup] = useState(false);

  const handleAddAPIKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName || !newKeyScope) return;

    const newKey: APIKey = {
      id: `KEY-${Math.floor(Math.random() * 900 + 100)}`,
      name: newKeyName,
      token: `sk_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}...`,
      scope: newKeyScope,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setApiKeys(prev => [newKey, ...prev]);
    setNewKeyName('');
    setNewKeyScope('');
  };

  const handleDeleteAPIKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };

  const handleCreateBackup = () => {
    setIsGeneratingBackup(true);
    setBackupLogs([
      `[BACKUP] Locking transaction tables down...`,
      `[BACKUP] Packing SGLT2 & Retinopathy metadata schemas...`
    ]);

    setTimeout(() => {
      setBackupLogs(prev => [
        ...prev,
        `[BACKUP] Compressing user profile directories & credential logs...`,
        `[BACKUP] Uploading archived tape index: 15.1 MB successfully saved.`,
        `[SUCCESS] Snapshot HD-SNAP-NEW completed.`
      ]);

      const newSnap: BackupSnapshot = {
        id: `HD-SNAP-${new Date().toISOString().substring(0, 10).replace(/-/g, '')}_MANUAL`,
        size: '15.1 MB',
        schemaVersion: '1.9.0',
        type: 'manual',
        createdAt: new Date().toLocaleString()
      };

      setBackups(prev => [newSnap, ...prev]);
      setIsGeneratingBackup(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-zinc-950 font-serif border-b border-zinc-100 pb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-zinc-900" />
          <span>{isRTL ? 'إعدادات البنية التحتية والنسخ الاحتياطي والمفاتيح' : 'Infrastructure configurations, Api Tokens & Snapshot Backups'}</span>
        </h2>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          {isRTL 
            ? 'تأمين الحسابات عبر MFA، توليد وحذف مفاتيح الربط الخارجي، وأخذ لقطات فورية لقاعدة البيانات للتعافي من الكوارث.'
            : 'Configure secure infrastructure layers. Restrict API access protocols, toggle multi-factor authenticator requirements, run backup snapshot dumps, and execute rollback plans.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: MFA toggles API Key list */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* MFA enforce section */}
          <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-zinc-950" />
              <span>{isRTL ? 'الأمان والتحقق بخطوتين (MFA)' : 'Platform Security controls'}</span>
            </span>

            <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-xl gap-4">
              <span className="text-xs text-zinc-700 font-medium font-sans">
                {isRTL ? 'فرض التحقق المزدوج لجميع المنقحين' : 'Enforce Multi-Factor MFA for academic advisor roles'}
              </span>
              <button
                type="button"
                onClick={() => setIsMfaEnforced(!isMfaEnforced)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                  isMfaEnforced ? 'bg-zinc-905 bg-black' : 'bg-zinc-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow transform duration-300 ${
                  isMfaEnforced ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Create new API Key Form */}
          <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-zinc-950" />
              <span>{isRTL ? 'توليد هويات الربط (API Keys)' : 'Egress API token manager'}</span>
            </span>

            <form onSubmit={handleAddAPIKey} className="space-y-3 text-xs">
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Key name, e.g., ORCID Hook"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 rounded-lg focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Key scope, e.g., Write verified claims"
                  value={newKeyScope}
                  onChange={(e) => setNewKeyScope(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 rounded-lg focus:outline-none font-sans text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 border border-black text-white font-mono font-bold rounded-lg cursor-pointer transition-colors"
              >
                {isRTL ? 'توليد مفتاح جديد' : 'Generate Token Key'}
              </button>
            </form>
          </div>

        </div>

        {/* Right column: Snapshots and rollback checkpoints */}
        <div className="lg:col-span-2 border border-zinc-200 rounded-2xl p-5 bg-white space-y-5">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-zinc-950" />
              <span>{isRTL ? 'نظام التعافي والكوارث واللقاطات' : 'System backups & automated recovery logs'}</span>
            </span>
            <button
              onClick={handleCreateBackup}
              disabled={isGeneratingBackup}
              className="px-3 py-1 bg-zinc-950 text-white font-mono text-[10px] uppercase font-bold rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-zinc-900"
            >
              <RefreshCw className={`w-3 h-3 ${isGeneratingBackup ? 'animate-spin' : ''}`} />
              <span>{isGeneratingBackup ? (isRTL ? 'جاري النسخ...' : 'Dumping checkpoint...') : (isRTL ? 'أخذ نسخة سحابية فورية' : 'Create disaster Snapshot')}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="overflow-x-auto border border-zinc-200 rounded-xl">
              <table className="min-w-full text-xs text-left rtl:text-right font-sans">
                <thead className="bg-zinc-50 font-mono text-[9px] uppercase text-zinc-400">
                  <tr>
                    <th className="px-3 py-2.5">Snapshot System ID</th>
                    <th className="px-3 py-2.5">Archived Size</th>
                    <th className="px-3 py-2.5">Db Schema</th>
                    <th className="px-3 py-2.5">Backup category</th>
                    <th className="px-3 py-2.5">Execution date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-mono text-[11px] text-zinc-650">
                  {backups.map((bk) => (
                    <tr key={bk.id} className="hover:bg-zinc-50/50">
                      <td className="px-3 py-3 font-bold text-zinc-900">{bk.id}</td>
                      <td className="px-3 py-3 font-semibold">{bk.size}</td>
                      <td className="px-3 py-3 font-medium">v{bk.schemaVersion}</td>
                      <td className="px-3 py-3 font-medium uppercase font-sans text-[10px] text-zinc-500">{bk.type}</td>
                      <td className="px-3 py-3 text-zinc-400">{bk.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {backupLogs.length > 0 && (
              <div className="bg-zinc-950 text-emerald-450 p-3 h-24 overflow-y-auto rounded-lg font-mono text-[10px] border border-black space-y-0.5">
                {backupLogs.map((log, index) => <div key={index}>{log}</div>)}
              </div>
            )}
          </div>

          <div className="border-t border-zinc-200 pt-4 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1">
              {isRTL ? 'مفاتيح الربط والاتصالات النشطة للـ GCP' : 'API tokens keys active credentials'}
            </span>

            <div className="overflow-x-auto border border-zinc-150 rounded-xl">
              <table className="min-w-full text-xs text-left rtl:text-right font-sans">
                <thead className="bg-zinc-50 font-mono text-[9px] uppercase text-zinc-400">
                  <tr>
                    <th className="px-3 py-2">API Token name</th>
                    <th className="px-3 py-2">Hashed secret key</th>
                    <th className="px-3 py-2">Scope of integration</th>
                    <th className="px-3 py-2">Created</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-zinc-50/50">
                      <td className="px-3 py-2.5 text-xs font-bold text-zinc-900">{key.name}</td>
                      <td className="px-3 py-2.5 font-mono text-[10px] text-zinc-500">{key.token}</td>
                      <td className="px-3 py-2.5 text-xs italic text-zinc-600">{key.scope}</td>
                      <td className="px-3 py-2.5 font-mono text-[10px] text-zinc-400">{key.createdAt}</td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => handleDeleteAPIKey(key.id)}
                          className="p-1 px-2 border border-zinc-150 hover:border-zinc-900 text-red-700 hover:text-red-905 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
