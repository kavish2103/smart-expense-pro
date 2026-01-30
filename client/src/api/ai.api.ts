// src/api/ai.api.ts
import api from "./axios";

export const getAIInsights = async () => {
    const res = await api.get("/api/ai/insights");
    return res.data;
};

export const getAIHistory = async () => {
    const res = await api.get("/api/ai/history");
    return res.data;
};
