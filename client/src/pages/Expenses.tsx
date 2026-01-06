import { useEffect, useState, useCallback } from "react";
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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔁 Fetch expenses from API
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // ✅ Fetch ALL expenses by passing a high limit (1000 should be enough for most users)
      // This allows client-side pagination to work correctly
      const res = await getExpenses({ limit: 1000 });

      console.log("API Response:", res.data);

      // ✅ Backend returns { page, limit, total, totalPages, data: [...] }
      const expensesArray = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.expenses || [];

      console.log("Expenses array:", expensesArray);
      console.log("Total expenses fetched:", expensesArray.length);

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

  // ✅ Refresh when window regains focus (user comes back to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (location.pathname === "/expenses") {
        fetchExpenses();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [location.pathname, fetchExpenses]);

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
      
      // ✅ Adjust page if current page becomes empty after deletion
      const newTotalPages = Math.max(1, Math.ceil(newFiltered.length / ITEMS_PER_PAGE));
      if (page > newTotalPages) {
        setPage(newTotalPages);
      }
    } catch {
      alert("Failed to delete expense");
    }
  };

  // 📄 Pagination
  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);

  // ✅ Ensure page doesn't exceed total pages when expenses are deleted/filtered
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>My Expenses</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={fetchExpenses} title="Refresh expenses">
            🔄 Refresh
          </button>
          <button onClick={() => navigate("/create-expense")}>
            + Add Expense
          </button>
        </div>
      </div>

      {/* 🎯 Category Filter */}
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

      {/* 📭 No Expenses */}
      {filteredExpenses.length === 0 && (
        <div>
          <h3>No expenses yet</h3>
          <p>Add your first expense to get started.</p>
        </div>
      )}

      {/* 📋 Expense List */}
      <ul>
        {currentExpenses.map((exp) => (
          <li key={exp.id}>
            <strong>{exp.title}</strong> – ₹{exp.amount} ({exp.category})
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => navigate(`/expenses/edit/${exp.id}`)}
            >
              Edit
            </button>
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDelete(exp.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* ⏮ Pagination */}
      {filteredExpenses.length > 0 && totalPages > 1 && (
        <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            style={{
              padding: "8px 16px",
              cursor: page === 1 ? "not-allowed" : "pointer",
              opacity: page === 1 ? 0.5 : 1,
            }}
          >
            Previous
          </button>

          <span style={{ margin: "0 10px" }}>
            Page {page} of {totalPages} ({filteredExpenses.length} total expenses)
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            style={{
              padding: "8px 16px",
              cursor: page >= totalPages ? "not-allowed" : "pointer",
              opacity: page >= totalPages ? 0.5 : 1,
            }}
          >
            Next
          </button>
        </div>
      )}
      
      {/* Show pagination info even when only one page */}
      {filteredExpenses.length > 0 && totalPages === 1 && (
        <div style={{ marginTop: "20px", color: "#888" }}>
          Showing all {filteredExpenses.length} expenses
        </div>
      )}
    </div>
  );
};

export default Expenses;
