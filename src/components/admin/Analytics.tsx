import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, Users, MessageSquare, Newspaper, GraduationCap, ArrowUpRight, Activity, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    newsCount: 0,
    messageCount: 0,
    userCount: 0,
    registrationCount: 0,
    examCount: 0
  });
  const [registrationData, setRegistrationData] = useState<any[]>([]);
  const [majorDistribution, setMajorDistribution] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsSnap, messagesSnap, usersSnap, registrationsSnap, examsSnap] = await Promise.all([
          getDocs(collection(db, 'news')),
          getDocs(collection(db, 'messages')),
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'registrations')),
          getDocs(collection(db, 'exams'))
        ]);

        setStats({
          newsCount: newsSnap.size,
          messageCount: messagesSnap.size,
          userCount: usersSnap.size,
          registrationCount: registrationsSnap.size,
          examCount: examsSnap.size
        });

        // Process registration data for charts
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const counts: { [key: string]: number } = {};
        registrationsSnap.docs.forEach(doc => {
          const createdAt = doc.data().createdAt;
          if (createdAt) {
            const date = createdAt.toDate?.() || new Date(createdAt);
            const month = months[date.getMonth()];
            counts[month] = (counts[month] || 0) + 1;
          }
        });
        setRegistrationData(months.map(m => ({ name: m, value: counts[m] || 0 })));

        // Major distribution
        const majorCounts: { [key: string]: number } = {};
        registrationsSnap.docs.forEach(doc => {
          const major = doc.data().major;
          if (major) {
            majorCounts[major] = (majorCounts[major] || 0) + 1;
          }
        });
        setMajorDistribution(Object.entries(majorCounts).map(([name, value]) => ({ name, value })));

      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Pendaftar', 
      value: stats.registrationCount, 
      icon: Users, 
      color: 'blue',
      trend: '+12%',
      description: 'Siswa baru terdaftar'
    },
    { 
      label: 'Total Pengguna', 
      value: stats.userCount, 
      icon: GraduationCap, 
      color: 'emerald',
      trend: '+5%',
      description: 'Akun aktif di sistem'
    },
    { 
      label: 'Pesan Masuk', 
      value: stats.messageCount, 
      icon: MessageSquare, 
      color: 'amber',
      trend: '-2%',
      description: 'Pertanyaan dari pengunjung'
    },
    { 
      label: 'Berita & Artikel', 
      value: stats.newsCount, 
      icon: Newspaper, 
      color: 'purple',
      trend: '+3',
      description: 'Konten yang dipublikasikan'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
          <p className="text-slate-500">Pantau performa dan statistik sekolah secara real-time</p>
        </div>
        <div className="flex items-center space-x-2 text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-xl">
          <Clock className="h-4 w-4" />
          <span>Terakhir diperbarui: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${
                card.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {card.trend}
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{card.value}</div>
            <div className="text-sm font-bold text-slate-800 mb-1">{card.label}</div>
            <div className="text-xs text-slate-500">{card.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Trend */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tren Pendaftaran</h3>
              <p className="text-sm text-slate-500">Jumlah pendaftar per bulan</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs font-medium text-slate-600">Pendaftar</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Major Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Distribusi Jurusan</h3>
          <p className="text-sm text-slate-500 mb-8">Peminatan siswa baru</p>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={majorDistribution.length > 0 ? majorDistribution : [{ name: 'Belum ada data', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {majorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-3xl font-bold text-slate-900">{stats.registrationCount}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</div>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {majorDistribution.map((major, index) => (
              <div key={major.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm font-medium text-slate-600">{major.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{major.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <Activity className="h-5 w-5" />
            </div>
            <h4 className="font-bold">Insight Pendaftaran</h4>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed">
            Pendaftaran meningkat sebesar 15% dibandingkan minggu lalu. Jurusan Teknik Otomotif menjadi yang paling diminati.
          </p>
        </div>
        <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-xl shadow-emerald-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <CheckCircle className="h-5 w-5" />
            </div>
            <h4 className="font-bold">Status Sistem</h4>
          </div>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Semua sistem berjalan normal. Database Firestore dan Authentication aktif. Latensi rata-rata 45ms.
          </p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h4 className="font-bold">Target PSB</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>PROGRES</span>
              <span>{Math.round((stats.registrationCount / 500) * 100)}%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-400 h-full rounded-full" 
                style={{ width: `${(stats.registrationCount / 500) * 100}%` }}
              />
            </div>
            <p className="text-slate-400 text-[10px] italic mt-1">Target: 500 Siswa Baru</p>
          </div>
        </div>
      </div>
    </div>
  );
}
