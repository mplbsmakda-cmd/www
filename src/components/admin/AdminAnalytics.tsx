import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    pendingRegistrations: 0,
    acceptedRegistrations: 0,
    totalExams: 0,
    totalSessions: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [registrationData, setRegistrationData] = useState<any[]>([]);
  const [majorData, setMajorData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [regSnap, examSnap, sessionSnap, majorSnap] = await Promise.all([
          getDocs(collection(db, 'registrations')),
          getDocs(collection(db, 'exams')),
          getDocs(collection(db, 'exam_sessions')),
          getDocs(collection(db, 'majors'))
        ]);

        const regs = regSnap.docs.map(doc => doc.data());
        const sessions = sessionSnap.docs.map(doc => doc.data());

        const totalRegs = regs.length;
        const pending = regs.filter(r => r.status === 'pending').length;
        const accepted = regs.filter(r => r.status === 'accepted').length;
        
        const totalScores = sessions.reduce((acc, s) => acc + (s.score || 0), 0);
        const avgScore = sessions.length > 0 ? totalScores / sessions.length : 0;

        setStats({
          totalRegistrations: totalRegs,
          pendingRegistrations: pending,
          acceptedRegistrations: accepted,
          totalExams: examSnap.docs.length,
          totalSessions: sessions.length,
          averageScore: Math.round(avgScore)
        });

        // Registration by Major
        const majorCounts: Record<string, number> = {};
        regs.forEach(r => {
          majorCounts[r.major] = (majorCounts[r.major] || 0) + 1;
        });
        
        const majorChartData = Object.entries(majorCounts).map(([name, value]) => ({
          name: name.split('(')[0].trim(),
          value
        }));
        setMajorData(majorChartData);

        // Simulated time data (since we don't have many real dates yet)
        setRegistrationData([
          { name: 'Sen', value: 4 },
          { name: 'Sel', value: 7 },
          { name: 'Rab', value: 5 },
          { name: 'Kam', value: 12 },
          { name: 'Jum', value: 8 },
          { name: 'Sab', value: 15 },
          { name: 'Min', value: totalRegs },
        ]);

      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="flex items-center text-emerald-600 text-sm font-bold">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              12%
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</div>
          <div className="text-sm text-gray-500">Total Pendaftar</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="flex items-center text-amber-600 text-sm font-bold">
              <Activity className="h-4 w-4 mr-1" />
              Pending
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.pendingRegistrations}</div>
          <div className="text-sm text-gray-500">Menunggu Review</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="flex items-center text-emerald-600 text-sm font-bold">
              <TrendingUp className="h-4 w-4 mr-1" />
              Aktif
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.acceptedRegistrations}</div>
          <div className="text-sm text-gray-500">Siswa Diterima</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="flex items-center text-purple-600 text-sm font-bold">
              Avg
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.averageScore}</div>
          <div className="text-sm text-gray-500">Rata-rata Skor CBT</div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Trend */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Tren Pendaftaran</h3>
            <select className="text-sm border-none bg-gray-50 rounded-xl px-3 py-2 outline-none">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Major Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-8">Distribusi Jurusan</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={majorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {majorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
            <div className="w-1/2 space-y-4">
              {majorData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm text-gray-600 truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-6">Aktivitas Terbaru</h3>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <Activity className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Pendaftaran Baru</div>
                  <div className="text-xs text-gray-500">Siswa baru telah mendaftar di jurusan MPLB</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">2 jam yang lalu</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
