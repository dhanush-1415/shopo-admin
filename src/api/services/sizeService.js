/**
 * Size Service
 */
import { get, post } from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Get all sizes
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export async function getAllSizes(token) {
  try {
    const response = await get(API_ENDPOINTS.SIZES.GET_ALL, { token });

    if (response.success && response.data) {
      // API returns { success: true, data: [...] } or { success: true, data: { data: [...] } }
      const sizes = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || []);
      
      return {
        success: true,
        data: sizes,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch sizes',
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

/**
 * Create a new size
 * @param {Object} sizeData - Size data
 * @param {string} sizeData.type - Size type (e.g., "Topwear", "Bottomwear")
 * @param {Array<string>} sizeData.size - Array of size values
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function createSize(sizeData, token) {
  try {
    const response = await post(API_ENDPOINTS.SIZES.CREATE, sizeData, { token });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Size creation failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Create a size variation
 * @param {Object} sizeData - Size variation data
 * @param {string} sizeData.type - Size type (e.g., "Topwear", "Bottomwear")
 * @param {Array<string>} sizeData.size - Array of size values
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function createSizeVariation(sizeData, token) {
  try {
    const response = await post(API_ENDPOINTS.SIZES.CREATE_VARIATION, sizeData, { token });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Size variation creation failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

