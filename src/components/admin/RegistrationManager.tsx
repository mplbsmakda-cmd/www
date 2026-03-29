import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Users, 
  Search, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Download,
  Filter,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  major: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: any;
  previousSchool: string;
  birthDate: string;
  gender: string;
  address: string;
}

export default function RegistrationManager() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pendaftaran ini?")) return;
    try {
      await deleteDoc(doc(db, 'registrations', id));
      setRegistrations(prev => prev.filter(r => r.id !== id));
      if (selectedReg?.id === id) setSelectedReg(null);
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  const updateStatus = async (id: string, status: Registration['status']) => {
    try {
      await updateDoc(doc(db, 'registrations', id), { status });
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      if (selectedReg?.id === id) setSelectedReg({ ...selectedReg, status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.phone.includes(searchTerm);
    const matchesFilter = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: Registration['status']) => {
    switch (status) {
      case 'accepted': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Diterima</span>;
      case 'rejected': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Ditolak</span>;
      case 'reviewed': return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Ditinjau</span>;
      default: return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Ditinjau</option>
            <option value="accepted">Diterima</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 text-sm font-bold text-gray-900">Nama Lengkap</th>
              <th className="py-4 px-4 text-sm font-bold text-gray-900">Jurusan</th>
              <th className="py-4 px-4 text-sm font-bold text-gray-900">Status</th>
              <th className="py-4 px-4 text-sm font-bold text-gray-900">Tanggal</th>
              <th className="py-4 px-4 text-sm font-bold text-gray-900 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                </td>
              </tr>
            ) : filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500 italic">
                  Tidak ada data pendaftaran ditemukan.
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900">{reg.fullName}</div>
                    <div className="text-xs text-gray-500">{reg.email}</div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{reg.major}</td>
                  <td className="py-4 px-4">{getStatusBadge(reg.status)}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleDateString('id-ID') : 'N/A'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setSelectedReg(reg)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(reg.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReg && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900">Detail Pendaftaran</h3>
                <button onClick={() => setSelectedReg(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Lengkap</div>
                    <div className="text-gray-900 font-medium">{selectedReg.fullName}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</div>
                    <div className="text-gray-900 font-medium">{selectedReg.email}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Telepon</div>
                    <div className="text-gray-900 font-medium">{selectedReg.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Jurusan</div>
                    <div className="text-gray-900 font-medium">{selectedReg.major}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Asal Sekolah</div>
                    <div className="text-gray-900 font-medium">{selectedReg.previousSchool}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tanggal Lahir</div>
                    <div className="text-gray-900 font-medium">{selectedReg.birthDate}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Jenis Kelamin</div>
                    <div className="text-gray-900 font-medium">{selectedReg.gender}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</div>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(selectedReg.status)}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Alamat</div>
                  <div className="text-gray-900 font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {selectedReg.address}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateStatus(selectedReg.id, 'reviewed')}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Tandai Ditinjau
                  </button>
                  <button 
                    onClick={() => updateStatus(selectedReg.id, 'accepted')}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-all"
                  >
                    Terima
                  </button>
                  <button 
                    onClick={() => updateStatus(selectedReg.id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all"
                  >
                    Tolak
                  </button>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-200 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Cetak Data
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
