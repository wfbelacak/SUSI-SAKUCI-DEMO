import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, Loader2, Tag, Search } from "lucide-react";
import { toast } from "sonner";
import { useKategoriList, useCreateKategori, useUpdateKategori, useDeleteKategori } from "@/hooks/useApi";
import type { Kategori } from "@/types";

export default function AdminCategories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState<Kategori | null>(null);
  const [formData, setFormData] = useState({ ket_kategori: "" });

  // API hooks
  const { data: kategoriData, isLoading } = useKategoriList();
  const createMutation = useCreateKategori();
  const updateMutation = useUpdateKategori();
  const deleteMutation = useDeleteKategori();

  const categories = kategoriData?.data || [];

  // Filter categories
  const filteredCategories = categories.filter((cat) =>
    cat.ket_kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    if (!formData.ket_kategori.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }

    try {
      await createMutation.mutateAsync({ ket_kategori: formData.ket_kategori });
      toast.success("Kategori berhasil ditambahkan!");
      setIsCreateOpen(false);
      setFormData({ ket_kategori: "" });
    } catch (error: any) {
      toast.error("Gagal menambahkan kategori", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedKategori || !formData.ket_kategori.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: selectedKategori.id_kategori,
        data: { ket_kategori: formData.ket_kategori },
      });
      toast.success("Kategori berhasil diperbarui!");
      setIsEditOpen(false);
      setSelectedKategori(null);
      setFormData({ ket_kategori: "" });
    } catch (error: any) {
      toast.error("Gagal memperbarui kategori", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedKategori) return;

    try {
      await deleteMutation.mutateAsync(selectedKategori.id_kategori);
      toast.success("Kategori berhasil dihapus!");
      setIsDeleteOpen(false);
      setSelectedKategori(null);
    } catch (error: any) {
      toast.error("Gagal menghapus kategori", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  const openEditDialog = (kategori: Kategori) => {
    setSelectedKategori(kategori);
    setFormData({ ket_kategori: kategori.ket_kategori });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (kategori: Kategori) => {
    setSelectedKategori(kategori);
    setIsDeleteOpen(true);
  };

  return (
    <Layout role="admin">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Data Kategori</h1>
            <p className="text-muted-foreground mt-1">Kelola kategori pengaduan</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="btn-primary-gradient gap-2">
            <Plus className="w-4 h-4" />
            Tambah Kategori
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Daftar Kategori ({filteredCategories.length})
            </CardTitle>
            <CardDescription>Kategori digunakan untuk mengelompokkan pengaduan</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada kategori</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">ID</TableHead>
                      <TableHead>Nama Kategori</TableHead>
                      <TableHead className="w-32 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((kategori) => (
                      <TableRow key={kategori.id_kategori} className="group">
                        <TableCell className="font-medium">{kategori.id_kategori}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Tag className="w-4 h-4 text-primary" />
                            </div>
                            {kategori.ket_kategori}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(kategori)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => openDeleteDialog(kategori)}
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
            <DialogDescription>
              Masukkan nama kategori untuk pengaduan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-nama">Nama Kategori</Label>
              <Input
                id="create-nama"
                placeholder="Contoh: Fasilitas Kelas"
                value={formData.ket_kategori}
                onChange={(e) => setFormData({ ket_kategori: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="btn-primary-gradient"
            >
              {createMutation.isPending ? (
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>
              Perbarui nama kategori
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nama">Nama Kategori</Label>
              <Input
                id="edit-nama"
                placeholder="Contoh: Fasilitas Kelas"
                value={formData.ket_kategori}
                onChange={(e) => setFormData({ ket_kategori: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleEdit}
              disabled={updateMutation.isPending}
              className="btn-primary-gradient"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus kategori "{selectedKategori?.ket_kategori}"?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
