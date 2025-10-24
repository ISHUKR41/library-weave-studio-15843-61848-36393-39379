import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trophy, Users, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const features = [
    {
      icon: Trophy,
      title: "Professional Tournaments",
      description: "Join competitive BGMI and Free Fire tournaments with guaranteed prize pools",
    },
    {
      icon: Users,
      title: "Multiple Formats",
      description: "Solo, Duo, and Squad modes available for all skill levels",
    },
    {
      icon: Zap,
      title: "Instant Registration",
      description: "Quick and easy registration process with secure payment",
    },
    {
      icon: Shield,
      title: "Fair Play",
      description: "Strict rules and regulations ensure fair competition for all players",
    },
  ];

  const games = [
    {
      name: "BGMI",
      path: "/bgmi",
      description: "Battle Grounds Mobile India",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      name: "Free Fire",
      path: "/freefire",
      description: "Garena Free Fire",
      gradient: "from-orange-600 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Elite Gaming
              </span>
              <br />
              <span className="text-foreground">Tournaments</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Compete in professional BGMI and Free Fire tournaments. Win prizes, earn recognition, and dominate the battlefield.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="group">
                <Link to="/bgmi">
                  Join BGMI Tournament
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/freefire">Join Free Fire Tournament</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground text-lg">
              Professional gaming experience with guaranteed prizes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full bg-gradient-card border-border/50 hover:border-primary/50 transition-all group hover:shadow-glow">
                  <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Choose Your Game</h2>
            <p className="text-muted-foreground text-lg">
              Select your preferred battle royale game and start competing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {games.map((game, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={game.path}>
                  <Card className="p-8 h-full bg-gradient-card border-border/50 hover:border-primary transition-all group cursor-pointer hover:shadow-glow">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.gradient} mb-4 group-hover:scale-110 transition-transform`} />
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">{game.description}</p>
                    <div className="flex items-center text-primary group-hover:translate-x-2 transition-transform">
                      <span className="font-semibold">Join Tournament</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-white">Ready to Compete?</h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Join thousands of players in our professional gaming tournaments. Register now and start your journey to victory!
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-secondary/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 TournamentPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
