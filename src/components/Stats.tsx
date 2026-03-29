import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, GraduationCap, Building2, Trophy, Loader2 } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const iconMap: { [key: string]: any } = {
  Users: Users,
  GraduationCap: GraduationCap,
  Building2: Building2,
  Trophy: Trophy,
};

export default function Stats() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(collection(db, 'stats'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        setStats(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComp = iconMap[stat.icon] || Users;
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <IconComp className="h-7 w-7" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
