import DashboardLayout from "../components/DashboardLayout";
import HeaderSummary from "../components/dashboard/HeaderSummary";
import SummaryCards from "../components/dashboard/SummaryCards";
import OverviewChart from "../components/dashboard/OverviewChart";
import AIAdvisorCard from "../components/dashboard/AIAdvisorCard";

const Dashboard = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <HeaderSummary />

                {/* Stats Grid */}
                <SummaryCards />

                {/* Charts & AI Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <OverviewChart />
                    </div>
                    <div className="lg:col-span-1">
                        <AIAdvisorCard />
                    </div>
                </div>

                {/* Recent Transactions (Mobile Friendly Placeholder / Future Expansion) */}
                {/* <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recent Transactions</h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-gray-500 h-40">
              <p>Transaction list coming soon...</p>
            </div>
        </div> */}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
