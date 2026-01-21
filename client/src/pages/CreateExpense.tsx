import { useState } from "react";
import { createExpense } from "../api/expense.api";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

const CreateExpense = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createExpense({
        title,
        amount: Number(amount),
        category,
      });

      // Reset form
      setTitle("");
      setAmount("");
      setCategory("");

      navigate("/expenses");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create expense. Please try again.");
      console.error("Error creating expense:", err);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h2>Create Expense</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

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

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="travel">Travel</option>
            <option value="food">Food</option>
            <option value="drink">Drink</option>
            <option value="cloths">Cloths</option>
          </select>

          <button type="submit">Add Expense</button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateExpense;
