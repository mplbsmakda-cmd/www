import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Filter } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { NewsItem } from '../types';

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedDateRange, setSelectedDateRange] = useState('Semua Waktu');

  const categories = ['Semua', 'Akademik', 'Kegiatan', 'Prestasi', 'Pengumuman'];
  const dateRanges = ['Semua Waktu', 'Bulan Ini', 'Tahun Ini'];

  useEffect(() => {
    // Fetch all news to allow client-side filtering
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
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
  const initialNews = news.length > 0 ? news : [
    {
      id: '1',
      title: 'Kunjungan Industri ke PT Astra Honda Motor',
      content: 'Siswa jurusan TSM melakukan kunjungan industri untuk melihat proses perakitan motor secara langsung.',
      authorUid: 'admin',
      category: 'Kegiatan',
      imageUrl: 'https://picsum.photos/seed/industry/800/500',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Workshop Cyber Security Bersama Kominfo',
      content: 'Meningkatkan kesadaran keamanan digital bagi siswa TKJ melalui workshop intensif.',
      authorUid: 'admin',
      category: 'Akademik',
      imageUrl: 'https://picsum.photos/seed/cyber/800/500',
      createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString() // 2 months ago
    },
    {
      id: '3',
      title: 'Juara 1 LKS Tingkat Provinsi Bidang Kelistrikan',
      content: 'Prestasi membanggakan diraih oleh siswa TITL dalam ajang Lomba Kompetensi Siswa.',
      authorUid: 'admin',
      category: 'Prestasi',
      imageUrl: 'https://picsum.photos/seed/winner/800/500',
      createdAt: new Date().toISOString()
    }
  ];

  const filteredNews = useMemo(() => {
    return initialNews.filter(item => {
      // Category Filter
      const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;

      // Date Filter
      let matchDate = true;
      const itemDate = new Date(item.createdAt);
      const now = new Date();

      if (selectedDateRange === 'Bulan Ini') {
        matchDate = itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      } else if (selectedDateRange === 'Tahun Ini') {
        matchDate = itemDate.getFullYear() === now.getFullYear();
      }

      return matchCategory && matchDate;
    });
  }, [initialNews, selectedCategory, selectedDateRange]);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Berita Terbaru</h2>
            <p className="text-gray-600">Ikuti perkembangan dan prestasi terbaru dari sekolah kami.</p>
          </div>
          <button className="hidden md:flex items-center text-blue-600 font-semibold hover:text-blue-700">
            Lihat Semua Berita
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center text-gray-500 font-medium w-full md:w-auto mb-2 md:mb-0">
            <Filter className="h-5 w-5 mr-2" />
            Filter:
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {dateRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredNews.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://picsum.photos/seed/news/800/500'}
                    alt={item.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-blue-600 uppercase tracking-wider shadow-sm">
                    {item.category || 'Berita'}
                  </div>
                </div>
                <div className="p-6">
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
                  <div className="flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                    Baca Selengkapnya
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada berita ditemukan</h3>
            <p className="text-gray-500">Coba ubah filter kategori atau tanggal untuk melihat berita lainnya.</p>
            <button 
              onClick={() => { setSelectedCategory('Semua'); setSelectedDateRange('Semua Waktu'); }}
              className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
