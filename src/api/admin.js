// src/api/admin.js
import axios from 'axios';

// Base URL for admin backend routes
const API_URL = 'http://localhost:5000/admin';

// ------------------ Users ------------------
export const getUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ------------------ Verification Requests ------------------
export const getVerificationRequests = async (token) => {
  const res = await axios.get(`${API_URL}/requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const approveRequest = async (id, token) => {
  const res = await axios.put(
    `${API_URL}/requests/${id}/approve`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const rejectRequest = async (id, token) => {
  const res = await axios.put(
    `${API_URL}/requests/${id}/reject`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// ------------------ Food Donations ------------------
export const getDonations = async (token) => {
  const res = await axios.get(`${API_URL}/donations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const markFoodUnsafe = async (id, token) => {
  const res = await axios.put(
    `${API_URL}/donations/${id}/unsafe`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// ------------------ Volunteers ------------------
export const getVolunteers = async (token) => {
  const res = await axios.get(`${API_URL}/assignments/volunteers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ------------------ NGOs ------------------
export const getNGOs = async (token) => {
  const res = await axios.get(`${API_URL}/ngos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ------------------ Logistics / Assignments ------------------
export const getAssignments = async (token) => {
  const res = await axios.get(`${API_URL}/assignments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const markAssignmentDelayed = async (id, token) => {
  const res = await axios.put(
    `${API_URL}/assignments/${id}/delay`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
