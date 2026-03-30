import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { 
  Monitor, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Lock,
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import CBTExam from './CBTExam';

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  startTime: string;
  endTime: string;
  questions: any[];
}

interface Session {
  status: 'ongoing' | 'completed';
  score?: number;
  endTime?: any;
}

export default function CBTList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<Record<string, Session>>({});
  const [loading, setLoading] = useState(true);
  const [activeExamId, setActiveExamId] = useState<string | null>(null);

  useEffect(() => {
    fetchExamsAndSessions();
  }, []);

  const fetchExamsAndSessions = async () => {
    try {
      const now = new Date().toISOString();
      const examsSnap = await getDocs(collection(db, 'exams'));
      const examsData = examsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));
      setExams(examsData);

      const sessionsData: Record<string, Session> = {};
      for (const exam of examsData) {
        const sessionSnap = await getDoc(doc(db, 'exam_sessions', `${auth.currentUser?.uid}_${exam.id}`));
        if (sessionSnap.exists()) {
          sessionsData[exam.id] = sessionSnap.data() as Session;
        }
      }
      setSessions(sessionsData);
    } catch (error) {
      console.error("Error fetching exams/sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const isExamAvailable = (exam: Exam) => {
    const now = new Date();
    const start = new Date(exam.startTime);
    const end = new Date(exam.endTime);
    return now >= start && now <= end;
  };

  if (activeExamId) {
    return (
      <CBTExam 
        examId={activeExamId} 
        onComplete={() => {
          setActiveExamId(null);
          fetchExamsAndSessions();
        }} 
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Ujian Online (CBT)</h2>
          <p className="text-gray-500 mt-1">Daftar ujian yang tersedia untuk Anda.</p>
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl flex items-center text-sm font-bold">
          <ShieldCheck className="h-4 w-4 mr-2" />
          Sistem Terproteksi
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => {
          const session = sessions[exam.id];
          const available = isExamAvailable(exam);
          const completed = session?.status === 'completed';
          const ongoing = session?.status === 'ongoing';

          return (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-white rounded-[2.5rem] border p-8 transition-all flex flex-col h-full",
                completed ? "border-emerald-100 bg-emerald-50/20" : "border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={cn(
                  "p-4 rounded-2xl",
                  completed ? "bg-emerald-100 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>
                  <Monitor className="h-6 w-6" />
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                  completed ? "bg-emerald-100 text-emerald-600" : 
                  available ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                )}>
                  {completed ? 'Selesai' : available ? 'Tersedia' : 'Belum Dibuka'}
                </div>
              </div>

              <div className="flex-grow space-y-4">
                <h3 className="text-xl font-bold text-gray-900">{exam.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{exam.description}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Durasi</div>
                    <div className="flex items-center text-sm font-bold text-gray-700">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      {exam.duration} Menit
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Jadwal</div>
                    <div className="flex items-center text-sm font-bold text-gray-700">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      {new Date(exam.startTime).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50">
                {completed ? (
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Skor Anda</div>
                      <div className="text-2xl font-black text-emerald-600">{session.score}</div>
                    </div>
                    <div className="flex items-center text-emerald-600 font-bold text-sm">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Terverifikasi
                    </div>
                  </div>
                ) : available ? (
                  <button
                    onClick={() => setActiveExamId(exam.id)}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-100 group"
                  >
                    <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    {ongoing ? 'Lanjutkan Ujian' : 'Mulai Ujian'}
                  </button>
                ) : (
                  <div className="flex items-center justify-center py-4 bg-gray-50 rounded-2xl text-gray-400 font-bold text-sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Belum Tersedia
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {exams.length === 0 && (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <Monitor className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada jadwal ujian untuk Anda.</p>
          </div>
        )}
      </div>

      <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Panduan Keamanan CBT</h3>
            <p className="text-blue-100 max-w-xl">
              Pastikan koneksi internet stabil. Dilarang keras keluar dari mode layar penuh atau berpindah tab selama ujian berlangsung. 
              Sistem kami akan mendeteksi dan mencatat setiap pelanggaran secara otomatis.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl flex items-center">
              <ShieldCheck className="h-8 w-8 mr-3" />
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase opacity-60">Status Sistem</div>
                <div className="text-sm font-bold">Aktif & Aman</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
}
