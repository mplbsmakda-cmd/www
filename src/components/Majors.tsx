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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredMajors = majors.filter(major => 
    major.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    major.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Portal Header */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider mb-6">
                Portal Jurusan
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Pilih <span className="text-blue-600">Keahlianmu</span>, Bangun Masa Depanmu
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Jelajahi berbagai program keahlian unggulan di SMK LPPMRI 2 KEDUNGREJA yang dirancang khusus untuk mencetak tenaga kerja profesional dan kompeten.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Settings className="h-5 w-5 text-gray-400 animate-spin-slow" />
                </div>
                <input
                  type="text"
                  placeholder="Cari jurusan atau keahlian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Majors Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMajors.map((major, index) => {
                  const IconComp = iconMap[major.icon] || Briefcase;
                  return (
                    <motion.div
                      key={major.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 flex flex-col h-full"
                    >
                      <div className={`w-16 h-16 ${major.color} rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <IconComp className="h-8 w-8" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {major.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-8 flex-grow line-clamp-3">
                        {major.description}
                      </p>
                      
                      <div className="pt-6 border-t border-gray-50">
                        <Link 
                          to={`/majors/${major.id}`}
                          className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all group/btn"
                        >
                          Lihat Detail
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {filteredMajors.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                  <Briefcase className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Tidak ada jurusan yang sesuai dengan pencarian Anda.</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-blue-600 font-bold hover:underline"
                  >
                    Tampilkan Semua Jurusan
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
