import axios from "axios";
// const API_URL = "http://192.168.23.10:8000";
const API_URL = "https://bestbuy-backend-i09y.onrender.com";

export const PostData = async (data, tree) => {
  const response = await axios.post(`${API_URL}${tree}`, data)
  return response.data;
};

export const GetData = async (tree) => {
  const response = await axios(`${API_URL}${tree}`);
  return response.data;
};

export const DeleteData = async (tree) => {
  const response = await axios.delete(`${API_URL}${tree}`);
  return response.data;
};
export const PutData = async (tree, data) => {
  const response = await axios.delete(`${API_URL}${tree}`, data);
  return response.data;
};
