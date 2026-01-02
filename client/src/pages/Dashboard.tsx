import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { settingsApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Briefcase, 
  Phone, 
  Activity,
  ArrowRight,
  Users,
  TrendingUp
} from 'lucide-react';

interface DashboardStats {
  totalServices: number;
  totalSubmissions: number;
  totalMessages: number;
  siteStatus: string;
}

const quickActions = [
  { path: '/hero', icon: FileText, label: 'Edit Hero', description: 'Edit hero section' },
  { path: '/about', icon: Users, label: 'Edit About', description: 'Edit about section' },
  { path: '/services', icon: Briefcase, label: 'Edit Services', description: 'Kelola layanan' },
  { path: '/contact', icon: Phone, label: 'Edit Contact', description: 'Edit informasi kontak' },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 4,
    totalSubmissions: 0,
    totalMessages: 0,
    siteStatus: 'Online'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await settingsApi.getDashboardStats();
      if (response.data?.data) {
        setStats(prev => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Total Layanan', 
      value: stats.totalServices, 
      icon: Briefcase,
      color: 'bg-red-50 text-red-600'
    },
    { 
      label: 'Submission', 
      value: stats.totalSubmissions, 
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      label: 'Pesan Masuk', 
      value: stats.totalMessages, 
      icon: Phone,
      color: 'bg-green-50 text-green-600'
    },
    { 
      label: 'Status Website', 
      value: stats.siteStatus, 
      icon: Activity,
      color: 'bg-purple-50 text-purple-600'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Selamat Datang!</h2>
        <p className="text-gray-500 mt-1">Kelola konten website Hibiscus Efsya dari sini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {isLoading ? '-' : stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Link
                to={action.path}
                className="block p-5 bg-white border border-gray-200 rounded-2xl hover:border-red-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-red-50 transition-colors">
                      <action.icon size={22} className="text-gray-600 group-hover:text-red-600 transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{action.label}</p>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-gray-400 group-hover:text-red-600 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-red-50 border border-red-100 rounded-2xl p-6"
      >
        <h3 className="font-bold text-red-900 mb-2">Catatan</h3>
        <p className="text-red-700">
          Setelah melakukan perubahan di admin panel, perubahan akan langsung terlihat di website utama. 
          Pastikan untuk memeriksa hasilnya di{' '}
          <a href="https://hibiscusefsya.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">
            hibiscusefsya.com
          </a>
        </p>
      </motion.div>
    </div>
  );
}
