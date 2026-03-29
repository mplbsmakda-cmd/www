import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Search, Edit2, Trash2, Briefcase, Calculator, Laptop, 
  Code, Settings, PenTool, Cpu, Loader2, Save, X, ChevronRight
} from 'lucide-react';
import { 
  collection, query, orderBy, getDocs, addDoc, 
  updateDoc, deleteDoc, doc, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { cn } from '../../lib/utils';

const iconMap: Record<string, any> = {
  Briefcase, Calculator, Laptop, Code, Settings, PenTool, Cpu
};

export default function MajorsManager() {
  const [majors, setMajors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMajor, setCurrentMajor] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'majors'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setMajors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching majors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      longDescription: formData.get('longDescription'),
      icon: formData.get('icon'),
      color: formData.get('color'),
      adminEmail: formData.get('adminEmail'),
      skills: (formData.get('skills') as string).split(',').map(s => s.trim()),
      prospects: (formData.get('prospects') as string).split(',').map(s => s.trim()),
      updatedAt: serverTimestamp()
    };

    try {
      if (currentMajor?.id) {
        await updateDoc(doc(db, 'majors', currentMajor.id), data);
      } else {
        await addDoc(collection(db, 'majors'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setCurrentMajor(null);
      fetchMajors();
    } catch (error) {
      console.error("Error saving major:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jurusan ini?")) return;
    try {
      await deleteDoc(doc(db, 'majors', id));
      fetchMajors();
    } catch (error) {
      console.error("Error deleting major:", error);
    }
  };

  const filteredMajors = majors.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Jurusan</h2>
          <p className="text-sm text-gray-500">Kelola program keahlian yang ditawarkan sekolah</p>
        </div>
        <button
          onClick={() => {
            setCurrentMajor(null);
            setIsEditing(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tambah Jurusan
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari jurusan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMajors.map((major) => {
            const IconComp = iconMap[major.icon] || Briefcase;
            return (
              <motion.div
                key={major.id}
                layout
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", major.color)}>
                    <IconComp className="h-7 w-7" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setCurrentMajor(major);
                        setIsEditing(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(major.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{major.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{major.description}</p>
                
                {major.adminEmail && (
                  <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Admin Jurusan</div>
                    <div className="text-xs text-blue-800 font-medium truncate">{major.adminEmail}</div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <ChevronRight className="h-3 w-3 mr-1 text-blue-500" />
                    Kompetensi Utama
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {major.skills?.slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] font-medium rounded-md border border-gray-100">
                        {skill}
                      </span>
                    ))}
                    {major.skills?.length > 3 && (
                      <span className="text-[10px] text-gray-400 font-medium">+{major.skills.length - 3} lainnya</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900">
                  {currentMajor ? 'Edit Jurusan' : 'Tambah Jurusan Baru'}
                </h3>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Nama Jurusan</label>
                    <input
                      name="title"
                      defaultValue={currentMajor?.title}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Warna (Tailwind Class)</label>
                    <input
                      name="color"
                      defaultValue={currentMajor?.color || 'bg-blue-600'}
                      placeholder="bg-blue-600"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Admin Jurusan</label>
                  <input
                    name="adminEmail"
                    type="email"
                    defaultValue={currentMajor?.adminEmail}
                    placeholder="admin@jurusan.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-[10px] text-gray-400">Email ini akan diberikan akses khusus ke panel admin jurusan ini.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Ikon</label>
                  <select
                    name="icon"
                    defaultValue={currentMajor?.icon || 'Briefcase'}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {Object.keys(iconMap).map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Deskripsi Singkat</label>
                  <textarea
                    name="description"
                    defaultValue={currentMajor?.description}
                    required
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Deskripsi Lengkap</label>
                  <textarea
                    name="longDescription"
                    defaultValue={currentMajor?.longDescription}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Kompetensi Keahlian (Pisahkan dengan koma)</label>
                  <textarea
                    name="skills"
                    defaultValue={currentMajor?.skills?.join(', ')}
                    required
                    placeholder="Skill 1, Skill 2, Skill 3"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Prospek Karir (Pisahkan dengan koma)</label>
                  <textarea
                    name="prospects"
                    defaultValue={currentMajor?.prospects?.join(', ')}
                    required
                    placeholder="Karir 1, Karir 2, Karir 3"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="pt-4 flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Batal
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

import { AnimatePresence } from 'motion/react';
