import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Image,
  Sparkles,
  Phone,
  Bell,
  Search,
  Sun,
  ExternalLink,
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-slate-800 z-50 transition-all duration-300 lg:translate-x-0 shadow-xl',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-xl">🌺</span>
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden"
            >
              <h1 className="font-bold text-white text-lg">Hibiscus</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </motion.div>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto p-2 hover:bg-slate-700 rounded-lg lg:hidden text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 mt-2">
          <p className={cn("text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3", sidebarCollapsed && "text-center")}>
            {sidebarCollapsed ? '•' : 'Menu'}
          </p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                )
              }
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", sidebarCollapsed && "mx-auto")} />
              {!sidebarCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse button - Desktop only */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-indigo-500 rounded-full items-center justify-center text-white shadow-lg hover:bg-indigo-600 transition-colors"
        >
          <ChevronDown className={cn("w-4 h-4 transition-transform", sidebarCollapsed ? "-rotate-90" : "rotate-90")} />
        </button>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-700/50 transition-colors",
                sidebarCollapsed && "justify-center"
              )}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
                </span>
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="font-medium text-white text-sm truncate">
                      {user?.full_name || user?.username}
                    </p>
                    <p className="text-xs text-slate-400 capitalize truncate">
                      {user?.role?.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-slate-400 transition-transform flex-shrink-0',
                      userMenuOpen && 'rotate-180'
                    )}
                  />
                </>
              )}
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-slate-700 border border-slate-600 rounded-xl shadow-xl overflow-hidden"
                >
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn("transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-xl lg:hidden text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2 w-64">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder-slate-400 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Theme toggle placeholder */}
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-600">
              <Sun className="w-5 h-5" />
            </button>

            {/* View Site */}
            <a
              href="https://hibiscusefsya.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/30"
            >
              <ExternalLink className="w-4 h-4" />
              View Site
            </a>
          </div>
        </header>

        {/* Page Header */}
        <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">
            {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {location.pathname === '/' && 'Welcome back! Here\'s what\'s happening with your site.'}
            {location.pathname === '/hero' && 'Customize your landing page hero section.'}
            {location.pathname === '/about' && 'Edit the about section content.'}
            {location.pathname === '/services' && 'Manage your services and offerings.'}
            {location.pathname === '/contact' && 'Update contact information.'}
          </p>
        </div>

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
