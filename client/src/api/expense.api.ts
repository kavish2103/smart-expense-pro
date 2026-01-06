import api from "./axios";

export const getExpenses = (params?: {
    page?: number;
    limit?: number;
    category?: string;
  }) => {
    return api.get("/expenses", { params });
  };

export const createExpense = async (data: {
  title: string;
  amount: number;
  category: string;
}) => {
  const res = await api.post("/expenses", data);
  return res.data;
};

export const updateExpense = (
    id: string,
    data: {
      title: string;
      amount: number;
      category: string;
    }
  ) => api.put(`/expenses/${id}`, data);

export const deleteExpense = async (id: string) => {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
};
