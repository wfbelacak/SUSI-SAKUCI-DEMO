import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  History,
  MessageSquare,
  LogOut,
  Menu,
  X,
  User,
  PlusCircle,
  BarChart3,
  Users,
  Tag,
  CheckCircle2,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { NotificationBell } from "@/components/NotificationBell";

interface LayoutProps {
  children: ReactNode;
  role: "admin" | "student";
}

// Admin Sistem (full access)
const adminSystemNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: CheckCircle2, label: "Review Pengaduan", path: "/admin/review" },
  { icon: FileText, label: "Semua Pengaduan", path: "/admin/complaints" },
  { icon: MessageSquare, label: "Saran & Pesan", path: "/admin/saran" },
  { icon: Users, label: "Data Siswa", path: "/admin/students" },
  { icon: Tag, label: "Data Kategori", path: "/admin/categories" },
  { icon: BarChart3, label: "Statistik", path: "/admin/statistics" },
  { icon: Archive, label: "Arsip", path: "/admin/arsip" },
  { icon: History, label: "Histori", path: "/admin/history" },
];

// Pelaksana (limited access)
const pelaksanaNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: FileText, label: "Pengaduan Terbaru", path: "/admin/complaints" },
  { icon: History, label: "History Pengaduan", path: "/admin/history" },
];

const studentNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
  { icon: PlusCircle, label: "Buat Pengaduan", path: "/student/new" },
  { icon: FileText, label: "Pengaduan Saya", path: "/student/complaints" },
  { icon: MessageSquare, label: "Umpan Balik", path: "/student/feedback" },
  { icon: History, label: "Histori", path: "/student/history" },
];

export function Layout({ children, role }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { siswa, admin, logout } = useAuth();

  // Dynamic nav items based on role
  const navItems = role === "admin"
    ? (admin?.posisi === "Pelaksana" ? pelaksanaNavItems : adminSystemNavItems)
    : studentNavItems;
  
  // Get user info from auth context
  const userName = role === "admin" 
    ? (admin?.nama_admin || "Admin") 
    : (siswa?.nama || "Siswa");
  const userRole = role === "admin" 
    ? (admin?.posisi || "Administrator") 
    : (siswa?.kelas || "Siswa");

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    toast.success("Logout berhasil", {
      description: "Sampai jumpa kembali!",
    });
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (role === "admin") {
      navigate("/admin/profile");
    } else {
      navigate("/student/profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog 
        open={logoutDialogOpen} 
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleLogoutConfirm}
      />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10">
                <img src="/assets/logo.png" alt="SUSI SAKUCI" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-bold text-sidebar-foreground">SUSI SAKUCI</h1>
                <p className="text-xs text-sidebar-foreground/60">Suara Siswa</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-sidebar-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:block">
                <h2 className="font-semibold text-foreground">
                  Selamat Datang, {userName.split(" ")[0]}! 👋
                </h2>
                <p className="text-sm text-muted-foreground">{userRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">
                      {userName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogoutClick} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
