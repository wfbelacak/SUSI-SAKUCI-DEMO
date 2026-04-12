// ==================== SISWA ====================
export interface Siswa {
  nis: number;
  nama: string;
  password?: string;
  kelas: string;
  is_active?: boolean;
  dibuat_pada: string | null;
  terakhir_update: string | null;
  input_aspirasi?: InputAspirasi[];
}

export interface SiswaLoginRequest {
  nis: number;
  password: string;
}

export interface SiswaCreateRequest {
  nis: number;
  nama: string;
  password: string;
  kelas: string;
  is_active?: boolean;
}

export interface SiswaUpdateRequest {
  nama?: string;
  password?: string;
  kelas?: string;
  is_active?: boolean;
}

// ==================== ADMIN ====================
export interface Admin {
  id_admin: number;
  nama_admin: string;
  username: number;
  password?: string;
  posisi: 'Admin' | 'Pelaksana';
  aspirasi?: Aspirasi[];
}

export interface AdminLoginRequest {
  username: number;
  password: string;
}

export interface AdminCreateRequest {
  nama_admin: string;
  username: number;
  password: string;
  posisi: 'Admin' | 'Pelaksana';
}

export interface AdminUpdateRequest {
  nama_admin?: string;
  username?: number;
  password?: string;
  posisi?: 'Admin' | 'Pelaksana';
}

// ==================== KATEGORI ====================
export interface Kategori {
  id_kategori: number;
  ket_kategori: string;
  input_aspirasi?: InputAspirasi[];
  aspirasi?: Aspirasi[];
}

export interface KategoriRequest {
  ket_kategori: string;
}

// ==================== INPUT ASPIRASI ====================
export interface InputAspirasi {
  id_pelaporan: number;
  nis: number;
  id_kategori: number;
  lokasi: string;
  foto_dokumentasi: string | null;
  keterangan: string;
  status_review?: 'pending' | 'diterima' | 'ditolak';
  created_at?: string;
  siswa?: Siswa;
  kategori?: Kategori;
  aspirasi?: Aspirasi[];
}

export interface InputAspirasiCreateRequest {
  nis: number;
  id_kategori: number;
  lokasi: string;
  foto_dokumentasi?: string;
  keterangan: string;
}

export interface InputAspirasiUpdateRequest {
  nis?: number;
  id_kategori?: number;
  lokasi?: string;
  foto_dokumentasi?: string;
  keterangan?: string;
}

// ==================== ASPIRASI ====================
export type AspirasiStatus = 'Menunggu' | 'Proses' | 'Selesai';

export interface Aspirasi {
  id_aspirasi: number;
  id_pelaporan: number;
  id_kategori: number;
  id_admin: number;
  status: AspirasiStatus;
  feedback: number | null;
  foto_tanggapan: string | null;
  detail_tanggapan: string | null;
  input_aspirasi?: InputAspirasi;
  kategori?: Kategori;
  admin?: Admin;
}

export interface AspirasiCreateRequest {
  id_pelaporan: number;
  id_kategori: number;
  id_admin: number;
  status?: AspirasiStatus;
  feedback?: number;
  foto_tanggapan?: string;
  detail_tanggapan?: string;
}

export interface AspirasiUpdateRequest {
  id_pelaporan?: number;
  id_kategori?: number;
  id_admin?: number;
  status?: AspirasiStatus;
  feedback?: number;
  foto_tanggapan?: string;
  detail_tanggapan?: string;
}

export interface AspirasiStatusUpdateRequest {
  status: AspirasiStatus;
  detail_tanggapan?: string;
}

// ==================== API RESPONSE ====================
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}
