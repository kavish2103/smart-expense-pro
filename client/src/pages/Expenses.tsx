import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteExpense, getExpenses } from "../api/expense.api";
import ExpenseCharts from "../components/ExpenseCharts";

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

  // 📊 Category Analytics
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    sortedExpenses.forEach((exp) => {
      const cat = exp.category.toLowerCase();
      totals[cat] = (totals[cat] || 0) + exp.amount;
    });
    return totals;
  }, [sortedExpenses]);

  // 📄 Pagination
  const totalPages = Math.max(1, Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentExpenses = sortedExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  if (loading) return <p>Loading your expenses...</p>;

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={fetchExpenses}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {/* 🔝 Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>My Expenses</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={fetchExpenses}>🔄 Refresh</button>
          <button onClick={exportAllToCSV}>⬇ Export All</button>
          <button onClick={handleExportFiltered}>⬇ Export Filtered</button>
          <button onClick={handleExportPage}>⬇ Export Page</button>
          <button onClick={() => navigate("/create-expense")}>+ Add Expense</button>
        </div>
      </div>

      {/* 📊 Summary */}
      {sortedExpenses.length > 0 && (
        <div style={{ marginBottom: "15px", padding: "10px", border: "1px solid #333", borderRadius: "8px" }}>
          <strong>Total Expenses:</strong> {sortedExpenses.length} |{" "}
          <strong>Total Spent:</strong> ₹{totalAmount}
        </div>
      )}

      {/* 📊 Charts */}
      {sortedExpenses.length > 0 && <ExpenseCharts expenses={sortedExpenses} />}

      {/* 🎛 Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="travel">Travel</option>
          <option value="food">Food</option>
          <option value="drink">Drink</option>
          <option value="cloths">Cloths</option>
        </select>

        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />

        {(fromDate || toDate) && (
          <button onClick={() => { setFromDate(""); setToDate(""); }}>
            Clear Dates
          </button>
        )}

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amount_desc">Amount: High → Low</option>
          <option value="amount_asc">Amount: Low → High</option>
          <option value="title_asc">Title: A → Z</option>
        </select>
      </div>

      {/* 📋 List */}
      <ul>
        {currentExpenses.map((exp) => (
          <li key={exp.id}>
            <strong>{exp.title}</strong> – ₹{exp.amount} ({exp.category})
            <button style={{ marginLeft: "10px" }} onClick={() => navigate(`/expenses/edit/${exp.id}`)}>Edit</button>
            <button style={{ marginLeft: "10px" }} onClick={() => handleDelete(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* ⏮ Pagination */}
      {sortedExpenses.length > 0 && totalPages > 1 && (
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button disabled={page === 1} onClick={() => setPage((p) => Math.max(p - 1, 1))}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(p + 1, totalPages))}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Expenses;
