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
  X,
  Package,
  Settings,
  CheckCircle
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
      setMessage('Section berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Gagal menyimpan');
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
      setMessage('Service berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Gagal menyimpan service');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('Yakin ingin menghapus service ini?')) return;

    try {
      await servicesApi.delete(id);
      await fetchData();
      setMessage('Service berhasil dihapus!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Gagal menghapus');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Success Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
        >
          <CheckCircle className="w-5 h-5" />
          {message}
        </motion.div>
      )}

      {/* Section Settings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-indigo-100">
            <Settings className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Section Settings</h2>
            <p className="text-sm text-slate-500">Konfigurasi header section</p>
          </div>
        </div>
        <div className="grid gap-5">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Label</label>
              <input
                type="text"
                name="section_label"
                value={sectionData?.section_label || ''}
                onChange={handleSectionChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={sectionData?.title || ''}
                onChange={handleSectionChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Highlight</label>
              <input
                type="text"
                name="title_highlight"
                value={sectionData?.title_highlight || ''}
                onChange={handleSectionChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              value={sectionData?.description || ''}
              onChange={handleSectionChange}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveSection}
              disabled={isSaving}
              className="px-5 py-2.5 bg-indigo-500 text-white font-medium rounded-xl hover:bg-indigo-600 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" />
              Simpan Section
            </button>
          </div>
        </div>
      </motion.div>

      {/* Services List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Services List</h2>
              <p className="text-sm text-slate-500">{services.length} services tersedia</p>
            </div>
          </div>
          <button
            onClick={handleNewService}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Tambah Service
          </button>
        </div>

        <div className="space-y-3">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
            >
              <GripVertical className="w-5 h-5 text-slate-300 cursor-grab group-hover:text-slate-400" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800">{service.title}</h3>
                  {service.is_coming_soon && (
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  {!service.is_active && (
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 truncate">{service.description}</p>
                {service.link && (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 hover:underline mt-1.5 font-medium"
                  >
                    {service.link} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEditService(service)}
                  className="p-2.5 hover:bg-indigo-100 rounded-xl transition-colors"
                >
                  <Edit className="w-4 h-4 text-indigo-600" />
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="p-2.5 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}

          {services.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Belum ada service</p>
              <p className="text-sm">Klik "Tambah Service" untuk memulai</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && editingService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {editingService.id ? 'Edit Service' : 'Service Baru'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {editingService.id ? 'Update informasi service' : 'Tambahkan service baru'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Short Description</label>
                  <input
                    type="text"
                    value={editingService.description}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Description</label>
                  <textarea
                    value={editingService.full_description}
                    onChange={(e) => setEditingService({ ...editingService, full_description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Link (optional)</label>
                  <input
                    type="text"
                    value={editingService.link || ''}
                    onChange={(e) => setEditingService({ ...editingService, link: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingService.is_coming_soon}
                      onChange={(e) => setEditingService({ ...editingService, is_coming_soon: e.target.checked })}
                      className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Coming Soon</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingService.is_active}
                      onChange={(e) => setEditingService({ ...editingService, is_active: e.target.checked })}
                      className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveService}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
