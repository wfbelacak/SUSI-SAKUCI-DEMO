import { useState } from "react";
import { StudentLayout } from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star, Loader2, CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useInputAspirasiBySiswa } from "@/hooks/useApi";
import api from "@/lib/api";

export default function StudentFeedback() {
  const { siswa } = useAuth();
  const [selectedComplaint, setSelectedComplaint] = useState<number | null>(null);
  const [selectedAspirasiId, setSelectedAspirasiId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: complaintsData, isLoading, refetch } = useInputAspirasiBySiswa(siswa?.nis || 0);
  
  // Get only completed complaints for feedback (that haven't been rated yet)
  const completedComplaints = (complaintsData?.data || []).filter(c => 
    c.aspirasi?.some(a => a.status === 'Selesai')
  );
  
  // Get already rated complaints
  const ratedComplaints = (complaintsData?.data || []).filter(c => 
    c.aspirasi?.some(a => a.feedback && a.feedback > 0)
  );

  const handleSelectComplaint = (complaintId: number, aspirasiId: number) => {
    setSelectedComplaint(complaintId);
    setSelectedAspirasiId(aspirasiId);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedAspirasiId || rating === 0) {
      toast.error("Lengkapi feedback", {
        description: "Pilih pengaduan dan berikan rating",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.patch(`/aspirasi/${selectedAspirasiId}/feedback`, {
        feedback: rating,
      });
      
      toast.success("Terima kasih atas feedback Anda!");
      setSelectedComplaint(null);
      setSelectedAspirasiId(null);
      setRating(0);
      setFeedbackText("");
      refetch(); // Refresh data
    } catch (error: any) {
      toast.error("Gagal mengirim feedback", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 1: return "Sangat Tidak Puas";
      case 2: return "Tidak Puas";
      case 3: return "Cukup";
      case 4: return "Puas";
      case 5: return "Sangat Puas";
      default: return "Belum ada rating";
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in pb-24">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feedback</h1>
          <p className="text-muted-foreground mt-1">
            Berikan penilaian atas penanganan pengaduan Anda
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Completed complaints list for feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Pengaduan Selesai
              </CardTitle>
              <CardDescription>
                Pilih pengaduan yang sudah selesai untuk memberikan rating
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : completedComplaints.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada pengaduan selesai</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {completedComplaints.map((complaint) => {
                    const aspirasi = complaint.aspirasi?.find(a => a.status === 'Selesai');
                    const hasRating = aspirasi?.feedback && aspirasi.feedback > 0;
                    
                    return (
                      <div
                        key={complaint.id_pelaporan}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedComplaint === complaint.id_pelaporan
                            ? 'border-primary bg-primary/5'
                            : hasRating 
                              ? 'border-green-200 bg-green-50 opacity-60 cursor-not-allowed'
                              : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => !hasRating && aspirasi && handleSelectComplaint(complaint.id_pelaporan, aspirasi.id_aspirasi)}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm line-clamp-2">
                              {complaint.keterangan}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {complaint.lokasi}
                            </p>
                          </div>
                          {hasRating ? (
                            <Badge variant="secondary" className="text-xs gap-1 bg-green-100 text-green-700">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {aspirasi.feedback}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Belum dinilai
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rating form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5" />
                Berikan Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedComplaint ? (
                <>
                  {/* Rating Stars */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Rating</label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-10 h-10 transition-colors ${
                              star <= rating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      {getRatingLabel(rating)}
                    </p>
                  </div>

                  {/* Feedback Text */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Komentar (Opsional)</label>
                    <Textarea
                      placeholder="Tulis komentar Anda tentang penanganan pengaduan..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    className="w-full btn-primary-gradient"
                    onClick={handleSubmitFeedback}
                    disabled={!selectedComplaint || rating === 0 || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Feedback
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Pilih pengaduan dari daftar untuk memberikan rating</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Already rated section */}
        {ratedComplaints.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rating yang Sudah Diberikan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ratedComplaints.map((complaint) => {
                  const aspirasi = complaint.aspirasi?.find(a => a.feedback && a.feedback > 0);
                  return (
                    <div key={complaint.id_pelaporan} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm line-clamp-1 flex-1">{complaint.keterangan}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-4 h-4 ${
                              star <= (aspirasi?.feedback || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
}
