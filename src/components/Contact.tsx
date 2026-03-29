import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('error');
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Hubungi Kami</h2>
            <p className="text-gray-600 mb-10">
              Punya pertanyaan seputar pendaftaran atau informasi sekolah? 
              Tim kami siap membantu Anda.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-blue-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Alamat</div>
                  <div className="text-sm text-gray-600">Jl. Raya Kedungreja No. 2, Cilacap, Jawa Tengah</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-blue-600">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Telepon</div>
                  <div className="text-sm text-gray-600">(0282) 1234567</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-blue-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Email</div>
                  <div className="text-sm text-gray-600">info@smklppmri2kedungreja.sch.id</div>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-2xl overflow-hidden h-64 border border-gray-200">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15822.38555816431!2d108.85!3d-7.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMzYnMDAuMCJTIDEwOMKwNTEnMDAuMCJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 lg:p-12 rounded-3xl shadow-xl shadow-blue-100/50 border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Masukkan nama Anda"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="email@contoh.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Pesan</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Tuliskan pesan Anda di sini..."
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {status === 'sending' ? 'Mengirim...' : 'Kirim Pesan'}
                <Send className="ml-2 h-5 w-5" />
              </button>
              {status === 'success' && (
                <p className="text-green-600 text-center font-medium">Pesan terkirim! Terima kasih.</p>
              )}
              {status === 'error' && (
                <p className="text-red-600 text-center font-medium">Gagal mengirim pesan. Coba lagi nanti.</p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
