import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Image,
  Sparkles,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Sparkles, label: 'Hero Section', path: '/hero' },
  { icon: Users, label: 'About Section', path: '/about' },
  { icon: FileText, label: 'Services', path: '/services' },
  { icon: Phone, label: 'Contact', path: '/contact' },
  { icon: Image, label: 'Media Library', path: '/media' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] z-50 transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-[hsl(var(--border))]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center">
            <span className="text-xl">🌺</span>
          </div>
          <div>
            <h1 className="font-bold text-[hsl(var(--foreground))]">Hibiscus Admin</h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Dashboard</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto p-2 hover:bg-[hsl(var(--muted))] rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-[hsl(var(--primary))] text-white'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[hsl(var(--border))]">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center">
                <span className="text-white font-bold">
                  {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-[hsl(var(--foreground))] text-sm">
                  {user?.full_name || user?.username}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-[hsl(var(--muted-foreground))] transition-transform',
                  userMenuOpen && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-lg overflow-hidden"
                >
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="h-16 bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] flex items-center justify-between px-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 px-4">
            <h2 className="font-semibold text-[hsl(var(--foreground))]">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <a
            href="https://hibiscusefsya.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)] rounded-lg transition-colors"
          >
            View Site →
          </a>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
