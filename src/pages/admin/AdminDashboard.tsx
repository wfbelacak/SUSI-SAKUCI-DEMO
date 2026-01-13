import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Clock, CheckCircle2, XCircle, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { name: "Jan", total: 12 },
  { name: "Feb", total: 18 },
  { name: "Mar", total: 24 },
  { name: "Apr", total: 15 },
  { name: "Mei", total: 28 },
  { name: "Jun", total: 32 },
];

const categoryData = [
  { name: "Ruang Kelas", value: 35, color: "hsl(199, 89%, 48%)" },
  { name: "Toilet", value: 25, color: "hsl(173, 80%, 40%)" },
  { name: "Lab Komputer", value: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Perpustakaan", value: 15, color: "hsl(152, 69%, 40%)" },
  { name: "Lainnya", value: 5, color: "hsl(215, 20%, 65%)" },
];

const recentComplaints = [
  {
    id: "1",
    title: "AC Ruang Kelas XI IPA 1 Rusak",
    description: "AC di ruang kelas tidak berfungsi sejak seminggu yang lalu, membuat suasana belajar tidak nyaman.",
    category: "Ruang Kelas",
    location: "Gedung A Lantai 2",
    status: "pending" as const,
    date: "13 Jan 2026",
    studentName: "Ahmad Fauzi",
  },
  {
    id: "2",
    title: "Keran Air Toilet Bocor",
    description: "Keran air di toilet putra lantai 1 mengalami kebocoran yang cukup parah.",
    category: "Toilet",
    location: "Toilet Putra Lantai 1",
    status: "in_progress" as const,
    date: "12 Jan 2026",
    studentName: "Budi Santoso",
  },
  {
    id: "3",
    title: "Komputer Lab 5 Error",
    description: "5 unit komputer di lab komputer tidak bisa menyala, mengganggu praktikum.",
    category: "Lab Komputer",
    location: "Lab Komputer 2",
    status: "completed" as const,
    date: "11 Jan 2026",
    studentName: "Siti Rahayu",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Layout role="admin">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Admin</h1>
            <p className="text-muted-foreground mt-1">Pantau dan kelola pengaduan sarana sekolah</p>
          </div>
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Pengaduan"
            value={127}
            description="Januari 2026"
            icon={FileText}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Menunggu Proses"
            value={23}
            description="Perlu ditindaklanjuti"
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Sedang Diproses"
            value={18}
            description="Dalam pengerjaan"
            icon={TrendingUp}
            variant="info"
          />
          <StatCard
            title="Selesai"
            value={86}
            description="Bulan ini"
            icon={CheckCircle2}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Tren Pengaduan Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="total" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pengaduan per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {categoryData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Complaints */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pengaduan Terbaru</CardTitle>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
              onClick={() => navigate("/admin/complaints")}
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  {...complaint}
                  onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
