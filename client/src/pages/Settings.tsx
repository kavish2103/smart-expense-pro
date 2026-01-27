import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { User, Trash2, Info, Check, Shield } from "lucide-react";
import ChangePasswordModal from "../components/settings/ChangePasswordModal";

const Settings = () => {
    const { email } = useAuth();
    const [theme] = useState(localStorage.getItem("theme") || "light");
    const [showClearSuccess, setShowClearSuccess] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);



    const handleClearData = () => {
        if (window.confirm("Are you sure you want to clear cached data? This will not delete your account but resets local settings.")) {
            // Keep auth token and necessary keys
            const token = localStorage.getItem("token");
            const userEmail = localStorage.getItem("user_email");
            const knownAccounts = localStorage.getItem("known_accounts");

            localStorage.clear();

            // Restore auth
            if (token) localStorage.setItem("token", token);
            if (userEmail) localStorage.setItem("user_email", userEmail);
            if (knownAccounts) localStorage.setItem("known_accounts", knownAccounts);

            // Re-apply theme
            localStorage.setItem("theme", theme);

            setShowClearSuccess(true);
            setTimeout(() => setShowClearSuccess(false), 3000);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage your account and preferences</p>
                    </div>
                </div>

                <div className="grid gap-8">

                    {/* Account Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                            <User className="text-blue-500" size={24} />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Account Information</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                                    <p className="text-gray-900 dark:text-white font-medium mt-1">{email}</p>
                                </div>
                                <button className="text-sm px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors">
                                    Edit Profile
                                </button>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Password</p>
                                    <p className="text-gray-900 dark:text-white font-medium mt-1">••••••••</p>
                                </div>
                                <button
                                    onClick={() => setIsChangePasswordOpen(true)}
                                    className="text-sm px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>



                    {/* Data & System Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                            <Info className="text-gray-500" size={24} />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">System</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Clear Cache</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Clear local data and refresh the application</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {showClearSuccess && <span className="text-green-500 text-sm flex items-center gap-1"><Check size={14} /> Cleared</span>}
                                    <button
                                        onClick={handleClearData}
                                        className="text-sm px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Clear Data
                                    </button>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-center text-gray-400">
                                    Smart Expense Pro v1.0.0
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            />
        </DashboardLayout>
    );
};

export default Settings;
