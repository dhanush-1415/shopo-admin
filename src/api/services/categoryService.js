/**
 * Category Service
 */
import { post, postFormData, put, putFormData, get } from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Create a new category
 * @param {Object} categoryData - Category data
 * @param {string} categoryData.name - Category name
 * @param {File} categoryData.image - Category image file
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function createCategory(categoryData, token) {
  try {
    const formData = new FormData();
    formData.append('name', categoryData.name || '');

    if (categoryData.image instanceof File) {
      formData.append('image', categoryData.image);
    }

    const response = await postFormData(API_ENDPOINTS.CATEGORIES.CREATE, formData, { token });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Category creation failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Create a new subcategory
 * @param {Object} subcategoryData - Subcategory data
 * @param {string} subcategoryData.name - Subcategory name
 * @param {string|number} subcategoryData.categoryId - Parent category ID
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function createSubcategory(subcategoryData, token) {
  try {
    const response = await post(
      API_ENDPOINTS.CATEGORIES.SUBCATEGORY,
      {
        name: subcategoryData.name,
        categoryId: subcategoryData.categoryId,
      },
      { token }
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Subcategory creation failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Create a new child category
 * @param {Object} childCategoryData - Child category data
 * @param {string} childCategoryData.name - Child category name
 * @param {string|number} childCategoryData.subCategoryId - Parent subcategory ID
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function createChildCategory(childCategoryData, token) {
  try {
    const response = await post(
      API_ENDPOINTS.CATEGORIES.CHILD_CATEGORY,
      {
        name: childCategoryData.name,
        subCategoryId: childCategoryData.subCategoryId,
      },
      { token }
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Child category creation failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Update a category
 * @param {Object} categoryData - Category data
 * @param {string|number} categoryData.id - Category ID
 * @param {string} categoryData.name - Category name
 * @param {File} categoryData.image - Category image file (optional)
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function updateCategory(categoryData, token) {
  try {
    const formData = new FormData();
    formData.append('name', categoryData.name || '');

    if (categoryData.image instanceof File) {
      formData.append('image', categoryData.image);
    }

    const response = await putFormData(`${API_ENDPOINTS.CATEGORIES.UPDATE}/${categoryData.id}`, formData, { token });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Category update failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Update a subcategory
 * @param {Object} subcategoryData - Subcategory data
 * @param {string|number} subcategoryData.id - Subcategory ID
 * @param {string} subcategoryData.name - Subcategory name
 * @param {string|number} subcategoryData.categoryId - Parent category ID
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function updateSubcategory(subcategoryData, token) {
  try {
    const response = await put(
      `${API_ENDPOINTS.CATEGORIES.SUBCATEGORY_UPDATE}/${subcategoryData.id}`,
      {
        name: subcategoryData.name,
        categoryId: subcategoryData.categoryId,
      },
      { token }
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Subcategory update failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Update a child category
 * @param {Object} childCategoryData - Child category data
 * @param {string|number} childCategoryData.id - Child category ID
 * @param {string} childCategoryData.name - Child category name
 * @param {string|number} childCategoryData.subCategoryId - Parent subcategory ID
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function updateChildCategory(childCategoryData, token) {
  try {
    const response = await put(
      `${API_ENDPOINTS.CATEGORIES.CHILD_CATEGORY_UPDATE}/${childCategoryData.id}`,
      {
        name: childCategoryData.name,
        subCategoryId: childCategoryData.subCategoryId,
      },
      { token }
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Child category update failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Get category by ID
 * @param {string|number} categoryId - Category ID
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function getCategoryById(categoryId, token) {
  try {
    const response = await get(`${API_ENDPOINTS.CATEGORIES.GET}/${categoryId}`, { token });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch category',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Get subcategory by ID
 * @param {string|number} subcategoryId - Subcategory ID
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function getSubcategoryById(subcategoryId, token) {
  try {
    const response = await get(`${API_ENDPOINTS.CATEGORIES.SUBCATEGORY_GET}/${subcategoryId}`, { token });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch subcategory',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Get child category by ID
 * @param {string|number} childCategoryId - Child category ID
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function getChildCategoryById(childCategoryId, token) {
  try {
    const response = await get(`${API_ENDPOINTS.CATEGORIES.CHILD_CATEGORY_GET}/${childCategoryId}`, { token });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch child category',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Get all categories with subcategories and child categories
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export async function getAllCategories(token) {
  try {
    const response = await get(API_ENDPOINTS.CATEGORIES.GET_ALL, { token });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data || [],
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch categories',
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

