import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ComplaintCard } from "@/components/ComplaintCard";
import { StatusBadge, ComplaintStatus } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Calendar, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const allComplaints = [
  {
    id: "1",
    title: "AC Ruang Kelas XI IPA 1 Rusak",
    description: "AC di ruang kelas tidak berfungsi sejak seminggu yang lalu, membuat suasana belajar tidak nyaman karena cuaca panas.",
    category: "Ruang Kelas",
    location: "Gedung A Lantai 2",
    status: "pending" as ComplaintStatus,
    date: "13 Jan 2026",
    studentName: "Ahmad Fauzi",
  },
  {
    id: "2",
    title: "Keran Air Toilet Bocor",
    description: "Keran air di toilet putra lantai 1 mengalami kebocoran yang cukup parah, air terus mengalir dan terbuang percuma.",
    category: "Toilet",
    location: "Toilet Putra Lantai 1",
    status: "in_progress" as ComplaintStatus,
    date: "12 Jan 2026",
    studentName: "Budi Santoso",
  },
  {
    id: "3",
    title: "Komputer Lab 5 Error",
    description: "5 unit komputer di lab komputer tidak bisa menyala, mengganggu praktikum siswa yang membutuhkan komputer.",
    category: "Lab Komputer",
    location: "Lab Komputer 2",
    status: "completed" as ComplaintStatus,
    date: "11 Jan 2026",
    studentName: "Siti Rahayu",
  },
  {
    id: "4",
    title: "Lampu Koridor Mati",
    description: "Beberapa lampu di koridor gedung B tidak menyala, membuat area menjadi gelap di malam hari.",
    category: "Fasilitas Umum",
    location: "Gedung B Lantai 1",
    status: "pending" as ComplaintStatus,
    date: "10 Jan 2026",
    studentName: "Dewi Lestari",
  },
  {
    id: "5",
    title: "Kursi Kelas Patah",
    description: "Ada 3 kursi di kelas XII IPS 2 yang patah kakinya dan berbahaya jika diduduki.",
    category: "Ruang Kelas",
    location: "Gedung C Lantai 3",
    status: "in_progress" as ComplaintStatus,
    date: "9 Jan 2026",
    studentName: "Rudi Hartono",
  },
  {
    id: "6",
    title: "Proyektor Rusak",
    description: "Proyektor di ruang multimedia tidak menampilkan gambar dengan jelas, sudah buram.",
    category: "Ruang Kelas",
    location: "Ruang Multimedia",
    status: "rejected" as ComplaintStatus,
    date: "8 Jan 2026",
    studentName: "Nina Safitri",
  },
];

export default function AdminComplaints() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const filteredComplaints = allComplaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || complaint.category === selectedCategory;
    const matchesStatus = activeTab === "all" || complaint.status === activeTab;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const statusCounts = {
    all: allComplaints.length,
    pending: allComplaints.filter((c) => c.status === "pending").length,
    in_progress: allComplaints.filter((c) => c.status === "in_progress").length,
    completed: allComplaints.filter((c) => c.status === "completed").length,
    rejected: allComplaints.filter((c) => c.status === "rejected").length,
  };

  return (
    <Layout role="admin">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Semua Pengaduan</h1>
          <p className="text-muted-foreground mt-1">Kelola dan tindaklanjuti pengaduan dari siswa</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul atau nama siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Ruang Kelas">Ruang Kelas</SelectItem>
                <SelectItem value="Toilet">Toilet</SelectItem>
                <SelectItem value="Lab Komputer">Lab Komputer</SelectItem>
                <SelectItem value="Fasilitas Umum">Fasilitas Umum</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Tanggal
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full md:w-auto md:inline-flex">
            <TabsTrigger value="all" className="text-xs md:text-sm">
              Semua ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs md:text-sm">
              Menunggu ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="text-xs md:text-sm">
              Diproses ({statusCounts.in_progress})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs md:text-sm">
              Selesai ({statusCounts.completed})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs md:text-sm">
              Ditolak ({statusCounts.rejected})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-12">
                <SlidersHorizontal className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Tidak ada pengaduan</h3>
                <p className="text-muted-foreground">
                  Tidak ditemukan pengaduan sesuai filter yang dipilih.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComplaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    {...complaint}
                    onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
