/**
 * Color Service
 */
import { post, get } from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Create a new color
 * @param {Object} colorData - Color data
 * @param {string} colorData.color - Color name
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function createColor(colorData, token) {
  try {
    const response = await post(API_ENDPOINTS.COLORS.CREATE, colorData, { token });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Color creation failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Get all colors
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export async function getAllColors(token) {
  try {
    const response = await get(API_ENDPOINTS.COLORS.GET_ALL, { token });

    if (response.success && response.data) {
      // API returns { success: true, data: [...] } or { success: true, data: { data: [...] } }
      const colors = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || []);
      
      return {
        success: true,
        data: colors,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch colors',
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

