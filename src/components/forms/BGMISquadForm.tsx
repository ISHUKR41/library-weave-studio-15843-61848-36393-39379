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
import { bgmiSquadSchema } from "@/lib/validationSchemas";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";

type BGMISquadFormData = z.infer<typeof bgmiSquadSchema>;

interface BGMISquadFormProps {
  entryFee: number;
}

const BGMISquadForm = ({ entryFee }: BGMISquadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<BGMISquadFormData>({
    resolver: zodResolver(bgmiSquadSchema),
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

  const onSubmit = async (formData: BGMISquadFormData) => {
    console.log("Starting BGMI Squad registration submission...");
    console.log("Form data:", formData);
    
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
        tournament_type: 'squad' as const,
        team_name: formData.teamName,
        team_leader_name: formData.teamLeaderName,
        team_leader_id: formData.teamLeaderId,
        team_leader_whatsapp: formData.whatsapp,
        player2_name: formData.player2Name,
        player2_id: formData.player2Id,
        player3_name: formData.player3Name,
        player3_id: formData.player3Id,
        player4_name: formData.player4Name,
        player4_id: formData.player4Id,
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
      queryClient.invalidateQueries({ queryKey: ['bgmi-squad-count'] });
      console.log("BGMI Squad registration complete!");
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
      <Card className="p-6 md:p-8 bg-gradient-card border-border/50" data-testid="card-bgmi-squad-form">
        <h2 className="text-2xl font-bold mb-6" data-testid="text-form-title">BGMI Squad Registration</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name *</Label>
            <Input
              id="teamName"
              data-testid="input-team-name"
              {...register("teamName")}
              placeholder="Enter team name"
              className="bg-background"
            />
            {errors.teamName && (
              <p className="text-sm text-destructive">{errors.teamName.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Team Leader Details</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamLeaderName">Full Name *</Label>
                <Input
                  id="teamLeaderName"
                  data-testid="input-team-leader-name"
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
                  data-testid="input-team-leader-id"
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
                  data-testid="input-whatsapp"
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Player 2 Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="player2Name">Full Name *</Label>
                <Input
                  id="player2Name"
                  data-testid="input-player2-name"
                  {...register("player2Name")}
                  placeholder="Enter full name"
                  className="bg-background"
                />
                {errors.player2Name && (
                  <p className="text-sm text-destructive">{errors.player2Name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="player2Id">Game ID *</Label>
                 <Input
                  id="player2Id"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  {...register("player2Id")}
                  placeholder="Enter game ID"
                  className="bg-background"
                  onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g,'').slice(0,20); }}
                 />
                {errors.player2Id && (
                  <p className="text-sm text-destructive">{errors.player2Id.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Player 3 Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="player3Name">Full Name *</Label>
                <Input
                  id="player3Name"
                  {...register("player3Name")}
                  placeholder="Enter full name"
                  className="bg-background"
                />
                {errors.player3Name && (
                  <p className="text-sm text-destructive">{errors.player3Name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="player3Id">Game ID *</Label>
                 <Input
                  id="player3Id"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  {...register("player3Id")}
                  placeholder="Enter game ID"
                  className="bg-background"
                  onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g,'').slice(0,20); }}
                 />
                {errors.player3Id && (
                  <p className="text-sm text-destructive">{errors.player3Id.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Player 4 Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="player4Name">Full Name *</Label>
                <Input
                  id="player4Name"
                  {...register("player4Name")}
                  placeholder="Enter full name"
                  className="bg-background"
                />
                {errors.player4Name && (
                  <p className="text-sm text-destructive">{errors.player4Name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="player4Id">Game ID *</Label>
                 <Input
                  id="player4Id"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  {...register("player4Id")}
                  placeholder="Enter game ID"
                  className="bg-background"
                  onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g,'').slice(0,20); }}
                 />
                {errors.player4Id && (
                  <p className="text-sm text-destructive">{errors.player4Id.message}</p>
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
                data-testid="img-qr-code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID *</Label>
              <Input
                id="transactionId"
                data-testid="input-transaction-id"
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
                data-testid="dropzone-screenshot"
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
                  <img src={screenshotPreview} alt="Preview" className="w-full max-w-md mx-auto rounded-lg border border-border" data-testid="img-screenshot-preview" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-primary">Additional Options</h3>
            <div className="flex items-center space-x-2 p-4 bg-background rounded-lg border border-border">
              <Checkbox
                id="youtubeVote"
                data-testid="checkbox-youtube-vote"
                checked={youtubeVote}
                onCheckedChange={(checked) => setValue("youtubeVote", checked as boolean)}
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
            data-testid="button-submit"
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

export default BGMISquadForm;
