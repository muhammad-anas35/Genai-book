import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const API_URL = "http://localhost:8000/api/v1";

const getAuthToken = () => {
  if (ExecutionEnvironment.canUseDOM) {
    return localStorage.getItem("token");
  }
  return null;
};

export const chatWithAgent = async (message, threadId = null) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ message, thread_id: threadId })
  });
  return response.json();
};

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/auth/login/access-token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });
  
  const data = await res.json();
  if (data.access_token && ExecutionEnvironment.canUseDOM) {
    localStorage.setItem("token", data.access_token);
  }
  return data;
};

export const signup = async (userData) => {
  // userData should contain: { email, password, name, experience, goal, plan }
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};
