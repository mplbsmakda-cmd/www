import { motion } from 'motion/react';

const images = [
  { url: 'https://picsum.photos/seed/school1/800/600', title: 'Gedung Utama', category: 'Fasilitas' },
  { url: 'https://picsum.photos/seed/school2/800/600', title: 'Laboratorium Komputer', category: 'Akademik' },
  { url: 'https://picsum.photos/seed/school3/800/600', title: 'Bengkel Otomotif', category: 'Fasilitas' },
  { url: 'https://picsum.photos/seed/school4/800/600', title: 'Kegiatan Pramuka', category: 'Ekstrakurikuler' },
  { url: 'https://picsum.photos/seed/school5/800/600', title: 'Perpustakaan Digital', category: 'Fasilitas' },
  { url: 'https://picsum.photos/seed/school6/800/600', title: 'Olahraga Sore', category: 'Ekstrakurikuler' },
];

export default function Gallery() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Galeri Sekolah</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Melihat lebih dekat kehidupan kampus, fasilitas unggulan, dan berbagai kegiatan inspiratif di SMK LPPMRI 2 KEDUNGREJA.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative group overflow-hidden rounded-3xl cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">{img.category}</span>
                <h3 className="text-white text-xl font-bold">{img.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
