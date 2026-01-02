import { useEffect, useState } from 'react';
import { contentApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Save, Loader2, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

// Default static data
const defaultContactData = {
  section_label: 'Kontak',
  title: 'Hubungi',
  title_highlight: 'Kami',
  description: 'Tertarik untuk bermitra? Hubungi kami untuk informasi lebih lanjut.',
  email: 'admin@hibiscusefsya.com',
  phone: '+62 812 3456 7890',
  whatsapp: '+6281234567890',
  address: 'Jakarta, Indonesia',
  instagram: 'https://instagram.com/hibiscusefsya',
  linkedin: '',
  twitter: '',
};

export default function ContactEditor() {
  const [data, setData] = useState<any>(defaultContactData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [apiConnected, setApiConnected] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await contentApi.getContact();
      if (response.data && Object.keys(response.data).length > 0) {
        setData(response.data);
      }
      setApiConnected(true);
    } catch (error) {
      console.error('Failed to fetch contact content:', error);
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
      await contentApi.updateContact(data);
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

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Info */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Contact Section</h2>
        <p className="text-gray-500">Edit informasi kontak dan social media.</p>
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
        {/* Section Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Section Content</h3>
          
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

        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Contact Information</h3>
          
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={data?.email || ''}
                onChange={handleChange}
                placeholder="contact@hibiscusefsya.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={data?.phone || ''}
                onChange={handleChange}
                placeholder="+62 812 3456 7890"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
              <input
                type="text"
                name="whatsapp"
                value={data?.whatsapp || ''}
                onChange={handleChange}
                placeholder="+628123456789"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={data?.address || ''}
                onChange={handleChange}
                placeholder="Jakarta, Indonesia"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Social Media</h3>
          
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="text"
                name="instagram"
                value={data?.instagram || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={data?.linkedin || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter / X</label>
              <input
                type="text"
                name="twitter"
                value={data?.twitter || ''}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              />
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
