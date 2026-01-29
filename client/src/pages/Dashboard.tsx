import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import HeaderSummary from "../components/dashboard/HeaderSummary";
import SummaryCards from "../components/dashboard/SummaryCards";
import BudgetCard from "../components/dashboard/BudgetCard";
import { getDashboardStats } from "../api/dashboard.api";

const Dashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [budgets, setBudgets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            console.log("Fetching stats...");
            const res = await getDashboardStats();
            console.log("Stats received:", res.data);

            if (!res.data || !res.data.summary) {
                alert("Debug: API returned empty data structure");
                return;
            }

            setStats(res.data.summary);
            setBudgets(res.data.budgets || []);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Dynamic Budget List (from API)
    // The API now returns a merged list of all categories that have a budget OR expenses
    const budgetList = budgets;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <HeaderSummary
                    totalSpent={stats?.totalSpent || 0}
                    percentageChange={stats?.percentageChange || 0}
                />

                {/* Stats Grid */}
                <SummaryCards stats={stats} loading={loading} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Budget Section (Main) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Category Budgets</h3>
                                <button
                                    onClick={fetchStats}
                                    disabled={loading}
                                    className="text-sm text-indigo-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Refreshing..." : "Refresh"}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {budgetList.slice(0, 4).map((budget: any) => (
                                    <BudgetCard
                                        key={budget.category}
                                        {...budget}
                                        onUpdate={fetchStats}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Side Widgets */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Remaining Budgets (Overflow) */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-semibold text-gray-500 mb-3">Other Categories</h4>
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 overscroll-contain">
                                {budgetList.slice(4).map((budget: any) => (
                                    <BudgetCard
                                        key={budget.category}
                                        {...budget}
                                        onUpdate={fetchStats}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
