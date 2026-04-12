import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  authService,
  siswaService,
  adminService,
  kategoriService,
  inputAspirasiService,
  aspirasiService,
  reviewService,
} from '@/services/api';
import type {
  SiswaLoginRequest,
  SiswaCreateRequest,
  SiswaUpdateRequest,
  AdminLoginRequest,
  AdminCreateRequest,
  AdminUpdateRequest,
  KategoriRequest,
  InputAspirasiCreateRequest,
  InputAspirasiUpdateRequest,
  AspirasiCreateRequest,
  AspirasiUpdateRequest,
  AspirasiStatusUpdateRequest,
  AspirasiStatus,
} from '@/types';

// ==================== AUTH HOOKS ====================
export const useLoginSiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SiswaLoginRequest) => authService.loginSiswa(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useLoginAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminLoginRequest) => authService.loginAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

// ==================== SISWA HOOKS ====================
export const useSiswaList = () => {
  return useQuery({
    queryKey: ['siswa'],
    queryFn: () => siswaService.getAll(),
    staleTime: 30 * 1000,
  });
};

export const useSiswaDetail = (nis: number) => {
  return useQuery({
    queryKey: ['siswa', nis],
    queryFn: () => siswaService.getById(nis),
    enabled: !!nis,
    staleTime: 30 * 1000,
  });
};

export const useCreateSiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SiswaCreateRequest) => siswaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
    },
  });
};

export const useUpdateSiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ nis, data }: { nis: number; data: SiswaUpdateRequest }) =>
      siswaService.update(nis, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
    },
  });
};

export const useDeleteSiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nis: number) => siswaService.delete(nis),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
    },
  });
};

export const useToggleSiswaActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nis: number) => siswaService.toggleActive(nis),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
    },
  });
};

// ==================== ADMIN HOOKS ====================
export const useAdminList = () => {
  return useQuery({
    queryKey: ['admin'],
    queryFn: () => adminService.getAll(),
    staleTime: 30 * 1000,
  });
};

export const useAdminDetail = (id: number) => {
  return useQuery({
    queryKey: ['admin', id],
    queryFn: () => adminService.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminCreateRequest) => adminService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdminUpdateRequest }) =>
      adminService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

// ==================== KATEGORI HOOKS ====================
export const useKategoriList = () => {
  return useQuery({
    queryKey: ['kategori'],
    queryFn: () => kategoriService.getAll(),
    staleTime: 60 * 1000,
  });
};

export const useKategoriDetail = (id: number) => {
  return useQuery({
    queryKey: ['kategori', id],
    queryFn: () => kategoriService.getById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
};

export const useCreateKategori = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: KategoriRequest) => kategoriService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori'] });
    },
  });
};

export const useUpdateKategori = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: KategoriRequest }) =>
      kategoriService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori'] });
    },
  });
};

export const useDeleteKategori = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => kategoriService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori'] });
    },
  });
};

// ==================== INPUT ASPIRASI HOOKS ====================
export const useInputAspirasiList = (statusReview?: string) => {
  return useQuery({
    queryKey: ['input-aspirasi', statusReview],
    queryFn: () => inputAspirasiService.getAll(statusReview),
    staleTime: 30 * 1000,
  });
};

export const useRecentComplaints = (limit: number = 5) => {
  return useQuery({
    queryKey: ['input-aspirasi', 'recent', limit],
    queryFn: () => inputAspirasiService.getRecent(limit),
    staleTime: 30 * 1000,
  });
};

export const useInputAspirasiDetail = (id: number) => {
  return useQuery({
    queryKey: ['input-aspirasi', id],
    queryFn: () => inputAspirasiService.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

export const useInputAspirasiBySiswa = (nis: number) => {
  return useQuery({
    queryKey: ['input-aspirasi', 'siswa', nis],
    queryFn: () => inputAspirasiService.getBySiswa(nis),
    enabled: !!nis,
    staleTime: 30 * 1000,
  });
};

export const useCreateInputAspirasi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InputAspirasiCreateRequest) => inputAspirasiService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['input-aspirasi'] });
    },
  });
};

export const useUpdateInputAspirasi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: InputAspirasiUpdateRequest }) =>
      inputAspirasiService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['input-aspirasi'] });
    },
  });
};

export const useDeleteInputAspirasi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => inputAspirasiService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['input-aspirasi'] });
    },
  });
};

// ==================== ASPIRASI HOOKS ====================
export const useAspirasiList = () => {
  return useQuery({
    queryKey: ['aspirasi'],
    queryFn: () => aspirasiService.getAll(),
    staleTime: 30 * 1000,
  });
};

export const useAspirasiDetail = (id: number) => {
  return useQuery({
    queryKey: ['aspirasi', id],
    queryFn: () => aspirasiService.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

export const useAspirasiByAdmin = (idAdmin: number) => {
  return useQuery({
    queryKey: ['aspirasi', 'admin', idAdmin],
    queryFn: () => aspirasiService.getByAdmin(idAdmin),
    enabled: !!idAdmin,
    staleTime: 30 * 1000,
  });
};

export const useAspirasiByStatus = (status: AspirasiStatus) => {
  return useQuery({
    queryKey: ['aspirasi', 'status', status],
    queryFn: () => aspirasiService.getByStatus(status),
    enabled: !!status,
    staleTime: 30 * 1000,
  });
};

export const useCreateAspirasi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AspirasiCreateRequest) => aspirasiService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aspirasi'] });
      queryClient.invalidateQueries({ queryKey: ['input-aspirasi'] });
    },
  });
};

export const useUpdateAspirasi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AspirasiUpdateRequest }) =>
      aspirasiService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aspirasi'] });
    },
  });
};

export const useUpdateAspirasiStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AspirasiStatusUpdateRequest }) =>
      aspirasiService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aspirasi'] });
    },
  });
};

export const useDeleteAspirasi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => aspirasiService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aspirasi'] });
    },
  });
};

// ==================== REVIEW HOOKS ====================
export const useReviewPending = () => {
  return useQuery({
    queryKey: ['review', 'pending'],
    queryFn: () => reviewService.getPending(),
    staleTime: 30 * 1000,
  });
};

export const useArsipList = () => {
  return useQuery({
    queryKey: ['review', 'arsip'],
    queryFn: () => reviewService.getArsip(),
    staleTime: 30 * 1000,
  });
};

export const useAcceptComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewService.accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review'] });
      queryClient.invalidateQueries({ queryKey: ['input-aspirasi'] });
    },
  });
};

export const useRejectComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review'] });
      queryClient.invalidateQueries({ queryKey: ['input-aspirasi'] });
    },
  });
};
