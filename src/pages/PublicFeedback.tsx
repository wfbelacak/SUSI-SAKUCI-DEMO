import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, Send, Loader2, CheckCircle2, MessageSquare, 
  User, Mail, Phone, ArrowLeft, Heart
} from "lucide-react";
import { toast } from "sonner";
import { useKategoriList } from "@/hooks/useApi";
import api from "@/lib/api";

type KategoriPengirim = "Alumni" | "Orang Tua" | "Masyarakat Umum" | "Lainnya";

interface FormData {
  nama_pengirim: string;
  email: string;
  no_telepon: string;
  kategori_pengirim: KategoriPengirim | "";
  id_kategori: string;
  isi_saran: string;
}

export default function PublicFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nama_pengirim: "",
    email: "",
    no_telepon: "",
    kategori_pengirim: "",
    id_kategori: "",
    isi_saran: "",
  });

  const { data: kategoriData } = useKategoriList();
  const categories = kategoriData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama_pengirim.trim()) {
      toast.error("Nama wajib diisi");
      return;
    }
    if (!formData.kategori_pengirim) {
      toast.error("Pilih kategori pengirim");
      return;
    }
    if (!formData.isi_saran.trim() || formData.isi_saran.length < 10) {
      toast.error("Isi saran/kritik minimal 10 karakter");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        nama_pengirim: formData.nama_pengirim,
        email: formData.email || null,
        no_telepon: formData.no_telepon || null,
        kategori_pengirim: formData.kategori_pengirim,
        id_kategori: formData.id_kategori ? parseInt(formData.id_kategori) : null,
        isi_saran: formData.isi_saran,
      };

      await api.post('/saran-publik', payload);
      setIsSuccess(true);
      toast.success("Terima kasih!", {
        description: "Saran/kritik Anda telah berhasil dikirim.",
      });
    } catch (error: any) {
      const message = error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.";
      toast.error("Gagal mengirim", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nama_pengirim: "",
      email: "",
      no_telepon: "",
      kategori_pengirim: "",
      id_kategori: "",
      isi_saran: "",
    });
    setIsSuccess(false);
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full animate-scale-in">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Terima Kasih!</h2>
              <p className="text-muted-foreground">
                Saran/kritik Anda telah berhasil dikirim. Kami sangat menghargai masukan Anda 
                untuk kemajuan SMK Sangkuriang 1 Cimahi.
              </p>
              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={handleReset} className="btn-primary-gradient">
                  Kirim Saran Lagi
                </Button>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10">
              <img src="/assets/logo.png" alt="SUSI SAKUCI" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-sm md:text-base">SUSI SAKUCI</h1>
              <p className="text-xs text-muted-foreground">Suara Siswa</p>
            </div>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Kirim Saran & Kritik
                </CardTitle>
                <CardDescription>
                  Berikan masukan Anda untuk kemajuan SMK Sangkuriang 1 Cimahi. 
                  Form ini terbuka untuk alumni, orang tua siswa, dan masyarakat umum.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="nama" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Nama Lengkap *
                    </Label>
                    <Input
                      id="nama"
                      placeholder="Masukkan nama Anda"
                      value={formData.nama_pengirim}
                      onChange={(e) => setFormData({ ...formData, nama_pengirim: e.target.value })}
                      required
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        Email (opsional)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@contoh.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        No. Telepon (opsional)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        value={formData.no_telepon}
                        onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Kategori Pengirim */}
                  <div className="space-y-2">
                    <Label>Anda adalah *</Label>
                    <Select 
                      value={formData.kategori_pengirim} 
                      onValueChange={(value: KategoriPengirim) => setFormData({ ...formData, kategori_pengirim: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alumni">Alumni SMK Sangkuriang 1</SelectItem>
                        <SelectItem value="Orang Tua">Orang Tua/Wali Siswa</SelectItem>
                        <SelectItem value="Masyarakat Umum">Masyarakat Umum</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Kategori Saran */}
                  <div className="space-y-2">
                    <Label>Kategori Saran (opsional)</Label>
                    <Select 
                      value={formData.id_kategori} 
                      onValueChange={(value) => setFormData({ ...formData, id_kategori: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori saran" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id_kategori} value={String(cat.id_kategori)}>
                            {cat.ket_kategori}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Isi Saran */}
                  <div className="space-y-2">
                    <Label htmlFor="isi_saran">Isi Saran/Kritik *</Label>
                    <Textarea
                      id="isi_saran"
                      placeholder="Tuliskan saran atau kritik Anda secara jelas dan konstruktif..."
                      value={formData.isi_saran}
                      onChange={(e) => setFormData({ ...formData, isi_saran: e.target.value })}
                      className="min-h-[150px]"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.isi_saran.length}/2000 karakter (minimal 10)
                    </p>
                  </div>

                  {/* Submit */}
                  <Button 
                    type="submit" 
                    className="w-full btn-primary-gradient"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Saran
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6 animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tentang SUSI SAKUCI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">SUSI SAKUCI</strong> (Suara Siswa Sangkuriang 1 Cimahi) 
                  adalah platform pengaduan dan saran untuk meningkatkan kualitas layanan pendidikan 
                  di SMK Sangkuriang 1 Cimahi.
                </p>
                <p>
                  Melalui halaman ini, alumni, orang tua siswa, dan masyarakat umum dapat menyampaikan 
                  saran atau kritik konstruktif untuk kemajuan sekolah.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  Tips Memberikan Saran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    Jelaskan dengan spesifik dan jelas
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    Berikan solusi jika memungkinkan
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    Gunakan bahasa yang sopan dan konstruktif
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    Hindari informasi yang bersifat sensitif
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm text-center text-muted-foreground">
                  Siswa aktif? <Link to="/" className="text-primary font-medium hover:underline">Login di sini</Link> untuk mengakses fitur lengkap.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Muhammad Wafa Abdurrohman 12 RPL 3.SUSI SAKUCI All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
}
