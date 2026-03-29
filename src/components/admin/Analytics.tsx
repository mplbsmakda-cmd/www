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
import { TrendingUp, Users, MessageSquare, Newspaper, GraduationCap } from 'lucide-react';

interface AnalyticsProps {
  stats: {
    newsCount: number;
    messageCount: number;
    userCount: number;
    registrationCount: number;
  };
  registrationData: any[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function Analytics({ stats, registrationData }: AnalyticsProps) {
  // Mock data for the chart if registrationData is empty
  const chartData = registrationData.length > 0 ? registrationData : [
    { name: 'Jan', value: 40 },
    { name: 'Feb', value: 30 },
    { name: 'Mar', value: 65 },
    { name: 'Apr', value: 45 },
    { name: 'May', value: 90 },
    { name: 'Jun', value: 120 },
  ];

  const pieData = [
    { name: 'Berita', value: stats.newsCount },
    { name: 'Pesan', value: stats.messageCount },
    { name: 'Pengguna', value: stats.userCount },
    { name: 'Pendaftaran', value: stats.registrationCount },
  ];

  return (
    <div className="space-y-8">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              Tren Pendaftaran
            </h3>
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">6 Bulan Terakhir</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
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
        </motion.div>

        {/* Content Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
              Distribusi Konten
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs text-gray-600 font-medium">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-emerald-900">Konversi Pendaftaran</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">85%</div>
          <p className="text-xs text-emerald-600 mt-1">Meningkat 12% dari bulan lalu</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-blue-900">Retensi Pengguna</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">92%</div>
          <p className="text-xs text-blue-600 mt-1">Stabilitas tinggi dalam 30 hari</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-purple-900">Respon Pesan</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">~2 Jam</div>
          <p className="text-xs text-purple-600 mt-1">Waktu rata-rata balasan admin</p>
        </div>
      </div>
    </div>
  );
}

import { BarChart3 } from 'lucide-react';
