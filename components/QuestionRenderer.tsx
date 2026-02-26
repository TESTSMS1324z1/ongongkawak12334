
import React, { useState } from 'react';
import { GeneratedQuestion, QuestionType } from '../types';
import { UI } from '../constants';

interface QuestionRendererProps {
  question: GeneratedQuestion;
  type: QuestionType;
  index: number;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, type, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const getOptionLabel = (idx: number) => String.fromCharCode(65 + idx);

  const copyToClipboard = () => {
    const text = `${question.title}\n\n${question.content}\n\n${question.options?.map((o, i) => `${getOptionLabel(i)}. ${o}`).join('\n') || ''}`;
    navigator.clipboard.writeText(text);
    alert('題目已複製到剪貼簿！');
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden mb-10 transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] print:shadow-none print:border-none print:mb-12">
      {/* Visual Indicator */}
      <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] animate-[gradient_3s_linear_infinite]"></div>
      
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
                DSE Practice Q{index + 1}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-widest no-print">
                {type.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight pt-2">
              {question.title}
            </h2>
          </div>
          <div className="flex flex-col items-end">
             <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl flex flex-col items-center justify-center min-w-[70px]">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 leading-none mb-1">Marks</span>
                <span className="text-xl font-black leading-none">{question.totalMarks}</span>
             </div>
             <button 
                onClick={copyToClipboard}
                className="mt-3 text-slate-400 hover:text-indigo-600 transition-colors p-1 no-print"
                title="複製題目內容"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
             </button>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* Data Extract Section */}
        {question.data && (
          <div className="my-8 group relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
             <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-7">
                <div className="flex items-center gap-2 mb-4 text-slate-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{UI.dataLabel}</span>
                </div>
                <div className="font-serif-tc text-slate-700 leading-relaxed italic text-lg whitespace-pre-wrap">
                    {question.data}
                </div>
             </div>
          </div>
        )}

        {/* Question Content */}
        <div className="mb-8">
          <p className="text-xl text-slate-800 leading-relaxed font-semibold">
            {question.content}
          </p>
        </div>

        {/* MCQ Options UI */}
        {type === QuestionType.MCQ && question.options && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {question.options.map((opt, idx) => (
              <div 
                key={idx} 
                className="flex items-center p-5 bg-white border border-slate-200 rounded-2xl transition-all hover:border-indigo-400 hover:shadow-sm group cursor-default"
              >
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-100 rounded-xl font-extrabold text-slate-500 mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {getOptionLabel(idx)}
                </div>
                <span className="text-slate-700 font-bold group-hover:text-slate-900">{opt}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Toggle */}
        <div className="no-print pt-8 border-t border-slate-50">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`w-full group flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-extrabold transition-all duration-300 ${
              showAnswer 
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98]'
            }`}
          >
            {showAnswer ? (
              <>
                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                </svg>
                {UI.hideAns}
              </>
            ) : (
              <>
                <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
                {UI.showAns}
              </>
            )}
          </button>

          {showAnswer && (
            <div className="mt-10 animate-fadeIn space-y-8">
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-3 h-3 bg-indigo-600 rounded-full"></span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{UI.markingScheme}</h3>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              
              {/* MCQ Marking */}
              {type === QuestionType.MCQ && (
                <div className="space-y-4">
                  <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-500 text-white flex items-center justify-center rounded-2xl text-2xl font-black shadow-lg shadow-emerald-200">
                      {getOptionLabel(question.correctOption ?? 0)}
                    </div>
                    <div>
                      <p className="text-emerald-900 font-black text-lg">{UI.correctAns}</p>
                      <p className="text-emerald-700 font-medium">此選項符合考評局經濟學邏輯及精確定義。</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mt-6">
                    <p className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 px-2">各選項詳細分析 (Options Analysis)</p>
                    {question.optionExplanations?.map((exp, idx) => (
                      <div key={idx} className={`p-5 rounded-2xl border transition-all ${exp.isCorrect ? 'bg-emerald-50/20 border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-100 group hover:border-slate-300'}`}>
                        <div className="flex items-start gap-4">
                          <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-colors ${exp.isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'}`}>
                            {exp.option}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className={`font-black text-[10px] uppercase tracking-widest ${exp.isCorrect ? 'text-emerald-600' : 'text-slate-400'}`}>
                                  {exp.isCorrect ? 'Correct Logic' : 'Common Fallacy / Incorrect'}
                                </p>
                                {!exp.isCorrect && (
                                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse"></span>
                                )}
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed font-medium">{exp.explanation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SQ / DRQ Marking */}
              {(type === QuestionType.SHORT_QUESTION || type === QuestionType.DATA_RESPONSE) && (
                <div className="space-y-6">
                  {question.markingScheme?.map((item, idx) => (
                    <div key={idx} className="group flex gap-6 items-start">
                      <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center font-black text-xs group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        0{idx + 1}
                      </div>
                      <div className="flex-1 pb-6 border-b border-slate-50 group-last:border-none">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-black text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{item.point}</p>
                          <span className="text-indigo-600 font-black bg-indigo-50 px-3 py-1 rounded-full text-xs whitespace-nowrap">
                            {item.marks} M
                          </span>
                        </div>
                        <p className="text-slate-600 text-base leading-relaxed font-medium">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Print Disclaimer */}
        <div className="hidden print-only mt-10 text-center border-t border-slate-200 pt-6">
           <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
              Generated by DSE Economics Master AI • Strictly for Personal Practice
           </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionRenderer;
