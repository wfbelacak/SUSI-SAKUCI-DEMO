import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  History,
  MessageSquare,
  LogOut,
  PlusCircle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface StudentLayoutProps {
  children: ReactNode;
}

const bottomNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
  { icon: FileText, label: "Pengaduan", path: "/student/complaints" },
  { icon: PlusCircle, label: "Tambah", path: "/student/new", isCenter: true },
  { icon: MessageSquare, label: "Feedback", path: "/student/feedback" },
];

export function StudentLayout({ children }: StudentLayoutProps) {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { siswa, logout } = useAuth();

  const userName = siswa?.nama || "Siswa";
  const userClass = siswa?.kelas || "Kelas";

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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog 
        open={logoutDialogOpen} 
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleLogoutConfirm}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-6 h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10">
              <img src="/assets/logo.png" alt="SUSI SAKUCI" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-sm md:text-base">SUSI SAKUCI</h1>
              <p className="text-xs text-muted-foreground">Suara Siswa</p>
            </div>
          </div>

          {/* Right side: History, Notification, Profile */}
          <div className="flex items-center gap-2">
            {/* History Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/student/history")}
            >
              <History className="w-5 h-5" />
            </Button>

            {/* Notification Bell */}
            <NotificationBell />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="p-4 md:p-6">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            if (item.isCenter) {
              // Center button (Tambah Pengaduan)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center -mt-6"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow">
                    <item.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Account Menu in Bottom Nav */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                  location.pathname === "/student/profile"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <User className="w-5 h-5" />
                <span className="text-xs font-medium">Akun</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-48 mb-2">
              <DropdownMenuItem onClick={() => navigate("/student/profile")}>
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
      </nav>
    </div>
  );
}
