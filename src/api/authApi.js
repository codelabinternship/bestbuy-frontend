// src/api/authApi.js
import axios from "axios";
const API_URL = "http://192.168.174.177:8000";

export const PostData = async (data, tree) => {
  console.log(data);

  const response = await axios.post(`${API_URL}${tree}`, data);
  return response.data;
};
  
export const GetData = async (tree) => {
  const response = await axios.get(`${API_URL}${tree}`);
  return response.data;
};



export const DeleteData = async (tree, id) => {
  const response = await axios.delete(`${API_URL}${tree}${id}`);
  return response.data;
};

export const PutData = async (tree, id, data) => {
  const response = await axios.put(`${API_URL}${tree}${id}`, data);
  return response.data;
};
