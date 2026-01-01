import { useEffect, useState } from 'react';
import { contentApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';

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
        <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">About Section</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Edit the about section of your landing page</p>
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
        {/* Title Section */}
        <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">Title & Description</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Section Label
              </label>
              <input
                type="text"
                name="section_label"
                value={data?.section_label || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
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
                  className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
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
                  className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
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
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {featureFields.map(({ num, iconKey, titleKey, descKey }) => (
              <div key={num} className="p-4 rounded-lg bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))]">
                <h3 className="font-medium mb-3 text-[hsl(var(--foreground))]">Feature {num}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[hsl(var(--muted-foreground))] mb-1">Icon (emoji)</label>
                    <input
                      type="text"
                      name={iconKey}
                      value={data?.[iconKey] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                      placeholder="💡"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[hsl(var(--muted-foreground))] mb-1">Title</label>
                    <input
                      type="text"
                      name={titleKey}
                      value={data?.[titleKey] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[hsl(var(--muted-foreground))] mb-1">Description</label>
                    <input
                      type="text"
                      name={descKey}
                      value={data?.[descKey] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Stats */}
        <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">Card Statistics</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="space-y-2">
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Stat {num}</label>
                <input
                  type="text"
                  name={`card_stat_${num}_value`}
                  value={data?.[`card_stat_${num}_value`] || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                  placeholder="Value"
                />
                <input
                  type="text"
                  name={`card_stat_${num}_label`}
                  value={data?.[`card_stat_${num}_label`] || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                  placeholder="Label"
                />
              </div>
            ))}
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
