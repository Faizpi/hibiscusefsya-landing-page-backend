import { useEffect, useState, useRef } from 'react';
import { servicesApi, uploadApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Loader2, CheckCircle, AlertCircle, AlertTriangle,
  Plus, Trash2, ChevronDown, ChevronUp, GripVertical,
  Sparkles, Calculator, Shirt, Plane, Clock, Upload, Image as ImageIcon, X
} from 'lucide-react';

// Icon mapping
const iconOptions = [
  { value: 'Sparkles', label: 'Body Care', icon: Sparkles },
  { value: 'Calculator', label: 'Akuntansi', icon: Calculator },
  { value: 'Shirt', label: 'Fashion', icon: Shirt },
  { value: 'Plane', label: 'Travel', icon: Plane },
];

// Default categories data
const defaultCategories = [
  {
    id: 1,
    title: 'Body Care',
    icon: 'Sparkles',
    color: 'text-pink-600',
    bg_color: 'bg-pink-100',
    services: [
      { name: 'MBK Body Care', description: 'Rangkaian produk perawatan tubuh: Bedak Biang Keringat, Body Lotion, Body Mist, Deodorant Roll On, dan P.O. Powder', image: '', link: 'https://bodycare.hibiscusefsya.com', is_coming_soon: false },
      { name: 'Spa Products', description: 'Produk spa berkualitas untuk relaksasi dan perawatan tubuh', image: '', link: '', is_coming_soon: true },
      { name: 'Aromatherapy', description: 'Essential oil dan produk aromaterapi untuk kesehatan', image: '', link: '', is_coming_soon: true },
      { name: 'Natural Skincare', description: 'Perawatan kulit dengan bahan-bahan alami pilihan', image: '', link: '', is_coming_soon: true },
    ]
  },
  {
    id: 2,
    title: 'Fashion',
    icon: 'Shirt',
    color: 'text-purple-600',
    bg_color: 'bg-purple-100',
    services: [
      { name: 'Casual Wear', description: 'Koleksi pakaian kasual untuk aktivitas sehari-hari', image: '', link: '', is_coming_soon: true },
      { name: 'Modest Fashion', description: 'Fashion muslimah modern dan stylish', image: '', link: '', is_coming_soon: true },
      { name: 'Accessories', description: 'Aksesoris fashion untuk melengkapi penampilan', image: '', link: '', is_coming_soon: true },
      { name: 'Bags Collection', description: 'Koleksi tas untuk berbagai kesempatan', image: '', link: '', is_coming_soon: true },
    ]
  },
  {
    id: 3,
    title: 'Travel',
    icon: 'Plane',
    color: 'text-blue-600',
    bg_color: 'bg-blue-100',
    services: [
      { name: 'Domestic Tour', description: 'Paket wisata domestik ke destinasi terbaik Indonesia', image: '', link: '', is_coming_soon: true },
      { name: 'International Tour', description: 'Paket wisata internasional dengan harga kompetitif', image: '', link: '', is_coming_soon: true },
      { name: 'Umrah Package', description: 'Paket ibadah umrah dengan pelayanan terbaik', image: '', link: '', is_coming_soon: true },
      { name: 'Corporate Travel', description: 'Solusi perjalanan bisnis untuk perusahaan', image: '', link: '', is_coming_soon: true },
    ]
  },
  {
    id: 4,
    title: 'Technology',
    icon: 'Calculator',
    color: 'text-green-600',
    bg_color: 'bg-green-100',
    services: [
      { name: 'Jasa Akuntansi', description: 'Layanan akuntansi profesional untuk bisnis Anda', image: '', link: 'https://akuntansi.hibiscusefsya.com', is_coming_soon: false },
      { name: 'Web Development', description: 'Pembuatan website profesional untuk bisnis', image: '', link: '', is_coming_soon: true },
      { name: 'Digital Marketing', description: 'Strategi pemasaran digital untuk meningkatkan penjualan', image: '', link: '', is_coming_soon: true },
      { name: 'IT Consulting', description: 'Konsultasi IT untuk transformasi digital bisnis', image: '', link: '', is_coming_soon: true },
    ]
  },
];

interface Service {
  name: string;
  description: string;
  image: string;
  link: string;
  is_coming_soon: boolean;
}

interface Category {
  id: number;
  title: string;
  icon: string;
  color: string;
  bg_color: string;
  services: Service[];
}

