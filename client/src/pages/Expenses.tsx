import { useEffect, useState } from "react";
import { deleteExpense, getExpenses } from "../api/expense.api";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
};

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getExpenses();
      setExpenses(res.data);
    } catch (err) {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await deleteExpense(id);
      // Remove deleted expense from UI
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete expense");
    }
  };

  if (loading) return <p>Loading your expenses...</p>;
  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={fetchExpenses}>Retry</button>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div>
        <h2>No expenses yet</h2>
        <p>Add your first expense to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>My Expenses</h2>

      {expenses.length === 0 && <p>No expenses found</p>}

      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            <strong>{exp.title}</strong> – ₹{exp.amount} ({exp.category})
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDelete(exp.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Expenses;
