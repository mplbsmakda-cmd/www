import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  School, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  LogOut,
  LayoutDashboard,
  Search
} from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { user, profile, loading } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Selamat Pagi');
    else if (hour < 15) setGreeting('Selamat Siang');
    else if (hour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');
  }, []);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'registrations'),
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRegistrations(data);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchRegistrations();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading || (user && fetching)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h2>
          <p className="text-gray-600 mb-8">Silakan login terlebih dahulu untuk mengakses dashboard siswa.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              {greeting}, {user.displayName?.split(' ')[0]}!
            </motion.h1>
            <p className="text-gray-600">Selamat datang di portal siswa SMK LPPMRI 2 KEDUNGREJA</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-28"
            >
              <div className="text-center mb-8">
                <img 
                  src={user.photoURL || ''} 
                  alt={user.displayName || ''} 
                  className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-blue-50"
                />
                <h2 className="text-xl font-bold text-gray-900">{user.displayName}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-2xl bg-gray-50">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="text-sm">
                    <div className="text-gray-500 text-xs">Email</div>
                    <div className="font-medium text-gray-900 truncate max-w-[180px]">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-2xl bg-gray-50">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="text-sm">
                    <div className="text-gray-500 text-xs">Bergabung Sejak</div>
                    <div className="font-medium text-gray-900">
                      {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Tautan Cepat</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => navigate('/registration')}
                    className="p-3 rounded-2xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-all text-center"
                  >
                    Daftar PPDB
                  </button>
                  <button 
                    onClick={() => navigate('/news')}
                    className="p-3 rounded-2xl bg-purple-50 text-purple-600 text-xs font-bold hover:bg-purple-100 transition-all text-center"
                  >
                    Berita Sekolah
                  </button>
                  <button 
                    onClick={() => navigate('/majors')}
                    className="p-3 rounded-2xl bg-green-50 text-green-600 text-xs font-bold hover:bg-green-100 transition-all text-center"
                  >
                    Info Jurusan
                  </button>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="p-3 rounded-2xl bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100 transition-all text-center"
                  >
                    Hubungi Kami
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Registration Status */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <LayoutDashboard className="h-6 w-6 text-blue-600 mr-3" />
                  Status Pendaftaran
                </h2>
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  {registrations.length} Pendaftaran
                </span>
              </div>

              {registrations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-6">Anda belum memiliki riwayat pendaftaran.</p>
                  <button 
                    onClick={() => navigate('/registration')}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Daftar Sekarang
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {registrations.map((reg) => (
                    <div 
                      key={reg.id}
                      className="p-6 rounded-3xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 mr-4">
                            <School className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{reg.major}</h3>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                            </p>
                          </div>
                        </div>
                        <div className={cn(
                          "px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center",
                          reg.status === 'pending' ? "bg-amber-50 text-amber-600" :
                          reg.status === 'reviewed' ? "bg-blue-50 text-blue-600" :
                          reg.status === 'accepted' ? "bg-emerald-50 text-emerald-600" :
                          "bg-red-50 text-red-600"
                        )}>
                          {reg.status === 'pending' && <Clock className="h-4 w-4 mr-2" />}
                          {reg.status === 'reviewed' && <Search className="h-4 w-4 mr-2" />}
                          {reg.status === 'accepted' && <CheckCircle className="h-4 w-4 mr-2" />}
                          {reg.status === 'rejected' && <AlertCircle className="h-4 w-4 mr-2" />}
                          {reg.status === 'pending' ? 'Menunggu Verifikasi' :
                           reg.status === 'reviewed' ? 'Ditinjau' :
                           reg.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium mr-2">Nama:</span> {reg.fullName}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium mr-2">Telepon:</span> {reg.phone}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <School className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium mr-2">Sekolah Asal:</span> {reg.previousSchool}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium mr-2 truncate">Alamat:</span> {reg.address}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Next Steps Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-200 text-white"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <AlertCircle className="h-6 w-6 mr-3" />
                Langkah Selanjutnya
              </h2>
              <p className="text-blue-100 mb-6 text-sm leading-relaxed">
                Setelah mendaftar, tim panitia PPDB akan memverifikasi data Anda. 
                Pastikan nomor WhatsApp Anda aktif untuk menerima informasi jadwal tes dan wawancara.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-2.5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all text-sm">
                  Hubungi Panitia
                </button>
                <button className="px-6 py-2.5 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition-all text-sm">
                  Unduh Panduan
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
