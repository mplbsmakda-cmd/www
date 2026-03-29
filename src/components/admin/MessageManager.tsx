import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ContactMessage } from '../../types';
import { Trash2, Mail, Calendar, Loader2, User, MessageSquare } from 'lucide-react';

export default function MessageManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
      setMessages(items);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      try {
        await deleteDoc(doc(db, 'messages', id));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Pesan Masuk</h2>

      <div className="grid grid-cols-1 gap-6">
        {messages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">Belum ada pesan masuk.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              layout
              key={msg.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{msg.name}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <Mail className="h-3 w-3 mr-1" />
                      {msg.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(msg.createdAt).toLocaleString('id-ID')}
                  </div>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                  <p>{msg.message}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
