import { motion } from 'motion/react';
import { ShieldCheck, Target, Users, Award, Zap, BookOpen } from 'lucide-react';

const features = [
  {
    title: 'Akreditasi A',
    description: 'Kualitas pendidikan terjamin dengan standar nasional tertinggi.',
    icon: Award,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: 'Kurikulum Industri',
    description: 'Materi pembelajaran yang selalu relevan dengan kebutuhan dunia kerja saat ini.',
    icon: Target,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    title: 'Fasilitas Lengkap',
    description: 'Bengkel dan laboratorium modern dengan peralatan standar industri.',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    title: 'Kerjasama Luas',
    description: 'Jejaring kemitraan dengan berbagai perusahaan besar untuk penyaluran lulusan.',
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    title: 'Pembinaan Karakter',
    description: 'Menitikberatkan pada kedisiplinan, etika kerja, dan nilai-nilai religius.',
    icon: ShieldCheck,
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  },
  {
    title: 'Beasiswa Prestasi',
    description: 'Berbagai program beasiswa bagi siswa berprestasi dan kurang mampu.',
    icon: BookOpen,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4"
          >
            Keunggulan Kami
          </motion.div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Mengapa Memilih SMK LPPMRI 2 KEDUNGREJA?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Kami memberikan lebih dari sekadar pendidikan, kami membangun masa depan yang kokoh bagi setiap siswa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
            >
              <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
