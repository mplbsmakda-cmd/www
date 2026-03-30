import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldAlert,
  Maximize,
  LogOut,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

interface CBTExamProps {
  examId: string;
  onComplete: () => void;
}

export default function CBTExam({ examId, onComplete }: CBTExamProps) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchExam = useCallback(async () => {
    try {
      const docSnap = await getDoc(doc(db, 'exams', examId));
      if (docSnap.exists()) {
        const data = docSnap.data() as Exam;
        setExam({ ...data, id: docSnap.id });
        setTimeLeft(data.duration * 60);
        
        // Create or resume session
        const sessionRef = doc(db, 'exam_sessions', `${auth.currentUser?.uid}_${examId}`);
        const sessionSnap = await getDoc(sessionRef);
        
        if (!sessionSnap.exists()) {
          await setDoc(sessionRef, {
            uid: auth.currentUser?.uid,
            examId,
            startTime: serverTimestamp(),
            status: 'ongoing',
            answers: {},
            violations: []
          });
        } else {
          const sessionData = sessionSnap.data();
          if (sessionData.status === 'completed') {
            onComplete();
            return;
          }
          setAnswers(sessionData.answers || {});
          // Calculate remaining time based on start time
          const startTime = sessionData.startTime.toDate();
          const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
          const remaining = (data.duration * 60) - elapsed;
          setTimeLeft(remaining > 0 ? remaining : 0);
        }
      }
    } catch (error) {
      console.error("Error fetching exam:", error);
    } finally {
      setLoading(false);
    }
  }, [examId, onComplete]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  // Security: Fullscreen enforcement
  const enterFullscreen = () => {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        addViolation("Keluar dari mode layar penuh");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation("Berpindah tab/aplikasi");
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'u' || e.key === 'i' || e.key === 'j')) {
        e.preventDefault();
        addViolation(`Mencoba menggunakan shortcut terlarang: ${e.key}`);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const addViolation = async (type: string) => {
    setViolations(prev => [...prev, type]);
    try {
      const sessionRef = doc(db, 'exam_sessions', `${auth.currentUser?.uid}_${examId}`);
      await updateDoc(sessionRef, {
        violations: arrayUnion({
          type,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error("Error logging violation:", error);
    }
  };

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, isSubmitting]);

  const handleAnswer = async (questionId: string, optionIdx: number) => {
    const newAnswers = { ...answers, [questionId]: optionIdx };
    setAnswers(newAnswers);
    
    try {
      const sessionRef = doc(db, 'exam_sessions', `${auth.currentUser?.uid}_${examId}`);
      await updateDoc(sessionRef, {
        answers: newAnswers
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      let score = 0;
      exam?.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) {
          score += 100 / exam.questions.length;
        }
      });

      const sessionRef = doc(db, 'exam_sessions', `${auth.currentUser?.uid}_${examId}`);
      await updateDoc(sessionRef, {
        status: 'completed',
        endTime: serverTimestamp(),
        score: Math.round(score * 100) / 100
      });

      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      onComplete();
    } catch (error) {
      console.error("Error submitting exam:", error);
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isFullscreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-6 z-[200]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white max-w-md w-full p-8 rounded-[2.5rem] text-center space-y-6 shadow-2xl"
        >
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Keamanan Ujian</h2>
            <p className="text-gray-500">
              Untuk menjaga integritas ujian, Anda harus masuk ke mode layar penuh.
              Sistem akan mendeteksi jika Anda berpindah tab atau aplikasi.
            </p>
          </div>
          <button
            onClick={enterFullscreen}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center"
          >
            <Maximize className="h-5 w-5 mr-2" />
            Masuk Mode Ujian
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = exam?.questions[currentQuestionIdx];

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gray-50 flex flex-col z-[200] select-none overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            CBT
          </div>
          <div>
            <h1 className="font-bold text-gray-900">{exam?.title}</h1>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">SMK LPPMRI 2 KEDUNGREJA</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-xl font-mono font-bold text-lg transition-colors",
            timeLeft < 300 ? "bg-red-50 text-red-600 animate-pulse" : "bg-blue-50 text-blue-600"
          )}>
            <Clock className="h-5 w-5 mr-2" />
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Selesai
          </button>
        </div>
      </header>

      <main className="flex-grow flex overflow-hidden">
        {/* Question Area */}
        <div className="flex-grow p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold">
                Pertanyaan {currentQuestionIdx + 1} dari {exam?.questions.length}
              </span>
              {violations.length > 0 && (
                <div className="flex items-center text-red-600 text-sm font-bold bg-red-50 px-3 py-1 rounded-full">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {violations.length} Pelanggaran
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
              <h2 className="text-xl text-gray-800 leading-relaxed font-medium">
                {currentQuestion?.text}
              </h2>

              <div className="space-y-4">
                {currentQuestion?.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(currentQuestion.id, idx)}
                    className={cn(
                      "w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center group",
                      answers[currentQuestion.id] === idx
                        ? "bg-blue-50 border-blue-600 ring-4 ring-blue-50"
                        : "bg-white border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                    )}
                  >
                    <span className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold mr-4 transition-all",
                      answers[currentQuestion.id] === idx
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className={cn(
                      "text-lg font-medium",
                      answers[currentQuestion.id] === idx ? "text-blue-900" : "text-gray-600"
                    )}>
                      {option}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                className="flex items-center px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Sebelumnya
              </button>
              <button
                disabled={currentQuestionIdx === (exam?.questions.length || 0) - 1}
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-30 shadow-lg shadow-blue-100"
              >
                Selanjutnya
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Sidebar */}
        <aside className="w-80 bg-white border-l border-gray-100 p-8 flex flex-col shadow-xl">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2 text-blue-600" />
            Navigasi Soal
          </h3>
          <div className="grid grid-cols-4 gap-3 flex-grow content-start overflow-y-auto pr-2">
            {exam?.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIdx(idx)}
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-all border-2",
                  currentQuestionIdx === idx
                    ? "border-blue-600 bg-blue-50 text-blue-600 scale-110 z-10 shadow-lg shadow-blue-100"
                    : answers[q.id] !== undefined
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                      : "border-gray-100 bg-gray-50 text-gray-400 hover:border-blue-200"
                )}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100">
            <div className="flex items-center text-amber-700 font-bold mb-2 text-sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Peringatan Keamanan
            </div>
            <p className="text-xs text-amber-600 leading-relaxed">
              Jangan mencoba keluar dari mode layar penuh atau berpindah tab. 
              Setiap tindakan mencurigakan akan dicatat oleh sistem.
            </p>
          </div>
        </aside>
      </main>

      {/* Confirm Submit Modal */}
      <AnimatePresence>
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-md p-8 rounded-[2.5rem] text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Selesaikan Ujian?</h3>
                <p className="text-gray-500">
                  Anda telah menjawab {Object.keys(answers).length} dari {exam?.questions.length} soal. 
                  Apakah Anda yakin ingin mengakhiri ujian ini?
                </p>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? 'Mengirim...' : 'Ya, Selesaikan Sekarang'}
                </button>
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="w-full py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all"
                >
                  Belum, Kembali ke Soal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
