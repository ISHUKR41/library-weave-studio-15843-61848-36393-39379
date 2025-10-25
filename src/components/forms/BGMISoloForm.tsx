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
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import pubgQR from "@/assets/pubg_qr.jpg";
import { useDropzone } from "react-dropzone";
import { bgmiSoloSchema } from "@/lib/validationSchemas";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";

type BGMISoloFormData = z.infer<typeof bgmiSoloSchema>;

interface BGMISoloFormProps {
  entryFee: number;
}

const BGMISoloForm = ({ entryFee }: BGMISoloFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<BGMISoloFormData>({
    resolver: zodResolver(bgmiSoloSchema),
    mode: "onChange",
    defaultValues: {
      youtubeVote: true
    }
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

  const onSubmit = async (formData: BGMISoloFormData) => {
    console.log("Starting BGMI Solo registration submission...");
    console.log("Form data:", formData);
    
    if (!isSupabaseConfigured()) {
      toast.error("Registration system is not configured. Please contact the administrator.");
      return;
    }
    
    if (!screenshot) {
      console.error("Screenshot validation failed: No screenshot file");
      toast.error("Please upload payment screenshot");
      return;
    }

    console.log("Screenshot file:", { 
      name: screenshot.name, 
      size: screenshot.size, 
      type: screenshot.type 
    });

    setIsSubmitting(true);
    try {
      console.log("Step 1: Uploading screenshot to Supabase Storage...");
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      console.log("Generated filename:", fileName);
      
      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, screenshot);

      if (uploadError) {
        console.error("Screenshot upload error:", uploadError);
        throw new Error(`Failed to upload screenshot: ${uploadError.message}`);
      }

      console.log("Screenshot uploaded successfully!");
      console.log("Step 2: Inserting registration to database...");

      const registrationData = {
        tournament_type: 'solo' as const,
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
        payment_screenshot_url: fileName,
        transaction_id: formData.transactionId,
        youtube_streaming_vote: formData.youtubeVote,
      };

      console.log("Registration data to insert:", registrationData);

      const { error: insertError } = await supabase
        .from('bgmi_registrations')
        .insert(registrationData);

      if (insertError) {
        console.error("Database insertion error:", insertError);
        throw new Error(`Failed to save registration: ${insertError.message}`);
      }

      console.log("Registration saved to database successfully!");
      console.log("Step 3: Success! Resetting form...");
      
      toast.success("Registration submitted successfully! Awaiting admin approval");
      reset();
      setScreenshot(null);
      setScreenshotPreview("");
      
      console.log("Step 4: Invalidating React Query cache...");
      queryClient.invalidateQueries({ queryKey: ['bgmi-solo-count'] });
      console.log("BGMI Solo registration complete!");
    } catch (error: any) {
      console.error("Registration submission failed:", error);
      const errorMessage = error.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      console.log("Submission process ended");
    }
  };

  const youtubeVote = watch("youtubeVote");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6 md:p-8 bg-gradient-card border-border/50" data-testid="card-bgmi-solo-form">
        <h2 className="text-2xl font-bold mb-6" data-testid="text-form-title">BGMI Solo Registration</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Player Details</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamLeaderName">Full Name *</Label>
                <Input
                  id="teamLeaderName"
                  data-testid="input-team-leader-name"
                  {...register("teamLeaderName")}
                  placeholder="Enter your full name"
                  className="bg-background/50"
                />
                {errors.teamLeaderName && (
                  <p className="text-sm text-destructive">{errors.teamLeaderName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamLeaderId">Player ID *</Label>
                <Input
                  id="teamLeaderId"
                  data-testid="input-team-leader-id"
                  {...register("teamLeaderId")}
                  placeholder="Enter your player ID"
                  className="bg-background/50"
                />
                {errors.teamLeaderId && (
                  <p className="text-sm text-destructive">{errors.teamLeaderId.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number *</Label>
              <Input
                id="whatsapp"
                data-testid="input-whatsapp"
                {...register("whatsapp")}
                placeholder="Enter WhatsApp number"
                className="bg-background/50"
              />
              {errors.whatsapp && (
                <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Payment Details</h3>
            <p className="text-sm text-muted-foreground">Entry Fee: ₹{entryFee}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>UPI QR Code</Label>
                <div className="border border-border rounded-lg p-4 bg-background/50">
                  <img 
                    src={pubgQR} 
                    alt="Payment QR Code" 
                    className="w-full max-w-xs mx-auto rounded-lg"
                    data-testid="img-qr-code"
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Scan to pay ₹{entryFee}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction ID *</Label>
                  <Input
                    id="transactionId"
                    data-testid="input-transaction-id"
                    {...register("transactionId")}
                    placeholder="Enter transaction ID"
                    className="bg-background/50"
                  />
                  {errors.transactionId && (
                    <p className="text-sm text-destructive">{errors.transactionId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Upload Payment Screenshot *</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                      ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
                      ${screenshotPreview ? 'bg-background/50' : 'bg-background/30'}`}
                    data-testid="dropzone-screenshot"
                  >
                    <input {...getInputProps()} />
                    {screenshotPreview ? (
                      <div className="space-y-2">
                        <img src={screenshotPreview} alt="Screenshot preview" className="max-h-32 mx-auto rounded" data-testid="img-screenshot-preview" />
                        <p className="text-sm text-muted-foreground">Click to change</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {isDragActive ? 'Drop the image here' : 'Drag & drop or click to select'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="youtubeVote"
              data-testid="checkbox-youtube-vote"
              checked={youtubeVote}
              onCheckedChange={(checked) => setValue("youtubeVote", checked as boolean)}
            />
            <Label 
              htmlFor="youtubeVote"
              className="text-sm font-normal cursor-pointer"
            >
              I want this tournament to be streamed on YouTube
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            data-testid="button-submit"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Registration'
            )}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default BGMISoloForm;
