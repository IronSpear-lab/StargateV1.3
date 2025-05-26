const API_BASE_URL = '/api'; // Assuming Vite proxy handles redirection to backend

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    // Log the error or handle it as per application's error handling strategy
    console.error('API Error:', { status: response.status, data });
    throw { status: response.status, data: data || { message: response.statusText } };
  }
  return data;
}

export const getRequest = async (endpoint, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
  return handleResponse(response);
};

export const postRequest = async (endpoint, body, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse(response);
};

export const postFormDataRequest = async (endpoint, formData, token = null) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Let browser set Content-Type for FormData
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  return handleResponse(response);
};
