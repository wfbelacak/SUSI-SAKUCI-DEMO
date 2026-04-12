import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StudentLayout } from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Send, Loader2, X, Image } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useKategoriList } from "@/hooks/useApi";
import api from "@/lib/api";

export default function StudentNewComplaint() {
  const navigate = useNavigate();
  const { siswa } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id_kategori: "",
    lokasi: "",
    keterangan: "",
  });

  // Fetch categories from API
  const { data: kategoriData, isLoading: loadingKategori } = useKategoriList();
  const categories = kategoriData?.data || [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error("Format file tidak valid", {
          description: "Gunakan format JPG, PNG, atau GIF",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File terlalu besar", {
          description: "Maksimal ukuran file adalah 5MB",
        });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!siswa?.nis) {
      toast.error("Error", { description: "Anda harus login terlebih dahulu" });
      return;
    }

    if (!formData.id_kategori || !formData.lokasi || !formData.keterangan) {
      toast.error("Error", { description: "Mohon lengkapi semua field yang wajib" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Use FormData for file upload
      const submitData = new FormData();
      submitData.append('nis', String(siswa.nis));
      submitData.append('id_kategori', formData.id_kategori);
      submitData.append('lokasi', formData.lokasi);
      submitData.append('keterangan', formData.keterangan);
      
      if (selectedFile) {
        submitData.append('foto_dokumentasi', selectedFile);
      }

      await api.post('/input-aspirasi', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Pengaduan berhasil dikirim!", {
        description: "Tim kami akan segera meninjau laporan Anda.",
      });

      navigate("/student/complaints");
    } catch (error: any) {
      toast.error("Gagal mengirim pengaduan", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Back button */}
        <Button variant="ghost" className="gap-2" onClick={() => navigate("/student")}>
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Buat Pengaduan Baru</CardTitle>
            <CardDescription>
              Sampaikan keluhan atau aspirasimu terkait sarana dan prasarana sekolah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <Label>Kategori *</Label>
                <Select
                  value={formData.id_kategori}
                  onValueChange={(value) => handleChange("id_kategori", value)}
                  disabled={loadingKategori}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingKategori ? "Memuat..." : "Pilih kategori"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id_kategori} value={String(cat.id_kategori)}>
                        {cat.ket_kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="lokasi">Lokasi *</Label>
                <Input
                  id="lokasi"
                  placeholder="Contoh: Gedung A Lantai 2, Ruang 201"
                  value={formData.lokasi}
                  onChange={(e) => handleChange("lokasi", e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="keterangan">Keterangan / Deskripsi *</Label>
                <Textarea
                  id="keterangan"
                  placeholder="Jelaskan detail permasalahan yang kamu temui..."
                  value={formData.keterangan}
                  onChange={(e) => handleChange("keterangan", e.target.value)}
                  className="min-h-[150px]"
                  required
                />
              </div>

              {/* File upload */}
              <div className="space-y-2">
                <Label>Foto Dokumentasi (Opsional)</Label>
                
                {!selectedFile ? (
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      Klik untuk upload atau drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF hingga 5MB
                    </p>
                  </div>
                ) : (
                  <div className="relative border rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      {previewUrl && (
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Submit buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/student")}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 btn-primary-gradient gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Pengaduan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
