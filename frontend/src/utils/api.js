const API_BASE_URL = 'https://planiq-888q.onrender.com/api';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('planiq_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.msg || data.message || 'Something went wrong';
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`API Error in ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  auth: {
    register: (name, email, password) => 
      apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      }),
      
    login: (email, password) => 
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),
      
    getProfile: () => 
      apiRequest('/auth/profile', {
        method: 'GET'
      })
  },
  
  tasks: {
    getTasks: (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      
      const query = params.toString() ? `?${params.toString()}` : '';
      return apiRequest(`/tasks${query}`, {
        method: 'GET'
      });
    },
    
    createTask: (taskData) => 
      apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
      }),
      
    updateTask: (id, taskData) => 
      apiRequest(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData)
      }),
      
    deleteTask: (id) => 
      apiRequest(`/tasks/${id}`, {
        method: 'DELETE'
      }),
      
    getStats: () => 
      apiRequest('/tasks/stats', {
        method: 'GET'
      })
  }
};
