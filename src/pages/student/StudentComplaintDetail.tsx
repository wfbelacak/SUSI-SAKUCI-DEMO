import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressTracker } from "@/components/ProgressTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, MapPin, Calendar, Send, ImageIcon, MessageCircle } from "lucide-react";
import { useState } from "react";

const complaintData = {
  id: "1",
  title: "AC Ruang Kelas XI IPA 1 Rusak",
  description:
    "AC di ruang kelas tidak berfungsi sejak seminggu yang lalu, membuat suasana belajar tidak nyaman karena cuaca yang sangat panas. Sudah dilaporkan ke petugas kebersihan tetapi belum ada tindak lanjut.",
  category: "Ruang Kelas",
  location: "Gedung A Lantai 2, Ruang 201",
  status: "in_progress" as const,
  date: "13 Januari 2026",
};

const progressSteps = [
  {
    id: 1,
    title: "Pengaduan Diterima",
    description: "Pengaduan berhasil dikirim dan masuk ke sistem",
    status: "completed" as const,
    date: "13 Jan 2026, 08:30",
  },
  {
    id: 2,
    title: "Sedang Ditinjau",
    description: "Tim sarana prasarana sedang meninjau laporan",
    status: "completed" as const,
    date: "13 Jan 2026, 10:15",
  },
  {
    id: 3,
    title: "Dalam Pengerjaan",
    description: "Teknisi sedang memperbaiki AC yang rusak",
    status: "current" as const,
    date: "14 Jan 2026, 09:00",
  },
  {
    id: 4,
    title: "Selesai",
    description: "Perbaikan telah selesai dilakukan",
    status: "pending" as const,
  },
];

const feedbackHistory = [
  {
    id: 1,
    sender: "Admin",
    message: "Terima kasih atas laporannya. Kami sudah menugaskan teknisi untuk memeriksa AC tersebut.",
    date: "13 Jan 2026, 10:30",
    isAdmin: true,
  },
  {
    id: 2,
    sender: "Ahmad Fauzi",
    message: "Baik, terima kasih. Mohon segera ditangani ya karena sudah tidak nyaman belajar di kelas.",
    date: "13 Jan 2026, 11:00",
    isAdmin: false,
  },
  {
    id: 3,
    sender: "Admin",
    message: "Teknisi sudah mulai memeriksa AC. Kemungkinan perlu penggantian spare part. Estimasi selesai 1-2 hari.",
    date: "14 Jan 2026, 09:15",
    isAdmin: true,
  },
];

export default function StudentComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("");
    }
  };

  return (
    <Layout role="student">
      <div className="space-y-6 animate-fade-in">
        {/* Back button */}
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => navigate("/student/complaints")}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Pengaduan Saya
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint detail card */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md">
                    {complaintData.category}
                  </span>
                  <StatusBadge status={complaintData.status} />
                </div>
                <CardTitle className="text-xl md:text-2xl">{complaintData.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {complaintData.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{complaintData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{complaintData.date}</span>
                  </div>
                </div>

                {/* Images placeholder */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Tidak ada foto terlampir</p>
                </div>
              </CardContent>
            </Card>

            {/* Feedback section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Komunikasi dengan Admin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {feedbackHistory.map((feedback) => (
                    <div
                      key={feedback.id}
                      className={`flex gap-3 ${feedback.isAdmin ? "" : "flex-row-reverse"}`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback
                          className={
                            feedback.isAdmin
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent text-accent-foreground"
                          }
                        >
                          {feedback.sender.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex-1 max-w-[80%] ${
                          feedback.isAdmin ? "" : "flex flex-col items-end"
                        }`}
                      >
                        <div
                          className={`rounded-lg p-3 ${
                            feedback.isAdmin
                              ? "bg-muted"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">{feedback.sender}</p>
                          <p className="text-sm">{feedback.message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{feedback.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Textarea
                    placeholder="Tulis pesan..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button
                    className="btn-primary-gradient self-end"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress Penyelesaian</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressTracker steps={progressSteps} />
              </CardContent>
            </Card>

            {/* Info card */}
            <Card className="bg-muted/50 border-muted">
              <CardContent className="p-4">
                <h4 className="font-semibold text-foreground mb-2">💡 Informasi</h4>
                <p className="text-sm text-muted-foreground">
                  Kamu akan menerima notifikasi setiap kali ada update status pengaduan. Tetap pantau progress di halaman ini.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
