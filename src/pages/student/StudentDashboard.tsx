import { StudentLayout } from "@/components/StudentLayout";
import { StatCard } from "@/components/StatCard";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle2, PlusCircle, ArrowRight, Megaphone, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useInputAspirasiBySiswa } from "@/hooks/useApi";
import type { ComplaintStatus } from "@/components/StatusBadge";

// Map database status to UI status
const mapStatus = (status: string | undefined): ComplaintStatus => {
  switch (status) {
    case 'Menunggu': return 'pending';
    case 'Proses': return 'in_progress';
    case 'Selesai': return 'completed';
    default: return 'pending';
  }
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { siswa } = useAuth();
  
  // Fetch complaints for logged-in student
  const { data: complaintsData, isLoading } = useInputAspirasiBySiswa(siswa?.nis || 0);
  
  const complaints = complaintsData?.data || [];
  
  // Calculate stats
  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(c => 
    !c.aspirasi || c.aspirasi.length === 0 || c.aspirasi.some(a => a.status === 'Menunggu')
  ).length;
  const inProgressCount = complaints.filter(c => 
    c.aspirasi?.some(a => a.status === 'Proses')
  ).length;
  const completedCount = complaints.filter(c => 
    c.aspirasi?.some(a => a.status === 'Selesai')
  ).length;
  
  // Get recent 3 complaints
  const recentComplaints = complaints.slice(0, 3);

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Banner */}
        <Card className="hero-gradient text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardContent className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone className="w-6 h-6" />
                  <span className="text-sm font-medium opacity-80">Portal Aspirasi Siswa</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Hai, {siswa?.nama?.split(' ')[0] || 'Siswa'}! Ada Keluhan?
                </h1>
                <p className="opacity-80 max-w-md">
                  Sampaikan aspirasimu tentang sarana dan prasarana sekolah. Kami siap mendengar dan menindaklanjuti!
                </p>
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 shadow-lg gap-2"
                onClick={() => navigate("/student/new")}
              >
                <PlusCircle className="w-5 h-5" />
                Buat Pengaduan Baru
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Pengaduan"
            value={totalComplaints}
            description="Pengaduan yang kamu buat"
            icon={FileText}
            variant="primary"
          />
          <StatCard
            title="Sedang Diproses"
            value={inProgressCount + pendingCount}
            description="Dalam penanganan"
            icon={Clock}
            variant="info"
          />
          <StatCard
            title="Selesai"
            value={completedCount}
            description="Sudah ditangani"
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* Recent Complaints */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pengaduan Terakhir</CardTitle>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
              onClick={() => navigate("/student/complaints")}
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : recentComplaints.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada pengaduan</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => navigate("/student/new")}
                >
                  Buat pengaduan pertamamu
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentComplaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id_pelaporan}
                    id={String(complaint.id_pelaporan)}
                    title={complaint.keterangan.substring(0, 50) + (complaint.keterangan.length > 50 ? '...' : '')}
                    description={complaint.keterangan}
                    category={complaint.kategori?.ket_kategori || 'Umum'}
                    location={complaint.lokasi}
                    status={mapStatus(complaint.aspirasi?.[0]?.status)}
                    date={new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    onClick={() => navigate(`/student/complaints/${complaint.id_pelaporan}`)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="bg-muted/50 border-muted">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3">💡 Tips Membuat Pengaduan Efektif</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Jelaskan lokasi kerusakan dengan detail (gedung, lantai, ruangan)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Sertakan foto jika memungkinkan untuk memperjelas kondisi
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Pilih kategori yang sesuai agar pengaduan cepat ditangani
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
