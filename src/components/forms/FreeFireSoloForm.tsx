import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import pubgQR from "@/assets/pubg_qr.jpg";
import { useDropzone } from "react-dropzone";
import { freeFireSoloSchema } from "@/lib/validationSchemas";
import { z } from "zod";

type FreeFireSoloFormData = z.infer<typeof freeFireSoloSchema>;

interface FreeFireSoloFormProps {
  entryFee: number;
}

const FreeFireSoloForm = ({ entryFee }: FreeFireSoloFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FreeFireSoloFormData>({
    resolver: zodResolver(freeFireSoloSchema),
    mode: "onChange"
  });
  const queryClient = useQueryClient();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setScreenshot(acceptedFiles[0]);
        setScreenshotPreview(URL.createObjectURL(acceptedFiles[0]));
      }
    },
  });

  const onSubmit = async (formData: FreeFireSoloFormData) => {
    console.log("FreeFire Solo form submission started", formData);
    
    if (!screenshot) {
      toast.error("Please upload payment screenshot");
      console.error("No screenshot uploaded");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Uploading screenshot...");
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, screenshot);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("Screenshot uploaded successfully, inserting data...");
      const path = fileName;

      const { error: insertError } = await (supabase as any)
        .from('freefire_registrations')
        .insert({
          tournament_type: 'solo',
          team_name: null,
          team_leader_name: formData.teamLeaderName,
          team_leader_id: formData.teamLeaderId,
          team_leader_whatsapp: formData.whatsapp,
          player2_name: null,
          player2_id: null,
          player3_name: null,
          player3_id: null,
          player4_name: null,
          player4_id: null,
          payment_screenshot_url: path,
          transaction_id: formData.transactionId,
          youtube_streaming_vote: formData.youtubeVote,
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      console.log("Registration successful!");
      toast.success("Registration submitted successfully! Awaiting admin approval");
      reset();
      setScreenshot(null);
      setScreenshotPreview("");
      queryClient.invalidateQueries({ queryKey: ['freefire-solo-count'] });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6 md:p-8 bg-gradient-card border-border/50">
        <h2 className="text-2xl font-bold mb-6">Free Fire Solo Registration</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Player Details</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamLeaderName">Full Name *</Label>
                <Input
                  id="teamLeaderName"
                  {...register("teamLeaderName")}
                  placeholder="Enter full name"
                  className="bg-background"
                />
                {errors.teamLeaderName && (
                  <p className="text-sm text-destructive">{errors.teamLeaderName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamLeaderId">Game ID *</Label>
                 <Input
                   id="teamLeaderId"
                   type="tel"
                   inputMode="numeric"
                   pattern="[0-9]*"
                   {...register("teamLeaderId")}
                   placeholder="Enter game ID"
                   className="bg-background"
                   onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g,'').slice(0,20); }}
                 />
                {errors.teamLeaderId && (
                  <p className="text-sm text-destructive">{errors.teamLeaderId.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                 <Input
                   id="whatsapp"
                   type="tel"
                   inputMode="numeric"
                   pattern="[0-9]{10}"
                   {...register("whatsapp")}
                   placeholder="Enter 10-digit WhatsApp number"
                   className="bg-background"
                   maxLength={10}
                   onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g,'').slice(0,10); }}
                 />
                {errors.whatsapp && (
                  <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-primary">Payment Details</h3>
            
            <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg">
              <p className="text-center font-semibold">Scan QR to Pay ₹{entryFee}</p>
              <img 
                src={pubgQR} 
                alt="Payment QR Code" 
                className="w-64 h-64 object-contain border-4 border-primary rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID *</Label>
              <Input
                id="transactionId"
                {...register("transactionId")}
                placeholder="Enter UPI transaction ID"
                className="bg-background"
              />
              {errors.transactionId && (
                <p className="text-sm text-destructive">{errors.transactionId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Payment Screenshot *</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive
                    ? "Drop the screenshot here"
                    : "Drag & drop payment screenshot or click to browse"}
                </p>
              </div>
              {screenshotPreview && (
                <div className="mt-4">
                  <img src={screenshotPreview} alt="Preview" className="w-full max-w-md mx-auto rounded-lg border border-border" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-primary">Additional Options</h3>
            <div className="flex items-center space-x-2 p-4 bg-background rounded-lg border border-border">
              <input
                type="checkbox"
                id="youtubeVote"
                {...register("youtubeVote")}
                defaultChecked={true}
                className="h-5 w-5 rounded border-primary text-primary focus:ring-primary"
              />
              <Label htmlFor="youtubeVote" className="text-base cursor-pointer">
                I want this match to be streamed on YouTube
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Registration"
            )}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default FreeFireSoloForm;
