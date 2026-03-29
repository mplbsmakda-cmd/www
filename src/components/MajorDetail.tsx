import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Briefcase, GraduationCap } from 'lucide-react';
import { majors } from '../data/majors';

export default function MajorDetail() {
  const { id } = useParams();
  const major = majors.find(m => m.id === id);

  if (!major) {
    return <Navigate to="/majors" replace />;
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/majors" 
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-12 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Jurusan
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`w-16 h-16 ${major.color} rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg`}>
                <major.icon className="h-8 w-8" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                {major.title}
              </h1>
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
                    {major.skills.map((skill, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600">{skill}</span>
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
                    {major.prospects.map((prospect, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="mr-3 h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600">{prospect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-32"
            >
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Tertarik dengan Jurusan Ini?</h3>
                <p className="text-slate-600 mb-8">
                  Daftarkan dirimu sekarang dan jadilah bagian dari generasi unggul di SMK LPPMRI 2 KEDUNGREJA.
                </p>
                <Link 
                  to="/registration"
                  className="block w-full py-4 bg-blue-600 text-white text-center font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                >
                  Daftar Sekarang
                </Link>
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <img 
                        src="https://ik.imagekit.io/zco6tu2vm/IMG-20251202-WA0110-removebg-preview.png?updatedAt=1773626170559" 
                        alt="Logo" 
                        className="h-8 w-auto"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">SMK LPPMRI 2 KEDUNGREJA</div>
                      <div className="text-xs text-slate-500">Kedungreja</div>
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
