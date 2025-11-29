/**
 * Blog Service
 */
import { get, postFormData, putFormData } from '../client';
import { API_ENDPOINTS } from '../config';

/**
 * Get all blogs
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: Array, pagination?: object, error?: string}>}
 */
export async function getAllBlogs(token) {
  try {
    const response = await get(API_ENDPOINTS.BLOGS.GET_ALL, { token });

    if (response.success && response.data) {
      // API returns { success: true, data: [...], pagination: {...} }
      const blogs = Array.isArray(response.data.data) 
        ? response.data.data 
        : (Array.isArray(response.data) ? response.data : []);
      
      return {
        success: true,
        data: blogs,
        pagination: response.data.pagination || null,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch blogs',
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
 * Get a single blog by ID
 * @param {string|number} blogId - Blog ID
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function getBlogById(blogId, token) {
  try {
    const response = await get(`${API_ENDPOINTS.BLOGS.GET}/${blogId}`, { token });

    if (response.success && response.data) {
      // API returns { success: true, data: { ...blog } }
      const blog = response.data.data || response.data;
      
      return {
        success: true,
        data: blog,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to fetch blog',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Create a new blog
 * @param {Object} blogData - Blog data
 * @param {string} blogData.title - Blog title
 * @param {string} blogData.slug - Blog slug
 * @param {string} blogData.shortDescription - Short description
 * @param {string} blogData.content - Blog content
 * @param {string} blogData.metaTitle - Meta title
 * @param {string} blogData.metaDescription - Meta description
 * @param {File} blogData.featuredImage - Featured image file
 * @param {File} blogData.bannerImage - Banner image file
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function createBlog(blogData, token) {
  try {
    const formData = new FormData();

    // Add text fields
    formData.append('title', blogData.title || '');
    formData.append('slug', blogData.slug || '');
    formData.append('shortDescription', blogData.shortDescription || '');
    formData.append('content', blogData.content || '');
    formData.append('metaTitle', blogData.metaTitle || '');
    formData.append('metaDescription', blogData.metaDescription || '');

    // Add image files if they are File objects
    if (blogData.featuredImage instanceof File) {
      formData.append('featuredImage', blogData.featuredImage);
    }
    if (blogData.bannerImage instanceof File) {
      formData.append('bannerImage', blogData.bannerImage);
    }

    const response = await postFormData(API_ENDPOINTS.BLOGS.CREATE, formData, { token });

    if (response.success) {
      // API might return { success: true, data: {...} } or just { success: true, ... }
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    }

    // Extract error message from response
    const errorMessage = response.data?.message || response.data?.error || response.error || 'Blog creation failed';
    
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
 * Update an existing blog
 * @param {Object} blogData - Blog data
 * @param {string|number} blogData.id - Blog ID
 * @param {string} blogData.title - Blog title
 * @param {string} blogData.slug - Blog slug
 * @param {string} blogData.shortDescription - Short description
 * @param {string} blogData.content - Blog content
 * @param {string} blogData.metaTitle - Meta title
 * @param {string} blogData.metaDescription - Meta description
 * @param {string} blogData.status - Blog status (active/inactive)
 * @param {File} blogData.featuredImage - Featured image file (optional)
 * @param {File} blogData.bannerImage - Banner image file (optional)
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function updateBlog(blogData, token) {
  try {
    const formData = new FormData();

    // Add required fields
    formData.append('id', blogData.id || '');
    formData.append('title', blogData.title || '');
    formData.append('slug', blogData.slug || '');
    formData.append('shortDescription', blogData.shortDescription || '');
    formData.append('content', blogData.content || '');
    formData.append('metaTitle', blogData.metaTitle || '');
    formData.append('metaDescription', blogData.metaDescription || '');
    formData.append('status', blogData.status || 'active');

    // Add image files if they are File objects
    if (blogData.featuredImage instanceof File) {
      formData.append('featuredImage', blogData.featuredImage);
    }
    if (blogData.bannerImage instanceof File) {
      formData.append('bannerImage', blogData.bannerImage);
    }

    const response = await putFormData(API_ENDPOINTS.BLOGS.UPDATE, formData, { token });

    if (response.success) {
      // API might return { success: true, data: {...} } or just { success: true, ... }
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    }

    // Extract error message from response
    const errorMessage = response.data?.message || response.data?.error || response.error || 'Blog update failed';
    
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

