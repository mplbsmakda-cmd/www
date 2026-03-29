import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <img 
                src="https://ik.imagekit.io/zco6tu2vm/IMG-20251202-WA0110-removebg-preview.png?updatedAt=1773626170559" 
                alt="Logo SMK LPPMRI 2 KEDUNGREJA" 
                className="h-10 w-auto"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-xl tracking-tight text-gray-900">SMK LPPMRI 2 KEDUNGREJA</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Mewujudkan pendidikan kejuruan yang inovatif dan berdaya saing global untuk masa depan yang lebih cerah.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Tautan Cepat</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Tentang Kami</Link></li>
              <li><Link to="/majors" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Program Keahlian</Link></li>
              <li><Link to="/news" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Berita & Acara</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Jurusan</h4>
            <ul className="space-y-4">
              <li><span className="text-sm text-gray-500">Teknik Kendaraan Ringan</span></li>
              <li><span className="text-sm text-gray-500">Teknik Komputer & Jaringan</span></li>
              <li><span className="text-sm text-gray-500">Teknik Instalasi Tenaga Listrik</span></li>
              <li><span className="text-sm text-gray-500">Teknik Sepeda Motor</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Informasi</h4>
            <ul className="space-y-4">
              <li className="text-sm text-gray-500">Pendaftaran Siswa Baru</li>
              <li className="text-sm text-gray-500">Beasiswa Prestasi</li>
              <li className="text-sm text-gray-500">Bursa Kerja Khusus</li>
              <li className="text-sm text-gray-500">Portal Alumni</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2026 SMK LPPMRI 2 KEDUNGREJA. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
