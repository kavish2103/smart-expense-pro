import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Receipt,
    BrainCircuit,
    TrendingUp,
    Settings,
    LogOut,
    History,
    X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Expenses", icon: Receipt, path: "/expenses" },
        { name: "AI Advisor", icon: BrainCircuit, path: "/ai-adviser" },
        { name: "Ai History", icon: History, path: "/ai-history" },
        { name: "Summary", icon: TrendingUp, path: "/summaries" },
        { name: "Settings", icon: Settings, path: "/settings" },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
        onClose();
    };

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 
                border-r border-gray-200 dark:border-gray-700 shadow-xl flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
            `}
        >
            <div className="p-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Smart Expense
                </h1>
                <button
                    onClick={onClose}
                    className="md:hidden p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md"
                                }
              `}
                        >
                            <item.icon size={20} className={isActive ? "text-white" : "text-gray-500 group-hover:text-blue-500"} />
                            <span className="font-medium">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
