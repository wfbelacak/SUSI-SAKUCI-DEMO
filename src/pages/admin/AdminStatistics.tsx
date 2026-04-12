import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Clock, CheckCircle2, TrendingUp, Users, Loader2, BarChart3, Calendar, PieChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend } from "recharts";
import api from "@/lib/api";

interface TrendDataItem {
  name: string;
  pengaduan: number;
  selesai: number;
}

interface CategoryDataItem {
  name: string;
  value: number;
  color: string;
}

interface StatusDataItem {
  name: string;
  value: number;
  color: string;
}

interface SummaryData {
  total_pengaduan: number;
  total_siswa: number;
  siswa_aktif_pelapor: number;
  tingkat_selesai: number;
  kategori_terbanyak: string;
  rata_rata_per_hari: number | null;
}

export default function AdminStatistics() {
  const [period, setPeriod] = useState<string>("month");
  const [trendData, setTrendData] = useState<TrendDataItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataItem[]>([]);
  const [statusData, setStatusData] = useState<StatusDataItem[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch statistics based on period — all data comes from optimized backend endpoints
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [trendRes, categoryRes, statusRes, summaryRes] = await Promise.all([
          api.get(`/statistik/trend?period=${period}`),
          api.get(`/statistik/category?period=${period}`),
          api.get(`/statistik/status?period=${period}`),
          api.get(`/statistik/summary?period=${period}`),
        ]);
        
        setTrendData(trendRes.data.data || []);
        setCategoryData(categoryRes.data.data || []);
        setStatusData(statusRes.data.data || []);
        setSummary(summaryRes.data.data || null);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        // Simple fallback — show empty state instead of downloading all data
        setStatusData([
          { name: 'Menunggu', value: 0, color: '#f59e0b' },
          { name: 'Proses', value: 0, color: '#3b82f6' },
          { name: 'Selesai', value: 0, color: '#10b981' },
        ]);
        setCategoryData([]);
        setSummary({
          total_pengaduan: 0,
          total_siswa: 0,
          siswa_aktif_pelapor: 0,
          tingkat_selesai: 0,
          kategori_terbanyak: '-',
          rata_rata_per_hari: null,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [period]);

  const periodLabel = {
    week: "Minggu Ini",
    month: "Bulan Ini",
    year: "Tahun Ini",
    all: "Semua Waktu",
  }[period] || period;

  return (
    <Layout role="admin">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Statistik</h1>
            <p className="text-muted-foreground mt-1">Analisis dan laporan pengaduan berdasarkan data nyata</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Minggu Ini</SelectItem>
                <SelectItem value="month">Bulan Ini</SelectItem>
                <SelectItem value="year">Tahun Ini</SelectItem>
                <SelectItem value="all">Semua Waktu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? '-' : summary?.total_pengaduan || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Pengaduan</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-500/10">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? '-' : statusData.find(s => s.name === 'Menunggu')?.value || 0}</p>
                  <p className="text-sm text-muted-foreground">Menunggu</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? '-' : summary?.tingkat_selesai || 0}%</p>
                  <p className="text-sm text-muted-foreground">Tingkat Selesai</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? '-' : summary?.siswa_aktif_pelapor || 0}</p>
                  <p className="text-sm text-muted-foreground">Pelapor Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tren Pengaduan {periodLabel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {loading ? (
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
                    <AreaChart data={trendData}>
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
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="pengaduan" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3} 
                        name="Pengaduan"
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="selesai" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.3} 
                        name="Selesai"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Distribusi Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : statusData.every(s => s.value === 0) ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Belum ada data
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Pengaduan per Kategori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : categoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Belum ada data
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="name" type="category" className="text-xs" width={120} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[0, 4, 4, 0]}
                        name="Jumlah"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan {periodLabel}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Total Siswa Terdaftar</span>
                <span className="font-bold text-lg">{loading ? '-' : summary?.total_siswa || 0}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Siswa Aktif Pelapor</span>
                <span className="font-bold text-lg">{loading ? '-' : summary?.siswa_aktif_pelapor || 0}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Tingkat Penyelesaian</span>
                <span className="font-bold text-lg text-green-600">{loading ? '-' : summary?.tingkat_selesai || 0}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Kategori Terbanyak</span>
                <span className="font-bold text-lg">{loading ? '-' : summary?.kategori_terbanyak || '-'}</span>
              </div>
              {summary?.rata_rata_per_hari !== null && (
                <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <span className="text-muted-foreground">Rata-rata per Hari</span>
                  <span className="font-bold text-lg text-primary">{summary?.rata_rata_per_hari}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
