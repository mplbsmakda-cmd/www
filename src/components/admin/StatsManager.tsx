import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Loader2, Users, GraduationCap, Building2, Trophy, Save } from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const icons = [
  { name: 'Users', icon: Users },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Building2', icon: Building2 },
  { name: 'Trophy', icon: Trophy },
];

const colors = [
  { name: 'Blue', class: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Emerald', class: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Orange', class: 'text-orange-600', bg: 'bg-orange-50' },
  { name: 'Purple', class: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function StatsManager() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newStat, setNewStat] = useState({
    label: '',
    value: '',
    icon: 'Users',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    order: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const q = query(collection(db, 'stats'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      setStats(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStat.label || !newStat.value) return;

    setAdding(true);
    try {
      await addDoc(collection(db, 'stats'), {
        ...newStat,
        createdAt: serverTimestamp()
      });
      setNewStat({
        label: '',
        value: '',
        icon: 'Users',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        order: stats.length
      });
      fetchStats();
    } catch (error) {
      console.error("Error adding stat:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus statistik ini?')) return;
    try {
      await deleteDoc(doc(db, 'stats', id));
      fetchStats();
    } catch (error) {
      console.error("Error deleting stat:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-blue-600" />
          Tambah Statistik Baru
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                required
                value={newStat.label}
                onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Siswa Aktif"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nilai</label>
              <input
                type="text"
                required
                value={newStat.value}
                onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: 1,200+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ikon</label>
              <select
                value={newStat.icon}
                onChange={(e) => setNewStat({ ...newStat, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                {icons.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tema Warna</label>
              <select
                value={newStat.color}
                onChange={(e) => {
                  const selected = colors.find(c => c.class === e.target.value);
                  if (selected) {
                    setNewStat({ ...newStat, color: selected.class, bg: selected.bg });
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                {colors.map(c => <option key={c.class} value={c.class}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={adding}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {adding ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
            Tambah Statistik
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          stats.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative group text-center"
            >
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                {(() => {
                  const IconComp = icons.find(i => i.name === item.icon)?.icon || Users;
                  return <IconComp className="h-7 w-7" />;
                })()}
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{item.value}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{item.label}</div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
