import { useEffect, useState, useMemo } from "react";
import { getExpenses } from "../api/expense.api";
import ExpenseCharts from "../components/ExpenseCharts";
import DashboardLayout from "../components/DashboardLayout";
import { IndianRupee, Receipt, TrendingUp, Wallet, ArrowUpRight } from "lucide-react";

type Expense = {
    id: string;
    title: string;
    amount: number;
    category: string;
    createdAt: string;
};

const Summaries = () => {
    const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchExpenses = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getExpenses({ limit: 10000 }); // Fetch all for summary
                const expensesArray = Array.isArray(res.data)
                    ? res.data
                    : res.data?.data || res.data?.expenses || [];
                setAllExpenses(expensesArray);
            } catch (err) {
                console.error("Error fetching expenses for summary:", err);
                setError("Failed to load expenses");
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const totalAmount = useMemo(
        () => allExpenses.reduce((sum, exp) => sum + exp.amount, 0),
        [allExpenses]
    );

    const averageTransaction = useMemo(
        () => allExpenses.length > 0 ? Math.round(totalAmount / allExpenses.length) : 0,
        [totalAmount, allExpenses.length]
    );

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-center">
                    {error}
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Summary</h1>
                        <p className="text-gray-500 dark:text-gray-400">Overview of your spending habits and trends</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Spent Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                    ₹{totalAmount.toLocaleString()}
                                </h3>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <Wallet size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            <span className="flex items-center text-red-500 mr-2">
                                <ArrowUpRight size={16} className="mr-1" />
                                Expense
                            </span>
                            <span>Across all categories</span>
                        </div>
                    </div>

                    {/* Transaction Count Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Transactions</p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                    {allExpenses.length}
                                </h3>
                            </div>
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                <Receipt size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            <span className="flex items-center text-green-500 mr-2">
                                <ArrowUpRight size={16} className="mr-1" />
                                100%
                            </span>
                            <span>Recorded entries</span>
                        </div>
                    </div>

                    {/* Average Transaction Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Spend</p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                    ₹{averageTransaction.toLocaleString()}
                                </h3>
                            </div>
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                <IndianRupee size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            <span className="text-gray-400">
                                Per transaction average
                            </span>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                {allExpenses.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Analytics</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Visual breakdown of your expenses</p>
                        </div>
                        <ExpenseCharts expenses={allExpenses} />
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                            <TrendingUp size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No data available</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Start adding expenses to see your summary.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Summaries;
