import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Calendar, SlidersHorizontal, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInputAspirasiList, useKategoriList } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
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

export default function AdminComplaints() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { admin } = useAuth();

  // Pelaksana only sees approved complaints; Admin sees all
  const isPelaksana = admin?.posisi === 'Pelaksana';
  const statusReviewFilter = isPelaksana ? 'diterima' : undefined;

  // Fetch data from API
  const { data: complaintsData, isLoading } = useInputAspirasiList(statusReviewFilter);
  const { data: kategoriData } = useKategoriList();
  
  const allComplaints = complaintsData?.data || [];
  const categories = kategoriData?.data || [];

  // Filter and sort complaints (newest first)
  const filteredComplaints = allComplaints
    .filter((complaint) => {
      const matchesSearch =
        complaint.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (complaint.siswa?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      const matchesCategory = selectedCategory === "all" || String(complaint.id_kategori) === selectedCategory;
      
      const complaintStatus = mapStatus(complaint.aspirasi?.[0]?.status);
      const matchesStatus = activeTab === "all" || complaintStatus === activeTab;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => b.id_pelaporan - a.id_pelaporan); // Sort by newest first

  // Calculate status counts
  const statusCounts = {
    all: allComplaints.length,
    pending: allComplaints.filter(c => mapStatus(c.aspirasi?.[0]?.status) === 'pending').length,
    in_progress: allComplaints.filter(c => mapStatus(c.aspirasi?.[0]?.status) === 'in_progress').length,
    completed: allComplaints.filter(c => mapStatus(c.aspirasi?.[0]?.status) === 'completed').length,
    rejected: 0,
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
              placeholder="Cari keterangan, lokasi, atau nama siswa..."
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
                {categories.map((cat) => (
                  <SelectItem key={cat.id_kategori} value={String(cat.id_kategori)}>
                    {cat.ket_kategori}
                  </SelectItem>
                ))}
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
          <TabsList className="grid grid-cols-4 w-full md:w-auto md:inline-flex">
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
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredComplaints.length === 0 ? (
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
                    key={complaint.id_pelaporan}
                    id={String(complaint.id_pelaporan)}
                    title={complaint.keterangan.substring(0, 50) + (complaint.keterangan.length > 50 ? '...' : '')}
                    description={complaint.keterangan}
                    category={complaint.kategori?.ket_kategori || 'Umum'}
                    location={complaint.lokasi}
                    status={mapStatus(complaint.aspirasi?.[0]?.status)}
                    date={new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    studentName={complaint.siswa?.nama || 'Siswa'}
                    onClick={() => navigate(`/admin/complaints/${complaint.id_pelaporan}`)}
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
