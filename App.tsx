
import React, { useState, useEffect } from 'react';
import { TOPICS, UI } from './constants';
import { QuestionType, Difficulty, Topic, GeneratedQuestion } from './types';
import { economicsAI } from './services/geminiService';
import QuestionRenderer from './components/QuestionRenderer';

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(TOPICS[0]);
  const [type, setType] = useState<QuestionType>(QuestionType.MCQ);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [count, setCount] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [studyTip, setStudyTip] = useState<string>("");
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const tips: Record<string, string> = {
      basic_concepts: "記住 Scarcity 是 Economics 的基礎，所有 Choice 都有 Opportunity Cost。",
      demand_supply: "留意 Change in Demand vs Change in Quantity Demanded 的區別。",
      market_intervention: "Price Ceiling 必定低於 Equilibrium Price 才有作用。",
      as_ad: "注意 Fiscal Policy 影響 AD，但長期 AS 取決於生產力。",
      money_banking: "注意 Money Creation 過程中的 Excess Reserves 與 Money Multiplier 的關係。",
      trade: "Comparative Advantage 取決於 Opportunity Cost，而非 Absolute Advantage。",
    };
    setStudyTip(tips[selectedTopic.id] || "DSE 經濟科重視邏輯推導，繪圖時必須標記清楚所有軸線及原點。");
  }, [selectedTopic]);

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadProgress(0);
      interval = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 95) return prev;
          return prev + (100 - prev) * 0.1;
        });
      }, 500);
    } else {
      setLoadProgress(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const questions = await economicsAI.generateQuestions(selectedTopic, type, difficulty, count);
      setGeneratedQuestions(questions);
      // Smooth scroll to top of questions
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(UI.error);
    } finally {
      setLoading(false);
    }
  };

  const clearContent = () => {
    if (confirm('確定要清空當前內容嗎？')) {
      setGeneratedQuestions([]);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Dynamic Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 no-print transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-slate-200 transition-transform group-hover:scale-105">E</div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none">
                {UI.title}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">DSE AI Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={clearContent}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-black text-slate-400 hover:text-rose-500 rounded-xl transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {UI.clearBtn}
              </button>
              <button 
                onClick={() => window.print()}
                disabled={generatedQuestions.length === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-sm transition-all shadow-sm ${
                  generatedQuestions.length === 0 
                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-50' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {UI.printBtn}
              </button>
          </div>
        </div>
        {loading && (
          <div className="absolute bottom-0 left-0 h-1 bg-indigo-600 transition-all duration-500 ease-out" style={{ width: `${loadProgress}%` }}></div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 w-full">
        {/* Modern Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-8 no-print">
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{UI.configTitle}</h3>
            </div>
            
            <div className="space-y-8">
              {/* Topic Select */}
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">{UI.topicLabel}</label>
                <div className="relative">
                    <select 
                      value={selectedTopic.id}
                      onChange={(e) => setSelectedTopic(TOPICS.find(t => t.id === e.target.value)!)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all cursor-pointer"
                    >
                      <optgroup label="微觀 (Microeconomics)">
                        {TOPICS.filter(t => t.category === 'Micro').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </optgroup>
                      <optgroup label="宏觀 (Macroeconomics)">
                        {TOPICS.filter(t => t.category === 'Macro').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </optgroup>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
              </div>

              {/* Type Grid */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{UI.typeLabel}</label>
                <div className="flex flex-col gap-2">
                  {[
                    { id: QuestionType.MCQ, label: UI.mcq, icon: 'list' },
                    { id: QuestionType.SHORT_QUESTION, label: UI.short, icon: 'chat' },
                    { id: QuestionType.DATA_RESPONSE, label: UI.data, icon: 'document' }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setType(btn.id)}
                      className={`flex items-center gap-3 px-5 py-4 rounded-2xl border text-sm font-bold transition-all ${
                        type === btn.id 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Pills */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{UI.difficultyLabel}</label>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                  {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        difficulty === d 
                          ? 'bg-white text-slate-900 shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {d === Difficulty.EASY ? '基礎' : d === Difficulty.MEDIUM ? '標準' : '挑戰'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{UI.countLabel}</label>
                  <span className="text-2xl font-black text-indigo-600 leading-none">{count}</span>
                </div>
                <input 
                  type="range" min="1" max="5" value={count} 
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-slate-900 text-white font-black py-5 rounded-2xl shadow-2xl shadow-slate-200 transition-all hover:bg-slate-800 disabled:opacity-50 active:scale-95"
                >
                  <span className={`relative z-10 flex items-center justify-center gap-3 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                    {UI.generateBtn}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <svg className="animate-spin h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                    </div>
                  )}
                </button>
                <p className="mt-4 text-[9px] text-slate-300 text-center uppercase tracking-[0.2em] font-bold">
                  {UI.mixedNote}
                </p>
              </div>
            </div>
          </div>

          {/* Elegant Tip Card */}
          <div className="relative group overflow-hidden bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl shadow-slate-200 transition-all duration-500 hover:shadow-indigo-100">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-600 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
                <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-4 text-indigo-400 flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                  {UI.studyTipTitle}
                </h4>
                <p className="text-base font-bold leading-relaxed italic text-slate-100 opacity-90">
                  “{studyTip}”
                </p>
            </div>
          </div>
        </aside>

        {/* Content Section */}
        <section className="flex-1 min-w-0">
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl mb-10 flex items-center gap-5 no-print animate-shake">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
              </div>
              <div>
                <p className="font-black text-rose-900 tracking-tight">生成錯誤</p>
                <p className="text-rose-600 text-sm font-bold opacity-80">{error}</p>
              </div>
            </div>
          )}

          {generatedQuestions.length === 0 && !loading && (
            <div className="bg-white rounded-[3rem] border-2 border-slate-50 border-dashed py-40 px-10 flex flex-col items-center justify-center text-center no-print group">
              <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-slate-300 max-w-sm tracking-tight leading-snug">
                {UI.placeholder}
              </h2>
              <div className="mt-8 flex gap-2 no-print opacity-30">
                 <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                 <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                 <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              </div>
            </div>
          )}

          {loading && (
            <div className="space-y-12 no-print">
              {[...Array(count)].map((_, i) => (
                <div key={i} className="bg-white p-12 rounded-[2.5rem] border border-slate-50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-1 bg-slate-50 w-full animate-pulse"></div>
                  <div className="flex justify-between mb-10">
                     <div className="space-y-3 w-2/3">
                        <div className="h-4 bg-slate-100 rounded-full w-24 animate-pulse"></div>
                        <div className="h-8 bg-slate-100 rounded-2xl w-full animate-pulse"></div>
                     </div>
                     <div className="w-16 h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
                  </div>
                  <div className="space-y-4 mb-10">
                    <div className="h-4 bg-slate-50 rounded-full w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-50 rounded-full w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-50 rounded-full w-4/5 animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-16 bg-slate-50 rounded-2xl animate-pulse"></div>
                    <div className="h-16 bg-slate-50 rounded-2xl animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {generatedQuestions.length > 0 && !loading && (
            <div className="animate-slideUp">
              {/* Paper Header (Print only) */}
              <div className="hidden print-only mb-16 text-center border-b-4 border-slate-900 pb-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-black text-white rounded flex items-center justify-center font-black">E</div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">HKDSE Economics Mock Exam</h1>
                </div>
                <div className="flex justify-between items-end">
                   <div className="text-left space-y-1">
                       <p className="text-xl font-bold">Paper 2: Practicing Concepts</p>
                       <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">{selectedTopic.nameEn}</p>
                   </div>
                   <div className="text-right text-sm font-bold space-y-1">
                       <p>Name: __________________________</p>
                       <p>Class: _________ (____)</p>
                   </div>
                </div>
              </div>
              
              {generatedQuestions.map((q, idx) => (
                <QuestionRenderer 
                  key={idx} 
                  question={q} 
                  type={type} 
                  index={idx}
                />
              ))}

              {/* Solutions Section (Print only) */}
              <div className="hidden print-only page-break-before pt-12">
                <div className="flex items-center gap-6 mb-12">
                   <h2 className="text-4xl font-black uppercase underline decoration-4 underline-offset-8">Marking Scheme</h2>
                   <div className="flex-1 h-px bg-slate-200"></div>
                </div>
                
                <div className="space-y-16">
                  {generatedQuestions.map((q, idx) => (
                    <div key={idx} className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
                      <div className="flex justify-between items-baseline border-b-2 border-slate-200 pb-4 mb-8">
                         <h3 className="text-2xl font-black">Q{idx + 1}: {q.title}</h3>
                         <span className="text-lg font-black text-slate-400">Total: {q.totalMarks} M</span>
                      </div>
                      
                      {q.correctOption !== undefined && (
                        <div className="mb-10 inline-flex items-center gap-6 bg-white px-8 py-5 rounded-3xl shadow-sm border border-slate-100">
                           <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Answer Key:</span>
                           <span className="text-5xl font-black text-black">{String.fromCharCode(65 + q.correctOption)}</span>
                        </div>
                      )}
                      
                      {q.optionExplanations && q.optionExplanations.length > 0 && (
                        <div className="space-y-6 mb-10">
                           <p className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Comprehensive Analysis</p>
                           <div className="grid grid-cols-1 gap-4">
                              {q.optionExplanations.map((exp, eIdx) => (
                                <div key={eIdx} className="text-sm bg-white p-4 rounded-2xl border border-slate-50">
                                  <strong className="text-slate-900 font-black">({exp.option})</strong> 
                                  <span className="ml-2 text-slate-600 font-bold">{exp.explanation}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}

                      <div className="space-y-8">
                        <p className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Step-by-step Scheme</p>
                        {q.markingScheme?.map((item, midx) => (
                          <div key={midx} className="flex gap-6">
                            <div className="flex-1">
                              <p className="font-black text-lg text-slate-900 leading-snug mb-2">{item.point}</p>
                              <p className="text-sm text-slate-600 font-bold leading-relaxed">{item.explanation}</p>
                            </div>
                            <div className="flex-shrink-0 font-black text-lg border-l-2 border-slate-200 pl-4 h-fit">
                                {item.marks}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-auto py-12 text-center no-print border-t border-slate-50">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">
          EconMaster AI v2.5 • HKDSE Assessment Engine
        </p>
      </footer>
    </div>
  );
};

export default App;
