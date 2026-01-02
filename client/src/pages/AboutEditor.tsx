import { useEffect, useState } from 'react';
import { contentApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Save, Loader2, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

// Default static data
const defaultAboutData = {
  section_label: 'Tentang Kami',
  title: 'Mengapa Bermitra dengan',
  title_highlight: 'Hibiscus Efsya?',
  description: 'Hibiscus Efsya adalah korporasi bisnis yang membuka kesempatan kemitraan untuk berbagai unit bisnis kami.',
  feature_1_icon: '💡',
  feature_1_title: 'Sistem Teruji',
  feature_1_description: 'Model bisnis yang sudah terbukti sukses',
  feature_2_icon: '🤝',
  feature_2_title: 'Dukungan Penuh',
  feature_2_description: 'Tim support yang siap membantu mitra',
  feature_3_icon: '⚡',
  feature_3_title: 'Proses Cepat',
  feature_3_description: 'Pendaftaran dan setup bisnis yang efisien',
  feature_4_icon: '🛡️',
  feature_4_title: 'Brand Terpercaya',
  feature_4_description: 'Reputasi dan kualitas yang sudah diakui',
};

export default function AboutEditor() {
  const [data, setData] = useState<any>(defaultAboutData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [apiConnected, setApiConnected] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await contentApi.getAbout();
      if (response.data && Object.keys(response.data).length > 0) {
        setData(response.data);
      }
      setApiConnected(true);
    } catch (error) {
      console.error('Failed to fetch about content:', error);
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
      await contentApi.updateAbout(data);
      setMessage({ type: 'success', text: 'Berhasil disimpan!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menyimpan. Backend belum terhubung.' });
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

  const featureFields = [1, 2, 3, 4].map((num) => ({
    num,
    iconKey: `feature_${num}_icon`,
    titleKey: `feature_${num}_title`,
    descKey: `feature_${num}_description`,
  }));

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Info */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">About Section</h2>
        <p className="text-gray-500">Edit informasi tentang Hibiscus Efsya.</p>
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
        {/* Title Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Title & Description</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Label</label>
              <input
                type="text"
                name="section_label"
                value={data?.section_label || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={data?.title || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title Highlight</label>
                <input
                  type="text"
                  name="title_highlight"
                  value={data?.title_highlight || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={data?.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Features</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {featureFields.map(({ num, iconKey, titleKey, descKey }) => (
              <div key={num} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-medium text-gray-700 mb-4">Feature {num}</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Icon (emoji)</label>
                    <input
                      type="text"
                      name={iconKey}
                      value={data?.[iconKey] || ''}
                      onChange={handleChange}
                      placeholder="💡"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Title</label>
                    <input
                      type="text"
                      name={titleKey}
                      value={data?.[titleKey] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Description</label>
                    <input
                      type="text"
                      name={descKey}
                      value={data?.[descKey] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
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
