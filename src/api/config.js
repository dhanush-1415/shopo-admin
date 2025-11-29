/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: 'http://luxcycs.com:5501',
  TIMEOUT: 30000, // 30 seconds
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin-user/login',
  },
  PRODUCTS: {
    CREATE: '/product/create-product',
    UPDATE: '/product/update-product',
    LIST: '/product/list',
    GET_ALL: '/product/get-all-product',
    GET: '/product/get-product',
    DELETE: '/product/delete',
  },
  CATEGORIES: {
    CREATE: '/product/category/create',
    GET_ALL: '/product/category/get-all',
    GET: '/product/category/get-category',
    UPDATE: '/product/category/update',
    SUBCATEGORY: '/product/subcategory/create',
    SUBCATEGORY_GET: '/product/subcategory/get-subcategory',
    SUBCATEGORY_UPDATE: '/product/subcategory/update',
    CHILD_CATEGORY: '/product/childcategory/create',
    CHILD_CATEGORY_GET: '/product/childcategory/get-childcategory',
    CHILD_CATEGORY_UPDATE: '/product/childcategory/update',
    LIST: '/categories/list',
    DELETE: '/categories/delete',
  },
  COLORS: {
    CREATE: '/product/color/create',
    GET_ALL: '/product/color/get-all',
  },
  SIZES: {
    GET_ALL: '/product/size/get-all',
    CREATE: '/product/size/create',
    CREATE_VARIATION: '/product/size-variations/create',
  },
  SIZE_CHARTS: {
    CREATE: '/product/size-chart/create',
    GET_ALL: '/product/size-chart/get-all',
  },
  CUSTOMERS: {
    GET_ALL: '/customer/get-all-customer',
    GET: '/customer/get-customer',
  },
  BLOGS: {
    GET_ALL: '/blog/get-all-blog',
    CREATE: '/blog/create-blog',
    GET: '/blog/get-blog',
    UPDATE: '/blog/update-blog',
  },
  ORDERS: {
    GET_ALL: '/orders/get-all-orders',
  },
};