export default function ServicesEditor() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [apiConnected, setApiConnected] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadRef = useRef<{ catIndex: number; svcIndex: number } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await servicesApi.getAll();
      if (response.data?.success && response.data?.data && response.data.data.length > 0) {
        setCategories(response.data.data);
        setApiConnected(true);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (catIndex: number, field: string, value: string) => {
    setCategories(prev => {
      const updated = [...prev];
      updated[catIndex] = { ...updated[catIndex], [field]: value };
      return updated;
    });
  };

  const handleServiceChange = (catIndex: number, svcIndex: number, field: string, value: any) => {
    setCategories(prev => {
      const updated = [...prev];
      updated[catIndex].services[svcIndex] = { 
        ...updated[catIndex].services[svcIndex], 
        [field]: value 
      };
      return updated;
    });
  };

  const addService = (catIndex: number) => {
    setCategories(prev => {
      const updated = [...prev];
      updated[catIndex].services.push({
        name: 'Layanan Baru',
        description: 'Deskripsi layanan baru',
        image: '',
        link: '',
        is_coming_soon: true,
      });
      return updated;
    });
  };

  const removeService = (catIndex: number, svcIndex: number) => {
    setCategories(prev => {
      const updated = [...prev];
      updated[catIndex].services.splice(svcIndex, 1);
      return updated;
    });
  };

  // Handle image upload
  const handleImageUploadClick = (catIndex: number, svcIndex: number) => {
    currentUploadRef.current = { catIndex, svcIndex };
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUploadRef.current) return;

    const { catIndex, svcIndex } = currentUploadRef.current;
    const uploadKey = `${catIndex}-${svcIndex}`;
    
    setUploadingImage(uploadKey);
    
    try {
      const response = await uploadApi.single(file);
      if (response.data?.success && response.data?.url) {
        handleServiceChange(catIndex, svcIndex, 'image', response.data.url);
        setMessage({ type: 'success', text: 'Gambar berhasil diupload!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage({ type: 'error', text: 'Gagal upload gambar. Coba lagi.' });
    } finally {
      setUploadingImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (catIndex: number, svcIndex: number) => {
    handleServiceChange(catIndex, svcIndex, 'image', '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await servicesApi.updateAll(categories);
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

  const getIconComponent = (iconName: string) => {
    const found = iconOptions.find(o => o.value === iconName);
    if (found) {
      const Icon = found.icon;
      return <Icon size={18} />;
    }
    return <Sparkles size={18} />;
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
        <h2 className="text-xl font-bold text-gray-900">Services Section</h2>
        <p className="text-gray-500">Edit kategori dan layanan yang ditampilkan di landing page.</p>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden file input for uploads */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
        />

        {/* Categories */}
        {categories.map((category, catIndex) => (
          <div key={catIndex} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Category Header */}
            <button
              type="button"
              onClick={() => setExpandedCategory(expandedCategory === catIndex ? null : catIndex)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${category.bg_color} ${category.color} flex items-center justify-center`}>
                  {getIconComponent(category.icon)}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-500">{category.services.length} layanan</p>
                </div>
              </div>
              {expandedCategory === catIndex ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {/* Category Content */}
            <AnimatePresence>
              {expandedCategory === catIndex && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-4 space-y-4">
                    {/* Category Info */}
                    <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Kategori
                        </label>
                        <input
                          type="text"
                          value={category.title}
                          onChange={(e) => handleCategoryChange(catIndex, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon
                        </label>
                        <select
                          value={category.icon}
                          onChange={(e) => handleCategoryChange(catIndex, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                        >
                          {iconOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Services List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Layanan</h4>
                        <button
                          type="button"
                          onClick={() => addService(catIndex)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Plus size={16} />
                          Tambah Layanan
                        </button>
                      </div>

                      {category.services.map((service, svcIndex) => (
                        <div 
                          key={svcIndex} 
                          className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-2 text-gray-400">
                              <GripVertical size={16} />
                              <span className="text-sm font-medium">#{svcIndex + 1}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeService(catIndex, svcIndex)}
                              className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Image Upload Section */}
                          <div className="flex gap-4">
                            <div className="w-32 h-24 flex-shrink-0">
                              {service.image ? (
                                <div className="relative w-full h-full rounded-lg overflow-hidden group">
                                  <img 
                                    src={service.image} 
                                    alt={service.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleImageUploadClick(catIndex, svcIndex)}
                                      className="p-1.5 bg-white rounded-lg text-gray-700 hover:bg-gray-100"
                                    >
                                      <Upload size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeImage(catIndex, svcIndex)}
                                      className="p-1.5 bg-white rounded-lg text-red-500 hover:bg-red-50"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleImageUploadClick(catIndex, svcIndex)}
                                  disabled={uploadingImage === `${catIndex}-${svcIndex}`}
                                  className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                >
                                  {uploadingImage === `${catIndex}-${svcIndex}` ? (
                                    <Loader2 size={20} className="animate-spin" />
                                  ) : (
                                    <>
                                      <ImageIcon size={20} />
                                      <span className="text-xs">Upload</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Nama Layanan
                                  </label>
                                  <input
                                    type="text"
                                    value={service.name}
                                    onChange={(e) => handleServiceChange(catIndex, svcIndex, 'name', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Link (URL)
                                  </label>
                                  <input
                                    type="text"
                                    value={service.link}
                                    onChange={(e) => handleServiceChange(catIndex, svcIndex, 'link', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Deskripsi
                                </label>
                                <textarea
                                  value={service.description}
                                  onChange={(e) => handleServiceChange(catIndex, svcIndex, 'description', e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none"
                                />
                              </div>

                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={service.is_coming_soon}
                                    onChange={(e) => handleServiceChange(catIndex, svcIndex, 'is_coming_soon', e.target.checked)}
                                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                  />
                                  <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <Clock size={14} />
                                    Coming Soon
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <motion.button
            type="submit"
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-medium shadow-lg shadow-red-600/30 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
