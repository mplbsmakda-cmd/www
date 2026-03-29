import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Briefcase, GraduationCap, Cpu, Calculator, Laptop, Code, Settings, PenTool, Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { cn } from '../lib/utils';

const iconMap: { [key: string]: any } = {
  Briefcase: Briefcase,
  Calculator: Calculator,
  Laptop: Laptop,
  Code: Code,
  Settings: Settings,
  PenTool: PenTool,
  Cpu: Cpu,
};

export default function MajorDetail() {
  const { id } = useParams();
  const [major, setMajor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMajor = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'majors', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMajor({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching major:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMajor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!major) {
    return <Navigate to="/majors" replace />;
  }

  const IconComp = iconMap[major.icon] || Briefcase;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <div className={cn("relative pt-32 pb-20 overflow-hidden", major.color)}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            to="/majors" 
            className="inline-flex items-center text-sm font-bold text-white/80 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Jurusan
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-white shadow-2xl border border-white/30"
            >
              <IconComp className="h-12 w-12" />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
              >
                {major.title}
              </motion.h1>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-3"
              >
                {major.skills?.slice(0, 3).map((skill: string, i: number) => (
                  <span key={i} className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/20">
                    {skill}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Tentang Program Keahlian</h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-12">
                {major.longDescription}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="flex items-center text-xl font-bold text-slate-900 mb-6">
                    <GraduationCap className="mr-3 h-6 w-6 text-blue-600" />
                    Kompetensi Keahlian
                  </h3>
                  <ul className="space-y-4">
                    {major.skills?.map((skill: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600 font-medium">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center text-xl font-bold text-slate-900 mb-6">
                    <Briefcase className="mr-3 h-6 w-6 text-blue-600" />
                    Prospek Karir
                  </h3>
                  <ul className="space-y-4">
                    {major.prospects?.map((prospect: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="mr-3 h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600 font-medium">{prospect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Additional Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Fasilitas Unggulan</h4>
                <p className="text-sm text-slate-600">Laboratorium standar industri, peralatan modern, dan lingkungan belajar yang kondusif.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Sertifikasi</h4>
                <p className="text-sm text-slate-600">Lulusan dibekali dengan sertifikasi kompetensi dari BNSP dan mitra industri terkait.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-32"
            >
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Mulai Masa Depanmu di Sini</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    Daftarkan dirimu sekarang dan jadilah bagian dari generasi unggul di SMK LPPMRI 2 KEDUNGREJA.
                  </p>
                  <Link 
                    to="/registration"
                    className="block w-full py-4 bg-blue-600 text-white text-center font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/50"
                  >
                    Daftar Sekarang
                  </Link>
                  
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                        <img 
                          src="https://ik.imagekit.io/zco6tu2vm/IMG-20251202-WA0110-removebg-preview.png?updatedAt=1773626170559" 
                          alt="Logo" 
                          className="h-8 w-auto"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold">SMK LPPMRI 2 KEDUNGREJA</div>
                        <div className="text-xs text-slate-400">Pusat Keunggulan</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
