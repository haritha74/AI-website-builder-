import client from "./client";

export const templateApi = {
  list: () => client.get("/templates").then((res) => res.data.data.templates),
};
