import client from "./client";

export const projectApi = {
  list: (search = "") => client.get("/projects", { params: { search } }).then((res) => res.data.data.projects),
  get: (id) => client.get(`/projects/${id}`).then((res) => res.data.data.project),
  create: (payload) => client.post("/projects", payload).then((res) => res.data.data.project),
  update: (id, payload) => client.put(`/projects/${id}`, payload).then((res) => res.data.data.project),
  duplicate: (id) => client.post(`/projects/${id}/duplicate`).then((res) => res.data.data.project),
  remove: (id) => client.delete(`/projects/${id}`).then((res) => res.data),
  generate: (prompt) => client.post("/generate", { prompt }).then((res) => res.data.data),
  exportUrl: (id, type) => `${client.defaults.baseURL}/projects/${id}/export/${type}`,
};
