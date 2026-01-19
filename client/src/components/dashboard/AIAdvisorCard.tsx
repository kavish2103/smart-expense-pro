import { useState } from "react";
import { Sparkles, Lightbulb, TrendingDown } from "lucide-react";

const AIAdvisorCard = () => {
    const [loading, setLoading] = useState(false);
    const [showAdvice, setShowAdvice] = useState(false);

    const handleGetAdvice = () => {
        setLoading(true);
        // Simulate AI delay
        setTimeout(() => {
            setLoading(false);
            setShowAdvice(true);
        }, 1500);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Sparkles size={24} className="text-yellow-300" />
                    </div>
                    <h3 className="text-xl font-bold">AI Spending Insights</h3>
                </div>

                <p className="text-indigo-100 mb-6 max-w-sm">
                    Get personalized recommendations to optimize your budget and save more this month.
                </p>

                {!showAdvice ? (
                    <button
                        onClick={handleGetAdvice}
                        disabled={loading}
                        className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Get AI Advice
                            </>
                        )}
                    </button>
                ) : (
                    <div className="space-y-3 animate-fade-in-up">
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 flex items-start gap-3">
                            <Lightbulb size={20} className="text-yellow-300 shrink-0 mt-1" />
                            <p className="text-sm font-medium">You spent 20% more on dining out than usual. Try cooking at home twice more this week.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 flex items-start gap-3">
                            <TrendingDown size={20} className="text-green-300 shrink-0 mt-1" />
                            <p className="text-sm font-medium">Subscriptions cost ~$45/mo. You haven't used "StreamPlus" in 2 months.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIAdvisorCard;
