import { apiClient } from "./apiClient";

export const userService = {
  listRoles: () => apiClient.get("/users/roles"),
  list: (params) => apiClient.get("/users", { params }),
  create: (payload) => apiClient.post("/users", payload),
  update: (id, payload) => apiClient.put(`/users/${id}`, payload),
  remove: (id) => apiClient.delete(`/users/${id}`),
};
