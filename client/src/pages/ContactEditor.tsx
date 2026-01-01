import { useEffect, useState } from 'react';
import { contentApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';

export default function ContactEditor() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await contentApi.getContact();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch contact content:', error);
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
      await contentApi.updateContact(data);
      setMessage('Contact content saved successfully!');
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
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Contact Section</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Edit contact information and section content</p>
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
        {/* Section Content */}
        <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">Section Content</h2>
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

        {/* Contact Information */}
        <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={data?.email || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="contact@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={data?.phone || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="+62 812 3456 7890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                WhatsApp
              </label>
              <input
                type="text"
                name="whatsapp"
                value={data?.whatsapp || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="+628123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={data?.address || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="Jakarta, Indonesia"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">Social Media</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={data?.instagram || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                LinkedIn
              </label>
              <input
                type="text"
                name="linkedin"
                value={data?.linkedin || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Twitter / X
              </label>
              <input
                type="text"
                name="twitter"
                value={data?.twitter || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                placeholder="https://twitter.com/..."
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
