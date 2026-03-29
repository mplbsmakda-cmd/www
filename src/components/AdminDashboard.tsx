import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Newspaper, MessageSquare, Plus, Loader2, LayoutDashboard, Users, TrendingUp, Clock } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import NewsManager from './admin/NewsManager';
import MessageManager from './admin/MessageManager';
import RegistrationManager from './admin/RegistrationManager';
import AdminAIAgent from './admin/AdminAIAgent';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'messages' | 'registrations'>('overview');
  const [stats, setStats] = useState({ newsCount: 0, messageCount: 0, userCount: 0, registrationCount: 0 });

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
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          ) : (
            <RegistrationManager />
          )}
        </div>
      </div>
    </div>
  );
}
