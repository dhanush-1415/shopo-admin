/**
 * Size Chart Service
 */
import { get, postFormData } from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Create a new size chart
 * @param {Object} sizeChartData - Size chart data
 * @param {string|number} sizeChartData.categoryId - Category ID
 * @param {File} sizeChartData.image - Size chart image file
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function createSizeChart(sizeChartData, token) {
  try {
    const formData = new FormData();

    // Add required fields
    formData.append('categoryId', sizeChartData.categoryId || '');
    
    // Add image file if it's a File object
    if (sizeChartData.image instanceof File) {
      formData.append('image', sizeChartData.image);
    }

    const response = await postFormData(API_ENDPOINTS.SIZE_CHARTS.CREATE, formData, { token });

    if (response.success) {
      // API might return { success: true, data: {...} } or just { success: true, ... }
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    }

    // Extract error message from response
    const errorMessage = response.data?.message || response.data?.error || response.error || 'Size chart creation failed';
    
    return {
      success: false,
      error: errorMessage,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Get all size charts
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export async function getAllSizeCharts(token) {
  try {
    const response = await get(API_ENDPOINTS.SIZE_CHARTS.GET_ALL, { token });

    if (response.success && response.data) {
      // API returns { success: true, data: [...] }
      const sizeCharts = Array.isArray(response.data.data) 
        ? response.data.data 
        : (Array.isArray(response.data) ? response.data : []);
      
      return {
        success: true,
        data: sizeCharts,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch size charts',
      data: [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

