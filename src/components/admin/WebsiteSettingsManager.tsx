import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function WebsiteSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [settings, setSettings] = useState({
    hero: {
      title: 'Membangun Masa Depan',
      subtitle: 'Unggul & Berkarakter',
      description: 'SMK LPPMRI 2 KEDUNGREJA berkomitmen mencetak lulusan yang siap kerja, berjiwa wirausaha, dan memiliki kompetensi global di era digital.',
      imageUrl: 'https://picsum.photos/seed/students/1000/1200'
    },
    about: {
      title: 'Tentang SMK LPPMRI 2 KEDUNGREJA',
      description: 'SMK LPPMRI 2 KEDUNGREJA adalah institusi pendidikan kejuruan yang berdedikasi untuk mencetak lulusan yang kompeten di bidang teknologi dan industri.',
      vision: 'Menjadi sekolah kejuruan unggulan yang menghasilkan lulusan berakhlak mulia, profesional, dan mandiri.',
      mission: 'Menyelenggarakan pendidikan berbasis kompetensi industri.\nMembentuk karakter siswa yang disiplin dan bertanggung jawab.\nMenjalin kemitraan strategis dengan dunia usaha dan industri.'
    },
    contact: {
      address: 'Jl. Raya Kedungreja No. 123, Kedungreja, Cilacap, Jawa Tengah',
      phone: '(0282) 1234567',
      email: 'info@smklppmri2kedungreja.sch.id',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.5358043641775!2d108.82098667411933!3d-7.534882174246194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e656d0a7a0b8a3b%3A0x6b158c3a51f84b65!2sSMK%20LPPM%20RI%202%20KEDUNGREJA!5e0!3m2!1sid!2sid!4v1711676543210!5m2!1sid!2sid'
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'website');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    try {
      await setDoc(doc(db, 'settings', 'website'), settings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section: keyof typeof settings, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pengaturan Website</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
          Simpan Perubahan
        </button>
      </div>

      {saveStatus === 'success' && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          Pengaturan berhasil disimpan!
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Gagal menyimpan pengaturan. Silakan coba lagi.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Bagian Hero (Beranda)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Utama</label>
            <input
              type="text"
              value={settings.hero.title}
              onChange={(e) => handleChange('hero', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Judul (Teks Biru)</label>
            <input
              type="text"
              value={settings.hero.subtitle}
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
            <textarea
              rows={3}
              value={settings.hero.description}
              onChange={(e) => handleChange('hero', 'description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar Hero</label>
            <input
              type="text"
              value={settings.hero.imageUrl}
              onChange={(e) => handleChange('hero', 'imageUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Informasi Kontak</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
            <textarea
              rows={2}
              value={settings.contact.address}
              onChange={(e) => handleChange('contact', 'address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
            <input
              type="text"
              value={settings.contact.phone}
              onChange={(e) => handleChange('contact', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={settings.contact.email}
              onChange={(e) => handleChange('contact', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Embed Google Maps</label>
            <textarea
              rows={3}
              value={settings.contact.mapEmbedUrl}
              onChange={(e) => handleChange('contact', 'mapEmbedUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono text-xs"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-gray-500 mt-1">Hanya masukkan URL (src) dari iframe Google Maps.</p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Tentang Kami</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <input
                type="text"
                value={settings.about.title}
                onChange={(e) => handleChange('about', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visi</label>
              <textarea
                rows={2}
                value={settings.about.vision}
                onChange={(e) => handleChange('about', 'vision', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              rows={3}
              value={settings.about.description}
              onChange={(e) => handleChange('about', 'description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Misi (Pisahkan dengan baris baru)</label>
            <textarea
              rows={5}
              value={settings.about.mission}
              onChange={(e) => handleChange('about', 'mission', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
