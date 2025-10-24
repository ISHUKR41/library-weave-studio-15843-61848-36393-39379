import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import RegistrationTable from "@/components/RegistrationTable";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const isAdmin = localStorage.getItem("adminAuth");
    if (!isAdmin) {
      navigate("/admin/login");
    } else {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">
              <AnimatedGradientText colors="from-purple-500 via-pink-500 to-red-500">
                Admin Dashboard
              </AnimatedGradientText>
            </h1>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="bgmi-solo" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="bgmi-solo">BGMI Solo</TabsTrigger>
              <TabsTrigger value="bgmi-duo">BGMI Duo</TabsTrigger>
              <TabsTrigger value="bgmi-squad">BGMI Squad</TabsTrigger>
              <TabsTrigger value="freefire-solo">FF Solo</TabsTrigger>
              <TabsTrigger value="freefire-duo">FF Duo</TabsTrigger>
              <TabsTrigger value="freefire-squad">FF Squad</TabsTrigger>
            </TabsList>

            <TabsContent value="bgmi-solo">
              <RegistrationTable game="bgmi" type="solo" />
            </TabsContent>

            <TabsContent value="bgmi-duo">
              <RegistrationTable game="bgmi" type="duo" />
            </TabsContent>

            <TabsContent value="bgmi-squad">
              <RegistrationTable game="bgmi" type="squad" />
            </TabsContent>

            <TabsContent value="freefire-solo">
              <RegistrationTable game="freefire" type="solo" />
            </TabsContent>

            <TabsContent value="freefire-duo">
              <RegistrationTable game="freefire" type="duo" />
            </TabsContent>

            <TabsContent value="freefire-squad">
              <RegistrationTable game="freefire" type="squad" />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
