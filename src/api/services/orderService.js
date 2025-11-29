/**
 * Order Service
 */
import { get } from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Get all orders
 * @param {string} token - Authentication token
 * @param {Object} params - Query parameters (page, limit, etc.)
 * @returns {Promise<{success: boolean, data?: Array, pagination?: Object, error?: string}>}
 */
export async function getAllOrders(token, params = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.ORDERS.GET_ALL}?${queryParams.toString()}`
      : API_ENDPOINTS.ORDERS.GET_ALL;

    const response = await get(url, { token });

    if (response.success && response.data) {
      // API returns { success: true, data: [...], pagination: {...} }
      const orders = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || []);
      
      return {
        success: true,
        data: orders,
        pagination: response.data.pagination || response.pagination || null,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch orders',
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

