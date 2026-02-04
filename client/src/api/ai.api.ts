// src/api/ai.api.ts
import api from "./axios";

export const getAIInsights = async () => {
    const res = await api.get("/ai/insights");
    return res.data;
};

export const getAIHistory = async () => {
    const res = await api.get("/ai/history");
    return res.data;
};
