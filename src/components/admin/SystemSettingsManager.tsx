import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Loader2, Globe, Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, Building2, Upload } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { cn } from '../../lib/utils';

export default function SystemSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    schoolName: 'SMK LPPMRI 2 KEDUNGREJA',
    schoolShortName: 'SMK LPPMRI 2',
    logoUrl: 'https://picsum.photos/seed/school-logo/200/200',
    faviconUrl: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    socials: {
      facebook: '',
      instagram: '',
      youtube: '',
      twitter: ''
    },
    contact: {
      email: '',
      phone: '',
      address: '',
      whatsapp: ''
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'system'));
      if (docSnap.exists()) {
        const data = JSON.parse(docSnap.data().content);
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Error fetching system settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'system'), {
        content: JSON.stringify(settings),
        updatedAt: serverTimestamp()
      });
      alert('Pengaturan sistem berhasil disimpan!');
    } catch (error) {
      console.error("Error saving system settings:", error);
      alert('Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h2>
          <p className="text-gray-500 text-sm">Kelola identitas dan konfigurasi utama website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
          Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Identity Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Building2 className="h-5 w-5 text-blue-600 mr-2" />
              Identitas Sekolah
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap Sekolah</label>
                <input
                  type="text"
                  value={settings.schoolName}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Singkat</label>
                <input
                  type="text"
                  value={settings.schoolShortName}
                  onChange={(e) => setSettings({ ...settings, schoolShortName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL Logo</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  <img src={settings.logoUrl} alt="Logo Preview" className="h-full w-full object-contain" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Globe className="h-5 w-5 text-emerald-600 mr-2" />
              Media Sosial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                <input
                  type="text"
                  placeholder="Facebook URL"
                  value={settings.socials.facebook}
                  onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, facebook: e.target.value } })}
                  className="w-full pl-12 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-600" />
                <input
                  type="text"
                  placeholder="Instagram URL"
                  value={settings.socials.instagram}
                  onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, instagram: e.target.value } })}
                  className="w-full pl-12 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="relative">
                <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-red-600" />
                <input
                  type="text"
                  placeholder="Youtube URL"
                  value={settings.socials.youtube}
                  onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, youtube: e.target.value } })}
                  className="w-full pl-12 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="relative">
                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-500" />
                <input
                  type="text"
                  placeholder="Twitter URL"
                  value={settings.socials.twitter}
                  onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, twitter: e.target.value } })}
                  className="w-full pl-12 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Mail className="h-5 w-5 text-orange-600 mr-2" />
              Kontak Cepat
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={settings.contact.email}
                  onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  value={settings.contact.phone}
                  onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={settings.contact.whatsapp}
                  onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, whatsapp: e.target.value } })}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alamat</label>
                <textarea
                  rows={3}
                  value={settings.contact.address}
                  onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, address: e.target.value } })}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
