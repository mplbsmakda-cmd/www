import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Budi Santoso',
    role: 'Alumni TKJ 2022 - Network Engineer di Telkom',
    content: 'SMK LPPMRI 2 KEDUNGREJA memberikan pondasi yang sangat kuat. Tidak hanya teori, tapi praktek langsung dengan alat standar industri membuat saya siap kerja setelah lulus.',
    avatar: 'https://i.pravatar.cc/150?u=budi',
  },
  {
    name: 'Siti Aminah',
    role: 'Siswa TKR Kelas XII',
    content: 'Fasilitas bengkel di sini sangat lengkap. Guru-gurunya juga sangat sabar dalam membimbing kami hingga benar-benar paham cara kerja mesin.',
    avatar: 'https://i.pravatar.cc/150?u=siti',
  },
  {
    name: 'Andi Wijaya',
    role: 'Alumni TSM 2021 - Pemilik Bengkel Mandiri',
    content: 'Jiwa wirausaha saya tumbuh di sekolah ini. Program BKK sangat membantu kami dalam mencari peluang kerja maupun membuka usaha sendiri.',
    avatar: 'https://i.pravatar.cc/150?u=andi',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Apa Kata Mereka?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Cerita sukses dari siswa dan alumni yang telah membuktikan kualitas pendidikan di SMK LPPMRI 2 KEDUNGREJA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
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
                <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full border-2 border-white shadow-sm" />
                <div>
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
