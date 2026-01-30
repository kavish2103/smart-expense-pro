import React, { useEffect, useState } from "react";
import { getAIHistory } from "../api/ai.api";
import DashboardLayout from "../components/DashboardLayout";

interface AIInsight {
    id: string;
    summary: string;
    createdAt: string;
}

const AIInsightsHistory: React.FC = () => {
    const [history, setHistory] = useState<AIInsight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getAIHistory();
                setHistory(data);
            } catch (err) {
                setError("Failed to load history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                    AI Insights History
                </h1>

                {loading ? (
                    <p className="text-gray-500">Loading history...</p>
                ) : error ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                        {error}
                    </div>
                ) : history.length === 0 ? (
                    <p className="text-gray-500">No history available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* List of Insights */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 h-[70vh] overflow-y-auto">
                            <ul className="space-y-4">
                                {history.map((item) => (
                                    <li
                                        key={item.id}
                                        onClick={() => setSelectedInsight(item)}
                                        className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition ${selectedInsight?.id === item.id
                                                ? "border-blue-500 bg-blue-50 dark:bg-gray-700"
                                                : "border-gray-200 dark:border-gray-700"
                                            }`}
                                    >
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </p>
                                        <p className="text-gray-800 dark:text-gray-200 mt-2 line-clamp-2">
                                            {/* Strip markdown for preview roughly if needed, or just show raw text */}
                                            {item.summary.slice(0, 100)}...
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Detail View */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-[70vh] overflow-y-auto">
                            {selectedInsight ? (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                        Insight Details
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Generated on:{" "}
                                        {new Date(selectedInsight.createdAt).toLocaleString()}
                                    </p>
                                    <div className="prose dark:prose-invert max-w-none">
                                        {/* Ideally use a Markdown renderer here, but simple pre-wrap for now */}
                                        <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
                                            {selectedInsight.summary}
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Select an item to view details
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AIInsightsHistory;
