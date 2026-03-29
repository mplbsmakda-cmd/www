import { motion } from 'motion/react';
import { Users, GraduationCap, Building2, Trophy } from 'lucide-react';

const stats = [
  { label: 'Siswa Aktif', value: '1,200+', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Alumni Sukses', value: '5,000+', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Mitra Industri', value: '45+', icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Prestasi Nasional', value: '120+', icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function Stats() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-slate-50 transition-colors"
            >
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
