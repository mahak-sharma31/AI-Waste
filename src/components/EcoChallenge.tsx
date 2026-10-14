import React, { useState, useEffect } from 'react';
import { HelpCircle, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Flame } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/knowledgeBase';
import { QuizQuestion, QuizRecord } from '../types';

const STORAGE_KEY = 'ecovision_quiz_records';

export const EcoChallenge: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [records, setRecords] = useState<QuizRecord[]>([]);

  // Load completed quiz records from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecords(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRecord = (finalScore: number, total: number) => {
    const percent = Math.round((finalScore / total) * 100);
    const newRecord: QuizRecord = {
      score: finalScore,
      total,
      percent,
      time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
    };
    const updated = [newRecord, ...records].slice(0, 10);
    setRecords(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const startQuiz = () => {
    // Shuffle questions
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    if (index === currentQ.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      saveRecord(score + (selectedOption === questions[currentIndex].answer ? 0 : 0), questions.length);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <section id="challenge" className="py-12 sm:py-16 lg:py-20 bg-white border-b border-[#d5e3d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3d8b5f]">
            05 / ECOCHALLENGE QUIZ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#163528] tracking-tight mt-2">
            Waste Sorting <span className="text-[#3d8b5f]">Mastery Challenge</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5f7366] mt-3">
            Test your knowledge of kerbside sorting rules, grease contamination, and recycling symbols.
            Results are tracked in your local browser history.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Quiz Card */}
          <div className="lg:col-span-8 bg-[#fbfdfa] border border-[#d5e3d8] rounded-3xl p-6 sm:p-8 shadow-sm">
            {!quizStarted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#e3f2e7] text-[#1f4d36] flex items-center justify-center mx-auto">
                  <HelpCircle className="w-8 h-8 text-[#3d8b5f]" />
                </div>
                <h3 className="font-bold text-2xl text-[#163528]">Ready to test your eco-sorting skills?</h3>
                <p className="text-sm text-[#5f7366] max-w-md mx-auto">
                  Answer 5 randomized multiple-choice questions covering plastic resin types, food waste composting, and curbside contamination.
                </p>
                <button
                  onClick={startQuiz}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#163528] hover:bg-[#1f4d36] transition-all shadow-md hover:-translate-y-0.5"
                >
                  Start EcoChallenge →
                </button>
              </div>
            ) : quizFinished ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#e3f2e7] text-[#1f4d36] flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-extrabold text-2xl text-[#163528]">Challenge Complete!</h3>
                <div className="text-4xl font-black text-[#1f4d36]">
                  {score} / {questions.length}
                </div>
                <p className="text-sm text-[#5f7366]">
                  You scored {Math.round((score / questions.length) * 100)}% on this sorting round.
                  {score === questions.length ? ' Flawless eco-sorting expertise!' : ' Keep practicing to divert more waste!'}
                </p>
                <button
                  onClick={startQuiz}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#163528] hover:bg-[#1f4d36] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Quiz Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#e8f0e4] text-xs font-bold text-[#5f7366]">
                  <span>
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#e8f0e4] text-[#1f4d36]">
                      {currentQ.difficulty}
                    </span>
                    <span className="text-[#163528]">Score: {score}</span>
                  </div>
                </div>

                {/* Question */}
                <h3 className="font-extrabold text-lg sm:text-xl text-[#163528] leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQ.options.map((option, idx) => {
                    const isCorrect = idx === currentQ.answer;
                    const isSelected = selectedOption === idx;

                    let buttonStyle = 'bg-white border-[#d5e3d8] hover:border-[#3d8b5f] text-[#163528]';

                    if (isAnswered) {
                      if (isCorrect) {
                        buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected && !isCorrect) {
                        buttonStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                      } else {
                        buttonStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                        className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${buttonStyle}`}
                      >
                        <span>{option}</span>
                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback explanation */}
                {isAnswered && (
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      selectedOption === currentQ.answer
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}
                  >
                    <strong>
                      {selectedOption === currentQ.answer ? 'Correct! ' : 'Not quite. '}
                    </strong>
                    {currentQ.explain}
                  </div>
                )}

                {/* Next button */}
                {isAnswered && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#163528] hover:bg-[#1f4d36] transition-colors"
                    >
                      <span>
                        {currentIndex + 1 >= questions.length ? 'View Results' : 'Next Question'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#b8e0c2]" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Past Records Sidebar */}
          <div className="lg:col-span-4 bg-[#fafcf8] border border-[#d5e3d8] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#e8f0e4]">
              <Flame className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-base text-[#163528]">Challenge History</h3>
            </div>

            {records.length === 0 ? (
              <p className="text-xs text-[#5f7366] py-4 text-center">
                Completed challenge scores will be recorded here.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {records.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[#d5e3d8] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#163528]">
                        Score: {rec.score}/{rec.total}
                      </span>
                      <span className="text-[10px] text-[#5f7366] block">{rec.time}</span>
                    </div>
                    <span className="font-bold px-2 py-0.5 rounded-full bg-[#e3f2e7] text-[#1f4d36]">
                      {rec.percent}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
