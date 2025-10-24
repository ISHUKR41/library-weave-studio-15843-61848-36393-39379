import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import RegistrationTable from "@/components/RegistrationTable";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin");
    } else {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin");
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
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage tournament registrations and approvals
              </p>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline"
              className="group hover:border-destructive hover:text-destructive transition-all"
            >
              <LogOut className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="bgmi" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
              <TabsTrigger value="bgmi" className="text-base font-semibold">
                BGMI Tournaments
              </TabsTrigger>
              <TabsTrigger value="freefire" className="text-base font-semibold">
                Free Fire Tournaments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bgmi" className="space-y-6">
              <Tabs defaultValue="solo" className="space-y-6">
                <TabsList className="grid w-full max-w-lg grid-cols-3">
                  <TabsTrigger value="solo">Solo</TabsTrigger>
                  <TabsTrigger value="duo">Duo</TabsTrigger>
                  <TabsTrigger value="squad">Squad</TabsTrigger>
                </TabsList>

                <TabsContent value="solo">
                  <RegistrationTable game="bgmi" type="solo" />
                </TabsContent>
                <TabsContent value="duo">
                  <RegistrationTable game="bgmi" type="duo" />
                </TabsContent>
                <TabsContent value="squad">
                  <RegistrationTable game="bgmi" type="squad" />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="freefire" className="space-y-6">
              <Tabs defaultValue="solo" className="space-y-6">
                <TabsList className="grid w-full max-w-lg grid-cols-3">
                  <TabsTrigger value="solo">Solo</TabsTrigger>
                  <TabsTrigger value="duo">Duo</TabsTrigger>
                  <TabsTrigger value="squad">Squad</TabsTrigger>
                </TabsList>

                <TabsContent value="solo">
                  <RegistrationTable game="freefire" type="solo" />
                </TabsContent>
                <TabsContent value="duo">
                  <RegistrationTable game="freefire" type="duo" />
                </TabsContent>
                <TabsContent value="squad">
                  <RegistrationTable game="freefire" type="squad" />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
