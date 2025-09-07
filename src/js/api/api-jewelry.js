import axios from 'axios'
import { handleApiError, validateApiResponse } from './api-utils.js'
import {
  API_CONFIG,
  validateConfig,
  getApiUrl,
  getApiHeaders,
  buildApiQuery,
  normalizeProduct,
} from './config.js'
