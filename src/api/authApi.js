import axios from "axios";
const API_URL = "http://192.168.23.10:8000";

export const registerUser = async (data, tree) => {
  const response = await axios.post(`${API_URL}${tree}`, data);
  return response.data;
};

export const GetData = async (tree) => {
  const response = await axios(`${API_URL}${tree}`);
  return response.data;
};
