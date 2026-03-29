import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Trophy, 
  Trash2, 
  Plus, 
  Loader2, 
  CheckCircle2,
  XCircle,
  Type,
  AlignLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExtraItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function ExtracurricularsManager() {
  const [extras, setExtras] = useState<ExtraItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newExtra, setNewExtra] = useState({ title: '', description: '', icon: 'Trophy' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchExtras();
  }, []);

  const fetchExtras = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'extracurriculars'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExtraItem));
      setExtras(data);
    } catch (error) {
      console.error("Error fetching extras:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    try {
      const docRef = await addDoc(collection(db, 'extracurriculars'), {
        ...newExtra,
        createdAt: serverTimestamp()
      });
      setExtras(prev => [{ id: docRef.id, ...newExtra }, ...prev]);
      setNewExtra({ title: '', description: '', icon: 'Trophy' });
      setIsAdding(false);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error("Error adding extra:", error);
      setStatus('error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus ekstrakurikuler ini?")) return;
    try {
      await deleteDoc(doc(db, 'extracurriculars', id));
      setExtras(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting extra:", error);
    }
  };

  const icons = ['Trophy', 'Music', 'Camera', 'Code', 'Heart', 'Users', 'Zap', 'Globe'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Trophy className="h-6 w-6 text-blue-600 mr-2" />
          Kelola Ekstrakurikuler
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tambah Ekskul
        </button>
      </div>

      {status === 'success' && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          Ekstrakurikuler berhasil ditambahkan!
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {extras.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm group relative">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-6 right-6 p-2 text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hapus"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          {extras.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 italic">
              Belum ada ekstrakurikuler yang ditambahkan.
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900">Tambah Ekskul Baru</h3>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nama Ekstrakurikuler</label>
                  <input
                    type="text"
                    required
                    value={newExtra.title}
                    onChange={(e) => setNewExtra({ ...newExtra, title: e.target.value })}
                    placeholder="Contoh: Pramuka"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    required
                    rows={3}
                    value={newExtra.description}
                    onChange={(e) => setNewExtra({ ...newExtra, description: e.target.value })}
                    placeholder="Jelaskan kegiatan ekskul ini..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none resize-none"
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Simpan Ekskul
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
