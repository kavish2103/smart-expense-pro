import { useState } from "react";
import { getAIInsights } from "../api/ai.api";


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

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2>AI Financial Adviser</h2>
            <p>Get personalized insights and money-saving tips based on your spending habits.</p>

            <button onClick={handleGetInsights} disabled={loading} style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}>
                {loading ? "Analyzing..." : "Get AI Advice"}
            </button>

            {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

            {insights && (
                <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", background: "#fff", lineHeight: "1.6" }}>
                    <h3>💡 Your Financial Insights</h3>
                    {/* Ensure you have a markdown renderer or just display text */}
                    {/* If react-markdown is not installed, we can fall back to simple whitespace preserving div */}
                    {/* Checking package.json would be ideal, but for now I'll assume simple text or needs a package. */}
                    {/* Since I didn't check package.json for react-markdown, I'll use a safe pre-wrap div for now to be sure it works without installing new deps unless I know they exist explicitly. */}
                    {/* Wait, the user has 'react-router-dom' so maybe 'react-markdown'? I'll stick to simple whitespace for safety first. */}
                    <div style={{ whiteSpace: "pre-wrap" }}>{insights}</div>
                </div>
            )}
        </div>
    );
};

export default AIAdviser;
