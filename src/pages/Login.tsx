import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, ShieldCheck, GraduationCap, Eye, EyeOff, MessageCircle, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useLoginSiswa, useLoginAdmin } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { saranPublikService } from "@/services/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [siswaForm, setSiswaForm] = useState({ nis: "", password: "" });
  const [adminForm, setAdminForm] = useState({ username: "", password: "" });
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactForm, setContactForm] = useState({ nama: "", nis_or_info: "", pesan: "" });
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, role, loginSiswa, loginAdmin } = useAuth();

  const loginSiswaMutation = useLoginSiswa();
  const loginAdminMutation = useLoginAdmin();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'siswa') {
        navigate('/student');
      } else if (role === 'admin') {
        navigate('/admin');
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await loginAdminMutation.mutateAsync({
        username: parseInt(adminForm.username),
        password: adminForm.password,
      });
      
      if (result.success) {
        loginAdmin(result.data);
        toast.success("Login berhasil!", {
          description: `Selamat datang, ${result.data.nama_admin}`,
        });
        navigate("/admin");
      }
    } catch (error: any) {
      toast.error("Login gagal", {
        description: error.response?.data?.message || "Username atau password salah",
      });
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await loginSiswaMutation.mutateAsync({
        nis: parseInt(siswaForm.nis),
        password: siswaForm.password,
      });
      
      if (result.success) {
        loginSiswa(result.data);
        toast.success("Login berhasil!", {
          description: `Selamat datang, ${result.data.nama}`,
        });
        navigate("/student");
      }
    } catch (error: any) {
      toast.error("Login gagal", {
        description: error.response?.data?.message || "NIS atau password salah",
      });
    }
  };

  const handleContactSubmit = async () => {
    if (!contactForm.nama.trim() || !contactForm.pesan.trim()) {
      toast.error("Nama dan pesan wajib diisi");
      return;
    }

    setContactSending(true);
    try {
      await saranPublikService.create({
        nama_pengirim: contactForm.nama,
        kategori_pengirim: 'Lainnya',
        isi_saran: `[HUBUNGI ADMIN] NIS/Info: ${contactForm.nis_or_info || '-'}\n\n${contactForm.pesan}`,
      });
      setContactSent(true);
      toast.success("Pesan berhasil dikirim!", {
        description: "Admin akan segera menghubungi Anda.",
      });
    } catch (error: any) {
      toast.error("Gagal mengirim pesan", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setContactSending(false);
    }
  };

  const resetContactForm = () => {
    setContactForm({ nama: "", nis_or_info: "", pesan: "" });
    setContactSent(false);
    setShowContactDialog(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Simplified with 3D rectangles */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden items-center justify-center">
        {/* 3D Stacked Rectangles Background */}
        <div className="absolute inset-0">
          {/* Rectangle 1 - Largest, back */}
          <div 
            className="absolute w-[400px] h-[250px] rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
            style={{ 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%) rotate(-12deg) translateZ(0)',
            }}
          />
          {/* Rectangle 2 - Medium */}
          <div 
            className="absolute w-[350px] h-[220px] rounded-3xl bg-white/8 border border-white/15 backdrop-blur-sm"
            style={{ 
              top: '48%', 
              left: '52%', 
              transform: 'translate(-50%, -50%) rotate(-6deg) translateZ(10px)',
            }}
          />
          {/* Rectangle 3 - Smaller */}
          <div 
            className="absolute w-[300px] h-[190px] rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm"
            style={{ 
              top: '46%', 
              left: '54%', 
              transform: 'translate(-50%, -50%) rotate(0deg) translateZ(20px)',
            }}
          />
          {/* Rectangle 4 - Smallest, front */}
          <div 
            className="absolute w-[250px] h-[160px] rounded-3xl bg-white/12 border border-white/25 backdrop-blur-md shadow-2xl"
            style={{ 
              top: '44%', 
              left: '56%', 
              transform: 'translate(-50%, -50%) rotate(6deg) translateZ(30px)',
            }}
          />
          
          {/* Decorative floating elements */}
          <div className="absolute top-[20%] left-[15%] w-20 h-20 rounded-2xl bg-white/5 border border-white/10 rotate-12" />
          <div className="absolute bottom-[25%] right-[20%] w-16 h-16 rounded-xl bg-white/5 border border-white/10 -rotate-12" />
          <div className="absolute top-[60%] left-[10%] w-12 h-12 rounded-lg bg-white/5 border border-white/10 rotate-45" />
          <div className="absolute top-[15%] right-[25%] w-14 h-14 rounded-xl bg-white/5 border border-white/10 -rotate-6" />
        </div>
        
        {/* Logo Centered */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl mb-6 overflow-hidden">
            <img src="/assets/logo.png" alt="SUSI SAKUCI" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SUSI SAKUCI</h1>
          <p className="text-white/70 text-lg">Suara Siswa Sangkuriang 1 Cimahi</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img src="/assets/logo.png" alt="SUSI SAKUCI" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SUSI SAKUCI</h1>
              <p className="text-xs text-muted-foreground">Suara Siswa</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Masuk ke Akun</h2>
            <p className="text-muted-foreground">Pilih role dan masukkan kredensial Anda</p>
          </div>

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Siswa
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <Card className="border-border/50 shadow-soft">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">Login Siswa</CardTitle>
                  <CardDescription>
                    Gunakan NIS dan password untuk masuk
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStudentLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nis">NIS</Label>
                      <Input
                        id="nis"
                        type="number"
                        placeholder="Masukkan NIS"
                        value={siswaForm.nis}
                        onChange={(e) => setSiswaForm({ ...siswaForm, nis: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="student-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan password"
                          value={siswaForm.password}
                          onChange={(e) => setSiswaForm({ ...siswaForm, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full btn-primary-gradient"
                      disabled={loginSiswaMutation.isPending}
                    >
                      {loginSiswaMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Memproses...
                        </>
                      ) : (
                        "Masuk sebagai Siswa"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card className="border-border/50 shadow-soft">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">Login Admin</CardTitle>
                  <CardDescription>
                    Masuk dengan akun administrator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username">Username</Label>
                      <Input
                        id="admin-username"
                        type="number"
                        placeholder="Masukkan username (angka)"
                        value={adminForm.username}
                        onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="admin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan password"
                          value={adminForm.password}
                          onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full btn-primary-gradient"
                      disabled={loginAdminMutation.isPending}
                    >
                      {loginAdminMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Memproses...
                        </>
                      ) : (
                        "Masuk sebagai Admin"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Lupa password?{" "}
            <Dialog open={showContactDialog} onOpenChange={(open) => { setShowContactDialog(open); if (!open) resetContactForm(); }}>
              <DialogTrigger asChild>
                <button className="text-primary hover:underline font-medium">
                  Hubungi Admin
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] sm:max-w-md p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Hubungi Admin
                  </DialogTitle>
                  <DialogDescription>
                    Kirim pesan ke admin untuk reset password atau bantuan lainnya.
                  </DialogDescription>
                </DialogHeader>

                {contactSent ? (
                  <div className="flex flex-col items-center text-center py-6 gap-3">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Pesan Terkirim!</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Admin akan melihat pesan Anda. Silakan tunggu hingga admin menghubungi Anda kembali.
                    </p>
                    <Button variant="outline" onClick={resetContactForm} className="mt-2">
                      Tutup
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="contact-nama">Nama Lengkap *</Label>
                      <Input
                        id="contact-nama"
                        placeholder="Masukkan nama Anda"
                        value={contactForm.nama}
                        onChange={(e) => setContactForm(prev => ({ ...prev, nama: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-nis">NIS / Kelas (opsional)</Label>
                      <Input
                        id="contact-nis"
                        placeholder="Contoh: 12345 / XII RPL 1"
                        value={contactForm.nis_or_info}
                        onChange={(e) => setContactForm(prev => ({ ...prev, nis_or_info: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-pesan">Pesan *</Label>
                      <Textarea
                        id="contact-pesan"
                        placeholder="Jelaskan keperluan Anda, misalnya: lupa password, tidak bisa login, dll."
                        value={contactForm.pesan}
                        onChange={(e) => setContactForm(prev => ({ ...prev, pesan: e.target.value }))}
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button
                      onClick={handleContactSubmit}
                      disabled={contactSending || !contactForm.nama.trim() || !contactForm.pesan.trim()}
                      className="w-full btn-primary-gradient gap-2"
                    >
                      {contactSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Kirim Pesan
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Pesan akan dikirim ke admin sistem SUSI SAKUCI
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </p>
        </div>
      </div>
    </div>
  );
}
