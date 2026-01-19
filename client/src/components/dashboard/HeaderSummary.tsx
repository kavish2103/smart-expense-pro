import { ArrowUpRight } from "lucide-react";

const HeaderSummary = () => {
    return (
        <div className="mb-8">
            <h2 className="text-gray-500 dark:text-gray-400 font-medium mb-1">Your total spending this month</h2>
            <div className="flex items-end gap-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                    $3,248.00
                </h1>
                <div className="flex items-center gap-1 mb-2 px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm font-semibold">
                    <ArrowUpRight size={16} />
                    <span>12.5%</span>
                </div>
                <span className="text-sm text-gray-400 mb-2">vs last month</span>
            </div>
        </div>
    );
};

export default HeaderSummary;
