import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  FileText,
  ShieldCheck,
  MessageSquare,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  ChevronDown,
  Layout,
  Send,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  // Handle navbar transparency on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === "admin" ? "/admin" : "/student");
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/20">
      {/* ==================== NAVBAR ==================== */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-2" 
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                <img
                  src="/assets/logo.png"
                  alt="SUSI SAKUCI"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight tracking-tight">
                  SUSI SAKUCI
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold leading-tight">
                  SMK Sangkuriang 1 Cimahi
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/saran")}
                className="hidden md:inline-flex text-sm font-medium hover:bg-primary/5"
              >
                Saran Publik
              </Button>
              <Button
                onClick={() => navigate("/login")}
                className="btn-primary-gradient px-6 rounded-full font-semibold shadow-primary text-sm gap-2"
              >
                Masuk
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Advanced Background Gradients */}
        <div className="absolute inset-0 bg-[#0B1120]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -mr-64 -mt-32 opacity-50" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full -ml-64 -mb-32 opacity-50" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-32 h-32 rounded-3xl bg-white/5 border border-white/10 rotate-12 animate-float shadow-2xl backdrop-blur-[2px]" />
          <div className="absolute top-[15%] right-[15%] w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 -rotate-6 animate-float-delayed shadow-2xl" />
          <div className="absolute bottom-[25%] left-[20%] w-20 h-20 rounded-xl bg-white/5 border border-white/10 rotate-45 animate-float shadow-2xl" />
          <div className="absolute bottom-[15%] right-[10%] w-40 h-40 rounded-[2.5rem] bg-accent/5 border border-accent/10 -rotate-12 animate-float-delayed shadow-2xl backdrop-blur-[1px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="animate-slide-up space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
              <Zap className="w-4 h-4 fill-primary" />
              <span className="text-xs font-bold uppercase tracking-wider">Platform Digital Sekolah No. 1</span>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tight">
                Suarakan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Perubahan</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
                Wujudkan lingkungan SMK Sangkuriang 1 Cimahi yang lebih baik melalui sistem pengaduan digital yang transparan dan efisien.
              </p>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="btn-primary-gradient w-full sm:w-auto px-10 py-7 rounded-2xl text-lg font-bold shadow-primary group"
              >
                Mulai Melapor
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/saran")}
                className="w-full sm:w-auto px-10 py-7 rounded-2xl text-lg font-bold border-white/10 text-white hover:bg-white/10 bg-white/5 backdrop-blur-md transition-all sm:flex-row gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Saran Publik
              </Button>
            </div>

            {/* Stats Summary */}
            <div className="pt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-white/10 mt-16 max-w-4xl mx-auto">
              {[
                { label: "Pengaduan", value: "Real-time" },
                { label: "Review Admin", value: "Cepat" },
                { label: "Status", value: "Transparan" },
                { label: "Keamanan", value: "Terjamin" },
              ].map((item, i) => (
                <div key={i} className="text-center group">
                  <p className="text-white text-2xl font-bold group-hover:text-primary transition-colors">{item.value}</p>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <span className="text-[10px] text-white uppercase tracking-tighter">Scroll Down</span>
          <ChevronDown className="w-5 h-5 text-white" />
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
        <div className="container-responsive relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-primary font-bold text-sm uppercase tracking-[0.2em]">Fitur Utama</h2>
            <h3 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
              Solusi Digital untuk <br />Kenyamanan Sekolah
            </h3>
            <p className="text-lg text-muted-foreground font-medium">
              Kami menghadirkan platform yang mempermudah interaksi antara siswa dan pihak sekolah secara modern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FileText,
                title: "Login Terintegrasi",
                desc: "Gunakan NIS Anda untuk akses penuh ke dashboard pelaporan dan pantau riwayat data Anda.",
                iconBg: "bg-blue-500/10",
                iconColor: "text-blue-500",
              },
              {
                icon: Clock,
                title: "Tanggapan Cepat",
                desc: "Setiap laporan masuk akan langsung diteruskan ke tim admin untuk ditinjau dan ditindaklanjuti.",
                iconBg: "bg-amber-500/10",
                iconColor: "text-amber-500",
              },
              {
                icon: ShieldCheck,
                title: "Privasi Siswa",
                desc: "Data pelapor dikelola dengan aman dan hanya dapat diakses oleh pihak yang berwenang.",
                iconBg: "bg-emerald-500/10",
                iconColor: "text-emerald-500",
              },
              {
                icon: Layout,
                title: "UI/UX Modern",
                desc: "Antarmuka yang bersih dan mudah digunakan bahkan untuk pengguna pertama kali.",
                iconBg: "bg-purple-500/10",
                iconColor: "text-purple-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-[2rem] border border-border/50 bg-card/50 hover:bg-card hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed leading-7">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-24 sm:py-32 bg-slate-50/50 dark:bg-slate-900/10 relative">
        <div className="container-responsive">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h2 className="text-primary font-bold text-sm uppercase tracking-[0.2em]">Alur Kerja</h2>
                <h3 className="text-4xl md:text-5xl font-black text-foreground">Bagaimana Caranya Melapor?</h3>
                <p className="text-lg text-muted-foreground font-medium max-w-xl">
                  Ikuti langkah mudah berikut ini untuk menyampaikan aspirasi Anda kepada sekolah dengan benar.
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: "Identifikasi & Login", desc: "Masuk ke sistem menggunakan NIS yang sudah terdaftar di database sekolah.", icon: Users },
                  { title: "Isi Form Pengaduan", desc: "Sampaikan keluhan secara mendalam, pilih kategori, dan tambahkan foto bukti fisik.", icon: Send },
                  { title: "Tunggu & Pantau", desc: "Pantau progres perbaikan melalui fitur riwayat laporan yang tersedia di dashboard.", icon: Layout },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-center lg:items-start gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-lg group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h5 className="text-lg font-bold text-foreground">{step.title}</h5>
                      <p className="text-slate-500 text-sm mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-700" />
              <div className="relative aspect-square sm:aspect-video lg:aspect-square bg-slate-200 dark:bg-slate-800 rounded-[3rem] border border-border overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
                {/* Visual placeholder for app UI mockup */}
                <div className="p-4 sm:p-8 h-full flex flex-col gap-4 bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-950">
                  <div className="h-12 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="grid grid-cols-3 gap-4 h-32">
                    {[1, 2, 3].map(i => <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" style={{animationDelay: `${i*0.2}s`}} />)}
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
                    <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                    <div className="h-24 w-full bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary font-bold">
                       Mockup Antarmuka Input
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="container-responsive">
          <div className="relative rounded-[3rem] bg-[#0F172A] p-8 sm:p-16 text-center overflow-hidden">
            {/* Shapes inside CTA box */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 blur-[100px] -ml-32 -mb-32" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-8 animate-fade-in">
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                Siap Wujudkan Lingkungan Sekolah yang Lebih Baik?
              </h2>
              <p className="text-slate-400 text-lg sm:text-xl font-medium">
                Setiap laporan Anda adalah langkah nyata bagi perbaikan fasilitas SMK Sangkuriang 1 Cimahi. Mari berpartisipasi sekarang.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="btn-primary-gradient w-full sm:w-auto px-10 py-7 rounded-2xl text-lg font-bold"
                >
                  Masuk ke Akun
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/saran")}
                  className="w-full sm:w-auto px-10 py-7 rounded-2xl text-lg font-bold bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  Kirim Saran Publik
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 border-t border-border/50 bg-background/50">
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
                  <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                </div>
                <h4 className="text-xl font-black text-foreground">SUSI SAKUCI</h4>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs text-center md:text-left">
                Suara Siswa SMK Sangkuriang 1 Cimahi. Platform pengaduan berbasis digital untuk lingkungan sekolah yang nyaman.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-sm font-semibold text-foreground">
                &copy; {new Date().getFullYear()} SUSI SAKUCI
              </p>
              <p className="text-xs text-muted-foreground">
                Dibuat dengan ❤️ oleh Muhammad Wafa Abdurrohman — 12 RPL 3
              </p>
              <div className="flex gap-4 mt-2">
                <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">Syarat & Ketentuan</span>
                <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">Kebijakan Privasi</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles for new animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(20px) rotate(-10deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .selection\\:bg-primary\\/20::selection {
          background-color: rgba(var(--primary), 0.2);
        }
      `}</style>
    </div>
  );
}
