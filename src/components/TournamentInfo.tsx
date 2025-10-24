import { Card } from "@/components/ui/card";
import { Trophy, Users, IndianRupee, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TournamentInfoProps {
  data: {
    type: string;
    game: string;
    maxPlayers?: number;
    maxTeams?: number;
    entryFee: number;
    winnerPrize: number;
    runnerUpPrize: number;
    perKillReward: number;
    playerCount: number;
  };
}

const TournamentInfo = ({ data }: TournamentInfoProps) => {
  const { data: registrations, isLoading } = useQuery({
    queryKey: [`${data.game}-${data.type}-count`],
    queryFn: async () => {
      const table = data.game === "bgmi" ? "bgmi_registrations" : "freefire_registrations";
      const { count } = await (supabase as any)
        .from(table)
        .select("*", { count: "exact", head: true })
        .eq("tournament_type", data.type)
        .eq("status", "approved");
      return count || 0;
    },
    refetchInterval: 5000,
  });

  const maxSlots = data.maxPlayers || data.maxTeams || 0;
  const availableSlots = maxSlots - (registrations || 0);
  const slotType = data.maxPlayers ? "players" : "teams";

  const infoCards = [
    {
      icon: IndianRupee,
      label: "Entry Fee",
      value: `₹${data.entryFee}`,
      color: "text-primary",
    },
    {
      icon: Trophy,
      label: "Winner Prize",
      value: `₹${data.winnerPrize}`,
      color: "text-accent",
    },
    {
      icon: Target,
      label: "Runner Up",
      value: `₹${data.runnerUpPrize}`,
      color: "text-blue-500",
    },
    {
      icon: Users,
      label: "Per Kill Reward",
      value: `₹${data.perKillReward}`,
      color: "text-green-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Slot Availability */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Card className="p-6 bg-gradient-card border-primary/50">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Available Slots
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold text-primary">
                {isLoading ? "..." : availableSlots}
              </span>
              <span className="text-2xl text-muted-foreground">/ {maxSlots}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {slotType} remaining
            </p>
            <div className="w-full bg-secondary rounded-full h-2 mt-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((maxSlots - availableSlots) / maxSlots) * 100}%` }}
                className="bg-gradient-primary h-2 rounded-full"
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Prize Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {infoCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 bg-gradient-card border-border/50 hover:border-primary/50 transition-all group">
              <card.icon className={`h-8 w-8 ${card.color} mb-2 group-hover:scale-110 transition-transform`} />
              <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
              <p className="text-xl font-bold">{card.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-card border-border/50">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Tournament Rules & Regulations
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>All players must pay the entry fee before registration is confirmed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Upload payment screenshot and transaction ID for verification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Room ID and password will be shared via WhatsApp after approval</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Winners must submit match result screenshot to claim prizes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Any form of cheating will result in immediate disqualification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Admin decisions are final and binding</span>
            </li>
          </ul>
        </Card>
      </motion.div>
    </div>
  );
};

export default TournamentInfo;
