import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { subscribeToLogs, SystemLog } from '../../services/logService';
import { Activity, Clock, User, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function SystemLogsManager() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToLogs((data) => {
      setLogs(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getTypeIcon = (type: SystemLog['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Activity className="h-5 w-5 text-blue-600 mr-3" />
          Log Aktivitas Sistem
        </h2>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">50 Aktivitas Terakhir</span>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pengguna</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1.5" />
                      {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString('id-ID') : 'Memproses...'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(log.type)}
                      <span className="text-sm font-bold text-gray-900">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-3 w-3 mr-1.5" />
                      {log.user}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-500 leading-relaxed max-w-xs truncate">
                      {log.details}
                    </p>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                    Belum ada log aktivitas yang tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
