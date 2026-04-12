import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { StatusBadge, ComplaintStatus } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, MapPin, Calendar, Tag, User, MessageSquare, Loader2, 
  CheckCircle2, Clock, Send, Lock, AlertCircle, Star, Upload, X, Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useInputAspirasiDetail, useCreateAspirasi, useUpdateAspirasiStatus } from "@/hooks/useApi";
import type { AspirasiStatus } from "@/types";

// Map database status to UI status
const mapStatus = (status: string | undefined): ComplaintStatus => {
  switch (status) {
    case 'Menunggu': return 'pending';
    case 'Proses': return 'in_progress';
    case 'Selesai': return 'completed';
    default: return 'pending';
  }
};

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useAuth();
  
  const [responseData, setResponseData] = useState({
    status: "" as AspirasiStatus | "",
    detail_tanggapan: "",
  });
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if admin is Pelaksana (can edit) or Admin (view only)
  const isPelaksana = admin?.posisi === 'Pelaksana';
  const isAdminRole = admin?.posisi === 'Admin';
  
  // Fetch complaint detail from API
  const { data: complaintData, isLoading, error, refetch } = useInputAspirasiDetail(Number(id));
  const complaint = complaintData?.data;
  
  // Mutations
  const createAspirasiMutation = useCreateAspirasi();
  const updateStatusMutation = useUpdateAspirasiStatus();

  // Get current status for locking logic
  const currentStatus = complaint?.aspirasi?.[0]?.status || 'Menunggu';
  
  // Status locking: once Proses, cannot go back to Menunggu
  const getAvailableStatuses = (): AspirasiStatus[] => {
    switch (currentStatus) {
      case 'Menunggu':
        return ['Menunggu', 'Proses', 'Selesai'];
      case 'Proses':
        return ['Proses', 'Selesai']; // Cannot go back to Menunggu
      case 'Selesai':
        return ['Selesai']; // Locked, cannot change
      default:
        return ['Menunggu', 'Proses', 'Selesai'];
    }
  };
  
  const isStatusLocked = currentStatus === 'Selesai';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onload = () => setFotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitResponse = async () => {
    if (!complaint || !admin) {
      toast.error("Error", { description: "Data tidak lengkap" });
      return;
    }

    if (!responseData.status) {
      toast.error("Error", { description: "Pilih status tanggapan" });
      return;
    }

    try {
      const existingAspirasi = complaint.aspirasi?.[0];
      
      if (existingAspirasi) {
        // Update existing aspirasi
        await updateStatusMutation.mutateAsync({
          id: existingAspirasi.id_aspirasi,
          data: {
            status: responseData.status as AspirasiStatus,
            detail_tanggapan: responseData.detail_tanggapan || undefined,
          }
        });
      } else {
        // Create new aspirasi with FormData for file upload
        const formData = new FormData();
        formData.append('id_pelaporan', String(complaint.id_pelaporan));
        formData.append('id_kategori', String(complaint.id_kategori));
        formData.append('id_admin', String(admin.id_admin));
        formData.append('status', responseData.status as AspirasiStatus);
        if (responseData.detail_tanggapan) {
          formData.append('detail_tanggapan', responseData.detail_tanggapan);
        }
        if (fotoFile) {
          formData.append('foto_tanggapan', fotoFile);
        }
        await createAspirasiMutation.mutateAsync(formData as any);
      }

      toast.success("Tanggapan berhasil dikirim!", {
        description: `Status diubah ke ${responseData.status}`,
      });
      
      // Refetch data
      refetch();
      
      // Reset form
      setResponseData({ status: "", detail_tanggapan: "" });
      clearFile();
    } catch (error: any) {
      toast.error("Gagal mengirim tanggapan", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout role="admin">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !complaint) {
    return (
      <Layout role="admin">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Pengaduan tidak ditemukan</h2>
          <p className="text-muted-foreground mb-4">ID: {id}</p>
          <Button onClick={() => navigate("/admin/complaints")}>
            Kembali ke Daftar Pengaduan
          </Button>
        </div>
      </Layout>
    );
  }

  const latestAspirasi = complaint.aspirasi?.[0];
  const status = mapStatus(latestAspirasi?.status);
  const isPending = createAspirasiMutation.isPending || updateStatusMutation.isPending;
  const availableStatuses = getAvailableStatuses();

  return (
    <Layout role="admin">
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        {/* Back button */}
        <Button variant="ghost" className="gap-2" onClick={() => navigate("/admin/complaints")}>
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Pengaduan
        </Button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Complaint Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl mb-2">
                      Pengaduan #{complaint.id_pelaporan}
                    </CardTitle>
                    <StatusBadge status={status} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">Kategori:</span>
                    <span className="font-medium">{complaint.kategori?.ket_kategori || 'Umum'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">Lokasi:</span>
                    <span className="font-medium">{complaint.lokasi}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">Pelapor:</span>
                    <span className="font-medium">{complaint.siswa?.nama || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">NIS:</span>
                    <span className="font-medium">{complaint.nis}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Deskripsi Pengaduan</h3>
                  <p className="text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">
                    {complaint.keterangan}
                  </p>
                </div>

                {/* Photo */}
                {complaint.foto_dokumentasi && (
                  <div>
                    <h3 className="font-semibold mb-2">Foto Dokumentasi</h3>
                    <div className="rounded-lg overflow-hidden border">
                      <img 
                        src={complaint.foto_dokumentasi.startsWith('/') ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}${complaint.foto_dokumentasi}` : complaint.foto_dokumentasi} 
                        alt="Dokumentasi" 
                        className="w-full h-auto max-h-96 object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Previous Response */}
            {latestAspirasi && latestAspirasi.detail_tanggapan && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Tanggapan Sebelumnya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{latestAspirasi.admin?.nama_admin || admin?.nama_admin || 'Admin'}</span>
                      <StatusBadge status={status} />
                    </div>
                    <p className="text-muted-foreground">{latestAspirasi.detail_tanggapan}</p>
                    {latestAspirasi.foto_tanggapan && (
                      <div className="mt-3 rounded-lg overflow-hidden border">
                        <img 
                          src={latestAspirasi.foto_tanggapan.startsWith('/') ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}${latestAspirasi.foto_tanggapan}` : latestAspirasi.foto_tanggapan} 
                          alt="Foto Tanggapan" 
                          className="w-full h-auto max-h-64 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Response Form - Only for Pelaksana */}
            {isPelaksana ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    {latestAspirasi ? 'Update Status' : 'Beri Tanggapan'}
                    {isStatusLocked && (
                      <Badge variant="secondary" className="ml-2 gap-1">
                        <Lock className="w-3 h-3" />
                        Terkunci
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isStatusLocked ? (
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Status Terkunci</p>
                        <p className="text-sm text-muted-foreground">
                          Pengaduan ini sudah selesai dan tidak dapat diubah lagi.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Status *</Label>
                        <Select 
                          value={responseData.status} 
                          onValueChange={(value) => setResponseData(prev => ({ ...prev, status: value as AspirasiStatus }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableStatuses.includes('Menunggu') && (
                              <SelectItem value="Menunggu">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-yellow-500" />
                                  Menunggu
                                </div>
                              </SelectItem>
                            )}
                            {availableStatuses.includes('Proses') && (
                              <SelectItem value="Proses">
                                <div className="flex items-center gap-2">
                                  <Loader2 className="w-4 h-4 text-blue-500" />
                                  Proses
                                </div>
                              </SelectItem>
                            )}
                            {availableStatuses.includes('Selesai') && (
                              <SelectItem value="Selesai">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  Selesai
                                </div>
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        {currentStatus === 'Proses' && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Status tidak dapat dikembalikan ke "Menunggu"
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="detail_tanggapan">Detail Tanggapan</Label>
                        <Textarea
                          id="detail_tanggapan"
                          placeholder="Jelaskan tindakan yang sudah atau akan dilakukan..."
                          value={responseData.detail_tanggapan}
                          onChange={(e) => setResponseData(prev => ({ ...prev, detail_tanggapan: e.target.value }))}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="foto_tanggapan">Foto/Video Tanggapan (Opsional)</Label>
                        {fotoPreview ? (
                          <div className="relative rounded-lg overflow-hidden border bg-muted/50">
                            {fotoFile?.type.startsWith('video/') ? (
                              <video src={fotoPreview} className="w-full h-auto max-h-48 object-cover" controls />
                            ) : (
                              <img src={fotoPreview} alt="Preview" className="w-full h-auto max-h-48 object-cover" />
                            )}
                            <button
                              type="button"
                              onClick={clearFile}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                          >
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Klik untuk upload foto atau video</p>
                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF, MP4 (max 10MB)</p>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          id="foto_tanggapan"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/gif,video/mp4,video/mov,video/avi"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>

                      <Button 
                        onClick={handleSubmitResponse}
                        disabled={isPending || !responseData.status}
                        className="w-full btn-primary-gradient"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Kirim Tanggapan
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              // Admin role (view only) notice
              <Card className="border-dashed">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Akses Terbatas</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Sebagai <strong>Admin</strong>, Anda hanya dapat melihat detail pengaduan. 
                        Untuk memperbarui status atau memberikan tanggapan, diperlukan akun <strong>Pelaksana</strong>.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Info Pelapor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nama</p>
                  <p className="font-medium">{complaint.siswa?.nama || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NIS</p>
                  <p className="font-medium">{complaint.nis}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kelas</p>
                  <p className="font-medium">{complaint.siswa?.kelas || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Saat Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${
                    status === 'completed' ? 'bg-green-500' : 
                    status === 'in_progress' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium">
                      {latestAspirasi?.status || 'Menunggu'}
                    </p>
                    {latestAspirasi?.admin && (
                      <p className="text-xs text-muted-foreground">
                        oleh {latestAspirasi.admin.nama_admin}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Rating */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Rating dari Siswa
                </CardTitle>
              </CardHeader>
              <CardContent>
                {latestAspirasi?.feedback ? (
                  <div className="space-y-3">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 ${
                            star <= latestAspirasi.feedback
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-center text-sm font-medium">
                      {latestAspirasi.feedback === 1 && 'Sangat Tidak Puas'}
                      {latestAspirasi.feedback === 2 && 'Tidak Puas'}
                      {latestAspirasi.feedback === 3 && 'Cukup'}
                      {latestAspirasi.feedback === 4 && 'Puas'}
                      {latestAspirasi.feedback === 5 && 'Sangat Puas'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-2 text-muted-foreground text-sm">
                    <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>Belum ada rating</p>
                    {status === 'completed' && (
                      <p className="text-xs mt-1">Menunggu feedback dari siswa</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Handler Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Info Anda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nama</p>
                  <p className="font-medium">{admin?.nama_admin || 'Admin'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posisi</p>
                  <Badge variant={isPelaksana ? "default" : "secondary"}>
                    {admin?.posisi || 'Admin'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
