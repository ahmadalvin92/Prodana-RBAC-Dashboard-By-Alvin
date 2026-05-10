import { apiClient } from "./apiClient";

export const aiService = {
  ask: (question) => apiClient.post("/ai/query", { question }),
};
