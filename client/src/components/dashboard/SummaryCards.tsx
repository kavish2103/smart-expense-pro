import { DollarSign, Tag, Calendar, PiggyBank } from "lucide-react";

const SummaryCards = () => {
    const cards = [
        {
            title: "Total Expenses",
            value: "$12,450",
            icon: DollarSign,
            color: "bg-blue-500",
            subtext: "+8% from last month",
            subcolor: "text-green-500"
        },
        {
            title: "Highest Category",
            value: "Housing",
            icon: Tag,
            color: "bg-purple-500",
            subtext: "$4,200 (33%)",
            subcolor: "text-gray-500"
        },
        {
            title: "Avg. Daily Spend",
            value: "$145",
            icon: Calendar,
            color: "bg-orange-500",
            subtext: "-2% from last month",
            subcolor: "text-green-500"
        },
        {
            title: "Savings Potential",
            value: "$350",
            icon: PiggyBank,
            color: "bg-emerald-500",
            subtext: "AI Estimated",
            subcolor: "text-emerald-500 font-semibold"
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${card.color} bg-opacity-10 dark:bg-opacity-20`}>
                            <card.icon className={`${card.color.replace("bg-", "text-")}`} size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{card.value}</p>
                    <span className={`text-xs ${card.subcolor}`}>{card.subtext}</span>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
