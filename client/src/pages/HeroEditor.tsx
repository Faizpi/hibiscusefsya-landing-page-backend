import { useEffect, useState } from 'react';
import { contentApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Save, Loader2, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

// Default static data
const defaultHeroData = {
  badge_text: '🌺 Peluang Kemitraan & Franchise',
  title: 'Raih Kesuksesan Bersama Kami',
  subtitle: 'Bisnis Terpercaya',
  description: 'Bergabunglah dengan jaringan franchise Hibiscus Efsya. Kami menyediakan sistem bisnis yang sudah teruji, dukungan penuh, dan potensi keuntungan yang menjanjikan.',
  primary_button_text: 'Daftar Franchise',
  primary_button_link: '#contact',
  secondary_button_text: 'Pelajari Lebih Lanjut',
  secondary_button_link: '#services',
  stats: [
    { value: '4+', label: 'Unit Bisnis' },
    { value: '50+', label: 'Mitra Aktif' },
  ],
};

export default function HeroEditor() {
  const [data, setData] = useState<any>(defaultHeroData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [apiConnected, setApiConnected] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await contentApi.getHero();
      if (response.data?.success && response.data?.data) {
        const apiData = response.data.data;
        // Parse stats if it's a string
        if (typeof apiData.stats === 'string') {
          apiData.stats = JSON.parse(apiData.stats);
        }
        setData({ ...defaultHeroData, ...apiData });
        setApiConnected(true);
      }
    } catch (error) {
      console.error('Failed to fetch hero content:', error);
      setApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await contentApi.updateHero(data);
      if (response.data?.success) {
        setMessage({ type: 'success', text: 'Berhasil disimpan!' });
        setApiConnected(true);
      } else {
        throw new Error('Save failed');
      }
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menyimpan. Periksa koneksi ke backend.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Info */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
        <p className="text-gray-500">Edit tampilan hero section di landing page.</p>
      </div>

      {/* API Connection Warning */}
      {!apiConnected && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
          <AlertTriangle size={20} />
          <div>
            <p className="font-medium">Backend belum terhubung</p>
            <p className="text-sm">Data ditampilkan dari template. Perubahan tidak akan tersimpan sampai database terhubung.</p>
          </div>
        </div>
      )}

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Badge */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Title & Badge</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Badge Text
              </label>
              <input
                type="text"
                name="badge_text"
                value={data?.badge_text || ''}
                onChange={handleChange}
                placeholder="e.g., 🌺 Peluang Kemitraan & Franchise"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={data?.title || ''}
                  onChange={handleChange}
                  placeholder="Raih Kesuksesan"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={data?.subtitle || ''}
                  onChange={handleChange}
                  placeholder="Bersama Kami"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={data?.description || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Deskripsi singkat tentang perusahaan..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Tombol CTA</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="font-medium text-red-700 mb-4">Primary Button</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                  <input
                    type="text"
                    name="primary_button_text"
                    value={data?.primary_button_text || ''}
                    onChange={handleChange}
                    placeholder="Daftar Franchise"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                  <input
                    type="text"
                    name="primary_button_link"
                    value={data?.primary_button_link || ''}
                    onChange={handleChange}
                    placeholder="#contact"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="font-medium text-gray-700 mb-4">Secondary Button</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                  <input
                    type="text"
                    name="secondary_button_text"
                    value={data?.secondary_button_text || ''}
                    onChange={handleChange}
                    placeholder="Pelajari Lebih Lanjut"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                  <input
                    type="text"
                    name="secondary_button_link"
                    value={data?.secondary_button_link || ''}
                    onChange={handleChange}
                    placeholder="#services"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
