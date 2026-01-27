import api from "./axios";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (
  email: string,
  password: string,
  name: string
) => {
  const res = await api.post("/auth/register", {
    email,
    password,
    name,
  });
  return res.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const res = await api.post("/auth/change-password", {
    currentPassword,
    newPassword
  });
  return res.data;
};


export const updateProfile = async (name: string, email: string) => {
  const res = await api.patch("/auth/profile", {
    name,
    email
  });
  return res.data;
};
