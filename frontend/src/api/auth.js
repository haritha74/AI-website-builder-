import client from "./client";

export const authApi = {
  register: (payload) => client.post("/register", payload).then((res) => res.data.data),
  login: (payload) => client.post("/login", payload).then((res) => res.data.data),
  forgotPassword: (payload) => client.post("/forgot-password", payload).then((res) => res.data),
  resetPassword: (payload) => client.post("/reset-password", payload).then((res) => res.data),
  profile: () => client.get("/profile").then((res) => res.data.data),
  updateProfile: (payload) => client.put("/profile", payload).then((res) => res.data.data),
  changePassword: (payload) => client.put("/profile/password", payload).then((res) => res.data),
  deleteAccount: () => client.delete("/profile").then((res) => res.data),
};
