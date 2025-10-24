import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import TournamentInfo from "@/components/TournamentInfo";
import FreeFireSoloForm from "@/components/forms/FreeFireSoloForm";
import FreeFireDuoForm from "@/components/forms/FreeFireDuoForm";
import FreeFireSquadForm from "@/components/forms/FreeFireSquadForm";
import freeFireBanner from "@/assets/freefire-banner.jpg";

const FreeFireTournament = () => {
  const [activeTab, setActiveTab] = useState("solo");

  const tournamentData = {
    solo: {
      type: "solo",
      game: "freefire",
      maxPlayers: 48,
      entryFee: 20,
      winnerPrize: 350,
      runnerUpPrize: 150,
      perKillReward: 5,
      playerCount: 1,
    },
    duo: {
      type: "duo",
      game: "freefire",
      maxTeams: 24,
      entryFee: 40,
      winnerPrize: 350,
      runnerUpPrize: 150,
      perKillReward: 5,
      playerCount: 2,
    },
    squad: {
      type: "squad",
      game: "freefire",
      maxTeams: 12,
      entryFee: 80,
      winnerPrize: 350,
      runnerUpPrize: 150,
      perKillReward: 5,
      playerCount: 4,
    },
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden mt-16">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${freeFireBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        </div>
        
        <div className="relative z-10 text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold"
          >
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 bg-clip-text text-transparent animate-gradient-x" style={{ backgroundSize: "200% auto" }}>
              Free Fire
            </span>{" "}
            <span className="text-foreground">Tournament</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Compete in Solo, Duo, or Squad modes
          </motion.p>
        </div>
      </section>

      {/* Tournament Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 h-auto p-1">
              <TabsTrigger value="solo" className="text-base">Solo</TabsTrigger>
              <TabsTrigger value="duo" className="text-base">Duo</TabsTrigger>
              <TabsTrigger value="squad" className="text-base">Squad</TabsTrigger>
            </TabsList>

            <TabsContent value="solo" className="space-y-8">
              <TournamentInfo data={tournamentData.solo} />
              <FreeFireSoloForm entryFee={tournamentData.solo.entryFee} />
            </TabsContent>

            <TabsContent value="duo" className="space-y-8">
              <TournamentInfo data={tournamentData.duo} />
              <FreeFireDuoForm entryFee={tournamentData.duo.entryFee} />
            </TabsContent>

            <TabsContent value="squad" className="space-y-8">
              <TournamentInfo data={tournamentData.squad} />
              <FreeFireSquadForm entryFee={tournamentData.squad.entryFee} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default FreeFireTournament;
