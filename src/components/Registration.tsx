import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  LogIn,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CreditCard,
  Briefcase,
  Loader2,
  Upload,
  FileCheck
} from 'lucide-react';
import { db, auth, googleProvider } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

export default function Registration() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'Laki-laki',
    address: '',
    nik: '',
    
    // Step 2: Academic
    previousSchool: '',
    nisn: '',
    major: '',
    
    // Step 3: Parent
    parentName: '',
    parentPhone: '',
    parentOccupation: '',
    
    // Step 4: Documents
    documents: [
      { name: 'Kartu Keluarga (KK)', status: 'pending', required: true },
      { name: 'Ijazah / SKL', status: 'pending', required: true },
      { name: 'Akta Kelahiran', status: 'pending', required: true },
      { name: 'KTP Orang Tua', status: 'pending', required: true },
    ],
    
    // Step 5: Final
    agreedToTerms: false
  });

  useEffect(() => {
    const checkExisting = async () => {
      if (user) {
        setFormData(prev => ({
          ...prev,
          fullName: user.displayName || '',
          email: user.email || '',
        }));

        try {
          const q = query(collection(db, 'registrations'), where('uid', '==', user.uid));
          const snap = await getDocs(q);
          if (!snap.empty) {
            setHasRegistered(true);
          }
        } catch (err) {
          console.error("Error checking registration:", err);
        } finally {
          setCheckingRegistration(false);
        }
      } else {
        setCheckingRegistration(false);
      }
    };
    checkExisting();
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
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.birthDate || !formData.address || !formData.nik) return false;
      if (formData.nik.length !== 16) {
        setError("NIK harus 16 digit");
        return false;
      }
    } else if (step === 2) {
      if (!formData.previousSchool || !formData.nisn || !formData.major) return false;
      if (formData.nisn.length !== 10) {
        setError("NISN harus 10 digit");
        return false;
      }
    } else if (step === 3) {
      if (!formData.parentName || !formData.parentPhone || !formData.parentOccupation) return false;
    } else if (step === 4) {
      const allRequiredUploaded = formData.documents
        .filter(d => d.required)
        .every(d => d.status === 'uploaded');
      if (!allRequiredUploaded) {
        setError("Harap unggah semua dokumen wajib.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleUpload = (index: number) => {
    // Simulate upload
    const newDocs = [...formData.documents];
    newDocs[index].status = 'uploaded';
    setFormData(prev => ({ ...prev, documents: newDocs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      setError("Anda harus menyetujui syarat dan ketentuan.");
      return;
    }
    
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
    } catch (err) {
      console.error('Registration error:', err);
      setError('Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || checkingRegistration) {
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
            ) : hasRegistered ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center"
              >
                <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Anda Sudah Terdaftar</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Sistem mendeteksi bahwa Anda sudah mengirimkan formulir pendaftaran. 
                  Silakan pantau status pendaftaran Anda melalui Dashboard Siswa.
                </p>
                <Link 
                  to="/dashboard"
                  className="inline-flex items-center px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                >
                  Buka Dashboard Siswa
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Link>
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
                    <Link 
                      to="/dashboard"
                      className="inline-flex items-center px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                    >
                      Lihat Dashboard Siswa
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">Formulir Pendaftaran</h2>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div 
                            key={s} 
                            className={cn(
                              "w-8 h-2 rounded-full transition-all",
                              s === step ? "bg-blue-600 w-12" : s < step ? "bg-emerald-500" : "bg-gray-200"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <AnimatePresence mode="wait">
                        {step === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                              <User className="h-5 w-5 mr-2 text-blue-600" />
                              Data Pribadi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama sesuai ijazah" />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">NIK (16 Digit)</label>
                                <input type="text" name="nik" required maxLength={16} value={formData.nik} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Masukkan 16 digit NIK" />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="contoh@email.com" />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">No. WhatsApp</label>
                                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="08xxxxxxxxxx" />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Lahir</label>
                                <input type="date" name="birthDate" required value={formData.birthDate} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none">
                                  <option value="Laki-laki">Laki-laki</option>
                                  <option value="Perempuan">Perempuan</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Lengkap</label>
                              <textarea name="address" required value={formData.address} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Alamat sesuai KK" />
                            </div>
                          </motion.div>
                        )}

                        {step === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                              <School className="h-5 w-5 mr-2 text-blue-600" />
                              Data Akademik
                            </h3>
                            <div className="space-y-6">
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Asal Sekolah (SMP/MTs)</label>
                                <input type="text" name="previousSchool" required value={formData.previousSchool} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama sekolah asal" />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-2">NISN (10 Digit)</label>
                                  <input type="text" name="nisn" required maxLength={10} value={formData.nisn} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="10 digit NISN" />
                                </div>
                                <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-2">Pilihan Jurusan</label>
                                  <select name="major" required value={formData.major} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">Pilih Jurusan</option>
                                    {majors.map((m, i) => <option key={i} value={m}>{m}</option>)}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {step === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                              <Users className="h-5 w-5 mr-2 text-blue-600" />
                              Data Orang Tua / Wali
                            </h3>
                            <div className="space-y-6">
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Orang Tua / Wali</label>
                                <input type="text" name="parentName" required value={formData.parentName} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama lengkap orang tua/wali" />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-2">No. WhatsApp Orang Tua</label>
                                  <input type="tel" name="parentPhone" required value={formData.parentPhone} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="08xxxxxxxxxx" />
                                </div>
                                <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-2">Pekerjaan Orang Tua</label>
                                  <input type="text" name="parentOccupation" required value={formData.parentOccupation} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Pekerjaan saat ini" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {step === 4 && (
                          <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                              <Upload className="h-5 w-5 mr-2 text-blue-600" />
                              Unggah Dokumen (Digital)
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Harap unggah scan dokumen asli dalam format PDF atau Gambar (Maks 2MB).
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                              {formData.documents.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50">
                                  <div className="flex items-center">
                                    <div className={cn(
                                      "p-2 rounded-xl mr-3",
                                      doc.status === 'uploaded' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                                    )}>
                                      {doc.status === 'uploaded' ? <FileCheck className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-gray-900">
                                        {doc.name} {doc.required && <span className="text-red-500">*</span>}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {doc.status === 'uploaded' ? 'Berhasil diunggah' : 'Menunggu unggahan'}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleUpload(index)}
                                    disabled={doc.status === 'uploaded'}
                                    className={cn(
                                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                      doc.status === 'uploaded' 
                                        ? "bg-emerald-500 text-white cursor-default" 
                                        : "bg-white border border-blue-200 text-blue-600 hover:bg-blue-50"
                                    )}
                                  >
                                    {doc.status === 'uploaded' ? 'Selesai' : 'Unggah'}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {step === 5 && (
                          <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                              <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                              Konfirmasi & Pernyataan
                            </h3>
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
                              <p className="text-sm text-blue-800 leading-relaxed">
                                Saya menyatakan bahwa data yang saya masukkan adalah benar dan dapat dipertanggungjawabkan. 
                                Saya bersedia mengikuti seluruh peraturan yang berlaku di SMK LPPMRI 2 KEDUNGREJA.
                              </p>
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  name="agreedToTerms" 
                                  checked={formData.agreedToTerms} 
                                  onChange={handleChange}
                                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Saya setuju dengan syarat dan ketentuan pendaftaran.</span>
                              </label>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                              <h4 className="font-bold text-gray-900 mb-4">Ringkasan Pendaftaran:</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="text-gray-500">Nama:</div>
                                <div className="font-medium text-gray-900">{formData.fullName}</div>
                                <div className="text-gray-500">NIK:</div>
                                <div className="font-medium text-gray-900">{formData.nik}</div>
                                <div className="text-gray-500">NISN:</div>
                                <div className="font-medium text-gray-900">{formData.nisn}</div>
                                <div className="text-gray-500">Jurusan:</div>
                                <div className="font-medium text-blue-600">{formData.major}</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100"
                        >
                          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium">{error}</span>
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        {step > 1 ? (
                          <button
                            type="button"
                            onClick={prevStep}
                            className="flex items-center px-6 py-3 text-gray-600 font-bold hover:text-blue-600 transition-colors"
                          >
                            <ChevronLeft className="h-5 w-5 mr-2" />
                            Kembali
                          </button>
                        ) : <div />}

                        {step < 5 ? (
                          <button
                            type="button"
                            onClick={nextStep}
                            className="flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                          >
                            Lanjut
                            <ChevronRight className="h-5 w-5 ml-2" />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                              "px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center",
                              isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                            )}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin mr-3" />
                                Memproses...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Kirim Pendaftaran
                              </>
                            )}
                          </button>
                        )}
                      </div>
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
