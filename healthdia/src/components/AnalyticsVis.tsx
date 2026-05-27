/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { AcademicPaper, WikipediaEdit, UserProfile } from '../types';
import { Cpu, Globe, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

interface AnalyticsVisProps {
  currentLang: 'en' | 'ar';
  papers: AcademicPaper[];
  wikiEdits: WikipediaEdit[];
  users: UserProfile[];
}

export default function AnalyticsVis({
  currentLang,
  papers,
  wikiEdits,
  users,
}: AnalyticsVisProps) {
  const isRTL = currentLang === 'ar';
  const approvedPapers = useMemo(() => papers.filter(p => p.status === 'approved'), [papers]);
  const activeUsersCount = useMemo(() => users.length, [users]);
  
  // Custom SEO states
  const [sitemapHost, setSitemapHost] = useState('https://healthdia.org');
  const [xmlOutput, setXmlOutput] = useState('');
  const [jsonLdOutput, setJsonLdOutput] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // 1. Math Data for D3: Citation growth trend by publication date
  const citationGrowthData = useMemo(() => {
    const sorted = [...approvedPapers].sort((a, b) => 
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );

    let cumulative = 0;
    return sorted.map((p, idx) => {
      cumulative += p.citationCount;
      return {
        seq: idx + 1,
        title: p.titleEN,
        citations: p.citationCount,
        cumulativeCitations: cumulative,
        date: new Date(p.publishedAt),
      };
    });
  }, [approvedPapers]);

  // 2. SVG Line Calculation with D3 for Citation Progression Chart
  const lineChartSvgPath = useMemo(() => {
    if (citationGrowthData.length === 0) return '';
    
    const width = 500;
    const height = 180;
    const padding = 30;

    // Set scales using d3
    const xScale = d3.scaleLinear()
      .domain([1, Math.max(citationGrowthData.length, 2)])
      .range([padding, width - padding]);

    const maxCum = d3.max(citationGrowthData, (d: { cumulativeCitations: number }) => d.cumulativeCitations) || 10;
    const yScale = d3.scaleLinear()
      .domain([0, maxCum * 1.1])
      .range([height - padding, padding]);

    // Construct line generator
    const lineGenerator = d3.line<{ seq: number; cumulativeCitations: number }>()
      .x(d => xScale(d.seq))
      .y(d => yScale(d.cumulativeCitations))
      .curve(d3.curveMonotoneX);

    return lineGenerator(citationGrowthData) || '';
  }, [citationGrowthData]);

  // 3. SVG Grid calculations using D3
  const chartGrids = useMemo(() => {
    if (citationGrowthData.length === 0) return { xTicks: [], yTicks: [] };
    const width = 500;
    const height = 180;
    const padding = 30;

    const maxCum = d3.max(citationGrowthData, (d: { cumulativeCitations: number }) => d.cumulativeCitations) || 10;
    
    const xScale = d3.scaleLinear()
      .domain([1, Math.max(citationGrowthData.length, 2)])
      .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
      .domain([0, maxCum * 1.1])
      .range([height - padding, padding]);

    const xTicks = xScale.ticks(Math.min(citationGrowthData.length, 6));
    const yTicks = yScale.ticks(4);

    return {
      xTicks: xTicks.map(val => ({ val, x: xScale(val) })),
      yTicks: yTicks.map(val => ({ val, y: yScale(val) })),
    };
  }, [citationGrowthData]);

  // 4. Research Category Share Ratio Metrics
  const categoryChartData = useMemo(() => {
    const rawCounts: Record<string, number> = {};
    approvedPapers.forEach(p => {
      const cat = currentLang === 'en' ? p.categoryEN : p.categoryAR;
      rawCounts[cat] = (rawCounts[cat] || 0) + 1;
    });

    const total = approvedPapers.length || 1;
    return Object.entries(rawCounts).map(([cat, count]) => ({
      category: cat,
      count,
      percentage: Math.round((count / total) * 100),
    }));
  }, [approvedPapers, currentLang]);

  // Dynamic Sitemap generator with precision metadata
  const handleGenerateSitemap = () => {
    let xmlStr = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n  <!-- Healthdia Primary Indexes -->\n  <url>\n    <loc>${sitemapHost}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>${sitemapHost}/browse</loc>\n    <changefreq>hourly</changefreq>\n    <priority>0.9</priority>\n  </url>\n\n  <!-- Indexed Research Manuscripts -->\n`;

    approvedPapers.forEach(p => {
      xmlStr += `  <url>\n    <loc>${sitemapHost}/@${p.id.toLowerCase()}</loc>\n    <lastmod>${p.publishedAt}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    xmlStr += `\n  <!-- Public Researcher Portfolios -->\n`;
    users.filter(u => u.isPublic).forEach(u => {
      xmlStr += `  <url>\n    <loc>${sitemapHost}/@${u.username || u.id.toLowerCase()}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    xmlStr += `</urlset>`;
    setXmlOutput(xmlStr);
    setJsonLdOutput('');
  };

  // Generate Schema JSON-LD metadata markup
  const handleGenerateSchema = () => {
    const schemaObj = {
      "@context": "https://schema.org",
      "@graph": approvedPapers.map(p => ({
        "@type": "ScholarlyArticle",
        "@id": `${sitemapHost}/#article-${p.id}`,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Healthdia Academic Repository",
          "url": sitemapHost
        },
        "headline": p.titleEN,
        "alternativeHeadline": p.titleAR,
        "identifier": p.doi,
        "datePublished": p.publishedAt,
        "publisher": {
          "@type": "Organization",
          "name": p.journalEN || "Healthdia Publications Center"
        },
        "author": p.authorsEN.map(author => ({
          "@type": "Person",
          "name": author
        })),
        "commentCount": wikiEdits.filter(e => e.paperId === p.id && e.status === 'approved').length,
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/LikeAction",
          "userInteractionCount": p.citationCount
        }
      }))
    };
    setJsonLdOutput(JSON.stringify(schemaObj, null, 2));
    setXmlOutput('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-lg font-bold text-zinc-950 font-serif border-b border-zinc-100 pb-2 flex items-center gap-2">
          <Globe className="w-5 h-5 text-zinc-900" />
          <span>{isRTL ? 'إحصائيات المنصة والـ SEO النخبي' : 'System Analytics & Meta SEO'}</span>
        </h2>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          {isRTL 
            ? 'مؤشرات أداء أبحاث هيلثديا النشطة، نمو الاستشهادات، مع محرك توليد XML Sitemaps وتكويد Schema.org فوري لدعم محركات الزحف ولأثبت ثوابت المهنية.'
            : 'Explore scholarly indices, compute real-time index growth with dynamic D3 mathematics, and generate metadata maps for Google Scholar indexing logs.'}
        </p>
      </div>

      {/* Numerical Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isRTL ? 'الأبحاث النشطة' : 'Active Publications', val: approvedPapers.length, unit: isRTL ? 'دراسة' : 'Papers' },
          { label: isRTL ? 'إجمالي الاستشهادات' : 'Cumulative Citations', val: approvedPapers.reduce((acc, p) => acc + p.citationCount, 0), unit: isRTL ? 'إحالة متبادلة' : 'Impact citations' },
          { label: isRTL ? 'التعديلات المندمجة' : 'Commits Merged', val: wikiEdits.filter(e => e.status === 'approved').length, unit: isRTL ? 'تعديل تشاركي' : 'Verified edits' },
          { label: isRTL ? 'معدل الحصاد النشط' : 'SEO Crawl Sync', val: '99.8%', unit: isRTL ? 'جاهزية جوجل' : 'Scholar Ready' }
        ].map((indicator, idx) => (
          <div key={idx} className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{indicator.label}</span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-lg sm:text-2xl font-black text-zinc-950 font-serif tracking-tight">{indicator.val}</span>
              <span className="text-[9px] text-zinc-500 font-mono">{indicator.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Workspace Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Visual 1: D3 Citation growth trend */}
        <div className="border border-zinc-200 p-5 rounded-2xl bg-white space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider">
              {isRTL ? 'رسم بياني D3: نمو الاستشهادات العلمي' : 'D3 Citation Progression Map'}
            </span>
            <span className="px-2 py-0.5 bg-zinc-100 text-zinc-900 border border-zinc-200 text-[8px] font-mono rounded">
              D3 Scale Curve
            </span>
          </div>

          {citationGrowthData.length > 0 ? (
            <div className="w-full">
              <svg viewBox="0 0 500 180" className="w-full text-[9px] font-mono select-none overflow-visible">
                {/* Horizontal Grid lines via D3 scales */}
                {chartGrids.yTicks.map((tick, i) => (
                  <g key={i} className="opacity-20">
                    <line 
                      x1={30} 
                      y1={tick.y} 
                      x2={470} 
                      y2={tick.y} 
                      stroke="#000" 
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    <text x={10} y={tick.y + 3} textAnchor="start" className="fill-zinc-400 font-semibold">{tick.val}</text>
                  </g>
                ))}

                {/* X Axis Sequence grids */}
                {chartGrids.xTicks.map((tick, i) => (
                  <g key={i} className="opacity-25">
                    <line 
                      x1={tick.x} 
                      y1={30} 
                      x2={tick.x} 
                      y2={150} 
                      stroke="#000" 
                      strokeWidth={0.5} 
                    />
                    <text x={tick.x} y={163} textAnchor="middle" className="fill-zinc-500 font-bold">P-{tick.val}</text>
                  </g>
                ))}

                {/* Curved Area Grayscale background shading */}
                <path
                  d={`${lineChartSvgPath} L 470,150 L 30,150 Z`}
                  fill="url(#grayscale-grad)"
                  className="opacity-10"
                />

                {/* Main Curved SVG Line computed with D3 */}
                <path
                  d={lineChartSvgPath}
                  fill="none"
                  stroke="#18181b"
                  strokeWidth={2}
                  strokeLinecap="round"
                />

                {/* Interactive Points representation */}
                {citationGrowthData.map((d, idx) => {
                  const width = 500;
                  const padding = 30;
                  const xScale = d3.scaleLinear()
                    .domain([1, Math.max(citationGrowthData.length, 2)])
                    .range([padding, width - padding]);

                  const maxCum = d3.max(citationGrowthData, (item: { cumulativeCitations: number }) => item.cumulativeCitations) || 10;
                  const yScale = d3.scaleLinear()
                    .domain([0, maxCum * 1.1])
                    .range([180 - padding, padding]);

                  const cx = xScale(d.seq);
                  const cy = yScale(d.cumulativeCitations);

                  return (
                    <g key={idx}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        className="fill-zinc-950 hover:r-6 cursor-pointer hover:stroke-zinc-400 stroke-1 transition-all"
                      />
                      <title>{`${d.title}\nCitations: ${d.citations}\nCumulative: ${d.cumulativeCitations}`}</title>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="grayscale-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#18181b" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex justify-between text-[9px] font-mono text-zinc-400 pt-1">
                <span>{isRTL ? 'أول منشور' : 'Initial Paper Ingest'}</span>
                <span>{isRTL ? 'المنشورات المتعاقبة (P-seq)' : 'Manuscripts Chronological sequence'}</span>
                <span>{isRTL ? 'أحدث المنشورات' : 'Terminal Indexing'}</span>
              </div>
            </div>
          ) : (
            <div className="h-[150px] flex items-center justify-center border border-dashed text-zinc-400 font-mono text-xs">
              {isRTL ? 'بانتظار الموافقة على دراسات لترسيم مخطط المنحنى' : 'No indexed papers to plot citation curves.'}
            </div>
          )}
        </div>

        {/* Visual 2: Category distribution meters */}
        <div className="border border-zinc-200 p-5 rounded-2xl bg-white space-y-4">
          <span className="text-xs font-mono font-bold uppercase text-zinc-700 tracking-wider block">
            {isRTL ? 'توزيع الأطروحات حسب الانضباط الطبي' : 'Clinical discipline index focus'}
          </span>

          <div className="space-y-4 pt-1.5 font-sans" id="discipline-volume-list">
            {categoryChartData.length > 0 ? (
              categoryChartData.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-900">{cat.category}</span>
                    <span className="font-mono text-zinc-500 font-semibold">{cat.count} {isRTL ? 'أبحاث' : 'docs'} ({cat.percentage}%)</span>
                  </div>
                  {/* Progress bar and metrics ratio */}
                  <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-zinc-950 h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-zinc-400 text-xs font-mono py-12 text-center">
                No active categorization distributions found.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SEO Scholar Site Builder Desk */}
      <div className="border border-zinc-200 rounded-2xl p-6 bg-zinc-50/50 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 font-serif flex items-center gap-1.5">
              <span>⚡</span>
              <span>{isRTL ? 'صانع خرائط الكبسولات للذكاء الأكاديمي والـ SEO' : 'Scholar XML Sitemap & Metadata Structural Builder'}</span>
            </h3>
            <p className="text-[11px] text-zinc-500 font-sans mt-0.5">
              {isRTL 
                ? 'ولد تكوينات أرشفة معتمدة لرفعها إلى Google Search Console وجوجل سكولار تلقائياً.'
                : 'Instantly build production-ready academic XML Sitemaps or schema structured models. Dynamic and live.'}
            </p>
          </div>

          <div className="flex gap-2 font-mono text-xs shrink-0 self-start sm:self-center">
            <button
              onClick={handleGenerateSitemap}
              className="px-3.5 py-1.5 bg-zinc-950 text-white hover:bg-zinc-900 rounded-xl font-bold cursor-pointer transition-colors"
            >
              {isRTL ? 'إنشاء sitemap.xml' : 'Assemble sitemap.xml'}
            </button>
            <button
              onClick={handleGenerateSchema}
              className="px-3.5 py-1.5 bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-100 rounded-xl font-bold cursor-pointer transition-colors"
            >
              {isRTL ? 'إنشاء JSON-LD Schema' : 'Code Schema.org JSON'}
            </button>
          </div>
        </div>

        {/* Input variables */}
        <div className="relative max-w-md">
          <label className="block text-[10px] font-mono text-zinc-500 uppercase pb-1">{isRTL ? 'رابط النطاق المستهدف' : 'Target Host URL Domain'}</label>
          <input
            type="text"
            value={sitemapHost}
            onChange={(e) => setSitemapHost(e.target.value)}
            className="w-full text-xs font-mono p-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:border-black"
            placeholder="https://healthdia.org"
          />
        </div>

        {/* Code Listing Output terminal panel */}
        {(xmlOutput || jsonLdOutput) && (
          <div className="space-y-3.5 animate-fade-in">
            <div className="flex justify-between items-center bg-zinc-100/80 px-4 py-2 text-[10px] font-mono text-zinc-500 rounded-xl">
              <span>{xmlOutput ? 'SCHOLAR_XML_SITEMAP.xml' : 'SCHEMA_ARTICLE_JSON_LD.json'}</span>
              <button
                onClick={() => copyToClipboard(xmlOutput || jsonLdOutput)}
                className="hover:underline flex items-center gap-1.5 font-bold text-zinc-950 cursor-pointer"
              >
                {copiedText ? (
                  <span className="text-emerald-700 flex items-center gap-0.5"><CheckCircle2 className="w-3.5 h-3.5" /> COPIED!</span>
                ) : (
                  <span>COPY CODE</span>
                )}
              </button>
            </div>

            <pre className="bg-zinc-950 text-emerald-450 p-4 rounded-2xl overflow-x-auto text-[10px] font-mono leading-relaxed border border-black shadow-xl max-h-[220px]">
              {xmlOutput || jsonLdOutput}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}
