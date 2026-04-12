import { useParams, useNavigate } from "react-router-dom";
import { StudentLayout } from "@/components/StudentLayout";
import { StatusBadge, ComplaintStatus } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, Tag, User, MessageSquare, Loader2 } from "lucide-react";
import { useInputAspirasiDetail } from "@/hooks/useApi";

// Map database status to UI status
const mapStatus = (status: string | undefined): ComplaintStatus => {
  switch (status) {
    case 'Menunggu': return 'pending';
    case 'Proses': return 'in_progress';
    case 'Selesai': return 'completed';
    default: return 'pending';
  }
};

export default function StudentComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch complaint detail from API
  const { data: complaintData, isLoading, error } = useInputAspirasiDetail(Number(id));
  const complaint = complaintData?.data;

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </StudentLayout>
    );
  }

  if (error || !complaint) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Pengaduan tidak ditemukan</h2>
          <p className="text-muted-foreground mb-4">ID: {id}</p>
          <Button onClick={() => navigate("/student/complaints")}>
            Kembali ke Daftar Pengaduan
          </Button>
        </div>
      </StudentLayout>
    );
  }

  const latestAspirasi = complaint.aspirasi?.[0];
  const status = mapStatus(latestAspirasi?.status);

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Back button */}
        <Button variant="ghost" className="gap-2" onClick={() => navigate("/student/complaints")}>
          <ArrowLeft className="w-4 h-4" />
          Kembali
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Kategori:</span>
                    <span className="font-medium">{complaint.kategori?.ket_kategori || 'Umum'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Lokasi:</span>
                    <span className="font-medium">{complaint.lokasi}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Pelapor:</span>
                    <span className="font-medium">{complaint.siswa?.nama || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">NIS:</span>
                    <span className="font-medium">{complaint.nis}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Deskripsi Pengaduan</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {complaint.keterangan}
                  </p>
                </div>

                {/* Photo */}
                {complaint.foto_dokumentasi && (
                  <div>
                    <h3 className="font-semibold mb-2">Foto Dokumentasi</h3>
                    <div className="rounded-lg overflow-hidden border">
                      <img 
                        src={complaint.foto_dokumentasi} 
                        alt="Dokumentasi" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response from Admin */}
            {latestAspirasi && latestAspirasi.detail_tanggapan && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Tanggapan Admin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{latestAspirasi.admin?.nama_admin || 'Admin'}</span>
                      <span className="text-xs text-muted-foreground">
                        ({latestAspirasi.admin?.posisi || 'Staff'})
                      </span>
                    </div>
                    <p className="text-muted-foreground">{latestAspirasi.detail_tanggapan}</p>
                    {latestAspirasi.foto_tanggapan && (
                      <div className="mt-3 rounded-lg overflow-hidden border">
                        <img 
                          src={latestAspirasi.foto_tanggapan} 
                          alt="Foto Tanggapan" 
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Pengaduan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${status === 'completed' ? 'bg-green-500' : status === 'in_progress' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                    <div>
                      <p className="font-medium">
                        {status === 'completed' ? 'Selesai' : status === 'in_progress' ? 'Sedang Diproses' : 'Menunggu'}
                      </p>
                      <p className="text-xs text-muted-foreground">Status saat ini</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Rating if completed */}
            {status === 'completed' && latestAspirasi?.feedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`text-2xl ${star <= latestAspirasi.feedback! ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {latestAspirasi.feedback}/5 bintang
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
