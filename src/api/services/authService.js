/**
 * Authentication Service
 */
import { post } from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function login(email, password) {
  try {
    const response = await post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Login failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

