import { motion } from "framer-motion";
import { Shield, AlertCircle, Info, FileText, Scale, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";

const Disclaimer = () => {
  const sections = [
    {
      icon: Shield,
      title: "General Disclaimer",
      content: [
        "The information provided on TournamentPro is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the site.",
        "Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.",
      ],
    },
    {
      icon: AlertCircle,
      title: "Tournament Participation",
      content: [
        "By participating in our tournaments, you acknowledge that gaming involves risk and competition. All participants must be of legal age (18 years or above) or have parental/guardian consent to participate.",
        "We reserve the right to disqualify any participant found violating tournament rules, using unfair means, hacks, cheats, or any third-party software that provides an unfair advantage.",
        "Tournament schedules, prize pools, and rules are subject to change at our discretion. Participants will be notified of any significant changes via registered WhatsApp number or email.",
        "We are not responsible for any technical issues, internet connectivity problems, device malfunctions, or game server issues that may affect your tournament experience.",
      ],
    },
    {
      icon: Scale,
      title: "Payment and Prizes",
      content: [
        "All registration fees are non-refundable once the tournament has commenced. Refund requests must be made at least 2 hours before the tournament start time.",
        "Prize distribution is subject to verification of winning screenshots and compliance with tournament rules. Prizes will be transferred within 24-48 hours of verification.",
        "We reserve the right to withhold prizes if suspicious activity, rule violations, or fraudulent behavior is detected.",
        "All payments must be made through authorized payment channels only. We are not responsible for payments made to unauthorized third parties.",
        "Tax implications on prize winnings, if any, are the sole responsibility of the winner as per applicable laws.",
      ],
    },
    {
      icon: UserCheck,
      title: "User Responsibilities",
      content: [
        "Users are responsible for maintaining the confidentiality of their account credentials and registration information.",
        "You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.",
        "You are responsible for all activities that occur under your account and must immediately notify us of any unauthorized use of your account.",
        "Users must respect other participants and maintain professional conduct during tournaments. Harassment, abusive language, or unsportsmanlike behavior will result in immediate disqualification.",
      ],
    },
    {
      icon: FileText,
      title: "Intellectual Property",
      content: [
        "All content, logos, trademarks, and intellectual property displayed on TournamentPro are owned by their respective owners. BGMI is a trademark of Krafton, Inc. Free Fire is a trademark of Garena International.",
        "We do not claim ownership of game content, characters, or in-game assets. Our platform is an independent tournament organizing service and is not officially affiliated with game developers.",
        "Screenshots, images, and content submitted by users remain the property of the users, but by submitting, you grant us a non-exclusive license to use such content for verification and promotional purposes.",
      ],
    },
    {
      icon: Info,
      title: "Limitation of Liability",
      content: [
        "To the fullest extent permitted by applicable law, TournamentPro shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.",
        "We do not guarantee uninterrupted or error-free service and are not liable for any delays, delivery failures, or any other loss or damage resulting from the transfer of data over communications networks and facilities.",
        "Our total liability to you for all claims arising from or related to the use of our services shall not exceed the amount you paid for tournament registration.",
      ],
    },
  ];

  const additionalPoints = [
    {
      title: "Age Restriction",
      description: "Participants must be 18 years or older, or have parental consent if under 18.",
    },
    {
      title: "Fair Play Policy",
      description: "Zero tolerance for cheating, hacking, or use of unauthorized software. Violations result in permanent ban.",
    },
    {
      title: "Privacy",
      description: "We collect and process personal information in accordance with our Privacy Policy. Your data is used solely for tournament operations.",
    },
    {
      title: "Modifications",
      description: "We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.",
    },
    {
      title: "Dispute Resolution",
      description: "Any disputes arising from tournament participation will be resolved through mutual discussion. Our decision on rule violations is final.",
    },
    {
      title: "Contact",
      description: "For any questions or concerns regarding this disclaimer, please contact our support team through the Contact page.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-6 shadow-glow">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Disclaimer
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Please read this disclaimer carefully before using TournamentPro services. By accessing and using our platform, you accept and agree to be bound by the terms outlined below.
          </p>
        </motion.div>

        {/* Main Disclaimer Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-8 bg-gradient-card border-border/50 hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold flex-1">{section.title}</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Important Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="p-8 bg-gradient-card border-border/50">
            <h2 className="text-2xl font-bold mb-6 text-center">Important Points to Remember</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {additionalPoints.map((point, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all"
                >
                  <h3 className="font-semibold text-lg mb-2 text-primary">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <Separator className="my-12" />

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <Card className="p-6 bg-gradient-card border-border/50 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This disclaimer is subject to change without notice. Please review it periodically.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Disclaimer;
