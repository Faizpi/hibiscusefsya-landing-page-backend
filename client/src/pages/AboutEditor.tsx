import { useEffect, useState } from 'react';
import { contentApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Save, Loader2, FileText, Sparkles, BarChart3, CheckCircle } from 'lucide-react';

export default function AboutEditor() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await contentApi.getAbout();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch about content:', error);
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
    setMessage('');

    try {
      await contentApi.updateAbout(data);
      setMessage('About content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const featureFields = [1, 2, 3, 4].map((num) => ({
    num,
    iconKey: `feature_${num}_icon`,
    titleKey: `feature_${num}_title`,
    descKey: `feature_${num}_description`,
  }));

  const featureColors = [
    { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700' },
    { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
    { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
    { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Success Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
            message.includes('success')
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          {message}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-indigo-100">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Title & Description</h2>
              <p className="text-sm text-slate-500">Section header content</p>
            </div>
          </div>
          <div className="grid gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Section Label
              </label>
              <input
                type="text"
                name="section_label"
                value={data?.section_label || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={data?.title || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title Highlight
                </label>
                <input
                  type="text"
                  name="title_highlight"
                  value={data?.title_highlight || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={data?.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-emerald-100">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Features</h2>
              <p className="text-sm text-slate-500">Highlight key features</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {featureFields.map(({ num, iconKey, titleKey, descKey }, index) => (
              <div 
                key={num} 
                className={`p-4 rounded-xl ${featureColors[index].bg} border ${featureColors[index].border}`}
              >
                <p className={`text-sm font-semibold ${featureColors[index].text} mb-3`}>Feature {num}</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Icon (emoji)</label>
                    <input
                      type="text"
                      name={iconKey}
                      value={data?.[iconKey] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      placeholder="💡"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Title</label>
                    <input
                      type="text"
                      name={titleKey}
                      value={data?.[titleKey] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Description</label>
                    <input
                      type="text"
                      name={descKey}
                      value={data?.[descKey] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-amber-100">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Card Statistics</h2>
              <p className="text-sm text-slate-500">Numbers that matter</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Stat {num}</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Value</label>
                    <input
                      type="text"
                      name={`card_stat_${num}_value`}
                      value={data?.[`card_stat_${num}_value`] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      placeholder="e.g., 100+"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Label</label>
                    <input
                      type="text"
                      name={`card_stat_${num}_label`}
                      value={data?.[`card_stat_${num}_label`] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      placeholder="Description"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end pt-4"
        >
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-500/30"
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
        </motion.div>
      </form>
    </div>
  );
}
