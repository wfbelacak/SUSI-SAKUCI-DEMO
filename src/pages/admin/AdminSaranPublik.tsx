import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare, User, Search, Loader2, Trash2,
  CheckCircle2, Clock, Mail, Phone, Calendar, AlertCircle
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { saranPublikService } from "@/services/api";
import { toast } from "sonner";

export default function AdminSaranPublik() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const queryClient = useQueryClient();

  // Fetch all saran publik
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["saran-publik"],
    queryFn: () => saranPublikService.getAll(),
    staleTime: 30_000,
  });

  const allMessages = data?.data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => saranPublikService.delete(id),
    onSuccess: () => {
      toast.success("Pesan berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["saran-publik"] });
    },
    onError: () => toast.error("Gagal menghapus pesan"),
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      saranPublikService.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Status berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["saran-publik"] });
    },
    onError: () => toast.error("Gagal memperbarui status"),
  });

  // Separate contact messages vs general saran
  const contactMessages = allMessages.filter((m: any) =>
    m.isi_saran?.includes("[HUBUNGI ADMIN]")
  );
  const saranMessages = allMessages.filter(
    (m: any) => !m.isi_saran?.includes("[HUBUNGI ADMIN]")
  );

  // Filter by tab
  const displayMessages =
    activeTab === "contact"
      ? contactMessages
      : activeTab === "saran"
      ? saranMessages
      : allMessages;

  // Filter by search
  const filteredMessages = displayMessages.filter((msg: any) => {
    const q = searchQuery.toLowerCase();
    return (
      msg.nama_pengirim?.toLowerCase().includes(q) ||
      msg.isi_saran?.toLowerCase().includes(q) ||
      msg.email?.toLowerCase().includes(q)
    );
  });

  // Parse contact message body
  const parseMessage = (isiSaran: string) => {
    const isContact = isiSaran?.includes("[HUBUNGI ADMIN]");
    if (isContact) {
      const body = isiSaran.replace("[HUBUNGI ADMIN] ", "");
      const [infoLine, ...pesanParts] = body.split("\n\n");
      return {
        isContact: true,
        info: infoLine || "",
        pesan: pesanParts.join("\n\n") || infoLine,
      };
    }
    return { isContact: false, info: "", pesan: isiSaran };
  };

  return (
    <Layout role="admin">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Saran & Pesan
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola saran publik dan pesan hubungi admin dari siswa
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allMessages.length}</p>
                <p className="text-xs text-muted-foreground">Total Pesan</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{contactMessages.length}</p>
                <p className="text-xs text-muted-foreground">Hubungi Admin</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{saranMessages.length}</p>
                <p className="text-xs text-muted-foreground">Saran Publik</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, pesan, atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              Semua ({allMessages.length})
            </TabsTrigger>
            <TabsTrigger value="contact">
              Hubungi Admin ({contactMessages.length})
            </TabsTrigger>
            <TabsTrigger value="saran">
              Saran Publik ({saranMessages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-semibold mb-1">Belum ada pesan</h3>
                <p className="text-sm">
                  Belum ada saran atau pesan dari siswa.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMessages.map((msg: any) => {
                  const parsed = parseMessage(msg.isi_saran);
                  const isHandled = msg.status === "ditangani";

                  return (
                    <Card
                      key={msg.id_saran || msg.id}
                      className={`transition-colors ${
                        isHandled ? "opacity-60" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Header: Name + badge */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="font-semibold text-sm">
                                {msg.nama_pengirim}
                              </span>
                              {parsed.isContact ? (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Hubungi Admin
                                </Badge>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  Saran Publik
                                </Badge>
                              )}
                              {isHandled && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-emerald-600 border-emerald-300"
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Ditangani
                                </Badge>
                              )}
                            </div>

                            {/* Info line (NIS for contact messages) */}
                            {parsed.isContact && parsed.info && parsed.info !== parsed.pesan && (
                              <p className="text-xs text-muted-foreground mb-1">
                                {parsed.info}
                              </p>
                            )}

                            {/* Message body */}
                            <p className="text-sm text-foreground whitespace-pre-line">
                              {parsed.pesan}
                            </p>

                            {/* Meta row */}
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                              {msg.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {msg.email}
                                </span>
                              )}
                              {msg.no_telepon && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {msg.no_telepon}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {msg.created_at
                                  ? new Date(
                                      msg.created_at
                                    ).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "-"}
                              </span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            {!isHandled && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs"
                                onClick={() =>
                                  statusMutation.mutate({
                                    id: msg.id_saran || msg.id,
                                    status: "ditangani",
                                  })
                                }
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                Tangani
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive text-xs"
                              onClick={() => {
                                if (
                                  confirm("Yakin ingin menghapus pesan ini?")
                                ) {
                                  deleteMutation.mutate(
                                    msg.id_saran || msg.id
                                  );
                                }
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Hapus
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
