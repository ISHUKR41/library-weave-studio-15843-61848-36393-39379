import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RegistrationTableProps {
  game: "bgmi" | "freefire";
  type: "solo" | "duo" | "squad";
}

const RegistrationTable = ({ game, type }: RegistrationTableProps) => {
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [signedScreenshotUrl, setSignedScreenshotUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateUrl = async () => {
      if (selectedRegistration?.payment_screenshot_url) {
        const raw = selectedRegistration.payment_screenshot_url as string;
        if (raw.startsWith('http')) {
          setSignedScreenshotUrl(raw);
          return;
        }
        const { data, error } = await supabase
          .storage
          .from('payment-screenshots')
          .createSignedUrl(raw, 60 * 60);
        if (!error && data?.signedUrl) setSignedScreenshotUrl(data.signedUrl);
        else setSignedScreenshotUrl(null);
      } else {
        setSignedScreenshotUrl(null);
      }
    };
    generateUrl();
  }, [selectedRegistration]);
  const queryClient = useQueryClient();

  const { data: registrations, isLoading } = useQuery({
    queryKey: [`${game}-${type}-registrations`],
    queryFn: async () => {
      const table = game === "bgmi" ? "bgmi_registrations" : "freefire_registrations";
      const { data, error } = await (supabase as any)
        .from(table)
        .select("*")
        .eq("tournament_type", type)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      const table = game === "bgmi" ? "bgmi_registrations" : "freefire_registrations";
      const { error } = await (supabase as any)
        .from(table)
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Registration ${status} successfully`);
      queryClient.invalidateQueries({ queryKey: [`${game}-${type}-registrations`] });
      queryClient.invalidateQueries({ queryKey: [`${game}-${type}-count`] });
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (!registrations || registrations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No registrations yet for {type} mode</p>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden bg-gradient-card border-border/50">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-semibold">Team/Player</TableHead>
                  <TableHead className="font-semibold">Leader Name</TableHead>
                  <TableHead className="font-semibold">WhatsApp</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg: any, index: number) => (
                  <motion.tr
                    key={reg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-border hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {reg.team_name || reg.team_leader_name}
                    </TableCell>
                    <TableCell>{reg.team_leader_name}</TableCell>
                    <TableCell className="font-mono text-sm">{reg.team_leader_whatsapp}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          reg.status === "approved"
                            ? "default"
                            : reg.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {reg.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRegistration(reg)}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {reg.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleStatusUpdate(reg.id, "approved")}
                              className="hover:shadow-glow transition-all"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(reg.id, "rejected")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>

      <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Registration Details</DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Team Name</p>
                  <p className="font-semibold text-lg">{selectedRegistration.team_name || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Leader Name</p>
                  <p className="font-semibold text-lg">{selectedRegistration.team_leader_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Leader ID</p>
                  <p className="font-semibold font-mono">{selectedRegistration.team_leader_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-semibold font-mono">{selectedRegistration.team_leader_whatsapp}</p>
                </div>
                {selectedRegistration.player2_name && (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Player 2 Name</p>
                      <p className="font-semibold">{selectedRegistration.player2_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Player 2 ID</p>
                      <p className="font-semibold font-mono">{selectedRegistration.player2_id}</p>
                    </div>
                  </>
                )}
                {selectedRegistration.player3_name && (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Player 3 Name</p>
                      <p className="font-semibold">{selectedRegistration.player3_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Player 3 ID</p>
                      <p className="font-semibold font-mono">{selectedRegistration.player3_id}</p>
                    </div>
                  </>
                )}
                {selectedRegistration.player4_name && (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Player 4 Name</p>
                      <p className="font-semibold">{selectedRegistration.player4_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Player 4 ID</p>
                      <p className="font-semibold font-mono">{selectedRegistration.player4_id}</p>
                    </div>
                  </>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-semibold font-mono text-primary">{selectedRegistration.transaction_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      selectedRegistration.status === "approved"
                        ? "default"
                        : selectedRegistration.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {selectedRegistration.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground font-semibold">Payment Screenshot</p>
                <img
                  src={signedScreenshotUrl ?? selectedRegistration.payment_screenshot_url}
                  alt="Payment Screenshot"
                  className="w-full max-w-md rounded-lg border-2 border-border hover:border-primary transition-colors shadow-lg"
                />
              </div>

              {selectedRegistration.status === "pending" && (
                <div className="flex gap-4 pt-4 border-t border-border">
                  <Button
                    className="flex-1 shadow-md hover:shadow-glow transition-all"
                    onClick={() => {
                      handleStatusUpdate(selectedRegistration.id, "approved");
                      setSelectedRegistration(null);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve Registration
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 shadow-md"
                    onClick={() => {
                      handleStatusUpdate(selectedRegistration.id, "rejected");
                      setSelectedRegistration(null);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject Registration
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegistrationTable;
