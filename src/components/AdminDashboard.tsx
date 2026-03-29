import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Newspaper, MessageSquare, Plus, Loader2, LayoutDashboard, Users, TrendingUp, Clock, Settings, Image as ImageIcon, HelpCircle, Trophy, Building2, Briefcase, BarChart3, Quote, Globe, Activity } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import NewsManager from './admin/NewsManager';
import MessageManager from './admin/MessageManager';
import RegistrationManager from './admin/RegistrationManager';
import WebsiteSettingsManager from './admin/WebsiteSettingsManager';
import GalleryManager from './admin/GalleryManager';
import FAQManager from './admin/FAQManager';
import ExtracurricularsManager from './admin/ExtracurricularsManager';
import FacilitiesManager from './admin/FacilitiesManager';
import MajorsManager from './admin/MajorsManager';
import StatsManager from './admin/StatsManager';
import TestimonialsManager from './admin/TestimonialsManager';
import UserManager from './admin/UserManager';
import AdminAIAgent from './admin/AdminAIAgent';
import Analytics from './admin/Analytics';
import SystemSettingsManager from './admin/SystemSettingsManager';
import SystemLogsManager from './admin/SystemLogsManager';
import { logAction } from '../services/logService';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'messages' | 'registrations' | 'settings' | 'gallery' | 'faq' | 'extras' | 'facilities' | 'majors' | 'stats' | 'testimonials' | 'users' | 'system' | 'logs'>('overview');
  const [stats, setStats] = useState({ newsCount: 0, messageCount: 0, userCount: 0, registrationCount: 0 });
  const [registrationData, setRegistrationData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const newsSnap = await getDocs(collection(db, 'news'));
        const messagesSnap = await getDocs(collection(db, 'messages'));
        const usersSnap = await getDocs(collection(db, 'users'));
        const registrationsSnap = await getDocs(collection(db, 'registrations'));
        setStats({
          newsCount: newsSnap.size,
          messageCount: messagesSnap.size,
          userCount: usersSnap.size,
          registrationCount: registrationsSnap.size
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
        const chartData = months.map(m => ({ name: m, value: counts[m] || 0 }));
        setRegistrationData(chartData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    if (isAdmin) fetchStats();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-gray-600">SMK LPPMRI 2 KEDUNGREJA - Panel Kendali Utama</p>
          </div>
          <div className="flex items-center space-x-4">
            <AdminAIAgent />
          </div>
        </div>

        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'overview' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Ringkasan</span>
            </div>
            {activeTab === 'overview' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'news' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <Newspaper className="h-4 w-4" />
              <span>Kelola Berita</span>
            </div>
            {activeTab === 'news' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'messages' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Pesan Masuk</span>
            </div>
            {activeTab === 'messages' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'registrations' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Pendaftaran</span>
            </div>
            {activeTab === 'registrations' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'gallery' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span>Galeri</span>
            </div>
            {activeTab === 'gallery' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'faq' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </div>
            {activeTab === 'faq' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('extras')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'extras' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Ekskul</span>
            </div>
            {activeTab === 'extras' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('facilities')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'facilities' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Fasilitas</span>
            </div>
            {activeTab === 'facilities' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('majors')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'majors' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>Jurusan</span>
            </div>
            {activeTab === 'majors' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'stats' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Statistik</span>
            </div>
            {activeTab === 'stats' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'testimonials' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <Quote className="h-4 w-4" />
              <span>Testimoni</span>
            </div>
            {activeTab === 'testimonials' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'users' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Pengguna</span>
            </div>
            {activeTab === 'users' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'settings' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Pengaturan</span>
            </div>
            {activeTab === 'settings' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'system' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Sistem</span>
            </div>
            {activeTab === 'system' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={cn(
              "pb-4 px-4 text-sm font-medium transition-all relative",
              activeTab === 'logs' ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Log</span>
            </div>
            {activeTab === 'logs' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Newspaper className="h-5 w-5" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.newsCount}</div>
                <div className="text-sm text-gray-500">Total Berita</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.messageCount}</div>
                <div className="text-sm text-gray-500">Pesan Masuk</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.userCount}</div>
                <div className="text-sm text-gray-500">Total Pengguna</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.registrationCount}</div>
                <div className="text-sm text-gray-500">Pendaftaran Baru</div>
              </div>
            </div>

            <Analytics stats={stats} registrationData={registrationData} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Aktivitas Terakhir</h2>
              <p className="text-gray-500 italic">Fitur log aktivitas akan segera hadir.</p>
            </div>
          ) : activeTab === 'news' ? (
            <NewsManager />
          ) : activeTab === 'messages' ? (
            <MessageManager />
          ) : activeTab === 'settings' ? (
            <WebsiteSettingsManager />
          ) : activeTab === 'gallery' ? (
            <GalleryManager />
          ) : activeTab === 'faq' ? (
            <FAQManager />
          ) : activeTab === 'extras' ? (
            <ExtracurricularsManager />
          ) : activeTab === 'majors' ? (
            <MajorsManager />
          ) : activeTab === 'stats' ? (
            <StatsManager />
          ) : activeTab === 'testimonials' ? (
            <TestimonialsManager />
          ) : activeTab === 'users' ? (
            <UserManager />
          ) : activeTab === 'facilities' ? (
            <FacilitiesManager />
          ) : activeTab === 'system' ? (
            <SystemSettingsManager />
          ) : activeTab === 'logs' ? (
            <SystemLogsManager />
          ) : (
            <RegistrationManager />
          )}
        </div>

      </div>
    </div>
  );
}
