import axios from "../../lib/axios";

export const login = async (data) => {
  const res = await axios.post("/api/auth/login/", data);
  return res.data;
};

export const register = async (data) => {
  const res = await axios.post("/api/auth/register/", data);
  return res.data;
};

export const getProfile = async (token) => {
  const res = await axios("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
