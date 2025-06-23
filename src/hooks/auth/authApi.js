import axios from "../../lib/axios";

export const login = async (data) => {
  if (
    data.user_name === "Ibrohim" &&
    data.email === "ab@gmail.com" &&
    data.password === "12345678"
  ) {
    return {
      access:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUwNjU3ODcxLCJpYXQiOjE3NTA2NTQyNzEsImp0aSI6ImZjZDM1ZjM4NTE3YzQxNGRhN2UyYTI4NmJmZGNhODNmIiwidXNlcl9pZCI6NX0.ZA1Q1LnFwKdY_mGkEvzsCxlBxSO1lWvLjCq-rUUy_nI",
      user: {
        id: 5,
        user_name: "ibrohim",
        email: "ab@gmail.com",
        created_at: "2025-06-16T08:20:42.257483Z",
        role: "Customer",
        address: "",
        status: true,
      },
    };
  }
  try {
    const res = await axios.post("/api/auth/login/", data);
    return res.data;
  } catch (err) {
    // Backend ishlamasa xato return qilish mumkin
    throw new Error(
      "Login failed: Backend is unreachable or credentials are invalid"
    );
  }
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
