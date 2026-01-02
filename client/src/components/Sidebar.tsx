import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Info, 
  Briefcase, 
  Phone, 
  Image as ImageIcon, 
  Settings, 
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const menuItems = [
    {
      group: 'MENU',
      items: [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/hero', icon: FileText, label: 'Hero Section' },
        { path: '/about', icon: Info, label: 'About Section' },
        { path: '/services', icon: Briefcase, label: 'Services' },
        { path: '/contact', icon: Phone, label: 'Contact' },
      ]
    },
    {
      group: 'OTHERS',
      items: [
        { path: '/media', icon: ImageIcon, label: 'Media Library' },
        { path: '/settings', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 border-r border-gray-200 ${
        sidebarOpen ? 'w-[290px] translate-x-0' : 'w-[90px] -translate-x-full lg:w-[90px]'
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/" className="flex items-center gap-3">
            <div className={`flex items-center justify-center rounded bg-red-600 text-white ${sidebarOpen ? 'h-10 w-10 text-xl' : 'h-8 w-8 text-lg'}`}>
              <span className="font-bold">H</span>
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold text-gray-900">
                Hibiscus
              </span>
            )}
        </NavLink>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block lg:hidden"
        >
          <ChevronLeft />
        </button>
      </div>
      {/* SIDEBAR HEADER */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Sidebar Menu */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {menuItems.map((group, groupIndex) => (
            <div key={groupIndex}>
              {sidebarOpen && (
                <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 uppercase">
                  {group.group}
                </h3>
              )}
              {!sidebarOpen && groupIndex > 0 && <div className="my-4 border-t border-gray-100" />}
              
              <ul className="mb-6 flex flex-col gap-1.5">
                {group.items.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                    
                    return (
                        <li key={item.path}>
                        <NavLink
                            to={item.path}
                            className={`group relative flex items-center gap-2.5 rounded-lg py-3 px-4 font-medium duration-300 ease-in-out ${
                            isActive
                                ? 'bg-red-50 text-red-600 dark:bg-meta-4'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className={`h-6 w-6 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
                            <span className={`${!sidebarOpen && 'hidden'} origin-left duration-200`}>
                                {item.label}
                            </span>
                             {/* Tooltip for collapsed state could go here */}
                        </NavLink>
                        </li>
                    )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
