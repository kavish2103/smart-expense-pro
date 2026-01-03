import { useEffect, useState } from "react";
import { getExpenses } from "../api/expense.api";

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

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses();
        setExpenses(res.data);
      } catch (err) {
        setError("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <p>Loading expenses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Expenses</h2>

      {expenses.length === 0 && <p>No expenses found</p>}

      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            <strong>{exp.title}</strong> – ₹{exp.amount} ({exp.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Expenses;
