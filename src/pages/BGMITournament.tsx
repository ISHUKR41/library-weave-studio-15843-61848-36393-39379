import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import TournamentInfo from "@/components/TournamentInfo";
import BGMISoloForm from "@/components/forms/BGMISoloForm";
import BGMIDuoForm from "@/components/forms/BGMIDuoForm";
import BGMISquadForm from "@/components/forms/BGMISquadForm";
import bgmiBanner from "@/assets/bgmi-banner.jpg";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

const BGMITournament = () => {
  const [activeTab, setActiveTab] = useState("solo");

  const tournamentData = {
    solo: {
      type: "solo",
      game: "bgmi",
      maxPlayers: 100,
      entryFee: 20,
      winnerPrize: 350,
      runnerUpPrize: 250,
      perKillReward: 9,
      playerCount: 1,
    },
    duo: {
      type: "duo",
      game: "bgmi",
      maxTeams: 50,
      entryFee: 40,
      winnerPrize: 350,
      runnerUpPrize: 250,
      perKillReward: 9,
      playerCount: 2,
    },
    squad: {
      type: "squad",
      game: "bgmi",
      maxTeams: 25,
      entryFee: 80,
      winnerPrize: 350,
      runnerUpPrize: 250,
      perKillReward: 9,
      playerCount: 4,
    },
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden mt-16">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bgmiBanner})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        
        <div className="relative z-10 text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold"
          >
            <AnimatedGradientText colors="from-blue-500 via-purple-500 to-pink-500">
              BGMI Tournament
            </AnimatedGradientText>
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
              <BGMISoloForm entryFee={tournamentData.solo.entryFee} />
            </TabsContent>

            <TabsContent value="duo" className="space-y-8">
              <TournamentInfo data={tournamentData.duo} />
              <BGMIDuoForm entryFee={tournamentData.duo.entryFee} />
            </TabsContent>

            <TabsContent value="squad" className="space-y-8">
              <TournamentInfo data={tournamentData.squad} />
              <BGMISquadForm entryFee={tournamentData.squad.entryFee} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default BGMITournament;
