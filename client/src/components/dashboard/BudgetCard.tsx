import { useState } from "react";
import { setBudget } from "../../api/budget.api";
import { Edit2, Check, X } from "lucide-react";

interface BudgetCardProps {
    category: string;
    amount: number;
    spent: number;
    remaining: number;
    progress: number;
    onUpdate: () => void;
}

const BudgetCard = ({ category, amount, spent, remaining, progress, onUpdate }: BudgetCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newAmount, setNewAmount] = useState(amount.toString());
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await setBudget({ category, amount: Number(newAmount) });
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error("Failed to update budget", error);
        } finally {
            setLoading(false);
        }
    };

    const getProgressColor = (percent: number) => {
        if (percent >= 100) return "bg-red-500";
        if (percent >= 80) return "bg-orange-500";
        return "bg-indigo-500";
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white capitalize">{category}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Budget</p>
                </div>
                {isEditing ? (
                    <div className="flex gap-1">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                        >
                            <Check size={16} />
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1 text-gray-400 hover:text-indigo-500 transition-colors"
                    >
                        <Edit2 size={14} />
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="mb-4">
                    <input
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                    />
                </div>
            ) : (
                <div className="mb-3">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{spent.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-500">
                            / ₹{amount.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            )}

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-2.5 rounded-full ${getProgressColor(progress)} transition-all duration-500`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                ></div>
            </div>

            <div className="mt-2 flex justify-between text-xs">
                <span className={`${progress >= 100 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                    {Math.round(progress)}% Used
                </span>
                <span className="text-gray-500">
                    ₹{remaining.toLocaleString('en-IN')} Left
                </span>
            </div>
        </div>
    );
};

export default BudgetCard;
