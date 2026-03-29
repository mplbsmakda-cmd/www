import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import { db, auth } from '../../firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { NewsItem } from '../../types';
import { cn } from '../../lib/utils';

interface NewsFormProps {
  item: NewsItem | null;
  onClose: () => void;
  defaultCategory?: string;
}

export default function NewsForm({ item, onClose, defaultCategory }: NewsFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    category: defaultCategory || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        content: item.content,
        imageUrl: item.imageUrl || '',
        category: item.category || defaultCategory || '',
      });
    }
  }, [item, defaultCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const newsData = {
        ...formData,
        authorUid: auth.currentUser.uid,
        createdAt: item ? item.createdAt : new Date().toISOString(),
      };

      if (item) {
        await updateDoc(doc(db, 'news', item.id), newsData);
      } else {
        await addDoc(collection(db, 'news'), newsData);
      }
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? 'Edit Berita' : 'Tambah Berita Baru'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Judul Berita</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Masukkan judul berita"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">URL Gambar (Opsional)</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Kategori / Jurusan</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              readOnly={!!defaultCategory}
              className={cn(
                "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                defaultCategory && "bg-gray-50 text-gray-500 cursor-not-allowed"
              )}
              placeholder="e.g. Umum, TJKT, MPLB"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Konten Berita</label>
            <textarea
              required
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Tuliskan isi berita di sini..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {item ? 'Simpan Perubahan' : 'Terbitkan Berita'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
