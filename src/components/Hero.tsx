import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Hero() {
  const { user } = useAuth();
  const [content, setContent] = useState({
    title: 'Membangun Masa Depan',
    subtitle: 'Unggul & Berkarakter',
    description: 'SMK LPPMRI 2 KEDUNGREJA berkomitmen mencetak lulusan yang siap kerja, berjiwa wirausaha, dan memiliki kompetensi global di era digital.',
    imageUrl: 'https://picsum.photos/seed/students/1000/1200'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'website');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().hero) {
          setContent(docSnap.data().hero);
        }
      } catch (error) {
        console.error("Error fetching hero settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-50/30 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-8 border border-blue-100 uppercase tracking-wider"
            >
              <Sparkles className="h-3 w-3 mr-2" />
              Penerimaan Siswa Baru 2026/2027
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]"
            >
              {content.title} <br />
              <span className="text-blue-600">{content.subtitle}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto lg:mx-0 text-lg text-slate-600 mb-12 leading-relaxed"
            >
              {content.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link 
                to="/registration"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center group"
              >
                Daftar Sekarang
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {user ? (
                <Link 
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl border border-blue-600 hover:bg-blue-50 transition-all text-center"
                >
                  Dashboard Siswa
                </Link>
              ) : (
                <Link 
                  to="/majors"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-center"
                >
                  Lihat Jurusan
                </Link>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 relative"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <img
                src={content.imageUrl}
                alt="Siswa SMK LPPMRI 2 KEDUNGREJA"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600 rounded-3xl -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400 rounded-full -z-10 blur-2xl opacity-50" />
            
            <div className="absolute top-1/2 -right-8 -translate-y-1/2 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden xl:block">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 p-2 rounded-2xl">
                  <img 
                    src="https://ik.imagekit.io/zco6tu2vm/IMG-20251202-WA0110-removebg-preview.png?updatedAt=1773626170559" 
                    alt="Logo" 
                    className="h-8 w-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">95%</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Lulusan Kerja</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
