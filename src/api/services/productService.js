/**
 * Product Service
 */
import { postFormData, get } from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @param {string} productData.name - Product name
 * @param {string} productData.description - Product description
 * @param {string} productData.metaTitle - Meta title for SEO
 * @param {string} productData.metaDescription - Meta description for SEO
 * @param {string} productData.careInstructions - Care instructions
 * @param {string|number} productData.categoryId - Category ID
 * @param {string|number} productData.subCategoryId - Subcategory ID
 * @param {string|number} productData.childCategoryId - Child category ID
 * @param {Object} productData.apparelDetails - Apparel details object
 * @param {Array} productData.inventory - Inventory array
 * @param {string|number} productData.mrp - MRP
 * @param {string|number} productData.sellingPrice - Selling price
 * @param {string|number} productData.gst - GST percentage
 * @param {File} productData.thumbnailImage - Thumbnail image file
 * @param {File} productData.galleryImage - Gallery image file
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function createProduct(productData, token) {
  try {
    const formData = new FormData();

    // Add text fields
    formData.append('name', productData.name || '');
    formData.append('description', productData.description || '');
    formData.append('metaTitle', productData.metaTitle || '');
    formData.append('metaDescription', productData.metaDescription || '');
    formData.append('careInstructions', productData.careInstructions || '');
    formData.append('categoryId', productData.categoryId || '');
    formData.append('subCategoryId', productData.subCategoryId || '');
    // Only append childCategoryId if it's provided (it's optional)
    if (productData.childCategoryId) {
      formData.append('childCategoryId', productData.childCategoryId);
    }
    formData.append('mrp', productData.mrp || '');
    formData.append('sellingPrice', productData.sellingPrice || '');
    formData.append('gst', productData.gst || '5');

    // Add apparelDetails as JSON string
    if (productData.apparelDetails) {
      formData.append('apparelDetails', JSON.stringify(productData.apparelDetails));
    }

    // Add inventory as JSON string
    if (productData.inventory && Array.isArray(productData.inventory)) {
      formData.append('inventory', JSON.stringify(productData.inventory));
    }

    // Add image files
    if (productData.thumbnailImage instanceof File) {
      formData.append('thumbnailImage', productData.thumbnailImage);
    }
    if (productData.galleryImage instanceof File) {
      formData.append('galleryImage', productData.galleryImage);
    }

    const response = await postFormData(API_ENDPOINTS.PRODUCTS.CREATE, formData, { token });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Product creation failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Get all products
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export async function getAllProducts(token) {
  try {
    const response = await get(API_ENDPOINTS.PRODUCTS.GET_ALL, { token });

    if (response.success && response.data) {
      // API returns { success: true, data: [...], pagination: {...} }
      const products = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || []);
      
      return {
        success: true,
        data: products,
        pagination: response.data.pagination || null,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch products',
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
 * Get a single product by ID
 * @param {string|number} productId - Product ID
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function getProductById(productId, token) {
  try {
    const response = await get(`${API_ENDPOINTS.PRODUCTS.GET}/${productId}`, { token });

    if (response.success && response.data) {
      // API returns { success: true, data: { ...product } }
      const product = response.data.data || response.data;
      
      return {
        success: true,
        data: product,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch product',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

