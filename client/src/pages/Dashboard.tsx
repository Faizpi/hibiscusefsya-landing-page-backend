import { useEffect, useState } from 'react';
import { settingsApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Mail, 
  Activity,
  TrendingUp,
  Users,
  Clock
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
      value: stats?.totalServices || 0,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Contact Submissions',
      value: stats?.totalSubmissions || 0,
      icon: Mail,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Unread Messages',
      value: stats?.unreadSubmissions || 0,
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Growth',
      value: '+12%',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Dashboard</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Welcome back! Here's an overview of your landing page.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))] hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{stat.title}</p>
                <p className="text-3xl font-bold mt-1 text-[hsl(var(--foreground))]">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: 'inherit' }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-[hsl(var(--primary))]" />
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Recent Activity</h2>
          </div>
          
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--muted)/0.5)] hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                      {activity.action}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {activity.username || 'System'} • {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[hsl(var(--muted-foreground))] text-center py-8">
              No recent activity
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[hsl(var(--accent))]" />
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/hero"
              className="p-4 rounded-lg bg-gradient-to-br from-[hsl(var(--primary)/0.1)] to-transparent border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] transition-colors text-center"
            >
              <LayoutDashboard className="w-6 h-6 mx-auto mb-2 text-[hsl(var(--primary))]" />
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">Edit Hero</p>
            </a>
            <a
              href="/services"
              className="p-4 rounded-lg bg-gradient-to-br from-[hsl(var(--accent)/0.1)] to-transparent border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))] transition-colors text-center"
            >
              <FileText className="w-6 h-6 mx-auto mb-2 text-[hsl(var(--accent))]" />
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">Manage Services</p>
            </a>
            <a
              href="/about"
              className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-transparent border border-[hsl(var(--border))] hover:border-green-500 transition-colors text-center"
            >
              <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">Edit About</p>
            </a>
            <a
              href="/contact"
              className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-transparent border border-[hsl(var(--border))] hover:border-orange-500 transition-colors text-center"
            >
              <Mail className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">Edit Contact</p>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
