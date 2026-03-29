import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'Kapan pendaftaran siswa baru dibuka?',
    a: 'Pendaftaran siswa baru untuk tahun ajaran 2026/2027 telah dibuka mulai Januari 2026 hingga Juli 2026. Anda dapat mendaftar langsung di sekolah atau melalui website ini.'
  },
  {
    q: 'Apa saja syarat pendaftaran?',
    a: 'Syarat utama meliputi fotokopi ijazah SMP/MTs, fotokopi akta kelahiran, pas foto 3x4, dan fotokopi kartu keluarga.'
  },
  {
    q: 'Apakah ada beasiswa?',
    a: 'Ya, kami menyediakan beasiswa prestasi bagi siswa dengan nilai akademik tinggi dan beasiswa kurang mampu (KIP) bagi siswa yang membutuhkan.'
  },
  {
    q: 'Bagaimana dengan fasilitas praktik?',
    a: 'Kami memiliki bengkel otomotif standar industri, laboratorium komputer dengan spesifikasi tinggi, dan laboratorium kelistrikan yang lengkap untuk menunjang praktik siswa.'
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-4 uppercase tracking-wider">
            <HelpCircle className="h-3 w-3 mr-2" />
            Bantuan & Informasi
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Pertanyaan Sering Diajukan</h2>
          <p className="text-slate-600">Temukan jawaban cepat untuk pertanyaan umum seputar SMK LPPMRI 2 KEDUNGREJA.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-900">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${activeIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-slate-600 text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
