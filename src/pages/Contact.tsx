import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // In production, this would send to your backend
      console.log("Contact form submitted:", data);
      toast.success("Message sent successfully! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "support@tournamentpro.com",
      link: "mailto:support@tournamentpro.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 98765 43210",
      link: "tel:+919876543210",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Mumbai, Maharashtra, India",
      link: null,
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Mon-Sat: 10:00 AM - 8:00 PM",
      link: null,
    },
  ];

  const socialLinks = [
    { icon: Facebook, link: "#", label: "Facebook" },
    { icon: Instagram, link: "#", label: "Instagram" },
    { icon: Twitter, link: "#", label: "Twitter" },
  ];

  const faqs = [
    {
      question: "How do I register for a tournament?",
      answer: "Navigate to either BGMI or Free Fire page, select your preferred tournament type (Solo/Duo/Squad), fill in the registration form with your team details, upload payment screenshot, and submit. You'll receive confirmation via WhatsApp once approved.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI payments. After filling the registration form, you'll need to upload a screenshot of your payment transaction along with the transaction ID for verification.",
    },
    {
      question: "When will I receive tournament details?",
      answer: "Once your registration is approved by our admin team, you'll receive the room ID and password via WhatsApp 30 minutes before the tournament starts.",
    },
    {
      question: "How are prizes distributed?",
      answer: "Winners and runner-ups receive their prizes via UPI transfer within 24-48 hours after tournament completion. You'll need to provide a winning screenshot for verification.",
    },
    {
      question: "Can I cancel my registration?",
      answer: "Registration cancellations must be requested at least 2 hours before tournament start time. Contact us via WhatsApp with your registration details for cancellation requests.",
    },
    {
      question: "What if I face technical issues during the tournament?",
      answer: "Contact our support team immediately via WhatsApp or call us during tournament hours. We have dedicated support staff to assist with technical issues.",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <AnimatedGradientText colors="from-emerald-500 via-teal-500 to-cyan-600">
              Get In Touch
            </AnimatedGradientText>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about our tournaments? We're here to help! Reach out to us and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-8 bg-gradient-card border-border/50 shadow-glow">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Send us a Message</h2>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+91 98765 43210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject *</FormLabel>
                          <FormControl>
                            <Input placeholder="Tournament Inquiry" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us how we can help you..." 
                            className="min-h-[150px] resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full shadow-lg hover:shadow-glow transition-all"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </Form>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <Card 
                key={index}
                className="p-6 bg-gradient-card border-border/50 hover:border-primary/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{info.title}</h3>
                    {info.link ? (
                      <a 
                        href={info.link}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{info.content}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {/* Social Links */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className="p-3 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="p-8 bg-gradient-card border-border/50">
            <h2 className="text-3xl font-bold mb-6 text-center">
              <AnimatedGradientText colors="from-yellow-500 via-orange-500 to-red-600">
                Frequently Asked Questions
              </AnimatedGradientText>
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
