import { Layout } from "@/components/Layout";
import { useArsipList } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Archive,
  MapPin,
  Clock,
  FileText,
  Loader2,
  Inbox,
} from "lucide-react";

const AdminArsip = () => {
  const { data: arsipData, isLoading } = useArsipList();
  const complaints = arsipData?.data || [];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Arsip Pengaduan</h1>
          <p className="text-muted-foreground mt-1">
            Pengaduan yang ditolak atau sudah melewati batas waktu 2 minggu
          </p>
        </div>

        {/* Stats */}
        <Card className="bg-gradient-to-r from-gray-500/10 to-slate-500/10 border-gray-500/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center">
              <Archive className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{complaints.length}</p>
              <p className="text-sm text-muted-foreground">Total pengaduan diarsipkan</p>
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && complaints.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Inbox className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">Arsip Kosong</h3>
              <p className="text-muted-foreground mt-1">
                Belum ada pengaduan yang diarsipkan
              </p>
            </CardContent>
          </Card>
        )}

        {/* Archived Complaint Cards */}
        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <Card key={complaint.id_pelaporan} className="opacity-80 hover:opacity-100 transition-opacity">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      Pengaduan #{complaint.id_pelaporan}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(complaint.created_at)}
                      </span>
                      {complaint.kategori && (
                        <Badge variant="outline">
                          {complaint.kategori.ket_kategori}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                    Diarsipkan
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Pelapor */}
                {complaint.siswa && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Pelapor:</span>
                    <span>{complaint.siswa.nama} ({complaint.siswa.kelas})</span>
                  </div>
                )}

                {/* Lokasi */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{complaint.lokasi}</span>
                </div>

                {/* Keterangan */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Keterangan</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{complaint.keterangan}</p>
                </div>

                {/* Foto */}
                {complaint.foto_dokumentasi && (
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={complaint.foto_dokumentasi}
                      alt="Dokumentasi"
                      className="w-full max-h-48 object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminArsip;
