import React, { useState } from 'react';
import { 
  Check, 
  X, 
  PenTool, 
  HelpCircle, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  AlertCircle 
} from 'lucide-react';

export const OmrSheetView = ({ 
  questions = [], 
  selectedAnswers = {}, 
  onSelectOption, 
  currentIdx = 0, 
  onJumpToQuestion, 
  markedForReview = {}, 
  candidateName = 'Aspirant', 
  candidateRoll = 'ADH-2026-88', 
  testTitle = 'Competitive Mock Examination', 
  isSubmitted = false, 
  questionResults = [], 
  lang = 'kn' 
}) => {
  const [inkColor, setInkColor] = useState('blue'); // 'blue' | 'black'
  const totalCount = questions.length || 0;
  
  // Calculate stats
  const answeredCount = Object.keys(selectedAnswers).filter(k => selectedAnswers[k] !== undefined && selectedAnswers[k] !== null).length;
  const reviewCount = Object.keys(markedForReview).filter(k => markedForReview[k]).length;
  const remainingCount = Math.max(0, totalCount - answeredCount);

  const OPTIONS = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full select-none font-sans">
      
      {/* OMR Sheet Official Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-100 via-amber-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b-2 border-slate-300 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-700 text-white uppercase tracking-wider">
                OMR SYSTEM
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                ಅಧ್ಯಯನ ಅಧಿಕೃತ OMR ಉತ್ತರ ಪತ್ರಿಕೆ
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
              {testTitle}
            </h3>
          </div>

          {/* Ink Pen Switcher */}
          {!isSubmitted && (
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm text-xs">
              <span className="text-[10px] font-bold text-slate-400 pl-1">
                {lang === 'kn' ? 'ಪೆನ್ ಶಾಯಿ:' : 'Ink:'}
              </span>
              <button
                type="button"
                onClick={() => setInkColor('blue')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                  inkColor === 'blue' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                <span>ನೀಲಿ (Blue)</span>
              </button>
              <button
                type="button"
                onClick={() => setInkColor('black')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                  inkColor === 'black' 
                    ? 'bg-slate-950 text-white shadow-sm dark:bg-slate-700' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-500"></span>
                <span>ಕಪ್ಪು (Black)</span>
              </button>
            </div>
          )}
        </div>

        {/* Candidate & Barcode Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono">
          <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block font-sans">ಅಭ್ಯರ್ಥಿ (Candidate)</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{candidateName}</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block font-sans">ರೋಲ್ ನಂ (Roll No)</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{candidateRoll}</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block font-sans">ಬಬಲ್ ಭರ್ತಿ (Shaded)</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{answeredCount} / {totalCount}</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block font-sans">ಉಳಿದಿರುವುದು (Remaining)</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{remainingCount}</span>
          </div>
        </div>
      </div>

      {/* Bubble Shading Guidelines Note */}
      <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-300 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>
            {lang === 'kn' 
              ? 'ಸೂಚನೆ: ವೃತ್ತವನ್ನು (A, B, C, D) ಸ್ಪರ್ಶಿಸಿ ಸಂಪೂರ್ಣವಾಗಿ ಶೇಡ್ ಮಾಡಿ.' 
              : 'Instructions: Tap/Click the circular bubble to shade your chosen answer.'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border border-slate-400 inline-block"></span> ಖಾಲಿ
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-700 inline-block"></span> ಸರಿಯಾದ ಶೇಡಿಂಗ್
          </span>
        </div>
      </div>

      {/* Main OMR Bubble Grid (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-950/40 divide-y divide-slate-200 dark:divide-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
          {questions.map((q, idx) => {
            const isCurrent = currentIdx === idx;
            const userChoice = selectedAnswers[idx];
            const isAnswered = userChoice !== undefined && userChoice !== null;
            const isReview = markedForReview[idx];
            const qResult = isSubmitted && questionResults[idx] ? questionResults[idx] : null;

            return (
              <div
                key={idx}
                onClick={() => onJumpToQuestion(idx)}
                className={`py-2 px-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-600 shadow-sm ring-1 ring-emerald-400'
                    : 'hover:bg-white dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {/* Question Number & Status Indicator */}
                <div className="flex items-center gap-2 min-w-[58px]">
                  <span className={`w-6 h-6 rounded-lg text-[11px] font-black font-mono flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : (isAnswered ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : 'text-slate-400')
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  
                  {isReview && !isSubmitted && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Marked for Review"></span>
                  )}
                </div>

                {/* 4 OMR Bubbles: (A) (B) (C) (D) */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {OPTIONS.map((optLabel, optIdx) => {
                    const isSelected = userChoice === optIdx;
                    const isCorrectChoice = qResult && qResult.correctAnswer === optIdx;
                    const isWrongSelected = qResult && isSelected && !qResult.isCorrect;

                    // Compute bubble style
                    let bubbleStyle = 'border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:border-slate-800 dark:hover:border-slate-300';
                    
                    if (isSubmitted) {
                      if (isCorrectChoice) {
                        bubbleStyle = 'bg-emerald-600 border-emerald-600 text-white font-black ring-2 ring-emerald-400 shadow-md animate-pulse';
                      } else if (isWrongSelected) {
                        bubbleStyle = 'bg-red-600 border-red-600 text-white font-black ring-2 ring-red-400';
                      }
                    } else if (isSelected) {
                      bubbleStyle = inkColor === 'blue'
                        ? 'bg-blue-700 border-blue-800 text-white font-black shadow-inner ring-1 ring-blue-500 scale-95'
                        : 'bg-slate-900 border-black text-white font-black shadow-inner ring-1 ring-slate-600 scale-95';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isSubmitted) {
                            onSelectOption(idx, optIdx);
                          }
                        }}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all cursor-pointer ${bubbleStyle}`}
                        title={`Question ${idx + 1} - Option ${optLabel}`}
                      >
                        {isSubmitted ? (
                          isCorrectChoice ? <Check className="w-3.5 h-3.5 text-white" /> : (isWrongSelected ? <X className="w-3.5 h-3.5 text-white" /> : optLabel)
                        ) : (
                          isSelected ? (
                            <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px]">
                              {optLabel}
                            </span>
                          ) : optLabel
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Clear option button */}
                {!isSubmitted && isAnswered && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOption(idx, undefined);
                    }}
                    className="p-1 text-slate-400 hover:text-red-500 text-[10px] rounded hover:bg-slate-100 dark:hover:bg-slate-800 ml-1"
                    title="Clear choice"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
                {(!isAnswered || isSubmitted) && <span className="w-5"></span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* OMR Bottom Status Bar */}
      <div className="p-3 px-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>OMR Barcode: #ADH-OMR-2026</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-blue-600 font-bold">● {answeredCount} Shaded</span>
          <span className="text-amber-600 font-bold">● {remainingCount} Blank</span>
          {reviewCount > 0 && <span className="text-purple-600 font-bold">● {reviewCount} Review</span>}
        </div>
      </div>

    </div>
  );
};
