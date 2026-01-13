import { Layout } from "@/components/Layout";
import { ComplaintCard } from "@/components/ComplaintCard";
import { ComplaintStatus } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle, FileX } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const myComplaints = [
  {
    id: "1",
    title: "AC Ruang Kelas XI IPA 1 Rusak",
    description: "AC di ruang kelas tidak berfungsi sejak seminggu yang lalu, membuat suasana belajar tidak nyaman.",
    category: "Ruang Kelas",
    location: "Gedung A Lantai 2",
    status: "in_progress" as ComplaintStatus,
    date: "13 Jan 2026",
  },
  {
    id: "2",
    title: "Meja Belajar Goyang",
    description: "Beberapa meja di kelas goyang karena kakinya tidak rata, mengganggu saat menulis.",
    category: "Ruang Kelas",
    location: "Gedung A Lantai 2",
    status: "completed" as ComplaintStatus,
    date: "5 Jan 2026",
  },
  {
    id: "3",
    title: "Lampu Kelas Berkedip",
    description: "Lampu di bagian depan kelas sering berkedip dan mengganggu konsentrasi belajar.",
    category: "Ruang Kelas",
    location: "Gedung A Lantai 2",
    status: "pending" as ComplaintStatus,
    date: "2 Jan 2026",
  },
  {
    id: "4",
    title: "Proyektor Blur",
    description: "Proyektor di kelas sudah tidak jernih lagi, gambar tampak buram.",
    category: "Ruang Kelas",
    location: "Gedung A Lantai 2",
    status: "rejected" as ComplaintStatus,
    date: "28 Des 2025",
  },
];

export default function StudentComplaints() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const filteredComplaints = myComplaints.filter((complaint) => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeTab === "all" || complaint.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: myComplaints.length,
    pending: myComplaints.filter((c) => c.status === "pending").length,
    in_progress: myComplaints.filter((c) => c.status === "in_progress").length,
    completed: myComplaints.filter((c) => c.status === "completed").length,
    rejected: myComplaints.filter((c) => c.status === "rejected").length,
  };

  return (
    <Layout role="student">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pengaduan Saya</h1>
            <p className="text-muted-foreground mt-1">Pantau status pengaduan yang sudah kamu buat</p>
          </div>
          <Button className="btn-primary-gradient gap-2" onClick={() => navigate("/student/new")}>
            <PlusCircle className="w-4 h-4" />
            Buat Pengaduan
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari pengaduan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
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
                <FileX className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Belum ada pengaduan</h3>
                <p className="text-muted-foreground mb-6">
                  {activeTab === "all"
                    ? "Kamu belum membuat pengaduan apapun."
                    : "Tidak ada pengaduan dengan status ini."}
                </p>
                <Button className="btn-primary-gradient gap-2" onClick={() => navigate("/student/new")}>
                  <PlusCircle className="w-4 h-4" />
                  Buat Pengaduan Pertama
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComplaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    {...complaint}
                    onClick={() => navigate(`/student/complaints/${complaint.id}`)}
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
