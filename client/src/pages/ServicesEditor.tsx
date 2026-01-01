import { useEffect, useState } from 'react';
import { servicesApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Edit, 
  ExternalLink,
  GripVertical,
  X
} from 'lucide-react';

interface Service {
  id: number;
  title: string;
  description: string;
  full_description: string;
  image: string;
  link: string;
  is_coming_soon: boolean;
  display_order: number;
  is_active: boolean;
}

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([]);
  const [sectionData, setSectionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, sectionRes] = await Promise.all([
        servicesApi.getAll(),
        servicesApi.getSection()
      ]);
      setServices(servicesRes.data);
      setSectionData(sectionRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSectionData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveSection = async () => {
    setIsSaving(true);
    try {
      await servicesApi.updateSection(sectionData);
      setMessage('Section saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setShowModal(true);
  };

  const handleNewService = () => {
    setEditingService({
      id: 0,
      title: '',
      description: '',
      full_description: '',
      image: '',
      link: '',
      is_coming_soon: false,
      display_order: services.length,
      is_active: true
    });
    setShowModal(true);
  };

  const handleSaveService = async () => {
    if (!editingService) return;
    setIsSaving(true);

    try {
      if (editingService.id) {
        await servicesApi.update(editingService.id, editingService);
      } else {
        await servicesApi.create(editingService);
      }
      await fetchData();
      setShowModal(false);
      setEditingService(null);
      setMessage('Service saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save service');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await servicesApi.delete(id);
      await fetchData();
      setMessage('Service deleted!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to delete');
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
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Services</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Manage your services/business units</p>
        </div>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500/10 text-green-600"
          >
            {message}
          </motion.div>
        )}
      </div>

      {/* Section Settings */}
      <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
        <h2 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">Section Settings</h2>
        <div className="grid gap-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Label</label>
              <input
                type="text"
                name="section_label"
                value={sectionData?.section_label || ''}
                onChange={handleSectionChange}
                className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={sectionData?.title || ''}
                onChange={handleSectionChange}
                className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Highlight</label>
              <input
                type="text"
                name="title_highlight"
                value={sectionData?.title_highlight || ''}
                onChange={handleSectionChange}
                className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Description</label>
            <textarea
              name="description"
              value={sectionData?.description || ''}
              onChange={handleSectionChange}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveSection}
              disabled={isSaving}
              className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Section
            </button>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Services List</h2>
          <button
            onClick={handleNewService}
            className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        <div className="space-y-3">
          {services.map((service) => (
            <motion.div
              key={service.id}
              layout
              className="flex items-center gap-4 p-4 rounded-lg bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))]"
            >
              <GripVertical className="w-5 h-5 text-[hsl(var(--muted-foreground))] cursor-grab" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[hsl(var(--foreground))]">{service.title}</h3>
                  {service.is_coming_soon && (
                    <span className="px-2 py-0.5 text-xs bg-yellow-500/10 text-yellow-600 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  {!service.is_active && (
                    <span className="px-2 py-0.5 text-xs bg-red-500/10 text-red-600 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{service.description}</p>
                {service.link && (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[hsl(var(--primary))] hover:underline mt-1"
                  >
                    {service.link} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditService(service)}
                  className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && editingService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[hsl(var(--card))] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                  {editingService.id ? 'Edit Service' : 'New Service'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Short Description</label>
                  <input
                    type="text"
                    value={editingService.description}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Description</label>
                  <textarea
                    value={editingService.full_description}
                    onChange={(e) => setEditingService({ ...editingService, full_description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Link (optional)</label>
                  <input
                    type="text"
                    value={editingService.link || ''}
                    onChange={(e) => setEditingService({ ...editingService, link: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))]"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingService.is_coming_soon}
                      onChange={(e) => setEditingService({ ...editingService, is_coming_soon: e.target.checked })}
                      className="w-4 h-4 rounded border-[hsl(var(--border))]"
                    />
                    <span className="text-sm">Coming Soon</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingService.is_active}
                      onChange={(e) => setEditingService({ ...editingService, is_active: e.target.checked })}
                      className="w-4 h-4 rounded border-[hsl(var(--border))]"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--muted))]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveService}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
