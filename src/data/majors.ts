import { Briefcase, Calculator, Laptop, LucideIcon } from 'lucide-react';

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
    id: 'mplb',
    title: 'Manajemen Perkantoran dan Layanan Bisnis (MPLB)',
    description: 'Mempelajari administrasi perkantoran, manajemen kearsipan, dan pelayanan prima dalam dunia bisnis modern.',
    longDescription: 'Program keahlian Manajemen Perkantoran dan Layanan Bisnis (MPLB) membekali siswa dengan kompetensi dalam bidang administrasi, pengelolaan dokumen, komunikasi bisnis, serta penggunaan teknologi perkantoran terkini untuk mendukung operasional perusahaan.',
    icon: Briefcase,
    color: 'bg-blue-500',
    prospects: [
      'Staf Administrasi',
      'Sekretaris Eksekutif',
      'Resepsionis / Front Office',
      'Asisten Manajer',
      'Staf Personalia (HRD)'
    ],
    skills: [
      'Manajemen Kearsipan Digital',
      'Korespondensi Bisnis',
      'Pelayanan Prima (Service Excellence)',
      'Pengoperasian Aplikasi Perkantoran',
      'Public Speaking & Komunikasi'
    ]
  },
  {
    id: 'akl',
    title: 'Akuntansi dan Keuangan Lembaga (AKL)',
    description: 'Fokus pada pengelolaan keuangan, pembukuan, perpajakan, dan sistem akuntansi digital.',
    longDescription: 'Akuntansi dan Keuangan Lembaga (AKL) adalah program keahlian yang mempelajari cara mencatat, mengklasifikasikan, dan mengolah data transaksi keuangan menjadi laporan keuangan yang akurat sesuai standar akuntansi yang berlaku.',
    icon: Calculator,
    color: 'bg-emerald-500',
    prospects: [
      'Staf Akuntansi (Accounting Staff)',
      'Kasir / Teller Bank',
      'Staf Perpajakan',
      'Auditor Junior',
      'Wirausaha / Konsultan Keuangan'
    ],
    skills: [
      'Siklus Akuntansi Jasa & Dagang',
      'Komputer Akuntansi (MYOB/Accurate)',
      'Administrasi Pajak',
      'Pengelolaan Kas Kecil',
      'Analisis Laporan Keuangan'
    ]
  },
  {
    id: 'tjkt',
    title: 'Teknik Jaringan Komputer dan Telekomunikasi (TJKT)',
    description: 'Keahlian dalam perancangan infrastruktur jaringan, administrasi server, dan telekomunikasi digital.',
    longDescription: 'Program keahlian Teknik Jaringan Komputer dan Telekomunikasi (TJKT) mendidik siswa untuk memiliki kompetensi dalam merakit komputer, instalasi jaringan LAN/WAN, konfigurasi server, hingga pemeliharaan sistem telekomunikasi modern.',
    icon: Laptop,
    color: 'bg-purple-500',
    prospects: [
      'Network Administrator',
      'IT Support Specialist',
      'Teknisi Jaringan & Telekomunikasi',
      'System Administrator',
      'Wirausaha IT / Warnet / RT-RW Net'
    ],
    skills: [
      'Instalasi & Konfigurasi Jaringan (Mikrotik/Cisco)',
      'Administrasi Server (Linux/Windows)',
      'Troubleshooting Hardware & Software',
      'Instalasi Fiber Optic',
      'Keamanan Jaringan Dasar'
    ]
  }
];
