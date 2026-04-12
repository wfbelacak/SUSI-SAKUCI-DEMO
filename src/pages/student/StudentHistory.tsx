import { useState } from "react";
import { StudentLayout } from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, History, Loader2, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useInputAspirasiBySiswa } from "@/hooks/useApi";

export default function StudentHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { siswa } = useAuth();

  const { data: complaintsData, isLoading } = useInputAspirasiBySiswa(siswa?.nis || 0);
  
  const allComplaints = complaintsData?.data || [];

  // Filter by search
  const filteredComplaints = allComplaints.filter(complaint => 
    complaint.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'Selesai':
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" />Selesai</Badge>;
      case 'Proses':
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"><Clock className="w-3 h-3 mr-1" />Proses</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"><Clock className="w-3 h-3 mr-1" />Menunggu</Badge>;
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Histori Pengaduan</h1>
          <p className="text-muted-foreground mt-1">Riwayat semua pengaduan yang pernah kamu buat</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari pengaduan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* History List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Riwayat ({filteredComplaints.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada riwayat pengaduan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <div
                    key={complaint.id_pelaporan}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/student/complaints/${complaint.id_pelaporan}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">#{complaint.id_pelaporan}</span>
                        {getStatusBadge(complaint.aspirasi?.[0]?.status)}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {complaint.keterangan}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{complaint.kategori?.ket_kategori || 'Umum'}</span>
                        <span>•</span>
                        <span>{complaint.lokasi}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
