import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, X, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const categories = [
  { value: "ruang-kelas", label: "Ruang Kelas" },
  { value: "toilet", label: "Toilet" },
  { value: "lab-komputer", label: "Lab Komputer" },
  { value: "perpustakaan", label: "Perpustakaan" },
  { value: "kantin", label: "Kantin" },
  { value: "fasilitas-umum", label: "Fasilitas Umum" },
  { value: "lainnya", label: "Lainnya" },
];

export default function StudentNewComplaint() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Pengaduan berhasil dikirim!", {
      description: "Tim kami akan segera meninjau laporan Anda.",
    });

    setIsSubmitting(false);
    navigate("/student/complaints");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Layout role="student">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Back button */}
        <Button variant="ghost" className="gap-2" onClick={() => navigate("/student")}>
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Buat Pengaduan Baru</CardTitle>
            <CardDescription>
              Sampaikan keluhan atau aspirasimu terkait sarana dan prasarana sekolah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Pengaduan *</Label>
                <Input
                  id="title"
                  placeholder="Contoh: AC Ruang Kelas Rusak"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi *</Label>
                <Input
                  id="location"
                  placeholder="Contoh: Gedung A Lantai 2, Ruang 201"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan detail permasalahan yang kamu temui..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="min-h-[150px]"
                  required
                />
              </div>

              {/* File upload */}
              <div className="space-y-2">
                <Label>Foto (Opsional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Klik untuk upload atau drag & drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG hingga 5MB (maksimal 3 foto)
                  </p>
                </div>
              </div>

              {/* Submit buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/student")}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 btn-primary-gradient gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Pengaduan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
