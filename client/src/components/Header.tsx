import React from 'react';
import {
    Menu,
    Search,
    Bell,
    User,
    ChevronDown,
    LogOut,
    Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-40 flex w-full bg-white drop-shadow-sm border-b border-gray-200 dark:bg-boxdark dark:drop-shadow-none">
            <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    {/* Hamburger Toggle BTN */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSidebarOpen(!sidebarOpen);
                        }}
                        className="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                    {/* Hamburger Toggle BTN */}

                    <span className="text-xl font-bold text-gray-900 lg:hidden">Hibiscus</span>
                </div>

                <div className="hidden sm:block">
                    <form action="https://formbold.com/s/unique_form_id" method="POST">
                        <div className="relative">
                            <button className="absolute left-0 top-1/2 -translate-y-1/2">
                                <Search className="w-5 h-5 text-gray-400" />
                            </button>

                            <input
                                type="text"
                                placeholder="Type to search..."
                                className="w-full bg-transparent pl-9 pr-4 text-gray-600 focus:outline-none xl:w-125"
                            />
                        </div>
                    </form>
                </div>

                <div className="flex items-center gap-3 2xsm:gap-7">
                    <ul className="flex items-center gap-2 2xsm:gap-4">
                        {/* Notification Menu Area */}
                        <li className="relative">
                            <button
                                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 hover:text-red-500 focus:outline-none"
                            >
                                <span className="absolute -top-0.5 right-0 z-1 h-2.5 w-2.5 rounded-full bg-red-600 inline">
                                    <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
                                </span>
                                <Bell className="w-5 h-5" />
                            </button>
                        </li>
                        {/* Notification Menu Area */}
                    </ul>

                    {/* User Area */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-4"
                        >
                            <span className="hidden text-right lg:block">
                                <span className="block text-sm font-medium text-black dark:text-white">
                                    {user?.full_name || 'Administrator'}
                                </span>
                                <span className="block text-xs text-gray-500">System Admin</span>
                            </span>

                            <span className="h-11 w-11 rounded-full bg-gray-200 overflow-hidden">
                                <div className="flex w-full h-full items-center justify-center bg-red-100 text-red-600 font-bold text-lg">
                                    {user?.full_name?.charAt(0) || 'A'}
                                </div>
                            </span>

                            <ChevronDown className={`w-4 h-4 text-gray-600 duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Start */}
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark border-gray-200 shadow-lg rounded-xl min-w-[200px]"
                                >
                                    <ul className="flex flex-col gap-1 border-b border-stroke border-gray-200 p-2">
                                        <li>
                                            <button
                                                className="flex w-full items-center gap-3.5 px-4 py-2 text-sm font-medium duration-300 ease-in-out hover:bg-gray-100 hover:text-red-600 rounded-lg text-gray-600"
                                            >
                                                <User className="w-5 h-5" />
                                                My Profile
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="flex w-full items-center gap-3.5 px-4 py-2 text-sm font-medium duration-300 ease-in-out hover:bg-gray-100 hover:text-red-600 rounded-lg text-gray-600"
                                            >
                                                <Settings className="w-5 h-5" />
                                                Account Settings
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="p-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3.5 px-4 py-2 text-sm font-medium duration-300 ease-in-out hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-600"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Log Out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {/* Dropdown End */}
                    </div>
                    {/* User Area */}
                </div>
            </div>
        </header>
    );
};

export default Header;
