import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Clock, CheckCircle2, TrendingUp, ArrowRight, Loader2, Calendar, MessageCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useRecentComplaints } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { saranPublikService } from "@/services/api";
import api from "@/lib/api";
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

interface TrendDataItem {
  name: string;
  date: string;
  pengaduan: number;
  selesai: number;
}

interface CategoryDataItem {
  name: string;
  value: number;
  color: string;
}

interface DashboardStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  completion_rate: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [period, setPeriod] = useState<string>("month");
  const [trendData, setTrendData] = useState<TrendDataItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  
  // Fetch only 3 recent complaints (lightweight)
  const { data: recentData, isLoading } = useRecentComplaints(3);
  const recentComplaints = recentData?.data || [];

  // Fetch statistics based on period — only re-run when period changes
  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const [dashboardRes, trendRes, categoryRes] = await Promise.all([
          api.get(`/statistik/dashboard?period=${period}`),
          api.get(`/statistik/trend?period=${period}`),
          api.get(`/statistik/category?period=${period}`),
        ]);
        
        setStats(dashboardRes.data.data);
        setTrendData(trendRes.data.data || []);
        setCategoryData(categoryRes.data.data || []);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        // Simple fallback — show zeros instead of downloading all data
        setStats({ total: 0, pending: 0, in_progress: 0, completed: 0, completion_rate: 0 });
        setTrendData([]);
        setCategoryData([]);
      } finally {
        setLoadingStats(false);
      }
    };
    
    fetchStats();
  }, [period]);

  // Fetch contact messages for Admin only
  useEffect(() => {
    if (admin?.posisi !== 'Admin') {
      setLoadingMessages(false);
      return;
    }
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await saranPublikService.getAll();
        // Filter only [HUBUNGI ADMIN] messages, take latest 5
        const contactMsgs = (res.data || [])
          .filter((m: any) => m.isi_saran?.includes('[HUBUNGI ADMIN]'))
          .slice(0, 5);
        setContactMessages(contactMsgs);
      } catch {
        setContactMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [admin]);

  const periodLabel = {
    week: "Minggu Ini",
    month: "Bulan Ini",
    year: "Tahun Ini",
  }[period] || "Periode";

  return (
    <Layout role="admin">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Admin</h1>
            <p className="text-muted-foreground mt-1">Pantau dan kelola pengaduan sarana sekolah</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={period} onValueChange={setPeriod}>
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
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Pengaduan"
            value={loadingStats ? 0 : (stats?.total || 0)}
            description={periodLabel}
            icon={FileText}
            variant="primary"
          />
          <StatCard
            title="Menunggu Proses"
            value={loadingStats ? 0 : (stats?.pending || 0)}
            description="Perlu ditindaklanjuti"
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Sedang Diproses"
            value={loadingStats ? 0 : (stats?.in_progress || 0)}
            description="Dalam pengerjaan"
            icon={TrendingUp}
            variant="info"
          />
          <StatCard
            title="Selesai"
            value={loadingStats ? 0 : (stats?.completed || 0)}
            description={`${stats?.completion_rate || 0}% tingkat selesai`}
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Tren Pengaduan {periodLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {loadingStats ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : trendData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Belum ada data untuk periode ini</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <defs>
                        <linearGradient id="colorPengaduan" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSelesai" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          padding: "12px 16px",
                        }}
                        labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: 13 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pengaduan" 
                        stroke="#6366f1" 
                        name="Pengaduan"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="selesai" 
                        stroke="#10b981" 
                        name="Selesai"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pengaduan per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                {loadingStats ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : categoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Belum ada data
                  </div>
                ) : (
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
                )}
              </div>
              <div className="space-y-2 mt-4">
                {categoryData.slice(0, 5).map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground truncate max-w-[100px]">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : recentComplaints.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada pengaduan masuk</p>
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
                    date={complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    studentName={complaint.siswa?.nama || 'Siswa'}
                    onClick={() => navigate(`/admin/complaints/${complaint.id_pelaporan}`)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Admin Messages — visible only to Admin */}
        {admin?.posisi === 'Admin' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Pesan Hubungi Admin
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {contactMessages.length} pesan
              </Badge>
            </CardHeader>
            <CardContent>
              {loadingMessages ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : contactMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada pesan dari siswa</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contactMessages.map((msg: any) => {
                    // Parse the message — format: "[HUBUNGI ADMIN] NIS/Info: xxx\n\npesan"
                    const msgBody = msg.isi_saran?.replace('[HUBUNGI ADMIN] ', '') || '';
                    const [infoLine, ...pesanParts] = msgBody.split('\n\n');
                    const pesan = pesanParts.join('\n\n') || infoLine;
                    
                    return (
                      <div 
                        key={msg.id_saran || msg.id} 
                        className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="font-medium text-sm truncate">{msg.nama_pengirim}</span>
                            </div>
                            {infoLine && infoLine !== pesan && (
                              <p className="text-xs text-muted-foreground mb-1">{infoLine}</p>
                            )}
                            <p className="text-sm text-foreground line-clamp-2">{pesan}</p>
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
