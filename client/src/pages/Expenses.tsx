import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteExpense, getExpenses } from "../api/expense.api";

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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔁 Fetch expenses from API
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

  // ✅ Always refetch when coming to /expenses
  useEffect(() => {
    if (location.pathname === "/expenses") {
      fetchExpenses();
    }
  }, [location.pathname, location.key, fetchExpenses]);

  // 🎯 Filter by category
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);

    if (value === "all") {
      setFilteredExpenses(allExpenses);
    } else {
      const filtered = allExpenses.filter(
        (exp) => exp.category.toLowerCase() === value.toLowerCase()
      );
      setFilteredExpenses(filtered);
    }
  };

  // ❌ Delete expense
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await deleteExpense(id);
      const updated = allExpenses.filter((e) => e.id !== id);
      setAllExpenses(updated);

      const newFiltered =
        category === "all"
          ? updated
          : updated.filter(
              (exp) => exp.category.toLowerCase() === category.toLowerCase()
            );

      setFilteredExpenses(newFiltered);

      const newTotalPages = Math.max(
        1,
        Math.ceil(newFiltered.length / ITEMS_PER_PAGE)
      );
      if (page > newTotalPages) {
        setPage(newTotalPages);
      }
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
  const totalPages = Math.max(
    1,
    Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE)
  );
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentExpenses = sortedExpenses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>My Expenses</h2>
        <div>
          <button onClick={fetchExpenses}>🔄 Refresh</button>
          <button onClick={() => navigate("/create-expense")}>
            + Add Expense
          </button>
        </div>
      </div>

      {/* 📊 Summary */}
      {sortedExpenses.length > 0 && (
        <div style={{ margin: "10px 0", padding: "10px", border: "1px solid #333" }}>
          <strong>Total Expenses:</strong> {sortedExpenses.length} &nbsp; | &nbsp;
          <strong>Total Spent:</strong> ₹{totalAmount}
        </div>
      )}

      {/* 📊 Category Analytics */}
      {Object.keys(categoryTotals).length > 0 && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            border: "1px solid #333",
          }}
        >
          <h3>Spending by Category</h3>
          <ul>
            {Object.entries(categoryTotals).map(([cat, total]) => (
              <li key={cat}>
                <strong>{cat.toUpperCase()}</strong> → ₹{total}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🎛 Filters & Sorting */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="travel">Travel</option>
          <option value="food">Food</option>
          <option value="drink">Drink</option>
          <option value="cloths">Cloths</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amount_desc">Amount: High → Low</option>
          <option value="amount_asc">Amount: Low → High</option>
          <option value="title_asc">Title: A → Z</option>
        </select>
      </div>

      {/* 📋 Expense List */}
      <ul>
        {currentExpenses.map((exp) => (
          <li key={exp.id}>
            <strong>{exp.title}</strong> – ₹{exp.amount} ({exp.category})
            <button onClick={() => navigate(`/expenses/edit/${exp.id}`)}>Edit</button>
            <button onClick={() => handleDelete(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* ⏮ Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: "10px" }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span> Page {page} of {totalPages} </span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Expenses;
