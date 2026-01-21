import { Search, Bell, Mail, LogOut, UserPlus, Lock, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";

const TopNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { logout, email, login } = useAuth();
    const navigate = useNavigate();

    // Account Switching State
    const [knownAccounts, setKnownAccounts] = useState<{ email: string; name: string }[]>([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [targetEmail, setTargetEmail] = useState("");
    const [switchPassword, setSwitchPassword] = useState("");
    const [switchError, setSwitchError] = useState("");
    const [isSwitching, setIsSwitching] = useState(false);

    useEffect(() => {
        const accounts = JSON.parse(localStorage.getItem("known_accounts") || "[]");
        setKnownAccounts(accounts);
    }, [isDropdownOpen]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleAddAccount = () => {
        // Clear current session but keep known accounts, then go to login
        logout();
        navigate("/login");
    };

    const initiateSwitchAccount = (accountEmail: string) => {
        setTargetEmail(accountEmail);
        setSwitchPassword("");
        setSwitchError("");
        setIsDropdownOpen(false);
        setShowPasswordModal(true);
    };

    const confirmSwitchAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSwitching(true);
        setSwitchError("");

        try {
            const data = await loginUser(targetEmail, switchPassword);
            login(data.token, targetEmail);
            setShowPasswordModal(false);
            // Stay on current page or redirect to dashboard?
            // Dashboard is safer as some pages might be user-specific
            navigate("/dashboard");
        } catch (err) {
            setSwitchError("Invalid password");
        } finally {
            setIsSwitching(false);
        }
    };

    const otherAccounts = knownAccounts.filter(acc => acc.email !== email);

    return (
        <>
            <header className="h-16 fixed top-0 right-0 left-0 md:left-64 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-40 px-6 flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-xl">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search expenses, categories, insights..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-400 text-gray-700 dark:text-gray-200"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4 ml-4">
                    <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1"></div>

                    {/* Profile / Mail Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Mail size={20} />
                            </div>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Signed in as</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{email}</p>
                                </div>

                                <div className="p-2">
                                    <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Switch Account
                                    </p>

                                    {otherAccounts.length === 0 && (
                                        <p className="px-3 py-2 text-sm text-gray-400 italic">No other accounts logged in.</p>
                                    )}

                                    {otherAccounts.map((acc) => (
                                        <button
                                            key={acc.email}
                                            onClick={() => initiateSwitchAccount(acc.email)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-left"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 text-xs font-bold">
                                                {acc.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 truncate">
                                                <p className="font-medium">{acc.name}</p>
                                                <p className="text-xs text-gray-500">{acc.email}</p>
                                            </div>
                                        </button>
                                    ))}

                                    <button
                                        onClick={handleAddAccount}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors mt-1"
                                    >
                                        <UserPlus size={16} />
                                        <span>Add another account</span>
                                    </button>
                                </div>

                                <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Overlay to close dropdown when clicking outside */}
                    {isDropdownOpen && (
                        <div
                            className="fixed inset-0 z-30"
                            onClick={() => setIsDropdownOpen(false)}
                        ></div>
                    )}
                </div>
            </header>

            {/* Password Verification Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm m-4 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Verify Identity</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Enter password for</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{targetEmail}</p>
                        </div>

                        <form onSubmit={confirmSwitchAccount}>
                            <div className="space-y-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={switchPassword}
                                        onChange={(e) => setSwitchPassword(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                {switchError && <p className="text-xs text-red-500">{switchError}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSwitching}
                                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {isSwitching ? "Verifying..." : "Switch Account"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default TopNavbar;
