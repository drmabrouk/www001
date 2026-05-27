/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, RefreshCw, FileText, Trash2, Plus, Image, FileCode, Check } from 'lucide-react';
import { GlobalSettings } from '../types';

interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'vector' | 'document';
  size: string;
  usage: string;
}

interface GCPAestheticsProps {
  currentLang: 'en' | 'ar';
  settingsForm: GlobalSettings;
  handleSettingsChange: (updated: Partial<GlobalSettings>) => void;
}

export default function GCPAesthetics({
  currentLang,
  settingsForm,
  handleSettingsChange,
}: GCPAestheticsProps) {
  const isRTL = currentLang === 'ar';

  // Customizable border radius coefficients
  const [borderRadiusScale, setBorderRadiusScale] = useState(16); // in px
  const [borderWidth, setBorderWidth] = useState(1); // in px

  // Global Media Library data state
  const [assets, setAssets] = useState<MediaAsset[]>([
    {
      id: 'MED-AST-01',
      name: 'healthdia-primary-logomark.svg',
      type: 'vector',
      size: '42 KB',
      usage: 'Universal Navigation Header & Official Seals'
    },
    {
      id: 'MED-AST-02',
      name: 'academic-degree-badge-gold.png',
      type: 'image',
      size: '185 KB',
      usage: 'Verified Reviewer Seals & Editorial Profiles'
    },
    {
      id: 'MED-AST-03',
      name: 'peer-certification-guidelines-2026.pdf',
      type: 'document',
      size: '1.4 MB',
      usage: 'Manual submission validation download'
    }
  ]);

  // Handle asset upload simulated
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState<'image' | 'vector' | 'document'>('image');

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName) return;

    const newAst: MediaAsset = {
      id: `MED-AST-${Math.floor(Math.random() * 90 + 10)}`,
      name: newAssetName.endsWith('.svg') || newAssetName.endsWith('.png') || newAssetName.endsWith('.pdf')
        ? newAssetName 
        : `${newAssetName}.${newAssetType === 'vector' ? 'svg' : newAssetType === 'document' ? 'pdf' : 'png'}`,
      type: newAssetType,
      size: `${Math.floor(Math.random() * 500 + 40)} KB`,
      usage: 'GCP Repository - Local administration attachment'
    };

    setAssets(prev => [newAst, ...prev]);
    setNewAssetName('');
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(ast => ast.id !== id));
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-zinc-950 font-serif border-b border-zinc-100 pb-2 flex items-center gap-2">
          <Settings className="w-5 h-5 text-zinc-900" />
          <span>{isRTL ? 'إعدادات المظهر والجماليات وهوية النظام' : 'Visual Identity, Styling Rules & Media Asset Library'}</span>
        </h2>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          {isRTL 
            ? 'تخصيص لوحة الألوان المونوكروم، التحكم بحواف البطاقات والتباعد العام، وإدارة مكتبة الصور والأوسمة الرسمية للجامعات.'
            : 'Configure CSS variables. Toggle between monochromatic palette presets, adjust the border-radius curves of cards, calibrate global grid spacing, and upload verified institutional logos.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Palettes and Radius Adjust */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Section 1: Palette settings */}
          <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider flex items-center gap-1.5 animate-pulse">
              <RefreshCw className="w-4 h-4 text-zinc-955" />
              <span>{isRTL ? 'مدرج الألوان النشط' : 'Primary Monochromatic presets'}</span>
            </span>

            <div className="space-y-2.5">
              {[
                { id: 'monochrome', name: isRTL ? 'أبيض وأسود مونوكروم' : 'Monochrome High-Clean', styles: 'bg-white text-zinc-950 border-zinc-350' },
                { id: 'high-contrast-dark', name: isRTL ? 'رمادي داكن مظلم عالي التباين' : 'Tactical Dark High-Contrast', styles: 'bg-zinc-950 text-white border-zinc-800' },
                { id: 'sand-editorial', name: isRTL ? 'كريمي صحفي كلاسيكي (샌د)' : 'Warm Sand Traditional Editorial', styles: 'bg-[#faf6eb] text-zinc-900 border-[#eae3cb]' }
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSettingsChange({ colorTheme: preset.id as any })}
                  className={`w-full p-4 border rounded-xl text-left rtl:text-right flex items-center justify-between transition-all cursor-pointer ${preset.styles} ${
                    settingsForm.colorTheme === preset.id
                      ? 'ring-2 ring-zinc-950/20 border-zinc-950 font-bold'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="text-xs">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Border radius and Card controls */}
          <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider">
              {isRTL ? 'جماليات المنحنيات والحواف' : 'Micro-Aesthetics & Card Borders'}
            </span>

            <div className="space-y-4 text-xs font-sans">
              {/* Card Radius */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                  <span className="uppercase tracking-widest">Card Border Radius</span>
                  <span className="font-bold text-zinc-900">{borderRadiusScale}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="2"
                  value={borderRadiusScale}
                  onChange={(e) => setBorderRadiusScale(parseInt(e.target.value))}
                  className="w-full accent-zinc-950"
                />
              </div>

              {/* Border thickness coefficient */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                  <span className="uppercase tracking-widest">Border Thickness</span>
                  <span className="font-bold text-zinc-900">{borderWidth}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                  className="w-full accent-zinc-950"
                />
              </div>

              {/* Visual preview widget */}
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-center font-mono">
                <span className="text-[10px] text-zinc-400 block mb-1.5 uppercase">CSS Card preview</span>
                <div 
                  className="bg-white mx-auto py-3 px-4 shadow-sm border border-zinc-900 inline-block font-sans text-xs font-bold text-zinc-950"
                  style={{ borderRadius: `${borderRadiusScale}px`, borderWidth: `${borderWidth}px` }}
                >
                  Sample Content Box
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Media Library with Upload actions */}
        <div className="lg:col-span-2 border border-zinc-200 rounded-2xl p-5 bg-white space-y-5">
          <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider">
            {isRTL ? 'مكتبة الملفات والوسائط والصور الموقعة' : 'Global Media Asset bank & institutional file vault'}
          </span>

          {/* Quick upload simulator */}
          <form onSubmit={handleAddAsset} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-50 p-4 border rounded-xl text-xs font-sans">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-[10px] font-mono uppercase text-zinc-500 font-bold">{isRTL ? 'اسم الملف الأكاديمي' : 'Asset filename'}</label>
              <input
                type="text"
                placeholder="e.g., cairo-univ-medical-crest.png"
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:outline-none bg-white font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-zinc-500 font-bold">{isRTL ? 'نوع الملف' : 'Asset format'}</label>
              <select
                value={newAssetType}
                onChange={(e) => setNewAssetType(e.target.value as any)}
                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:outline-none bg-white"
              >
                <option value="image">PNG/JPG Image</option>
                <option value="vector">SVG Vector Logo</option>
                <option value="document">PDF Clinical Doc</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-900 text-white font-bold rounded-lg text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRTL ? 'إدخال للمكتبة' : 'Push Asset'}</span>
              </button>
            </div>
          </form>

          {/* Asset List table */}
          <div className="space-y-3">
            <div className="overflow-x-auto border border-zinc-100 rounded-lg">
              <table className="min-w-full text-xs text-left rtl:text-right font-sans">
                <thead className="bg-zinc-50 font-mono text-[9px] uppercase text-zinc-400">
                  <tr>
                    <th className="px-3 py-2.5">{isRTL ? 'معرف الملف' : 'Asset Code'}</th>
                    <th className="px-3 py-2.5">{isRTL ? 'اسم الوسم' : 'Filename'}</th>
                    <th className="px-3 py-2.5">{isRTL ? 'نوع الملف' : 'Format'}</th>
                    <th className="px-3 py-2.5">{isRTL ? 'الحجم' : 'File size'}</th>
                    <th className="px-3 py-2.5">{isRTL ? 'نطاق التطبيق' : 'Active Scope'}</th>
                    <th className="px-3 py-2.5 text-center">{isRTL ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-zinc-50/50">
                      <td className="px-3 py-3 font-mono text-[10px] text-zinc-500 font-bold">{asset.id}</td>
                      <td className="px-3 py-3 font-mono font-bold text-zinc-950">
                        {asset.name}
                      </td>
                      <td className="px-3 py-3 font-mono text-[10px] text-zinc-650">
                        {asset.type.toUpperCase()}
                      </td>
                      <td className="px-3 py-3 font-mono text-zinc-500">{asset.size}</td>
                      <td className="px-3 py-3 text-zinc-600 font-sans text-xs italic">{asset.usage}</td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="p-1 px-2 border border-zinc-200 hover:border-zinc-950 text-red-700 hover:text-red-950 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
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
