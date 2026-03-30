import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

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
  startTime: any;
  endTime: any;
  questions: Question[];
  createdAt: any;
}

export default function ExamManager() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExam, setCurrentExam] = useState<Partial<Exam>>({
    title: '',
    description: '',
    duration: 60,
    questions: []
  });
  const [activeExamId, setActiveExamId] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const q = query(collection(db, 'exams'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setExams(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam)));
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExam = async () => {
    if (!currentExam.title || !currentExam.startTime || !currentExam.endTime) {
      alert("Mohon lengkapi data ujian.");
      return;
    }

    try {
      if (currentExam.id) {
        await updateDoc(doc(db, 'exams', currentExam.id), {
          ...currentExam,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'exams'), {
          ...currentExam,
          createdAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setCurrentExam({ title: '', description: '', duration: 60, questions: [] });
      fetchExams();
    } catch (error) {
      console.error("Error saving exam:", error);
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (!confirm("Hapus ujian ini?")) return;
    try {
      await deleteDoc(doc(db, 'exams', id));
      fetchExams();
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setCurrentExam(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  const updateQuestion = (qId: string, updates: Partial<Question>) => {
    setCurrentExam(prev => ({
      ...prev,
      questions: prev.questions?.map(q => q.id === qId ? { ...q, ...updates } : q)
    }));
  };

  const removeQuestion = (qId: string) => {
    setCurrentExam(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== qId)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen CBT</h2>
          <p className="text-gray-500">Kelola ujian berbasis komputer dan bank soal.</p>
        </div>
        <button
          onClick={() => {
            setCurrentExam({ title: '', description: '', duration: 60, questions: [] });
            setIsEditing(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Buat Ujian Baru
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Monitor className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{exam.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {exam.duration} Menit
                    </span>
                    <span className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      {exam.questions?.length || 0} Soal
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setCurrentExam(exam);
                    setIsEditing(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveExamId(activeExamId === exam.id ? null : exam.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  {activeExamId === exam.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {activeExamId === exam.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-t border-gray-50 bg-gray-50/50 overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">Waktu Mulai</div>
                        <div className="text-sm font-medium text-gray-900">{new Date(exam.startTime).toLocaleString('id-ID')}</div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">Waktu Selesai</div>
                        <div className="text-sm font-medium text-gray-900">{new Date(exam.endTime).toLocaleString('id-ID')}</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100">
                      <div className="text-xs font-bold text-gray-400 uppercase mb-2">Deskripsi</div>
                      <p className="text-sm text-gray-600">{exam.description || 'Tidak ada deskripsi.'}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {exams.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <Monitor className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada ujian yang dibuat.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {currentExam.id ? 'Edit Ujian' : 'Buat Ujian Baru'}
                </h3>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-grow space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Judul Ujian</label>
                      <input
                        type="text"
                        value={currentExam.title}
                        onChange={(e) => setCurrentExam(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Contoh: Ujian Seleksi Masuk 2026"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Durasi (Menit)</label>
                      <input
                        type="number"
                        value={currentExam.duration}
                        onChange={(e) => setCurrentExam(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Waktu Mulai</label>
                      <input
                        type="datetime-local"
                        value={currentExam.startTime || ''}
                        onChange={(e) => setCurrentExam(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Waktu Selesai</label>
                      <input
                        type="datetime-local"
                        value={currentExam.endTime || ''}
                        onChange={(e) => setCurrentExam(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    value={currentExam.description}
                    onChange={(e) => setCurrentExam(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Petunjuk pengerjaan ujian..."
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-900">Daftar Soal</h4>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all text-sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Soal
                    </button>
                  </div>

                  <div className="space-y-6">
                    {currentExam.questions?.map((q, qIdx) => (
                      <div key={q.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-4 relative">
                        <button
                          onClick={() => removeQuestion(q.id)}
                          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                            {qIdx + 1}
                          </span>
                          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pertanyaan</span>
                        </div>
                        <textarea
                          value={q.text}
                          onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                          placeholder="Tuliskan pertanyaan di sini..."
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={() => updateQuestion(q.id, { correctAnswer: oIdx })}
                                className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all",
                                  q.correctAnswer === oIdx 
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                                    : "bg-white text-gray-400 border border-gray-200 hover:border-emerald-200"
                                )}
                              >
                                {String.fromCharCode(65 + oIdx)}
                              </button>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const newOpts = [...q.options];
                                  newOpts[oIdx] = e.target.value;
                                  updateQuestion(q.id, { options: newOpts });
                                }}
                                className="flex-grow px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                placeholder={`Pilihan ${String.fromCharCode(65 + oIdx)}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveExam}
                  className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Ujian
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
