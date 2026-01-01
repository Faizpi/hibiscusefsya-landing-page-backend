import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { settingsApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Mail, 
  Activity,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Phone,
  ExternalLink
} from 'lucide-react';

interface DashboardStats {
  totalServices: number;
  totalSubmissions: number;
  unreadSubmissions: number;
  recentActivity: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await settingsApi.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Services',
      value: stats?.totalServices || 4,
      icon: FileText,
      gradient: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Contact Submissions',
      value: stats?.totalSubmissions || 0,
      icon: Mail,
      gradient: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Unread Messages',
      value: stats?.unreadSubmissions || 0,
      icon: Activity,
      gradient: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Site Status',
      value: 'Online',
      icon: TrendingUp,
      gradient: 'from-cyan-500 to-cyan-600',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
    },
  ];

  const quickActions = [
    {
      title: 'Edit Hero',
      description: 'Update hero section content',
      icon: Sparkles,
      path: '/hero',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Manage Services',
      description: 'Add or edit services',
      icon: FileText,
      path: '/services',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Edit About',
      description: 'Update about section',
      icon: Users,
      path: '/about',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Edit Contact',
      description: 'Update contact info',
      icon: Phone,
      path: '/contact',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Selamat Datang di Dashboard! 👋</h1>
          <p className="text-indigo-100 mb-4">
            Kelola konten landing page Hibiscus Efsya dengan mudah dari sini.
          </p>
          <a
            href="https://hibiscusefsya.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Lihat Website
          </a>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
              <p className="text-sm text-slate-500">Akses cepat ke halaman edit</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="group p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-gradient-to-br from-slate-50 to-white"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-500">{action.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-slate-200"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-indigo-100">
              <Activity className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
          </div>
          
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm">Belum ada aktivitas terbaru</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white"
        >
          <h3 className="text-lg font-bold mb-2">💡 Tips</h3>
          <p className="text-emerald-100 text-sm">
            Pastikan untuk selalu preview perubahan sebelum menyimpan. 
            Gunakan gambar dengan ukuran optimal untuk loading yang cepat.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white"
        >
          <h3 className="text-lg font-bold mb-2">📊 Status Website</h3>
          <p className="text-amber-100 text-sm">
            Website aktif di <span className="font-semibold">hibiscusefsya.com</span>. 
            Semua layanan berjalan normal.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
