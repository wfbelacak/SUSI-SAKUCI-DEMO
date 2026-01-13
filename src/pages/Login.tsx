import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ShieldCheck, GraduationCap, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin");
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/student");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Aspirasi</h1>
              <p className="text-white/70">SMA Negeri 1 Bandung</p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Suarakan Aspirasimu,<br />
            <span className="text-primary">Wujudkan Perubahan</span>
          </h2>

          <p className="text-lg text-white/80 max-w-md mb-10">
            Portal pengaduan sarana dan prasarana sekolah. Laporkan kendala yang kamu temui untuk sekolah yang lebih baik.
          </p>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-3xl font-bold text-white mb-1">500+</p>
              <p className="text-sm text-white/60">Laporan Masuk</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-3xl font-bold text-white mb-1">95%</p>
              <p className="text-sm text-white/60">Terselesaikan</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-3xl font-bold text-white mb-1">24 jam</p>
              <p className="text-sm text-white/60">Waktu Respon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Aspirasi</h1>
              <p className="text-xs text-muted-foreground">SMA Negeri 1</p>
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
                    Gunakan NISN dan password untuk masuk
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStudentLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nisn">NISN</Label>
                      <Input
                        id="nisn"
                        placeholder="Masukkan NISN"
                        defaultValue="0012345678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="student-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan password"
                          defaultValue="password"
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
                    <Button type="submit" className="w-full btn-primary-gradient">
                      Masuk sebagai Siswa
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
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@sekolah.id"
                        defaultValue="admin@sekolah.id"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="admin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan password"
                          defaultValue="password"
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
                    <Button type="submit" className="w-full btn-primary-gradient">
                      Masuk sebagai Admin
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Lupa password?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Hubungi Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
