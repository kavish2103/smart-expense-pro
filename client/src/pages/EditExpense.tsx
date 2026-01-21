import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getExpenses, updateExpense } from "../api/expense.api";

import DashboardLayout from "../components/DashboardLayout";

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await getExpenses();
        const expense = (res.data.data || res.data).find(
          (e: any) => e.id === id
        );

        if (!expense) {
          alert("Expense not found");
          navigate("/expenses");
          return;
        }

        setTitle(expense.title);
        setAmount(expense.amount.toString());
        setCategory(expense.category);
      } catch {
        alert("Failed to load expense");
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateExpense(id!, {
        title,
        amount: Number(amount),
        category,
      });

      navigate("/expenses");
    } catch {
      alert("Failed to update expense");
    }
  };

  if (loading) return <p>Loading expense...</p>;

  return (
    <DashboardLayout>
      <div>
        <h2>Edit Expense</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <button type="submit">Update Expense</button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditExpense;
