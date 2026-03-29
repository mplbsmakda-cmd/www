import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Loader2, Building2, Laptop, BookOpen, Microscope, Coffee, Music } from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const icons = [
  { name: 'Building2', icon: Building2 },
  { name: 'Laptop', icon: Laptop },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Microscope', icon: Microscope },
  { name: 'Coffee', icon: Coffee },
  { name: 'Music', icon: Music },
];

export default function FacilitiesManager() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newFacility, setNewFacility] = useState({
    title: '',
    description: '',
    icon: 'Building2'
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const q = query(collection(db, 'facilities'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setFacilities(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching facilities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacility.title || !newFacility.description) return;

    setAdding(true);
    try {
      await addDoc(collection(db, 'facilities'), {
        ...newFacility,
        createdAt: serverTimestamp()
      });
      setNewFacility({ title: '', description: '', icon: 'Building2' });
      fetchFacilities();
    } catch (error) {
      console.error("Error adding facility:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus fasilitas ini?')) return;
    try {
      await deleteDoc(doc(db, 'facilities', id));
      fetchFacilities();
    } catch (error) {
      console.error("Error deleting facility:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-blue-600" />
          Tambah Fasilitas Baru
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Fasilitas</label>
              <input
                type="text"
                required
                value={newFacility.title}
                onChange={(e) => setNewFacility({ ...newFacility, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Laboratorium Komputer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ikon</label>
              <div className="flex gap-2 p-1 bg-gray-50 rounded-lg border border-gray-200">
                {icons.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setNewFacility({ ...newFacility, icon: item.name })}
                    className={`p-2 rounded-md transition-colors ${
                      newFacility.icon === item.name ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Fasilitas</label>
            <textarea
              required
              rows={2}
              value={newFacility.description}
              onChange={(e) => setNewFacility({ ...newFacility, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Jelaskan secara singkat tentang fasilitas ini..."
            />
          </div>
          <button
            type="submit"
            disabled={adding}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {adding ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
            Tambah Fasilitas
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          facilities.map((item) => (
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
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                {icons.find(i => i.name === item.icon)?.icon ? (
                  (() => {
                    const IconComp = icons.find(i => i.name === item.icon)!.icon;
                    return <IconComp className="h-5 w-5" />;
                  })()
                ) : <Building2 className="h-5 w-5" />}
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
