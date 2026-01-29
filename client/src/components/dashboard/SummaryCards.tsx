import { DollarSign, Tag, Calendar, PiggyBank } from "lucide-react";

interface SummaryCardsProps {
    stats: {
        totalSpent: number;
        percentageChange: number;
        highestCategory: { category: string; amount: number } | null;
        avgDailyId: number;
        totalBudgetLimit: number;
        totalBudgetRemaining: number;
    } | null;
    loading: boolean;
}

const SummaryCards = ({ stats, loading }: SummaryCardsProps) => {
    if (loading || !stats) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: "Total Expenses",
            value: `₹${stats.totalSpent.toLocaleString('en-IN')}`,
            icon: DollarSign,
            color: "bg-blue-500",
            subtext: `${stats.percentageChange > 0 ? '+' : ''}${stats.percentageChange.toFixed(1)}% from last month`,
            subcolor: stats.percentageChange > 0 ? "text-red-500" : "text-green-500"
        },
        {
            title: "Highest Category",
            value: stats.highestCategory ? stats.highestCategory.category : "N/A",
            icon: Tag,
            color: "bg-purple-500",
            subtext: stats.highestCategory ? `₹${stats.highestCategory.amount.toLocaleString('en-IN')}` : "No Data",
            subcolor: "text-gray-500"
        },
        {
            title: "Avg. Daily Spend",
            value: `₹${Math.round(stats.avgDailyId).toLocaleString('en-IN')}`,
            icon: Calendar,
            color: "bg-orange-500",
            subtext: "Current Month",
            subcolor: "text-gray-500"
        },
        {
            title: "Budget Remaining",
            value: `₹${stats.totalBudgetRemaining.toLocaleString('en-IN')}`,
            icon: PiggyBank,
            color: stats.totalBudgetRemaining > 0 ? "bg-emerald-500" : "bg-red-500",
            subtext: `of ₹${stats.totalBudgetLimit.toLocaleString('en-IN')} Total Limit`,
            subcolor: stats.totalBudgetRemaining > 0 ? "text-emerald-500 font-semibold" : "text-red-500 font-semibold"
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {cards.map((card, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${card.color} bg-opacity-10 dark:bg-opacity-20`}>
                            <card.icon className={`${card.color.replace("bg-", "text-")}`} size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate" title={card.value}>{card.value}</p>
                    <span className={`text-xs ${card.subcolor}`}>{card.subtext}</span>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
