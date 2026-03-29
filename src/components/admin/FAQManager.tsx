import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  HelpCircle, 
  Trash2, 
  Plus, 
  Loader2, 
  CheckCircle2,
  XCircle,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  id: string;
  q: string;
  a: string;
}

export default function FAQManager() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'faqs'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQItem));
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    try {
      const docRef = await addDoc(collection(db, 'faqs'), {
        ...newFaq,
        createdAt: serverTimestamp()
      });
      setFaqs(prev => [{ id: docRef.id, ...newFaq }, ...prev]);
      setNewFaq({ q: '', a: '' });
      setIsAdding(false);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error("Error adding FAQ:", error);
      setStatus('error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pertanyaan ini?")) return;
    try {
      await deleteDoc(doc(db, 'faqs', id));
      setFaqs(prev => prev.filter(faq => faq.id !== id));
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <HelpCircle className="h-6 w-6 text-blue-600 mr-2" />
          Kelola FAQ
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tambah FAQ
        </button>
      </div>

      {status === 'success' && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          FAQ berhasil ditambahkan!
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm group relative">
              <div className="flex justify-between items-start pr-12">
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 text-lg">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(faq.id)}
                className="absolute top-6 right-6 p-2 text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hapus"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          {faqs.length === 0 && (
            <div className="text-center py-12 text-gray-500 italic">
              Belum ada FAQ yang ditambahkan.
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
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900">Tambah FAQ Baru</h3>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Pertanyaan</label>
                  <input
                    type="text"
                    required
                    value={newFaq.q}
                    onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                    placeholder="Contoh: Kapan pendaftaran dibuka?"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Jawaban</label>
                  <textarea
                    required
                    rows={4}
                    value={newFaq.a}
                    onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                    placeholder="Tuliskan jawaban di sini..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none resize-none"
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Simpan FAQ
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
