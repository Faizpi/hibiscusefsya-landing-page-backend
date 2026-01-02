import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-boxdark-2 p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-boxdark rounded-2xl shadow-theme-lg overflow-hidden min-h-[600px]">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-between bg-brand-600 p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-8">
              <span className="font-bold text-2xl">H</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Manage your content with ease.
            </h1>
            <p className="text-brand-100 text-lg">
              Hibiscus Admin Dashboard gives you full control over your landing page content, services, and media.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-600 bg-brand-400" />
              ))}
            </div>
            <p className="mt-4 text-brand-100 text-sm">Trusted by the team</p>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-500 opacity-50 blur-3xl z-0" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-brand-700 opacity-50 blur-3xl z-0" />
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
          >
            <div className="text-center lg:text-left mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
              <p className="text-gray-500 dark:text-gray-400">Please sign in to your dashboard account</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6 dark:bg-red-900/20 dark:border-red-900/50"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@hibiscusefsya.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-meta-4 border border-gray-200 dark:border-strokedark rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <a href="#" className="text-sm text-brand-600 hover:text-brand-700 font-medium">Forgot?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-meta-4 border border-gray-200 dark:border-strokedark rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer">Remember me for 30 days</label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-8 text-center bg-gray-50 dark:bg-meta-4 p-4 rounded-lg border border-dashed border-gray-300 dark:border-strokedark">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Demo Credentials</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                admin@hibiscusefsya.com
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                admin123
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
