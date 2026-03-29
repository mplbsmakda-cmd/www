import { motion } from 'motion/react';
import { Map, Play, Info, ExternalLink } from 'lucide-react';

export default function VirtualTour() {
  return (
    <section className="py-24 bg-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider mb-6 border border-blue-500/20">
              Pengalaman Imersif
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Jelajahi Kampus <span className="text-blue-500">Secara Virtual</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Lihat fasilitas modern dan lingkungan belajar kami dari mana saja melalui tur virtual 360 derajat.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 relative group"
          >
            <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-slate-800 border border-slate-700 shadow-2xl relative">
              <img 
                src="https://picsum.photos/seed/school-campus/1200/800" 
                alt="Virtual Tour Preview" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/50 hover:scale-110 transition-transform group/btn">
                  <Play className="h-8 w-8 fill-current ml-1" />
                </button>
              </div>
              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                  <div className="text-white font-bold text-sm">Gedung Utama & Laboratorium</div>
                  <div className="text-slate-300 text-xs">SMK LPPMRI 2 KEDUNGREJA</div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                  <div className="text-blue-400 text-xs font-bold uppercase tracking-widest">Live View</div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            {[
              { title: 'Laboratorium Komputer', desc: 'Dilengkapi dengan PC spesifikasi tinggi untuk desain dan pemrograman.', icon: Map },
              { title: 'Bengkel Otomotif', desc: 'Peralatan standar industri untuk praktik perbaikan kendaraan.', icon: Info },
              { title: 'Perpustakaan Digital', desc: 'Akses ke ribuan e-book dan jurnal penelitian internasional.', icon: ExternalLink },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition-colors group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
            >
              <span>Mulai Tur Lengkap</span>
              <ExternalLink className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
