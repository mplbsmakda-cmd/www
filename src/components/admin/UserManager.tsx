import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Mail, Shield, ShieldCheck, Loader2, Search, Briefcase, User as UserIcon } from 'lucide-react';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { logAction } from '../../services/logService';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

export default function UserManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchMajors();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMajors = async () => {
    try {
      const snap = await getDocs(collection(db, 'majors'));
      setMajors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching majors:", error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string, majorId?: string) => {
    setUpdatingId(userId);
    try {
      const userToUpdate = users.find(u => u.id === userId);
      const updateData: any = { role: newRole };
      if (newRole === 'major_admin' && majorId) {
        updateData.majorId = majorId;
      } else {
        updateData.majorId = null;
      }
      await updateDoc(doc(db, 'users', userId), updateData);
      
      // Log action
      if (currentUser) {
        logAction(
          'Update Role Pengguna',
          currentUser.email || 'Admin',
          `Mengubah role ${userToUpdate?.email} menjadi ${newRole}${majorId ? ` (Jurusan: ${majorId})` : ''}`,
          'success'
        );
      }

      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      if (currentUser) {
        logAction('Gagal Update Role', currentUser.email || 'Admin', `Gagal mengubah role pengguna: ${userId}`, 'error');
      }
      alert("Gagal memperbarui role");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-600" />
          Manajemen Pengguna
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-bottom border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pengguna</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role & Akses</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                          alt={user.displayName} 
                          className="h-10 w-10 rounded-full border border-gray-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="font-bold text-gray-900">{user.displayName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <select
                            value={user.role || 'user'}
                            disabled={updatingId === user.id}
                            onChange={(e) => handleRoleChange(user.id, e.target.value, user.majorId)}
                            className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <option value="user">Siswa/User</option>
                            <option value="major_admin">Admin Jurusan</option>
                            <option value="admin">Admin Utama</option>
                          </select>
                          {user.role === 'admin' && <ShieldCheck className="h-4 w-4 text-purple-600" />}
                          {user.role === 'major_admin' && <Briefcase className="h-4 w-4 text-blue-600" />}
                          {user.role === 'user' && <UserIcon className="h-4 w-4 text-gray-400" />}
                        </div>
                        
                        {user.role === 'major_admin' && (
                          <select
                            value={user.majorId || ''}
                            disabled={updatingId === user.id}
                            onChange={(e) => handleRoleChange(user.id, 'major_admin', e.target.value)}
                            className="text-[10px] font-medium bg-blue-50 border border-blue-100 text-blue-700 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <option value="">Pilih Jurusan...</option>
                            {majors.map(m => (
                              <option key={m.id} value={m.id}>{m.title}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString('id-ID') : 
                       user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                    Tidak ada pengguna ditemukan.
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
