import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  School, 
  BookOpen,
  Calendar,
  Users,
  LogIn
} from 'lucide-react';
import { db, auth, googleProvider } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

export default function Registration() {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'Laki-laki',
    address: '',
    previousSchool: '',
    major: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, 'users', result.user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: result.user.email === 'mplbsmakda@gmail.com' ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const majors = [
    'Manajemen Perkantoran dan Layanan Bisnis (MPLB)',
    'Akuntansi dan Keuangan Lembaga (AKL)',
    'Teknik Jaringan Komputer dan Telekomunikasi (TJKT)',
  ];

  const requirements = [
    'Fotokopi Ijazah SMP/MTs dilegalisir (2 lembar)',
    'Fotokopi SKHUN dilegalisir (2 lembar)',
    'Fotokopi Akta Kelahiran (2 lembar)',
    'Fotokopi Kartu Keluarga (2 lembar)',
    'Pas Foto 3x4 (4 lembar)',
    'Fotokopi KIP/KPS/PKH (jika ada)',
  ];

  const documents = [
    { name: 'Brosur PPDB 2026', size: '1.2 MB', link: '#' },
    { name: 'Formulir Pendaftaran (Offline)', size: '450 KB', link: '#' },
    { name: 'Panduan Pendaftaran Online', size: '850 KB', link: '#' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'registrations'), {
        ...formData,
        uid: user?.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'Laki-laki',
        address: '',
        previousSchool: '',
        major: '',
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError('Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Pendaftaran Siswa Baru (PPDB)
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Selamat datang di portal pendaftaran SMK LPPMRI 2 KEDUNGREJA. 
            Silakan lengkapi formulir di bawah ini untuk bergabung bersama kami.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Info & Downloads */}
          <div className="lg:col-span-1 space-y-8">
            {/* Requirements */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                Persyaratan
              </h2>
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Downloads */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Download className="h-6 w-6 text-blue-600 mr-2" />
                Unduhan Dokumen
              </h2>
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <a 
                    key={index}
                    href={doc.link}
                    className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-xl text-blue-600 mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.size}</div>
                      </div>
                    </div>
                    <Download className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Form or Login Prompt */}
          <div className="lg:col-span-2">
            {!user ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center"
              >
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LogIn className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Diperlukan</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Untuk melakukan pendaftaran online, Anda harus masuk menggunakan akun Google terlebih dahulu. 
                  Ini membantu kami memverifikasi identitas Anda dan memudahkan pelacakan status pendaftaran.
                </p>
                <button 
                  onClick={handleLogin}
                  className="px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center mx-auto"
                >
                  <LogIn className="h-5 w-5 mr-3" />
                  Masuk dengan Google
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100"
              >
                {isSuccess ? (
                  <div className="text-center py-12">
                    <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Pendaftaran Berhasil!</h2>
                    <p className="text-gray-600 mb-8">
                      Terima kasih telah mendaftar di SMK LPPMRI 2 KEDUNGREJA. 
                      Tim kami akan segera menghubungi Anda melalui email atau telepon.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button 
                        onClick={() => setIsSuccess(false)}
                        className="w-full sm:w-auto px-8 py-3 bg-white text-blue-600 border border-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all"
                      >
                        Kirim Pendaftaran Lain
                      </button>
                      <Link 
                        to="/dashboard"
                        className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all"
                      >
                        Lihat Dashboard Siswa
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Formulir Pendaftaran Online</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <User className="h-4 w-4 mr-2 text-blue-600" />
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Masukkan nama lengkap"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-blue-600" />
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="contoh@email.com"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-blue-600" />
                            No. WhatsApp/Telepon
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="08xxxxxxxxxx"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          />
                        </div>

                        {/* Birth Date */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                            Tanggal Lahir
                          </label>
                          <input
                            type="date"
                            name="birthDate"
                            required
                            value={formData.birthDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          />
                        </div>

                        {/* Gender */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-2 text-blue-600" />
                            Jenis Kelamin
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          >
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                        </div>

                        {/* Major */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                            Pilihan Jurusan
                          </label>
                          <select
                            name="major"
                            required
                            value={formData.major}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          >
                            <option value="">Pilih Jurusan</option>
                            {majors.map((major, index) => (
                              <option key={index} value={major}>{major}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Previous School */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                          <School className="h-4 w-4 mr-2 text-blue-600" />
                          Asal Sekolah (SMP/MTs)
                        </label>
                        <input
                          type="text"
                          name="previousSchool"
                          required
                          value={formData.previousSchool}
                          onChange={handleChange}
                          placeholder="Masukkan nama sekolah asal"
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        />
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                          Alamat Lengkap
                        </label>
                        <textarea
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Masukkan alamat lengkap tempat tinggal"
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                        />
                      </div>

                      {error && (
                        <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="text-sm">{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                          "w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center",
                          isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                        )}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                            Mengirim...
                          </>
                        ) : (
                          'Kirim Pendaftaran'
                        )}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
