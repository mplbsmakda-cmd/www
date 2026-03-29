import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Music, Camera, Code, Heart, Users, Zap, Globe, Loader2 } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const iconMap: { [key: string]: any } = {
  Trophy: <Trophy className="h-6 w-6" />,
  Music: <Music className="h-6 w-6" />,
  Camera: <Camera className="h-6 w-6" />,
  Code: <Code className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  Globe: <Globe className="h-6 w-6" />,
};

export default function Extracurriculars() {
  const [extras, setExtras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const q = query(collection(db, 'extracurriculars'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setExtras(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching extracurriculars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExtras();
  }, []);

  return (
    <section className="py-24 bg-white" id="extracurriculars">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ekstrakurikuler</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Wadah bagi siswa untuk mengembangkan minat, bakat, dan karakter di luar jam pelajaran akademik.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {extras.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-[2rem] border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-blue-100/50 transition-all group"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  {iconMap[item.icon] || <Trophy className="h-6 w-6" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
            {extras.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 italic">
                Belum ada data ekstrakurikuler.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
