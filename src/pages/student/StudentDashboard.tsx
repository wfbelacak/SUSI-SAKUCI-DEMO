import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle2, PlusCircle, ArrowRight, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const myComplaints = [
  {
    id: "1",
    title: "AC Ruang Kelas XI IPA 1 Rusak",
    description: "AC di ruang kelas tidak berfungsi sejak seminggu yang lalu, membuat suasana belajar tidak nyaman.",
    category: "Ruang Kelas",
    location: "Gedung A Lantai 2",
    status: "in_progress" as const,
    date: "13 Jan 2026",
  },
  {
    id: "2",
    title: "Meja Belajar Goyang",
    description: "Beberapa meja di kelas goyang karena kakinya tidak rata.",
    category: "Ruang Kelas",
    location: "Gedung A Lantai 2",
    status: "completed" as const,
    date: "5 Jan 2026",
  },
  {
    id: "3",
    title: "Lampu Kelas Berkedip",
    description: "Lampu di bagian depan kelas sering berkedip dan mengganggu konsentrasi.",
    category: "Ruang Kelas",
    location: "Gedung A Lantai 2",
    status: "pending" as const,
    date: "2 Jan 2026",
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <Layout role="student">
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
                  Hai, Ahmad! Ada Keluhan?
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
            value={3}
            description="Pengaduan yang kamu buat"
            icon={FileText}
            variant="primary"
          />
          <StatCard
            title="Sedang Diproses"
            value={1}
            description="Dalam penanganan"
            icon={Clock}
            variant="info"
          />
          <StatCard
            title="Selesai"
            value={1}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  {...complaint}
                  onClick={() => navigate(`/student/complaints/${complaint.id}`)}
                />
              ))}
            </div>
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
    </Layout>
  );
}
