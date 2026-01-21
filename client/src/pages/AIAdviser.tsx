import { useState } from "react";
import { getAIInsights } from "../api/ai.api";
import DashboardLayout from "../components/DashboardLayout";
import { BrainCircuit, Sparkles, AlertTriangle } from "lucide-react";

const AIAdviser = () => {
    const [insights, setInsights] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGetInsights = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getAIInsights();
            setInsights(res.aiInsights);
        } catch (err: any) {
            console.error("Error getting AI insights:", err);
            const serverError = err.response?.data?.details || err.response?.data?.error;
            setError(serverError || "Failed to get AI advice. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Custom helper to format basic markdown-like syntax from AI
    const formatAIResponse = (text: string) => {
        if (!text) return null;

        return text.split('\n').map((line, index) => {
            // Check for list items
            const isListItem = line.trim().startsWith('* ') || line.trim().startsWith('- ');
            const cleanLine = isListItem ? line.trim().substring(2) : line;

            // Process bold text: **text**
            const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

            const formattedLine = parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="text-gray-900 dark:text-gray-100 font-bold">{part.slice(2, -2)}</strong>;
                }
                return part;
            });

            if (isListItem) {
                return (
                    <div key={index} className="flex items-start gap-3 mb-3 pl-2">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{formattedLine}</p>
                    </div>
                );
            }

            // Headers or empty lines
            if (line.trim() === '') return <div key={index} className="h-4"></div>;

            return (
                <p key={index} className="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formattedLine}
                </p>
            );
        });
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg mb-2">
                        <BrainCircuit size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        AI Financial Adviser
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Get personalized insights and money-saving tips based on your spending habits.
                    </p>
                </div>

                {/* Action Section */}
                <div className="flex justify-center">
                    <button
                        onClick={handleGetInsights}
                        disabled={loading}
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Analyzing Finances...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} className="group-hover:animate-pulse" />
                                <span>Get AI Advice</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-700 dark:text-red-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2">
                        <AlertTriangle size={20} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Results Section */}
                {insights && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex items-center gap-3 pb-6 border-b border-gray-100 dark:border-gray-700">
                                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                                        <Sparkles size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Your Financial Insights
                                    </h2>
                                </div>

                                <div className="prose dark:prose-invert max-w-none">
                                    {formatAIResponse(insights)}
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                    AI-generated advice is for informational purposes only.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AIAdviser;
