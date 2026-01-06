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
    <div style={{ marginBottom: "30px" }}>
      <h3>📊 Expense Analytics</h3>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        <div style={{ width: "300px" }}>
          <h4>By Category</h4>
          <Pie data={categoryData} />
        </div>

        <div style={{ width: "500px" }}>
          <h4>By Month</h4>
          <Bar data={monthlyData} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;
