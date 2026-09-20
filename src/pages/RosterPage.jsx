import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Layers, 
  MapPin, 
  Calculator, 
  ArrowUpDown, 
  Download, 
  Search, 
  Share2, 
  RefreshCw, 
  CheckCircle2, 
  FileSpreadsheet,
  Award,
  Filter,
  Eye,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { fallbackCombinedRoster, fallbackSheet3, subColDefs } from '../data/rosterData';

export const RosterPage = ({ lang = 'kn', onNavigate }) => {
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'matrix' | 'eligibility' | 'summary' | 'full'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [selectedPost, setSelectedPost] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedQuota, setSelectedQuota] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedCaste, setSelectedCaste] = useState('ALL');
  const [selectedSubCol, setSelectedSubCol] = useState('valTotal');
  const [sortField, setSortField] = useState('valTotal');
  const [sortAsc, setSortAsc] = useState(false);

  // Calculator states
  const [calcPost, setCalcPost] = useState('HSTR');
  const [calcDistrict, setCalcDistrict] = useState('RAICHUR');
  const [calcQuota, setCalcQuota] = useState('HK');
  const [calcSubject, setCalcSubject] = useState('ENGLISH');
  const [calcCaste, setCalcCaste] = useState('ಸಾಮಾನ್ಯ');
  const [calcSubCol, setCalcSubCol] = useState('5'); // 5 = Others, 6 = Women, 7 = Rural, etc.

  // Extract unique filter options
  const filterOptions = useMemo(() => {
    const posts = new Set();
    const districts = new Set();
    const quotas = new Set();
    const subjects = new Set();
    const castes = new Set();

    fallbackCombinedRoster.forEach(row => {
      if (row[0]) posts.add(row[0]);
      if (row[1]) districts.add(row[1]);
      if (row[2]) quotas.add(row[2]);
      if (row[3]) subjects.add(row[3]);
      if (row[4] && row[4] !== 'ಒಟ್ಟು') castes.add(row[4]);
    });

    return {
      posts: Array.from(posts),
      districts: Array.from(districts),
      quotas: Array.from(quotas),
      subjects: Array.from(subjects),
      castes: Array.from(castes)
    };
  }, []);

  // Filtered rows for analysis
  const parsedRows = useMemo(() => {
    return fallbackCombinedRoster.map(row => {
      const parseVal = (v) => {
        if (!v) return 0;
        const n = parseInt(String(v).replace(/[^0-9]/g, ''), 10);
        return isNaN(n) ? 0 : n;
      };

      return {
        post: row[0],
        district: row[1],
        quota: row[2],
        subject: row[3],
        caste: row[4],
        valOthers: parseVal(row[5]),
        valWomen: parseVal(row[6]),
        valRural: parseVal(row[7]),
        valEx: parseVal(row[8]),
        valKannada: parseVal(row[9]),
        valPDP: parseVal(row[10]),
        valPH: parseVal(row[11]),
        valTrans: parseVal(row[12]),
        valTotal: parseVal(row[13]),
        raw: row
      };
    });
  }, []);

  // District Aggregated Leaderboard
  const districtRankings = useMemo(() => {
    const map = {};

    parsedRows.forEach(item => {
      // Apply filters
      if (selectedPost !== 'ALL' && item.post !== selectedPost) return;
      if (selectedDistrict !== 'ALL' && item.district !== selectedDistrict) return;
      if (selectedQuota !== 'ALL' && item.quota !== selectedQuota) return;
      if (selectedSubject !== 'ALL' && item.subject !== selectedSubject) return;
      if (selectedCaste !== 'ALL' && item.caste !== selectedCaste) return;

      // Only exclude row summary 'ಒಟ್ಟು' if we are summing individual castes
      if (selectedCaste === 'ALL' && item.caste === 'ಒಟ್ಟು') {
        // If it's the total row, add to district total
        if (!map[item.district]) {
          map[item.district] = {
            district: item.district,
            valTotal: 0,
            valOthers: 0,
            valWomen: 0,
            valRural: 0,
            valEx: 0,
            valKannada: 0,
            valPDP: 0,
            valPH: 0,
            valTrans: 0,
            categories: []
          };
        }
        map[item.district].valTotal += item.valTotal;
        map[item.district].valOthers += item.valOthers;
        map[item.district].valWomen += item.valWomen;
        map[item.district].valRural += item.valRural;
        map[item.district].valEx += item.valEx;
        map[item.district].valKannada += item.valKannada;
        map[item.district].valPDP += item.valPDP;
        map[item.district].valPH += item.valPH;
        map[item.district].valTrans += item.valTrans;
      } else if (selectedCaste !== 'ALL') {
        if (!map[item.district]) {
          map[item.district] = {
            district: item.district,
            valTotal: 0,
            valOthers: 0,
            valWomen: 0,
            valRural: 0,
            valEx: 0,
            valKannada: 0,
            valPDP: 0,
            valPH: 0,
            valTrans: 0,
            categories: []
          };
        }
        map[item.district].valTotal += item.valTotal;
        map[item.district].valOthers += item.valOthers;
        map[item.district].valWomen += item.valWomen;
        map[item.district].valRural += item.valRural;
        map[item.district].valEx += item.valEx;
        map[item.district].valKannada += item.valKannada;
        map[item.district].valPDP += item.valPDP;
        map[item.district].valPH += item.valPH;
        map[item.district].valTrans += item.valTrans;
      }
    });

    const list = Object.values(map);
    list.sort((a, b) => {
      const valA = a[sortField] ?? a.valTotal;
      const valB = b[sortField] ?? b.valTotal;
      return sortAsc ? valA - valB : valB - valA;
    });

    return list;
  }, [parsedRows, selectedPost, selectedDistrict, selectedQuota, selectedSubject, selectedCaste, sortField, sortAsc]);

  // Eligibility Calculation Result
  const eligibilityResult = useMemo(() => {
    const parseVal = (v) => {
      if (!v) return 0;
      const n = parseInt(String(v).replace(/[^0-9]/g, ''), 10);
      return isNaN(n) ? 0 : n;
    };

    const targetRow = fallbackCombinedRoster.find(r => 
      r[0] === calcPost &&
      r[1] === calcDistrict &&
      r[2] === calcQuota &&
      r[3] === calcSubject &&
      r[4] === calcCaste
    );

    const gmRow = fallbackCombinedRoster.find(r => 
      r[0] === calcPost &&
      r[1] === calcDistrict &&
      r[2] === calcQuota &&
      r[3] === calcSubject &&
      r[4] === 'ಸಾಮಾನ್ಯ'
    );

    const colIdx = parseInt(calcSubCol, 10);
    const catSpecific = targetRow ? parseVal(targetRow[colIdx]) : 0;
    const catGeneral = targetRow ? parseVal(targetRow[5]) : 0; // Caste Others/General
    const gmSpecific = gmRow ? parseVal(gmRow[colIdx]) : 0;
    const gmGeneral = gmRow ? parseVal(gmRow[5]) : 0; // GM Others

    let totalEligible = 0;
    if (calcCaste === 'ಸಾಮಾನ್ಯ') {
      totalEligible = colIdx === 5 ? gmGeneral : (gmSpecific + gmGeneral);
    } else {
      // Category candidate gets own category + GM pool
      totalEligible = (colIdx === 5)
        ? (catGeneral + gmGeneral)
        : (catSpecific + catGeneral + gmSpecific + gmGeneral);
    }

    return {
      catSpecific,
      catGeneral,
      gmSpecific,
      gmGeneral,
      totalEligible,
      hasData: !!targetRow
    };
  }, [calcPost, calcDistrict, calcQuota, calcSubject, calcCaste, calcSubCol]);

  // Export Full Roster to CSV
  const handleExportCSV = () => {
    const headers = [
      "Post", "District", "Quota", "Subject", "Caste", 
      "Others", "Women", "Rural", "Ex-Servicemen", 
      "Kannada Medium", "PDP", "PH", "Transgender", "Total"
    ];
    const csvRows = [headers.join(",")];
    fallbackCombinedRoster.forEach(row => {
      csvRows.push(row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Adhyayana_Roster_Matrix_2026-27.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // WhatsApp Share Summary
  const handleShareSummary = (dist) => {
    const txt = `📢 *KARTET / GPT 2026-27 Roster Summary*\n` +
      `📍 *District:* ${dist.district}\n` +
      `🔢 *Total Posts:* ${dist.valTotal}\n` +
      `👩 *Women:* ${dist.valWomen} | 🌾 *Rural:* ${dist.valRural}\n` +
      `👥 *General/Others:* ${dist.valOthers}\n\n` +
      `Check live roster analyzer on Adhyayana App!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 pb-20 pt-4 px-3 md:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-500/10 border border-slate-800 rounded-2xl p-4 md:p-6 backdrop-blur-md shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                  Official 2026-27 Data
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Live Synced (276 Rows)
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-amber-400" />
                {lang === 'kn' ? 'KARTET / GPT / HSTR ರೋಸ್ಟರ್ ವಿಶ್ಲೇಷಣೆ 2026-27' : 'Roster Vacancy Analyzer 2026-27'}
              </h1>
              <p className="text-xs text-slate-400 max-w-2xl">
                {lang === 'kn' 
                  ? 'ಕಲಬುರಗಿ ವಿಭಾಗ ಮತ್ತು ಕರ್ನಾಟಕದ ಶಿಕ್ಷಕರ ಹುದ್ದೆಗಳ ಸಮಗ್ರ ರೋಸ್ಟರ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್, ಅರ್ಹತಾ ಲೆಕ್ಕಾಚಾರ ಮತ್ತು ಜಿಲ್ಲಾವಾರು ಖಾಲಿ ಹುದ್ದೆಗಳ ವಿಶ್ಲೇಷಣೆ.' 
                  : 'Comprehensive vacancy matrices, eligibility calculator, and district-wise vacancy breakdown.'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'kn' ? 'CSV ಡೌನ್‌ಲೋಡ್' : 'Export CSV'}</span>
              </button>
              <a
                href="/roster.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 text-xs font-bold border border-cyan-800 transition cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ಪ್ರತ್ಯೇಕ ಟ್ಯಾಬ್' : 'Standalone'}</span>
              </a>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-5 border-t border-slate-800/80 mt-4 scrollbar-none">
            {[
              { id: 'leaderboard', label: lang === 'kn' ? '🏆 ಜಿಲ್ಲಾವಾರು ಶ್ರೇಯಾಂಕ (Leaderboard)' : '🏆 Leaderboard', icon: Award },
              { id: 'eligibility', label: lang === 'kn' ? '🧮 ಅರ್ಹತಾ ಲೆಕ್ಕಾಚಾರ (Eligibility Calc)' : '🧮 Eligibility Calc', icon: Calculator },
              { id: 'summary', label: lang === 'kn' ? '📊 ವಿಭಾಗದ ಸಾರಾಂಶ (Division Summary)' : '📊 Summary', icon: BarChart3 },
              { id: 'full', label: lang === 'kn' ? '📋 ಸಂಪೂರ್ಣ ರೋಸ್ಟರ್ (Full Table)' : '📋 Full Matrix', icon: FileSpreadsheet }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: LEADERBOARD & DISTRICT MATRICES */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg grid grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {lang === 'kn' ? 'ಹುದ್ದೆ (Post)' : 'Post'}
                </label>
                <select
                  value={selectedPost}
                  onChange={(e) => setSelectedPost(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">{lang === 'kn' ? 'ಎಲ್ಲಾ ಹುದ್ದೆಗಳು (All)' : 'All Posts'}</option>
                  {filterOptions.posts.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {lang === 'kn' ? 'ಜಿಲ್ಲೆ (District)' : 'District'}
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">{lang === 'kn' ? 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು (All)' : 'All Districts'}</option>
                  {filterOptions.districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {lang === 'kn' ? 'ಮೀಸಲಾತಿ (Quota)' : 'Quota'}
                </label>
                <select
                  value={selectedQuota}
                  onChange={(e) => setSelectedQuota(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">{lang === 'kn' ? 'ಎಲ್ಲಾ (All HK / NHK)' : 'All Quota'}</option>
                  {filterOptions.quotas.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {lang === 'kn' ? 'ವಿಷಯ (Subject)' : 'Subject'}
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">{lang === 'kn' ? 'ಎಲ್ಲಾ ವಿಷಯಗಳು (All)' : 'All Subjects'}</option>
                  {filterOptions.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {lang === 'kn' ? 'ಪ್ರವರ್ಗ (Caste)' : 'Category'}
                </label>
                <select
                  value={selectedCaste}
                  onChange={(e) => setSelectedCaste(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">{lang === 'kn' ? 'ಒಟ್ಟು (All Categories)' : 'All Categories'}</option>
                  {filterOptions.castes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {districtRankings.map((dist, idx) => (
                <div 
                  key={dist.district}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center ${
                          idx === 0 
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' 
                            : idx === 1 
                            ? 'bg-slate-300 text-slate-950' 
                            : idx === 2 
                            ? 'bg-amber-700 text-white' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          #{idx + 1}
                        </span>
                        <h3 className="text-base font-black text-white group-hover:text-amber-400 transition">
                          {dist.district}
                        </h3>
                      </div>
                      <span className="text-xl font-black text-amber-400">
                        {dist.valTotal} <span className="text-[10px] font-normal text-slate-400 uppercase">{lang === 'kn' ? 'ಹುದ್ದೆಗಳು' : 'Posts'}</span>
                      </span>
                    </div>

                    {/* Sub-column Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 mb-4">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block">{lang === 'kn' ? '👥 ಇತರೆ' : 'Others'}</span>
                        <span className="text-xs font-black text-slate-200">{dist.valOthers}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-rose-400 block">{lang === 'kn' ? '👩 ಮಹಿಳೆ' : 'Women'}</span>
                        <span className="text-xs font-black text-rose-300">{dist.valWomen}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-emerald-400 block">{lang === 'kn' ? '🌾 ಗ್ರಾಮೀಣ' : 'Rural'}</span>
                        <span className="text-xs font-black text-emerald-300">{dist.valRural}</span>
                      </div>
                      <div className="text-center pt-2 border-t border-slate-800/60">
                        <span className="text-[10px] text-indigo-400 block">{lang === 'kn' ? '🎖️ ಮಾಜಿ ಸೈನಿಕ' : 'Ex-Serv'}</span>
                        <span className="text-xs font-black text-indigo-300">{dist.valEx}</span>
                      </div>
                      <div className="text-center pt-2 border-t border-slate-800/60">
                        <span className="text-[10px] text-amber-400 block">{lang === 'kn' ? '📖 ಕನ್ನಡ ಮಾ.' : 'Kan. Med'}</span>
                        <span className="text-xs font-black text-amber-300">{dist.valKannada}</span>
                      </div>
                      <div className="text-center pt-2 border-t border-slate-800/60">
                        <span className="text-[10px] text-cyan-400 block">{lang === 'kn' ? '🏗️ PDP' : 'PDP'}</span>
                        <span className="text-xs font-black text-cyan-300">{dist.valPDP}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <span className="text-[11px] text-slate-400">
                      PH: <strong className="text-slate-200">{dist.valPH}</strong> | Trans: <strong className="text-slate-200">{dist.valTrans}</strong>
                    </span>
                    <button
                      onClick={() => handleShareSummary(dist)}
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{lang === 'kn' ? 'ಹಂಚಿಕೊಳ್ಳಿ' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ELIGIBILITY CALCULATOR */}
        {activeTab === 'eligibility' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  {lang === 'kn' ? 'ನಿಮ್ಮ ಅರ್ಹತಾ ಹುದ್ದೆಗಳ ಲೆಕ್ಕಾಚಾರ (Personal Eligibility Calculator)' : 'Personal Eligibility Calculator'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'kn' 
                    ? 'ನಿಮ್ಮ ಪ್ರವರ್ಗ ಹಾಗೂ ಮೀಸಲಾತಿ ಅನ್ವಯ ನೀವು ಸ್ಪರ್ಧಿಸಬಹುದಾದ (ನಿಮ್ಮ ಪ್ರವರ್ಗ + ಸಾಮಾನ್ಯ ಮೆರಿಟ್) ನಿಖರ ಹುದ್ದೆಗಳ ಲೆಕ್ಕಾಚಾರ.' 
                    : 'Calculate total vacancies eligible for your category + general merit pool.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    1. {lang === 'kn' ? 'ಹುದ್ದೆಯ ವಿಧ (Post)' : 'Post Type'}
                  </label>
                  <select
                    value={calcPost}
                    onChange={(e) => setCalcPost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 font-bold focus:border-amber-500"
                  >
                    {filterOptions.posts.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    2. {lang === 'kn' ? 'ಆಯ್ಕೆಯ ಜಿಲ್ಲೆ (District)' : 'District'}
                  </label>
                  <select
                    value={calcDistrict}
                    onChange={(e) => setCalcDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 font-bold focus:border-amber-500"
                  >
                    {filterOptions.districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    3. {lang === 'kn' ? 'ವಲಯ / ಕೋಟಾ (Quota)' : 'Quota'}
                  </label>
                  <select
                    value={calcQuota}
                    onChange={(e) => setCalcQuota(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 font-bold focus:border-amber-500"
                  >
                    {filterOptions.quotas.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    4. {lang === 'kn' ? 'ವಿಷಯ (Subject)' : 'Subject'}
                  </label>
                  <select
                    value={calcSubject}
                    onChange={(e) => setCalcSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 font-bold focus:border-amber-500"
                  >
                    {filterOptions.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    5. {lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರವರ್ಗ / ಜಾತಿ (Category)' : 'Category / Caste'}
                  </label>
                  <select
                    value={calcCaste}
                    onChange={(e) => setCalcCaste(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 font-bold focus:border-amber-500"
                  >
                    {filterOptions.castes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    6. {lang === 'kn' ? 'ವಿಶೇಷ ಸಮತಲ ಮೀಸಲಾತಿ (Horizontal Quota)' : 'Horizontal Quota'}
                  </label>
                  <select
                    value={calcSubCol}
                    onChange={(e) => setCalcSubCol(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 font-bold focus:border-amber-500"
                  >
                    <option value="5">👥 ಇತರೆ / ಸಾಮಾನ್ಯ (General/Others)</option>
                    <option value="6">👩 ಮಹಿಳೆ (Women)</option>
                    <option value="7">🌾 ಗ್ರಾಮೀಣ (Rural)</option>
                    <option value="8">🎖️ ಮಾಜಿ ಸೈನಿಕ (Ex-Servicemen)</option>
                    <option value="9">📖 ಕನ್ನಡ ಮಾಧ್ಯಮ (Kannada Medium)</option>
                    <option value="10">🏗️ ಯೋಜನಾ ನಿರಾಶ್ರಿತ (PDP)</option>
                    <option value="11">♿ ಅಂಗವಿಕಲ (PH)</option>
                    <option value="12">🏳️‍⚧️ ತೃತೀಯ ಲಿಂಗ (Transgender)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Scorecard */}
            <div className="bg-gradient-to-br from-amber-500/20 via-slate-900 to-emerald-500/20 border border-amber-500/40 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block mb-1">
                  {lang === 'kn' ? 'ಲೆಕ್ಕಾಚಾರದ ಫಲಿತಾಂಶ' : 'Calculation Result'}
                </span>
                <h3 className="text-sm font-bold text-slate-300">
                  {calcPost} • {calcDistrict} ({calcQuota}) - {calcSubject}
                </h3>
                
                <div className="my-6 text-center bg-slate-950/80 rounded-2xl p-5 border border-amber-500/30">
                  <span className="text-4xl md:text-5xl font-black text-amber-400 block tracking-tight">
                    {eligibilityResult.totalEligible}
                  </span>
                  <span className="text-xs font-bold text-slate-300 mt-1 block">
                    {lang === 'kn' ? 'ನೀವು ಸ್ಪರ್ಧಿಸಬಹುದಾದ ಒಟ್ಟು ಹುದ್ದೆಗಳು' : 'Total Eligible Vacancies'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <span className="text-slate-400">ನಿಮ್ಮ ಪ್ರವರ್ಗ ({calcCaste}):</span>
                    <strong className="text-slate-200">{eligibilityResult.catSpecific + eligibilityResult.catGeneral} ಹುದ್ದೆ</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <span className="text-slate-400">ಸಾಮಾನ್ಯ ಮೆರಿಟ್ (GM Pool):</span>
                    <strong className="text-emerald-400">+{eligibilityResult.gmSpecific + eligibilityResult.gmGeneral} ಹುದ್ದೆ</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                💡 <em>ನಿಯಮಾವಳಿ: ಪ್ರವರ್ಗದ ಅಭ್ಯರ್ಥಿಗಳಿಗೆ ತಮ್ಮ ಸ್ವಂತ ಪ್ರವರ್ಗದ ಹುದ್ದೆಗಳ ಜೊತೆಗೆ ಸಾಮಾನ್ಯ (GM) ಮುಕ್ತ ಹುದ್ದೆಗಳಲ್ಲೂ ಸ್ಪರ್ಧಿಸಲು ಅವಕಾಶವಿರುತ್ತದೆ.</em>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DIVISION SUMMARY (SHEET 3) */}
        {activeTab === 'summary' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  {lang === 'kn' ? 'ಕಲಬುರಗಿ ವಿಭಾಗದ ಖಾಲಿ ಹುದ್ದೆಗಳ ವರ್ಗೀಕರಣ (80% ವೃಂದ)' : 'Kalaburagi Division Subject-wise Summary'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  2026-27ನೇ ಸಾಲಿನ ಪ್ರೌಢಶಾಲಾ ಸಹ ಶಿಕ್ಷಕರು ಹಾಗೂ ದೈಹಿಕ ಶಿಕ್ಷಣ ಶಿಕ್ಷಕರು ಗ್ರೇಡ್ - 1 ನೇಮಕಾತಿ.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    {fallbackSheet3[0].slice(0, 10).map((th, i) => (
                      <th key={i} className="px-3.5 py-3 whitespace-nowrap">
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                  {fallbackSheet3.slice(1).map((row, rIdx) => {
                    const isTotalRow = rIdx === fallbackSheet3.length - 2;
                    return (
                      <tr 
                        key={rIdx} 
                        className={`hover:bg-slate-800/50 transition ${isTotalRow ? 'bg-amber-500/10 font-black text-amber-300' : ''}`}
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3.5 py-2.5 whitespace-nowrap">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: FULL MATRIX TABLE */}
        {activeTab === 'full' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                  {lang === 'kn' ? 'ಸಂಪೂರ್ಣ ರೋಸ್ಟರ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್ ಕೋಷ್ಟಕ (Complete Matrix Table)' : 'Complete Combined Matrix Table'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  ಒಟ್ಟು 276 ಅಧಿಕೃತ ದಾಖಲೆಗಳ ಹುಡುಕಾಟ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ.
                </p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={lang === 'kn' ? 'ಜಿಲ್ಲೆ, ವಿಷಯ ಅಥವಾ ಪ್ರವರ್ಗ ಹುಡುಕಿ...' : 'Search matrix...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[60vh] rounded-xl border border-slate-800 scrollbar-thin">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase sticky top-0 border-b border-slate-800 z-10">
                  <tr>
                    <th className="px-3 py-2.5">Post</th>
                    <th className="px-3 py-2.5">District</th>
                    <th className="px-3 py-2.5">Quota</th>
                    <th className="px-3 py-2.5">Subject</th>
                    <th className="px-3 py-2.5">Caste</th>
                    <th className="px-2 py-2.5 text-center">ಇತರೆ</th>
                    <th className="px-2 py-2.5 text-center">ಮಹಿಳೆ</th>
                    <th className="px-2 py-2.5 text-center">ಗ್ರಾಮೀಣ</th>
                    <th className="px-2 py-2.5 text-center">ಮಾ.ಸೈ</th>
                    <th className="px-2 py-2.5 text-center">ಕನ್ನಡ</th>
                    <th className="px-2 py-2.5 text-center">PDP</th>
                    <th className="px-2 py-2.5 text-center">PH</th>
                    <th className="px-2 py-2.5 text-center">Trans</th>
                    <th className="px-3 py-2.5 text-right font-black text-amber-400">ಒಟ್ಟು</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                  {fallbackCombinedRoster
                    .filter(r => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return r.some(c => (c || '').toLowerCase().includes(q));
                    })
                    .map((row, idx) => {
                      const isTotalRow = row[4] === 'ಒಟ್ಟು';
                      return (
                        <tr 
                          key={idx}
                          className={`hover:bg-slate-800/60 transition ${isTotalRow ? 'bg-amber-500/10 font-bold text-amber-300' : ''}`}
                        >
                          <td className="px-3 py-2">{row[0]}</td>
                          <td className="px-3 py-2 font-bold text-white">{row[1]}</td>
                          <td className="px-3 py-2">{row[2]}</td>
                          <td className="px-3 py-2">{row[3]}</td>
                          <td className="px-3 py-2 font-medium">{row[4]}</td>
                          <td className="px-2 py-2 text-center text-slate-400">{row[5] || '0'}</td>
                          <td className="px-2 py-2 text-center text-rose-300">{row[6] || '0'}</td>
                          <td className="px-2 py-2 text-center text-emerald-300">{row[7] || '0'}</td>
                          <td className="px-2 py-2 text-center text-slate-400">{row[8] || '0'}</td>
                          <td className="px-2 py-2 text-center text-amber-300">{row[9] || '0'}</td>
                          <td className="px-2 py-2 text-center text-slate-400">{row[10] || '0'}</td>
                          <td className="px-2 py-2 text-center text-slate-400">{row[11] || '0'}</td>
                          <td className="px-2 py-2 text-center text-slate-400">{row[12] || '0'}</td>
                          <td className="px-3 py-2 text-right font-black text-amber-400">{row[13] || '0'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
