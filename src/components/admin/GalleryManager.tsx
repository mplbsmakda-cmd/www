import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Loader2, 
  CheckCircle2,
  XCircle,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
}

export default function GalleryManager({ defaultCategory }: { defaultCategory?: string }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newImage, setNewImage] = useState({ url: '', title: '', category: defaultCategory || 'Fasilitas' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchImages();
  }, [defaultCategory]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'gallery'));
      if (defaultCategory) {
        q = query(collection(db, 'gallery'), where('category', '==', defaultCategory));
      }
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
      setImages(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    try {
      const docRef = await addDoc(collection(db, 'gallery'), {
        ...newImage,
        createdAt: serverTimestamp()
      });
      setImages(prev => [{ id: docRef.id, ...newImage }, ...prev]);
      setNewImage({ url: '', title: '', category: 'Fasilitas' });
      setIsAdding(false);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error("Error adding image:", error);
      setStatus('error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus gambar ini dari galeri?")) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const categories = ['Fasilitas', 'Akademik', 'Ekstrakurikuler', 'Kegiatan', 'Prestasi'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <ImageIcon className="h-6 w-6 text-blue-600 mr-2" />
          Kelola Galeri
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tambah Gambar
        </button>
      </div>

      {status === 'success' && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          Gambar berhasil ditambahkan ke galeri!
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group relative">
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-48 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-4">
                <div className="flex items-center text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                  <Tag className="h-3 w-3 mr-1" />
                  {img.category}
                </div>
                <h3 className="font-bold text-gray-900 truncate">{img.title}</h3>
              </div>
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
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
                <h3 className="text-xl font-bold text-gray-900">Tambah Gambar Baru</h3>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">URL Gambar</label>
                  <input
                    type="url"
                    required
                    value={newImage.url}
                    onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Judul Gambar</label>
                  <input
                    type="text"
                    required
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    placeholder="Contoh: Gedung Utama"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                  <select
                    value={newImage.category}
                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Tambah ke Galeri
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
