import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Quote, Loader2 } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Apa Kata Mereka?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Cerita sukses dari siswa dan alumni yang telah membuktikan kualitas pendidikan di SMK LPPMRI 2 KEDUNGREJA.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 p-8 rounded-3xl relative"
              >
                <Quote className="absolute top-6 right-8 h-10 w-10 text-slate-200" />
                <p className="text-slate-600 italic mb-8 relative z-10 leading-relaxed">
                  "{t.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <img 
                    src={t.avatar || `https://i.pravatar.cc/150?u=${t.id}`} 
                    alt={t.name} 
                    className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
            {testimonials.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 italic">
                Belum ada testimoni.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
