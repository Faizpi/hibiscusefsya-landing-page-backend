import { useEffect, useState } from 'react';
import { contentApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Save, Loader2, Image as ImageIcon } from 'lucide-react';

export default function HeroEditor() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await contentApi.getHero();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch hero content:', error);
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
      await contentApi.updateHero(data);
      setMessage('Hero content saved successfully!');
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
        <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Hero Section</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Edit the hero section of your landing page</p>
        </div>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              message.includes('success')
                ? 'bg-green-500/10 text-green-600'
                : 'bg-red-500/10 text-red-600'
            }`}
          >
            {message}
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Badge & Title */}
        <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">Title & Badge</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Badge Text
              </label>
              <input
                type="text"
                name="badge_text"
                value={data?.badge_text || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                placeholder="e.g., 🌺 Peluang Kemitraan"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={data?.title || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                  placeholder="Main title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                  Title Highlight
                </label>
                <input
                  type="text"
                  name="title_highlight"
                  value={data?.title_highlight || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                  placeholder="Highlighted text"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={data?.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent resize-none"
                placeholder="Hero description"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">Buttons</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Primary Button Text
              </label>
              <input
                type="text"
                name="button_primary_text"
                value={data?.button_primary_text || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Primary Button Link
              </label>
              <input
                type="text"
                name="button_primary_link"
                value={data?.button_primary_link || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Secondary Button Text
              </label>
              <input
                type="text"
                name="button_secondary_text"
                value={data?.button_secondary_text || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Secondary Button Link
              </label>
              <input
                type="text"
                name="button_secondary_link"
                value={data?.button_secondary_link || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">Statistics</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Stat 1</label>
              <input
                type="text"
                name="stat_1_value"
                value={data?.stat_1_value || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="Value (e.g., 4+)"
              />
              <input
                type="text"
                name="stat_1_label"
                value={data?.stat_1_label || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="Label"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Stat 2</label>
              <input
                type="text"
                name="stat_2_value"
                value={data?.stat_2_value || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="Value"
              />
              <input
                type="text"
                name="stat_2_label"
                value={data?.stat_2_label || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="Label"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Stat 3</label>
              <input
                type="text"
                name="stat_3_value"
                value={data?.stat_3_value || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="Value"
              />
              <input
                type="text"
                name="stat_3_label"
                value={data?.stat_3_label || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="Label"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white font-medium rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
