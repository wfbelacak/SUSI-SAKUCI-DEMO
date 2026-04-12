import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Search, Plus, Pencil, Trash2, Loader2, Users, Eye, EyeOff, UserCheck, UserX 
} from "lucide-react";
import { toast } from "sonner";
import { useSiswaList, useCreateSiswa, useUpdateSiswa, useDeleteSiswa, useToggleSiswaActive } from "@/hooks/useApi";
import type { Siswa, SiswaCreateRequest, SiswaUpdateRequest } from "@/types";

export default function AdminStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nis: "",
    nama: "",
    kelas: "",
    password: "",
    is_active: true,
  });

  // API hooks
  const { data: siswaData, isLoading, refetch } = useSiswaList();
  const createMutation = useCreateSiswa();
  const updateMutation = useUpdateSiswa();
  const deleteMutation = useDeleteSiswa();
  const toggleActiveMutation = useToggleSiswaActive();

  const allSiswa = siswaData?.data || [];
  
  // Filter students
  const filteredSiswa = allSiswa.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.nis).includes(searchQuery) ||
      s.kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateDialog = () => {
    setSelectedSiswa(null);
    setFormData({ nis: "", nama: "", kelas: "", password: "", is_active: true });
    setDialogOpen(true);
  };

  const openEditDialog = (siswa: Siswa) => {
    setSelectedSiswa(siswa);
    setFormData({
      nis: String(siswa.nis),
      nama: siswa.nama,
      kelas: siswa.kelas,
      password: "",
      is_active: siswa.is_active !== false, // default true if undefined
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (siswa: Siswa) => {
    setSelectedSiswa(siswa);
    setDeleteDialogOpen(true);
  };

  // Toggle active status directly from table
  const handleToggleActive = async (siswa: Siswa) => {
    try {
      const result = await toggleActiveMutation.mutateAsync(siswa.nis);
      toast.success(
        result.data?.is_active ? "Akun siswa diaktifkan" : "Akun siswa dinonaktifkan",
        { description: `${siswa.nama} (${siswa.nis})` }
      );
    } catch (error: any) {
      toast.error("Gagal mengubah status", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.nama || !formData.kelas) {
      toast.error("Lengkapi semua field yang wajib");
      return;
    }

    try {
      if (selectedSiswa) {
        // Update
        const updateData: SiswaUpdateRequest = {
          nama: formData.nama,
          kelas: formData.kelas,
          is_active: formData.is_active,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await updateMutation.mutateAsync({ nis: selectedSiswa.nis, data: updateData });
        toast.success("Data siswa berhasil diperbarui");
      } else {
        // Create
        if (!formData.nis || !formData.password) {
          toast.error("NIS dan password wajib diisi untuk siswa baru");
          return;
        }
        const createData: SiswaCreateRequest = {
          nis: parseInt(formData.nis),
          nama: formData.nama,
          kelas: formData.kelas,
          password: formData.password,
          is_active: formData.is_active,
        };
        await createMutation.mutateAsync(createData);
        toast.success("Siswa baru berhasil ditambahkan");
      }
      setDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error("Gagal menyimpan data", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedSiswa) return;

    try {
      await deleteMutation.mutateAsync(selectedSiswa.nis);
      toast.success("Siswa berhasil dihapus");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error("Gagal menghapus siswa", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Layout role="admin">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Data Siswa</h1>
            <p className="text-muted-foreground mt-1">Kelola akun siswa yang terdaftar</p>
          </div>
          <Button onClick={openCreateDialog} className="btn-primary-gradient gap-2">
            <Plus className="w-4 h-4" />
            Tambah Siswa
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, NIS, atau kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Daftar Siswa ({filteredSiswa.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredSiswa.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Tidak ada data siswa</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NIS</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSiswa.map((siswa) => (
                      <TableRow key={siswa.nis} className={siswa.is_active === false ? 'opacity-60' : ''}>
                        <TableCell className="font-medium">{siswa.nis}</TableCell>
                        <TableCell>{siswa.nama}</TableCell>
                        <TableCell>{siswa.kelas}</TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">{siswa.password || '***'}</code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={siswa.is_active !== false ? "default" : "secondary"}
                              className={siswa.is_active !== false 
                                ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" 
                                : "bg-gray-500/10 text-gray-500"
                              }
                            >
                              {siswa.is_active !== false ? (
                                <><UserCheck className="w-3 h-3 mr-1" /> Aktif</>
                              ) : (
                                <><UserX className="w-3 h-3 mr-1" /> Nonaktif</>
                              )}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(siswa)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSiswa ? "Edit Siswa" : "Tambah Siswa Baru"}
            </DialogTitle>
            <DialogDescription>
              {selectedSiswa 
                ? "Perbarui data siswa yang dipilih" 
                : "Masukkan data siswa baru untuk mendaftarkannya ke sistem"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nis">NIS *</Label>
              <Input
                id="nis"
                type="number"
                placeholder="Masukkan NIS"
                value={formData.nis}
                onChange={(e) => setFormData(prev => ({ ...prev, nis: e.target.value }))}
                disabled={!!selectedSiswa}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap *</Label>
              <Input
                id="nama"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kelas">Kelas *</Label>
              <Input
                id="kelas"
                placeholder="Contoh: XI IPA 1"
                value={formData.kelas}
                onChange={(e) => setFormData(prev => ({ ...prev, kelas: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {selectedSiswa ? "(kosongkan jika tidak diubah)" : "*"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* Active Status Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Status Akun</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.is_active 
                    ? "Akun aktif dan dapat digunakan untuk login" 
                    : "Akun dinonaktifkan, tidak bisa login"}
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
