import { Cpu, Car, Zap, Settings, Laptop, LucideIcon } from 'lucide-react';

export interface Major {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
  color: string;
  prospects: string[];
  skills: string[];
}

export const majors: Major[] = [
  {
    id: 'tkr',
    title: 'Teknik Kendaraan Ringan',
    description: 'Mempelajari perawatan dan perbaikan mesin otomotif modern dengan fasilitas bengkel standar industri.',
    longDescription: 'Program keahlian Teknik Kendaraan Ringan (TKR) membekali siswa dengan kompetensi dalam bidang otomotif, khususnya kendaraan roda empat. Siswa akan mempelajari sistem mesin, sistem pemindah tenaga, sistem sasis, sistem kelistrikan otomotif, hingga manajemen bengkel.',
    icon: Car,
    color: 'bg-blue-500',
    prospects: [
      'Mekanik di Bengkel Resmi (Dealer)',
      'Teknisi di Industri Manufaktur Otomotif',
      'Wirausaha Bengkel Mandiri',
      'Quality Control di Industri Otomotif',
      'Operator Alat Berat'
    ],
    skills: [
      'Overhaul Mesin (Engine)',
      'Sistem Injeksi (EFI)',
      'Sistem Rem & Suspensi',
      'Kelistrikan Bodi & AC',
      'Diagnosis Kerusakan Modern (Scanner)'
    ]
  },
  {
    id: 'tkj',
    title: 'Teknik Komputer & Jaringan',
    description: 'Fokus pada infrastruktur jaringan, administrasi server, dan keamanan siber untuk era digital.',
    longDescription: 'Teknik Komputer dan Jaringan (TKJ) adalah program keahlian yang mempelajari cara merakit komputer, menginstalasi sistem operasi, membangun jaringan LAN/WAN, mengelola server, hingga keamanan jaringan siber.',
    icon: Laptop,
    color: 'bg-purple-500',
    prospects: [
      'Network Engineer',
      'System Administrator',
      'IT Support Specialist',
      'Web Developer',
      'Cyber Security Analyst'
    ],
    skills: [
      'Instalasi & Konfigurasi Jaringan',
      'Administrasi Server (Linux/Windows)',
      'Mikrotik & Cisco Networking',
      'Troubleshooting Hardware & Software',
      'Keamanan Jaringan Dasar'
    ]
  },
  {
    id: 'titl',
    title: 'Teknik Instalasi Tenaga Listrik',
    description: 'Keahlian dalam perancangan dan pemasangan instalasi listrik bangunan serta otomasi industri.',
    longDescription: 'Program keahlian Teknik Instalasi Tenaga Listrik (TITL) mendidik siswa untuk memiliki kompetensi dalam pemasangan, pengoperasian, dan pemeliharaan instalasi listrik rumah tinggal, gedung bertingkat, serta instalasi motor listrik di industri.',
    icon: Zap,
    color: 'bg-yellow-500',
    prospects: [
      'Teknisi Listrik Industri',
      'Instalatir Listrik Bangunan',
      'Maintenance Electrical di Gedung/Hotel',
      'Wirausaha Jasa Kelistrikan',
      'Operator Pembangkit Listrik'
    ],
    skills: [
      'Instalasi Penerangan & Tenaga',
      'Otomasi Industri (PLC)',
      'Perbaikan Motor Listrik',
      'Gambar Teknik Elektro (AutoCAD)',
      'K3 Listrik'
    ]
  },
  {
    id: 'tsm',
    title: 'Teknik Sepeda Motor',
    description: 'Spesialisasi dalam pemeliharaan dan perbaikan berbagai jenis sepeda motor injeksi dan karburator.',
    longDescription: 'Teknik Sepeda Motor (TSM) memfokuskan pada penguasaan keterampilan pemeliharaan dan perbaikan sepeda motor. Kurikulum disesuaikan dengan perkembangan teknologi otomotif roda dua terkini, termasuk sistem injeksi dan motor listrik.',
    icon: Settings,
    color: 'bg-red-500',
    prospects: [
      'Mekanik di Bengkel Resmi Motor (AHASS/Yamaha)',
      'Teknisi di Pabrik Perakitan Motor',
      'Wirausaha Bengkel Motor',
      'Modifikator Sepeda Motor',
      'Service Advisor'
    ],
    skills: [
      'Servis Berkala Mesin Motor',
      'Perbaikan Sistem Injeksi (PGM-FI/YMJET-FI)',
      'Sistem Transmisi Otomatis (CVT)',
      'Kelistrikan Sepeda Motor',
      'Manajemen Suku Cadang'
    ]
  },
];
