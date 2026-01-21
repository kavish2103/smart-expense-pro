import "chart.js/auto";
import { Pie, Bar } from "react-chartjs-2";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
};

interface Props {
  expenses: Expense[];
}

const ExpenseCharts = ({ expenses }: Props) => {
  // 📊 Category totals
  const categoryMap: Record<string, number> = {};
  expenses.forEach((exp) => {
    const cat = exp.category.toUpperCase();
    categoryMap[cat] = (categoryMap[cat] || 0) + exp.amount;
  });

  const categoryData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        label: "Spending by Category",
        data: Object.values(categoryMap),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
        ],
      },
    ],
  };

  // 📅 Monthly totals
  const monthMap: Record<string, number> = {};
  expenses.forEach((exp) => {
    const month = new Date(exp.createdAt).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthMap[month] = (monthMap[month] || 0) + exp.amount;
  });

  const monthlyData = {
    labels: Object.keys(monthMap),
    datasets: [
      {
        label: "Monthly Spending",
        data: Object.values(monthMap),
        backgroundColor: "#36a2eb",
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Analytics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            By Category
          </h4>
          <div className="w-full max-w-[300px]">
            <Pie data={categoryData} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            By Month
          </h4>
          <div className="w-full">
            <Bar data={monthlyData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;
