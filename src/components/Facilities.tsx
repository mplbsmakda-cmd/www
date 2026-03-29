import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Building2, Laptop, BookOpen, Microscope, Coffee, Music, Loader2 } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const iconMap: { [key: string]: any } = {
  Building2: <Building2 className="h-6 w-6" />,
  Laptop: <Laptop className="h-6 w-6" />,
  BookOpen: <BookOpen className="h-6 w-6" />,
  Microscope: <Microscope className="h-6 w-6" />,
  Coffee: <Coffee className="h-6 w-6" />,
  Music: <Music className="h-6 w-6" />,
};

export default function Facilities() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const q = query(collection(db, 'facilities'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setFacilities(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching facilities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  return (
    <section className="py-24 bg-slate-50" id="facilities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Fasilitas Sekolah</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan berbagai fasilitas modern untuk menunjang proses belajar mengajar dan pengembangan bakat siswa.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {iconMap[item.icon] || <Building2 className="h-6 w-6" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
            {facilities.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 italic">
                Belum ada data fasilitas.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
