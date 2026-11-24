import axios from 'axios';
import { BASE_URL } from './config';

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

export const errMsg = (e) =>
  e?.response?.data?.message || 'Tidak dapat terhubung ke server. Pastikan backend berjalan dan BASE_URL benar.';

export default api;
