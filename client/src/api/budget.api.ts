import axios from "./axios";

export const getBudgets = async () => {
    return await axios.get("/api/budgets");
};

export const setBudget = async (data: { category: string; amount: number }) => {
    return await axios.post("/api/budgets", data);
};
