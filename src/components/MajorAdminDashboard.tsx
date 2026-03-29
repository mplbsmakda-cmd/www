import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { 
  Newspaper, MessageSquare, Loader2, LayoutDashboard, 
  Image as ImageIcon, Briefcase, BarChart3, Settings, LogOut,
  Users, Search, Mail, Phone, CheckCircle, Clock, XCircle
} from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import NewsManager from './admin/NewsManager';
import GalleryManager from './admin/GalleryManager';
import { cn } from '../lib/utils';

export default function MajorAdminDashboard() {
  const { isMajorAdmin, majorId, loading } = useAuth();
  const [major, setMajor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'gallery' | 'students'>('overview');
  const [stats, setStats] = useState({ newsCount: 0, galleryCount: 0, studentCount: 0 });
  const [students, setStudents] = useState<any[]>([]);
  const [fetchingStudents, setFetchingStudents] = useState(false);

  useEffect(() => {
    const fetchMajorData = async () => {
      if (!majorId) return;
      try {
        const majorDoc = await getDoc(doc(db, 'majors', majorId));
        if (majorDoc.exists()) {
          const majorData = majorDoc.data();
          setMajor({ id: majorDoc.id, ...majorData });

          const newsSnap = await getDocs(query(collection(db, 'news'), where('category', '==', majorData.title)));
          const gallerySnap = await getDocs(query(collection(db, 'gallery'), where('category', '==', majorData.title)));
          const studentsSnap = await getDocs(query(collection(db, 'registrations'), where('major', '==', majorData.title)));
          
          setStats({
            newsCount: newsSnap.size,
            galleryCount: gallerySnap.size,
            studentCount: studentsSnap.size
          });
          setStudents(studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error("Error fetching major admin data:", error);
      }
    };

    if (isMajorAdmin && majorId) fetchMajorData();
  }, [isMajorAdmin, majorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isMajorAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => signOut(auth);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 mb-1">
              <Briefcase className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Panel Admin Jurusan</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{major?.title || 'Memuat...'}</h1>
            <p className="text-gray-600">Kelola konten khusus untuk program keahlian Anda</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-bold text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </button>
        </div>

        <div className="flex space-x-4 mb-8 border-b border-gray-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "pb-4 px-4 text-sm font-bold transition-all relative whitespace-nowrap",
              activeTab === 'overview' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Ringkasan</span>
            </div>
            {activeTab === 'overview' && (
              <motion.div layoutId="majorAdminTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={cn(
              "pb-4 px-4 text-sm font-bold transition-all relative whitespace-nowrap",
              activeTab === 'news' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <Newspaper className="h-4 w-4" />
              <span>Berita Jurusan</span>
            </div>
            {activeTab === 'news' && (
              <motion.div layoutId="majorAdminTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={cn(
              "pb-4 px-4 text-sm font-bold transition-all relative whitespace-nowrap",
              activeTab === 'gallery' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span>Galeri Kegiatan</span>
            </div>
            {activeTab === 'gallery' && (
              <motion.div layoutId="majorAdminTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={cn(
              "pb-4 px-4 text-sm font-bold transition-all relative whitespace-nowrap",
              activeTab === 'students' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Siswa & Pendaftar</span>
            </div>
            {activeTab === 'students' && (
              <motion.div layoutId="majorAdminTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4">
                    <Newspaper className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.newsCount}</div>
                  <div className="text-sm text-gray-500 font-medium">Berita Terbit</div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit mb-4">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.galleryCount}</div>
                  <div className="text-sm text-gray-500 font-medium">Foto Galeri</div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.studentCount}</div>
                  <div className="text-sm text-gray-500 font-medium">Total Siswa/Pendaftar</div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <div className="p-3 bg-green-50 text-green-600 rounded-2xl w-fit mb-4">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">Aktif</div>
                  <div className="text-sm text-gray-500 font-medium">Status Portal</div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Informasi Jurusan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Program</div>
                      <div className="text-lg font-bold text-gray-900">{major?.title}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Deskripsi</div>
                      <div className="text-sm text-gray-600 leading-relaxed">{major?.description}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Warna Identitas</div>
                      <div className="flex items-center space-x-2">
                        <div className={cn("w-6 h-6 rounded-full", major?.color)}></div>
                        <span className="text-sm font-mono text-gray-600">{major?.color}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Sebagai Admin Jurusan, Anda bertanggung jawab untuk memperbarui berita dan galeri yang berkaitan langsung dengan program keahlian ini.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
            >
              <NewsManager defaultCategory={major?.title} />
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
            >
              <GalleryManager defaultCategory={major?.title} />
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-gray-900">Daftar Siswa & Pendaftar</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Cari nama..." 
                      className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Lengkap</th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Kontak</th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal Daftar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4">
                            <div className="font-bold text-gray-900">{student.fullName}</div>
                            <div className="text-xs text-gray-500">{student.previousSchool}</div>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center text-xs text-gray-600">
                                <Mail className="h-3 w-3 mr-1" />
                                {student.email}
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <Phone className="h-3 w-3 mr-1" />
                                {student.phone}
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              student.status === 'accepted' ? "bg-emerald-100 text-emerald-700" :
                              student.status === 'pending' ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            )}>
                              {student.status === 'accepted' ? 'Diterima' : 
                               student.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-500">
                            {student.createdAt?.toDate ? student.createdAt.toDate().toLocaleDateString('id-ID') : '-'}
                          </td>
                        </tr>
                      ))}
                      {students.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-gray-500 font-medium">
                            Belum ada pendaftar untuk jurusan ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
