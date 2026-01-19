import { Search, Bell } from "lucide-react";

const TopNavbar = () => {
    return (
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

                <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                        VP
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Profile
                    </span>
                </button>
            </div>
        </header>
    );
};

export default TopNavbar;
