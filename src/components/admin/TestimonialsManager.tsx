import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Loader2, Quote, User } from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    content: '',
    avatar: ''
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.content) return;

    setAdding(true);
    try {
      await addDoc(collection(db, 'testimonials'), {
        ...newTestimonial,
        createdAt: serverTimestamp()
      });
      setNewTestimonial({ name: '', role: '', content: '', avatar: '' });
      fetchTestimonials();
    } catch (error) {
      console.error("Error adding testimonial:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-blue-600" />
          Tambah Testimoni Baru
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                type="text"
                required
                value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nama Lengkap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan / Peran</label>
              <input
                type="text"
                required
                value={newTestimonial.role}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Alumni TKJ 2022"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Testimoni</label>
            <textarea
              required
              rows={3}
              value={newTestimonial.content}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Apa kata mereka tentang sekolah..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Foto (Opsional)</label>
            <input
              type="text"
              value={newTestimonial.avatar}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, avatar: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            disabled={adding}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {adding ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
            Tambah Testimoni
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          testimonials.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative group"
            >
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <User className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-6 w-6 text-gray-100 -z-10" />
                <p className="text-sm text-gray-600 italic leading-relaxed">"{item.content}"</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
