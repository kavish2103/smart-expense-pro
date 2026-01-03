import { useState } from "react";
import { createExpense } from "../api/expense.api";
import { useNavigate } from "react-router-dom";

const CreateExpense = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createExpense({
        title,
        amount: Number(amount),
        category,
      });

      navigate("/expenses");
    } catch (err) {
      setError("Failed to create expense");
    }
  };

  return (
    <div>
      <h2>Create Expense</h2>

      {error && <p>{error}</p>}

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

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default CreateExpense;
