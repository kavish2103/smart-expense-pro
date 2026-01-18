import { useEffect, useState, useMemo } from "react";
import { getExpenses } from "../api/expense.api";
import ExpenseCharts from "../components/ExpenseCharts";

type Expense = {
    id: string;
    title: string;
    amount: number;
    category: string;
    createdAt: string;
};

const Summaries = () => {
    const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchExpenses = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getExpenses({ limit: 10000 }); // Fetch all for summary
                const expensesArray = Array.isArray(res.data)
                    ? res.data
                    : res.data?.data || res.data?.expenses || [];
                setAllExpenses(expensesArray);
            } catch (err) {
                console.error("Error fetching expenses for summary:", err);
                setError("Failed to load expenses");
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const totalAmount = useMemo(
        () => allExpenses.reduce((sum, exp) => sum + exp.amount, 0),
        [allExpenses]
    );

    if (loading) return <p>Loading summaries...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Expense Summaries</h2>

            {allExpenses.length > 0 && (
                <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
                    <h3>Total Overview</h3>
                    <p><strong>Total Transactions:</strong> {allExpenses.length}</p>
                    <p><strong>Total Spent:</strong> ₹{totalAmount}</p>
                </div>
            )}

            {allExpenses.length > 0 ? (
                <ExpenseCharts expenses={allExpenses} />
            ) : (
                <p>No expenses found to summarize.</p>
            )}
        </div>
    );
};

export default Summaries;
