import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { NewsItem } from '../types';

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      setNews(items);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Mock news if none in DB
  const displayNews = news.length > 0 ? news : [
    {
      id: '1',
      title: 'Kunjungan Industri ke PT Astra Honda Motor',
      content: 'Siswa jurusan TSM melakukan kunjungan industri untuk melihat proses perakitan motor secara langsung.',
      authorUid: 'admin',
      imageUrl: 'https://picsum.photos/seed/industry/800/500',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Workshop Cyber Security Bersama Kominfo',
      content: 'Meningkatkan kesadaran keamanan digital bagi siswa TKJ melalui workshop intensif.',
      authorUid: 'admin',
      imageUrl: 'https://picsum.photos/seed/cyber/800/500',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Juara 1 LKS Tingkat Provinsi Bidang Kelistrikan',
      content: 'Prestasi membanggakan diraih oleh siswa TITL dalam ajang Lomba Kompetensi Siswa.',
      authorUid: 'admin',
      imageUrl: 'https://picsum.photos/seed/winner/800/500',
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Berita Terbaru</h2>
            <p className="text-gray-600">Ikuti perkembangan dan prestasi terbaru dari sekolah kami.</p>
          </div>
          <button className="hidden md:flex items-center text-blue-600 font-semibold hover:text-blue-700">
            Lihat Semua Berita
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayNews.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Berita
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Admin
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                {item.content}
              </p>
              <div className="flex items-center text-sm font-bold text-gray-900 group-hover:translate-x-1 transition-transform">
                Baca Selengkapnya
                <ArrowRight className="ml-2 h-4 w-4 text-blue-600" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
