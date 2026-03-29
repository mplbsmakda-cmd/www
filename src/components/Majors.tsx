import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, ArrowRight, Briefcase, Calculator, Laptop, Code, Settings, PenTool, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const iconMap: { [key: string]: any } = {
  Briefcase: Briefcase,
  Calculator: Calculator,
  Laptop: Laptop,
  Code: Code,
  Settings: Settings,
  PenTool: PenTool,
  Cpu: Cpu,
};

export default function Majors() {
  const [majors, setMajors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const q = query(collection(db, 'majors'), orderBy('createdAt', 'asc'));
        const snap = await getDocs(q);
        setMajors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching majors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMajors();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider mb-6">
                Portal Jurusan
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                Temukan <span className="text-blue-600">Masa Depanmu</span> di SMK LPPMRI 2
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Kami menawarkan berbagai program keahlian yang dirancang untuk membekali siswa dengan keterampilan praktis dan pengetahuan industri terkini.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Majors Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {majors.map((major, index) => {
                const IconComp = iconMap[major.icon] || Briefcase;
                return (
                  <motion.div
                    key={major.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 flex flex-col"
                  >
                    <div className={`w-16 h-16 ${major.color} rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <IconComp className="h-8 w-8" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {major.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                      {major.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <Link 
                        to={`/majors/${major.id}`}
                        className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 group/btn"
                      >
                        Lihat Detail
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {major.id.substring(0, 4)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {majors.length === 0 && (
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                  <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Belum ada data jurusan yang tersedia.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-200">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8">
                Siap Bergabung dengan Kami?
              </h2>
              <p className="text-blue-100 text-lg mb-12 max-w-2xl mx-auto">
                Jangan lewatkan kesempatan untuk mendapatkan pendidikan berkualitas dan fasilitas modern di SMK LPPMRI 2 KEDUNGREJA.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  to="/registration"
                  className="px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-xl"
                >
                  Daftar Sekarang
                </Link>
                <Link 
                  to="/contact"
                  className="px-10 py-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-400 transition-all border border-blue-400"
                >
                  Hubungi Kami
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
