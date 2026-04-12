import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useReviewPending, useAcceptComplaint, useRejectComplaint } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  AlertTriangle,
  FileText,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { InputAspirasi } from "@/types";

const AdminReview = () => {
  const { data: pendingData, isLoading } = useReviewPending();
  const acceptMutation = useAcceptComplaint();
  const rejectMutation = useRejectComplaint();
  const [selectedComplaint, setSelectedComplaint] = useState<InputAspirasi | null>(null);
  const [dialogAction, setDialogAction] = useState<"accept" | "reject" | null>(null);

  const complaints = pendingData?.data || [];

  const handleAction = (complaint: InputAspirasi, action: "accept" | "reject") => {
    setSelectedComplaint(complaint);
    setDialogAction(action);
  };

  const confirmAction = () => {
    if (!selectedComplaint || !dialogAction) return;

    const mutation = dialogAction === "accept" ? acceptMutation : rejectMutation;
    const successMsg = dialogAction === "accept"
      ? "Pengaduan diterima dan diteruskan ke pelaksana"
      : "Pengaduan ditolak dan dipindahkan ke arsip";

    mutation.mutate(selectedComplaint.id_pelaporan, {
      onSuccess: () => {
        toast.success(successMsg);
        setSelectedComplaint(null);
        setDialogAction(null);
      },
      onError: () => {
        toast.error("Gagal memproses pengaduan");
      },
    });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Review Pengaduan</h1>
          <p className="text-muted-foreground mt-1">
            Tinjau dan kelola pengaduan baru dari siswa
          </p>
        </div>

        {/* Stats */}
        <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{complaints.length}</p>
              <p className="text-sm text-muted-foreground">Pengaduan menunggu review</p>
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && complaints.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-500/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">Semua Sudah Direview</h3>
              <p className="text-muted-foreground mt-1">
                Tidak ada pengaduan yang menunggu review saat ini
              </p>
            </CardContent>
          </Card>
        )}

        {/* Complaint Cards */}
        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <Card key={complaint.id_pelaporan} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      Pengaduan #{complaint.id_pelaporan}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(complaint.created_at)}
                      </span>
                      {complaint.kategori && (
                        <Badge variant="outline">
                          {complaint.kategori.ket_kategori}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                    Menunggu Review
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pelapor */}
                {complaint.siswa && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Pelapor:</span>
                    <span>{complaint.siswa.nama} ({complaint.siswa.kelas})</span>
                  </div>
                )}

                {/* Lokasi */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{complaint.lokasi}</span>
                </div>

                {/* Keterangan */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Keterangan</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{complaint.keterangan}</p>
                </div>

                {/* Foto */}
                {complaint.foto_dokumentasi && (
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={complaint.foto_dokumentasi}
                      alt="Dokumentasi"
                      className="w-full max-h-64 object-cover"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={() => handleAction(complaint, "accept")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={acceptMutation.isPending || rejectMutation.isPending}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Terima
                  </Button>
                  <Button
                    onClick={() => handleAction(complaint, "reject")}
                    variant="destructive"
                    className="flex-1"
                    disabled={acceptMutation.isPending || rejectMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Tolak
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!dialogAction}
        onOpenChange={() => {
          setDialogAction(null);
          setSelectedComplaint(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogAction === "accept" ? "Terima Pengaduan?" : "Tolak Pengaduan?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === "accept"
                ? "Pengaduan ini akan diteruskan ke pelaksana untuk ditindaklanjuti."
                : "Pengaduan ini akan dipindahkan ke arsip dan tidak akan ditindaklanjuti."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={dialogAction === "accept" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {dialogAction === "accept" ? "Ya, Terima" : "Ya, Tolak"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminReview;
