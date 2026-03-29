import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { 
  Newspaper, MessageSquare, Loader2, LayoutDashboard, 
  Image as ImageIcon, Briefcase, BarChart3, Settings, LogOut 
} from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import NewsManager from './admin/NewsManager';
import GalleryManager from './admin/GalleryManager';
import { cn } from '../lib/utils';

export default function MajorAdminDashboard() {
  const { isMajorAdmin, majorId, loading } = useAuth();
  const [major, setMajor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'gallery' | 'settings'>('overview');
  const [stats, setStats] = useState({ newsCount: 0, galleryCount: 0 });

  useEffect(() => {
    const fetchMajorData = async () => {
      if (!majorId) return;
      try {
        const majorDoc = await getDoc(doc(db, 'majors', majorId));
        if (majorDoc.exists()) {
          setMajor({ id: majorDoc.id, ...majorDoc.data() });
        }

        const newsSnap = await getDocs(query(collection(db, 'news'), where('category', '==', majorDoc.data()?.title)));
        const gallerySnap = await getDocs(query(collection(db, 'gallery'), where('category', '==', majorDoc.data()?.title)));
        
        setStats({
          newsCount: newsSnap.size,
          galleryCount: gallerySnap.size
        });
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </AnimatePresence>
      </div>
    </div>
  );
}
