// src/api.ts
import axios from "axios";

export type allUsersResponse = {
  data: [];
};

const fetchUsersApi = async (): Promise<allUsersResponse> => {
  const response = await axios.get("http://localhost:8000/users");
  return response.data;
};

export { fetchUsersApi };
