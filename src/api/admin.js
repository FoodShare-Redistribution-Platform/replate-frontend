import axios from 'axios';

const API_URL = 'http://localhost:5001/api/admin';

const authHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

// ─── Dashboard ─────────────────────────────────────────────────────
export const getDashboardStats = async (token) => {
    const res = await axios.get(`${API_URL}/stats`, authHeader(token));
    return res.data;
};

// ─── Users CRUD ────────────────────────────────────────────────────
export const getUsers = async (token, params = {}) => {
    const res = await axios.get(`${API_URL}/users`, {
        ...authHeader(token),
        params,
    });
    return res.data; // { users, total, page, pages }
};

export const getUserById = async (id, token) => {
    const res = await axios.get(`${API_URL}/users/${id}`, authHeader(token));
    return res.data;
};

export const createUser = async (data, token) => {
    const res = await axios.post(`${API_URL}/users`, data, authHeader(token));
    return res.data;
};

export const updateUser = async (id, data, token) => {
    const res = await axios.put(`${API_URL}/users/${id}`, data, authHeader(token));
    return res.data;
};

export const deleteUser = async (id, token) => {
    const res = await axios.delete(`${API_URL}/users/${id}`, authHeader(token));
    return res.data;
};

export const toggleUserStatus = async (id, token) => {
    const res = await axios.put(`${API_URL}/users/${id}/toggle-status`, {}, authHeader(token));
    return res.data;
};

export const updateVerificationStatus = async (id, verificationStatus, token) => {
    const res = await axios.put(
        `${API_URL}/users/${id}/verification`,
        { verificationStatus },
        authHeader(token)
    );
    return res.data;
};

// ─── Resources ─────────────────────────────────────────────────────
export const getDonations = async (token) => {
    const res = await axios.get(`${API_URL}/donations`, authHeader(token));
    return res.data;
};

export const getRequests = async (token) => {
    const res = await axios.get(`${API_URL}/requests`, authHeader(token));
    return res.data;
};

export const getAssignments = async (token) => {
    const res = await axios.get(`${API_URL}/assignments`, authHeader(token));
    return res.data;
};

export const getAnalyticsStats = async (token, timeRange = 'This Month') => {
    const res = await axios.get(`${API_URL}/analytics`, {
        ...authHeader(token),
        params: { timeRange }
    });
    return res.data;
};
