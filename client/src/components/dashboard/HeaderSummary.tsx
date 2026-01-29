import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface HeaderSummaryProps {
    totalSpent: number;
    percentageChange: number;
}

const HeaderSummary = ({ totalSpent, percentageChange }: HeaderSummaryProps) => {
    const isIncrease = percentageChange >= 0;

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-gray-500 dark:text-gray-400 font-medium mb-1">Your total spending this month</h2>
            <div className="flex items-end gap-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                    ₹{totalSpent.toLocaleString('en-IN')}
                </h1>

                {percentageChange !== 0 && (
                    <div className={`flex items-center gap-1 mb-2 px-2 py-1 rounded-lg text-sm font-semibold 
                        ${isIncrease
                            ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                            : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"}`}
                    >
                        {isIncrease ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span>{Math.abs(percentageChange).toFixed(1)}%</span>
                    </div>
                )}
                <span className="text-sm text-gray-400 mb-2">vs last month</span>
            </div>
        </div>
    );
};

export default HeaderSummary;
