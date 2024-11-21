import axios from "axios";

const API_URL = "http://localhost:5000"; // Update this based on your server URL

export const getEmployees = async () => {
  const response = await axios.get(`${API_URL}/employees`);
  return response.data;
};

export const addEmployee = async (employee) => {
  const response = await axios.post(`${API_URL}/employee`, employee);
  return response.data;
};

export const updateEmployee = async (id, updatedData) => {
    const response = await axios.put(`${API_URL}/employee/${id}`, updatedData);
    return response.data;
  };
  

export const deleteEmployee = async (id) => {
  const response = await axios.delete(`${API_URL}/employee/${id}`);
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await axios.get(`${API_URL}/employee/${id}`);
  return response.data;
};
