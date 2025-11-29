/**
 * Customer Service
 */
import { get } from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Get all customers
 * @param {string} token - Authentication token
 * @param {Object} params - Query parameters (page, limit, etc.)
 * @returns {Promise<{success: boolean, data?: Array, pagination?: Object, error?: string}>}
 */
export async function getAllCustomers(token, params = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.CUSTOMERS.GET_ALL}?${queryParams.toString()}`
      : API_ENDPOINTS.CUSTOMERS.GET_ALL;

    const response = await get(url, { token });

    if (response.success && response.data) {
      // API returns { success: true, data: [...], pagination: {...} }
      const customers = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || []);
      
      return {
        success: true,
        data: customers,
        pagination: response.data.pagination || response.pagination || null,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch customers',
      data: [],
      pagination: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      data: [],
      pagination: null,
    };
  }
}

/**
 * Get customer by ID
 * @param {string} customerId - Customer ID
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function getCustomerById(customerId, token) {
  try {
    const response = await get(`${API_ENDPOINTS.CUSTOMERS.GET}/${customerId}`, { token });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch customer details',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

