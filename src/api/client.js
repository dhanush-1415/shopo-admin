/**
 * API Client - Reusable HTTP client for making API requests
 */
import { API_CONFIG } from './config';

/**
 * Creates a fetch request with proper configuration
 */
async function apiRequest(url, options = {}) {
  const { token, ...fetchOptions } = options;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...fetchOptions.headers,
  };

  // Add authorization header if token is provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...fetchOptions,
    headers,
  };

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, config);
    
    // Parse response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If response is not JSON, get text
      const text = await response.text();
      data = { message: text || 'An error occurred' };
    }

    // Handle non-ok responses
    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `HTTP error! status: ${response.status}`,
        status: response.status,
        data: data,
      };
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    // Handle network errors or other errors
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      status: error.status || 0,
    };
  }
}

/**
 * GET request
 */
export async function get(url, options = {}) {
  return apiRequest(url, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST request
 */
export async function post(url, body, options = {}) {
  return apiRequest(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * POST request with FormData (for file uploads)
 */
export async function postFormData(url, formData, options = {}) {
  const { token, ...fetchOptions } = options;
  
  const headers = {
    'Accept': 'application/json',
    ...fetchOptions.headers,
  };

  // Add authorization header if token is provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData - browser will set it with boundary
  const config = {
    ...fetchOptions,
    method: 'POST',
    headers,
    body: formData,
  };

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, config);
    
    // Parse response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If response is not JSON, get text
      const text = await response.text();
      data = { message: text || 'An error occurred' };
    }

    // Handle non-ok responses
    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `HTTP error! status: ${response.status}`,
        status: response.status,
        data: data,
      };
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    // Handle network errors or other errors
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      status: error.status || 0,
    };
  }
}

/**
 * PUT request
 */
export async function put(url, body, options = {}) {
  return apiRequest(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * PUT request with FormData (for file uploads)
 */
export async function putFormData(url, formData, options = {}) {
  const { token, ...fetchOptions } = options;
  
  const headers = {
    'Accept': 'application/json',
    ...fetchOptions.headers,
  };

  // Add authorization header if token is provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData - browser will set it with boundary
  const config = {
    ...fetchOptions,
    method: 'PUT',
    headers,
    body: formData,
  };

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, config);
    
    // Parse response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If response is not JSON, get text
      const text = await response.text();
      data = { message: text || 'An error occurred' };
    }

    // Handle non-ok responses
    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `HTTP error! status: ${response.status}`,
        status: response.status,
        data: data,
      };
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    // Handle network errors or other errors
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      status: error.status || 0,
    };
  }
}

/**
 * PATCH request
 */
export async function patch(url, body, options = {}) {
  return apiRequest(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request
 */
export async function del(url, options = {}) {
  return apiRequest(url, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * Create an API client instance with token
 */
export function createApiClient(token) {
  return {
    get: (url, options = {}) => get(url, { ...options, token }),
    post: (url, body, options = {}) => post(url, body, { ...options, token }),
    postFormData: (url, formData, options = {}) => postFormData(url, formData, { ...options, token }),
    put: (url, body, options = {}) => put(url, body, { ...options, token }),
    putFormData: (url, formData, options = {}) => putFormData(url, formData, { ...options, token }),
    patch: (url, body, options = {}) => patch(url, body, { ...options, token }),
    delete: (url, options = {}) => del(url, { ...options, token }),
  };
}

