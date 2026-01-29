import axios from "./axios";

export const getDashboardStats = async () => {
    return await axios.get("/dashboard/stats");
};
