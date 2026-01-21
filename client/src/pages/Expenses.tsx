import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteExpense, getExpenses } from "../api/expense.api";
import ExpenseCharts from "../components/ExpenseCharts";
import DashboardLayout from "../components/DashboardLayout";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
};

const ITEMS_PER_PAGE = 10;

const Expenses = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔁 Fetch expenses
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getExpenses({ limit: 1000 });

      const expensesArray = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.expenses || [];

      setAllExpenses(expensesArray);
      setFilteredExpenses(expensesArray);
      setPage(1);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  // Always refetch on /expenses
  useEffect(() => {
    if (location.pathname === "/expenses") {
      fetchExpenses();
    }
  }, [location.pathname, location.key, fetchExpenses]);

  // Refresh when tab regains focus
  useEffect(() => {
    const handleFocus = () => {
      if (location.pathname === "/expenses") {
        fetchExpenses();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [location.pathname, fetchExpenses]);

  // 📤 Export All
  const exportAllToCSV = () => {
    if (allExpenses.length === 0) {
      alert("No expenses to export");
      return;
    }

    const headers = ["Title", "Amount", "Category", "Date"];
    const rows = allExpenses.map((exp) => [
      exp.title,
      exp.amount,
      exp.category,
      new Date(exp.createdAt).toISOString().split("T")[0],
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "all-expenses.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // 📤 Export Filtered
  const handleExportFiltered = () => {
    if (sortedExpenses.length === 0) {
      alert("No expenses to export");
      return;
    }

    const headers = ["Title", "Amount", "Category", "Date"];
    const rows = sortedExpenses.map((exp) => [
      exp.title,
      exp.amount,
      exp.category,
      new Date(exp.createdAt).toISOString().split("T")[0],
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered-expenses.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // 📤 Export Page
  const handleExportPage = () => {
    if (currentExpenses.length === 0) {
      alert("No expenses on this page to export");
      return;
    }

    const headers = ["Title", "Amount", "Category", "Date"];
    const rows = currentExpenses.map((exp) => [
      exp.title,
      exp.amount,
      exp.category,
      new Date(exp.createdAt).toISOString().split("T")[0],
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `expenses-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 🎯 Apply Category + Search + Date Filters
  useEffect(() => {
    let result = [...allExpenses];

    if (category !== "all") {
      result = result.filter(
        (exp) => exp.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim() !== "") {
      result = result.filter((exp) =>
        exp.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (fromDate) {
      const from = new Date(fromDate);
      result = result.filter((exp) => new Date(exp.createdAt) >= from);
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      result = result.filter((exp) => new Date(exp.createdAt) <= to);
    }

    setFilteredExpenses(result);
    setPage(1);
  }, [category, search, fromDate, toDate, allExpenses]);

  // ❌ Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await deleteExpense(id);
      const updated = allExpenses.filter((e) => e.id !== id);
      setAllExpenses(updated);
    } catch {
      alert("Failed to delete expense");
    }
  };

  // 🔃 Sorting
  const sortedExpenses = useMemo(() => {
    const sorted = [...filteredExpenses];

    switch (sortBy) {
      case "date_asc":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        );
      case "date_desc":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
      case "amount_asc":
        return sorted.sort((a, b) => a.amount - b.amount);
      case "amount_desc":
        return sorted.sort((a, b) => b.amount - a.amount);
      case "title_asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }, [filteredExpenses, sortBy]);

  // 📊 Summary
  const totalAmount = useMemo(
    () => sortedExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    [sortedExpenses]
  );

  // 📄 Pagination
  const totalPages = Math.max(1, Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentExpenses = sortedExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex flex-col items-center">
          <p>{error}</p>
          <button
            onClick={fetchExpenses}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 🔝 Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Expenses</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchExpenses}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm transition"
            >
              🔄 Refresh
            </button>
            <div className="relative group">
              <button className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm transition">
                ⬇ Export
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-lg hidden group-hover:block z-10">
                <button onClick={exportAllToCSV} className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">All Expenses</button>
                <button onClick={handleExportFiltered} className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">Filtered Expenses</button>
                <button onClick={handleExportPage} className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">Current Page</button>
              </div>
            </div>

            <button
              onClick={() => navigate("/create-expense")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition shadow-sm"
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* 📊 Summary Cards */}
        {sortedExpenses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{sortedExpenses.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* 📊 Charts */}
        {sortedExpenses.length > 0 && <ExpenseCharts expenses={sortedExpenses} />}

        {/* 🎛 Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="travel">Travel</option>
              <option value="food">Food</option>
              <option value="drink">Drink</option>
              <option value="cloths">Cloths</option>
            </select>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Amount: High → Low</option>
              <option value="amount_asc">Amount: Low → High</option>
              <option value="title_asc">Title: A → Z</option>
            </select>
          </div>
          {(fromDate || toDate) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => { setFromDate(""); setToDate(""); }}
                className="text-xs text-red-500 hover:text-red-600 underline"
              >
                Clear Date Filter
              </button>
            </div>
          )}
        </div>

        {/* 📋 List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {currentExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No expenses found.
                    </td>
                  </tr>
                ) : (
                  currentExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{exp.title}</td>
                      <td className="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">₹{exp.amount}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 capitalize">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(exp.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => navigate(`/expenses/edit/${exp.id}`)}
                          className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ⏮ Pagination */}
          {sortedExpenses.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className={`px-4 py-2 text-sm rounded-lg transition ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'bg-white shadow text-gray-700 hover:bg-gray-100'}`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page <span className="font-semibold">{page}</span> of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className={`px-4 py-2 text-sm rounded-lg transition ${page >= totalPages ? 'text-gray-400 cursor-not-allowed' : 'bg-white shadow text-gray-700 hover:bg-gray-100'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
