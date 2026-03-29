import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, where } from 'firebase/firestore';
import { NewsItem } from '../../types';
import { Plus, Edit2, Trash2, Calendar, User, Loader2 } from 'lucide-react';
import NewsForm from './NewsForm';

export default function NewsManager({ defaultCategory }: { defaultCategory?: string }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    let q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    
    if (defaultCategory) {
      q = query(collection(db, 'news'), where('category', '==', defaultCategory), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      setNews(items);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingNews(item);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingNews(null);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Daftar Berita</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Berita
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {news.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">Belum ada berita yang diterbitkan.</p>
          </div>
        ) : (
          news.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Calendar className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{item.title}</h3>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                  </span>
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    Admin
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <NewsForm
            item={editingNews}
            onClose={() => setIsFormOpen(false)}
            defaultCategory={defaultCategory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
