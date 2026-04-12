import api from '@/lib/api';
import type {
  Siswa,
  SiswaLoginRequest,
  SiswaCreateRequest,
  SiswaUpdateRequest,
  Admin,
  AdminLoginRequest,
  AdminCreateRequest,
  AdminUpdateRequest,
  Kategori,
  KategoriRequest,
  InputAspirasi,
  InputAspirasiCreateRequest,
  InputAspirasiUpdateRequest,
  Aspirasi,
  AspirasiCreateRequest,
  AspirasiUpdateRequest,
  AspirasiStatusUpdateRequest,
  AspirasiStatus,
  ApiResponse,
} from '@/types';

// ==================== AUTH SERVICES ====================
export const authService = {
  loginSiswa: async (data: SiswaLoginRequest): Promise<ApiResponse<Siswa>> => {
    const response = await api.post('/siswa/login', data);
    if (response.data.success) {
      localStorage.setItem('siswa', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  loginAdmin: async (data: AdminLoginRequest): Promise<ApiResponse<Admin>> => {
    const response = await api.post('/admin/login', data);
    if (response.data.success) {
      localStorage.setItem('admin', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('siswa');
    localStorage.removeItem('admin');
  },

  getCurrentSiswa: (): Siswa | null => {
    const siswa = localStorage.getItem('siswa');
    return siswa ? JSON.parse(siswa) : null;
  },

  getCurrentAdmin: (): Admin | null => {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  },
};

// ==================== SISWA SERVICES ====================
export const siswaService = {
  getAll: async (): Promise<ApiResponse<Siswa[]>> => {
    const response = await api.get('/siswa');
    return response.data;
  },

  getById: async (nis: number): Promise<ApiResponse<Siswa>> => {
    const response = await api.get(`/siswa/${nis}`);
    return response.data;
  },

  create: async (data: SiswaCreateRequest): Promise<ApiResponse<Siswa>> => {
    const response = await api.post('/siswa', data);
    return response.data;
  },

  update: async (nis: number, data: SiswaUpdateRequest): Promise<ApiResponse<Siswa>> => {
    const response = await api.put(`/siswa/${nis}`, data);
    return response.data;
  },

  delete: async (nis: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/siswa/${nis}`);
    return response.data;
  },

  toggleActive: async (nis: number): Promise<ApiResponse<Siswa>> => {
    const response = await api.patch(`/siswa/${nis}/toggle-active`);
    return response.data;
  },
};

// ==================== ADMIN SERVICES ====================
export const adminService = {
  getAll: async (): Promise<ApiResponse<Admin[]>> => {
    const response = await api.get('/admin');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Admin>> => {
    const response = await api.get(`/admin/${id}`);
    return response.data;
  },

  create: async (data: AdminCreateRequest): Promise<ApiResponse<Admin>> => {
    const response = await api.post('/admin', data);
    return response.data;
  },

  update: async (id: number, data: AdminUpdateRequest): Promise<ApiResponse<Admin>> => {
    const response = await api.put(`/admin/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/admin/${id}`);
    return response.data;
  },
};

// ==================== KATEGORI SERVICES ====================
export const kategoriService = {
  getAll: async (): Promise<ApiResponse<Kategori[]>> => {
    const response = await api.get('/kategori');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Kategori>> => {
    const response = await api.get(`/kategori/${id}`);
    return response.data;
  },

  create: async (data: KategoriRequest): Promise<ApiResponse<Kategori>> => {
    const response = await api.post('/kategori', data);
    return response.data;
  },

  update: async (id: number, data: KategoriRequest): Promise<ApiResponse<Kategori>> => {
    const response = await api.put(`/kategori/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/kategori/${id}`);
    return response.data;
  },
};

// ==================== INPUT ASPIRASI SERVICES ====================
export const inputAspirasiService = {
  getAll: async (statusReview?: string): Promise<ApiResponse<InputAspirasi[]>> => {
    const params = statusReview ? `?status_review=${statusReview}` : '';
    const response = await api.get(`/input-aspirasi${params}`);
    return response.data;
  },

  getRecent: async (limit: number = 5, statusReview?: string): Promise<ApiResponse<InputAspirasi[]>> => {
    const params = statusReview ? `&status_review=${statusReview}` : '';
    const response = await api.get(`/input-aspirasi/recent?limit=${limit}${params}`);
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<InputAspirasi>> => {
    const response = await api.get(`/input-aspirasi/${id}`);
    return response.data;
  },

  getBySiswa: async (nis: number): Promise<ApiResponse<InputAspirasi[]>> => {
    const response = await api.get(`/input-aspirasi/siswa/${nis}`);
    return response.data;
  },

  create: async (data: InputAspirasiCreateRequest): Promise<ApiResponse<InputAspirasi>> => {
    const response = await api.post('/input-aspirasi', data);
    return response.data;
  },

  update: async (id: number, data: InputAspirasiUpdateRequest): Promise<ApiResponse<InputAspirasi>> => {
    const response = await api.put(`/input-aspirasi/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/input-aspirasi/${id}`);
    return response.data;
  },
};

// ==================== ASPIRASI SERVICES ====================
export const aspirasiService = {
  getAll: async (): Promise<ApiResponse<Aspirasi[]>> => {
    const response = await api.get('/aspirasi');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Aspirasi>> => {
    const response = await api.get(`/aspirasi/${id}`);
    return response.data;
  },

  getByAdmin: async (idAdmin: number): Promise<ApiResponse<Aspirasi[]>> => {
    const response = await api.get(`/aspirasi/admin/${idAdmin}`);
    return response.data;
  },

  getByStatus: async (status: AspirasiStatus): Promise<ApiResponse<Aspirasi[]>> => {
    const response = await api.get(`/aspirasi/status/${status}`);
    return response.data;
  },

  create: async (data: AspirasiCreateRequest | FormData): Promise<ApiResponse<Aspirasi>> => {
    const isFormData = data instanceof FormData;
    const response = await api.post('/aspirasi', data, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : undefined);
    return response.data;
  },

  update: async (id: number, data: AspirasiUpdateRequest): Promise<ApiResponse<Aspirasi>> => {
    const response = await api.put(`/aspirasi/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: number, data: AspirasiStatusUpdateRequest): Promise<ApiResponse<Aspirasi>> => {
    const response = await api.patch(`/aspirasi/${id}/status`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/aspirasi/${id}`);
    return response.data;
  },
};

// ==================== REVIEW SERVICE ====================
export const reviewService = {
  getPending: async (): Promise<ApiResponse<InputAspirasi[]>> => {
    const response = await api.get('/review/pending');
    return response.data;
  },

  accept: async (id: number): Promise<ApiResponse<InputAspirasi>> => {
    const response = await api.patch(`/review/${id}/accept`);
    return response.data;
  },

  reject: async (id: number): Promise<ApiResponse<InputAspirasi>> => {
    const response = await api.patch(`/review/${id}/reject`);
    return response.data;
  },

  getArsip: async (): Promise<ApiResponse<InputAspirasi[]>> => {
    const response = await api.get('/review/arsip');
    return response.data;
  },
};

// ==================== SARAN PUBLIK SERVICE ====================
export const saranPublikService = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/saran-publik');
    return response.data;
  },

  create: async (data: {
    nama_pengirim: string;
    email?: string;
    no_telepon?: string;
    kategori_pengirim: string;
    id_kategori?: number;
    isi_saran: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/saran-publik', data);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<ApiResponse<any>> => {
    const response = await api.patch(`/saran-publik/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/saran-publik/${id}`);
    return response.data;
  },

  getStatistics: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/saran-publik/statistics');
    return response.data;
  },
};
