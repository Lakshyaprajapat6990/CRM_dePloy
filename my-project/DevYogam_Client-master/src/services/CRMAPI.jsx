import axios from "axios";
import { baseURL } from "../utils/constant/Constant";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  credentials: "include",
});

// Add auth token to requests - read token dynamically on each request
axiosInstance.interceptors.request.use((config) => {
  // First try sessionStorage, then fall back to localStorage
  let token = sessionStorage.getItem("token");
  
  // If not in sessionStorage, check localStorage user object
  if (!token) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    token = user?.token;
  }
  
  console.log("CRMAPI Request - Token:", token ? "present" : "missing");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("CRMAPI Request - Authorization header set");
  } else {
    console.log("CRMAPI Request - No token found");
    console.log("sessionStorage keys:", Object.keys(sessionStorage));
    console.log("localStorage user:", localStorage.getItem("user"));
  }
  return config;
});

// ==================== CONTACT APIs ====================

export const getContacts = async (params = {}) => {
  const response = await axiosInstance.get("/api/crm/contacts", { params });
  return response.data;
};

export const getContactById = async (id) => {
  const response = await axiosInstance.get(`/api/crm/contacts/${id}`);
  return response.data;
};

export const createContact = async (data) => {
  const response = await axiosInstance.post("/api/crm/contacts", data);
  return response.data;
};

export const updateContact = async (id, data) => {
  const response = await axiosInstance.put(`/api/crm/contacts/${id}`, data);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await axiosInstance.delete(`/api/crm/contacts/${id}`);
  return response.data;
};

export const searchContacts = async (searchTerm) => {
  const response = await axiosInstance.get("/api/crm/contacts/search", {
    params: { q: searchTerm },
  });
  return response.data;
};

// ==================== INTERACTION APIs ====================

export const getInteractions = async (params = {}) => {
  const response = await axiosInstance.get("/api/crm/interactions", { params });
  return response.data;
};

export const getInteractionById = async (id) => {
  const response = await axiosInstance.get(`/api/crm/interactions/${id}`);
  return response.data;
};

export const createInteraction = async (data) => {
  const response = await axiosInstance.post("/api/crm/interactions", data);
  return response.data;
};

export const updateInteraction = async (id, data) => {
  const response = await axiosInstance.put(`/api/crm/interactions/${id}`, data);
  return response.data;
};

export const deleteInteraction = async (id) => {
  const response = await axiosInstance.delete(`/api/crm/interactions/${id}`);
  return response.data;
};

// ==================== DASHBOARD APIs ====================

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/api/crm/dashboard/stats");
  return response.data;
};

export const getContactsBySource = async () => {
  const response = await axiosInstance.get("/api/crm/dashboard/by-source");
  return response.data;
};

export const getContactsByStatus = async () => {
  const response = await axiosInstance.get("/api/crm/dashboard/by-status");
  return response.data;
};

export default {
  // Contacts
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
  
  // Interactions
  getInteractions,
  getInteractionById,
  createInteraction,
  updateInteraction,
  deleteInteraction,
  
  // Dashboard
  getDashboardStats,
  getContactsBySource,
  getContactsByStatus,
};
