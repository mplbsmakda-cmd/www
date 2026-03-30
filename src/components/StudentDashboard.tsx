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
  Search,
  Plus
} from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import CBTList from './CBTList';

export default function StudentDashboard() {
  const { user, profile, loading } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [realGrades, setRealGrades] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'grades' | 'documents' | 'cbt'>('dashboard');
  const [fetching, setFetching] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [documents, setDocuments] = useState([
    { name: 'Ijazah SMP', status: 'pending', type: 'PDF/JPG' },
    { name: 'Kartu Keluarga', status: 'uploaded', type: 'PDF/JPG' },
    { name: 'Akte Kelahiran', status: 'pending', type: 'PDF/JPG' },
    { name: 'Pas Foto 3x4', status: 'uploaded', type: 'JPG' },
  ]);
  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 100
  });
  const [finances, setFinances] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleUpload = (idx: number) => {
    const newDocs = [...documents];
    newDocs[idx].status = 'uploaded';
    setDocuments(newDocs);
  };

  const mockSchedule: any[] = [];

  const mockGrades = [
    { subject: 'Matematika', score: 85, status: 'Lulus' },
    { subject: 'Bahasa Indonesia', score: 90, status: 'Lulus' },
    { subject: 'Bahasa Inggris', score: 78, status: 'Lulus' },
    { subject: 'Produktif Kejuruan', score: 95, status: 'Lulus' },
  ];

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
        })) as any[];
        setRegistrations(data);

        // Fetch grades for these registrations
        const gradesData: any[] = [];
        for (const reg of data) {
          const gradeDoc = await getDoc(doc(db, 'grades', reg.id));
          if (gradeDoc.exists()) {
            gradesData.push({
              regId: reg.id,
              major: reg.major,
              ...gradeDoc.data()
            });
          }
        }
        setRealGrades(gradesData);
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

          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={cn(
                  "pb-4 px-4 text-sm font-bold transition-all relative",
                  activeTab === 'dashboard' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Dashboard
                {activeTab === 'dashboard' && <motion.div layoutId="studentTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('schedule')}
                className={cn(
                  "pb-4 px-4 text-sm font-bold transition-all relative",
                  activeTab === 'schedule' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Jadwal Saya
                {activeTab === 'schedule' && <motion.div layoutId="studentTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('grades')}
                className={cn(
                  "pb-4 px-4 text-sm font-bold transition-all relative",
                  activeTab === 'grades' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Nilai Saya
                {activeTab === 'grades' && <motion.div layoutId="studentTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('cbt')}
                className={cn(
                  "pb-4 px-4 text-sm font-bold transition-all relative",
                  activeTab === 'cbt' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Ujian (CBT)
                {activeTab === 'cbt' && <motion.div layoutId="studentTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('documents')}
                className={cn(
                  "pb-4 px-4 text-sm font-bold transition-all relative",
                  activeTab === 'documents' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Dokumen
                {activeTab === 'documents' && <motion.div layoutId="studentTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
              </button>
            </div>

            {activeTab === 'dashboard' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kehadiran</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{Math.round((attendance.present / attendance.total) * 100)}%</div>
                    <div className="text-xs text-gray-500 font-medium">Tingkat Kehadiran</div>
                    <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(attendance.present / attendance.total) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Akademik</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">87.0</div>
                    <div className="text-xs text-gray-500 font-medium">Rata-rata Nilai</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Keuangan</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">Lancar</div>
                    <div className="text-xs text-gray-500 font-medium">Status Pembayaran</div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
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
                </div>

                {/* Next Steps Card */}
                <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-200 text-white">
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
                </div>

                {/* Finance Card */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-3" />
                    Riwayat Pembayaran (SPP)
                  </h2>
                  <div className="space-y-4">
                    {finances.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <div className="font-bold text-gray-900">{f.name}</div>
                          <div className="text-xs text-gray-500">{f.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{f.amount}</div>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                            f.status === 'paid' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          )}>
                            {f.status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                    Jadwal Pelajaran
                  </h2>
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    Semester Ganjil
                  </span>
                </div>
                <div className="space-y-6">
                  {mockSchedule.map((day) => (
                    <div key={day.day} className="space-y-4">
                      <h3 className="font-bold text-lg text-gray-900 border-l-4 border-blue-600 pl-4">{day.day}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {day.subjects.map((sub, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="text-blue-600 font-bold text-sm mb-1">{sub.time}</div>
                            <div className="font-bold text-gray-900">{sub.name}</div>
                            <div className="text-xs text-gray-500 flex items-center mt-2">
                              <MapPin className="h-3 w-3 mr-1" />
                              {sub.room}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'grades' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {realGrades.length > 0 ? (
                  realGrades.map((grade, gIdx) => (
                    <div key={gIdx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                          <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                          Nilai Seleksi - {grade.major}
                        </h2>
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                          Rata-rata: {grade.average?.toFixed(2)}
                        </span>
                      </div>
                      <div className="overflow-hidden rounded-2xl border border-gray-100">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nilai</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {[
                              { subject: 'Matematika', score: grade.math },
                              { subject: 'Bahasa Indonesia', score: grade.indonesian },
                              { subject: 'Bahasa Inggris', score: grade.english },
                              { subject: 'IPA', score: grade.science },
                            ].map((item, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition-all">
                                <td className="px-6 py-4 font-medium text-gray-900">{item.subject}</td>
                                <td className="px-6 py-4">
                                  <span className={cn(
                                    "px-3 py-1 rounded-full text-sm font-bold",
                                    item.score >= 75 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                  )}>
                                    {item.score}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <span className={cn(
                                    "text-sm font-bold flex items-center justify-end",
                                    item.score >= 75 ? "text-emerald-600" : "text-amber-600"
                                  )}>
                                    {item.score >= 75 ? <CheckCircle className="h-4 w-4 mr-1" /> : <AlertCircle className="h-4 w-4 mr-1" />}
                                    {item.score >= 75 ? 'Lulus' : 'Di Bawah KKM'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Nilai</h3>
                    <p className="text-gray-500">Nilai seleksi Anda belum diinput oleh panitia. Silakan cek kembali nanti.</p>
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === 'cbt' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CBTList />
              </motion.div>
            )}
            {activeTab === 'documents' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Persyaratan Dokumen</h3>
                  <div className="space-y-4">
                    {documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            doc.status === 'uploaded' ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                          )}>
                            {doc.status === 'uploaded' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{doc.name}</div>
                            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{doc.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            doc.status === 'uploaded' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                          )}>
                            {doc.status === 'uploaded' ? 'Terunggah' : 'Belum Ada'}
                          </span>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
