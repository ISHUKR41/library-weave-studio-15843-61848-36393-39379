import { z } from "zod";

// Base schemas
export const basePlayerSchema = z.object({
  teamLeaderName: z.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),
  teamLeaderId: z.string()
    .trim()
    .min(5, "Game ID must be at least 5 characters")
    .max(20, "Game ID must be less than 20 characters")
    .regex(/^\d+$/, "Game ID must contain only numbers"),
  whatsapp: z.string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter valid 10-digit Indian mobile number"),
  transactionId: z.string()
    .trim()
    .min(8, "Transaction ID must be at least 8 characters")
    .max(50, "Transaction ID must be less than 50 characters"),
  youtubeVote: z.boolean().default(true),
});

export const additionalPlayerSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),
  id: z.string()
    .trim()
    .min(5, "Game ID must be at least 5 characters")
    .max(20, "Game ID must be less than 20 characters")
    .regex(/^\d+$/, "Game ID must contain only numbers"),
});

// BGMI Schemas
export const bgmiSoloSchema = basePlayerSchema;

export const bgmiDuoSchema = basePlayerSchema.extend({
  teamName: z.string()
    .trim()
    .min(3, "Team name must be at least 3 characters")
    .max(30, "Team name must be less than 30 characters")
    .regex(/^[a-zA-Z0-9\s]+$/, "Team name should only contain letters and numbers"),
  player2Name: z.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),
  player2Id: z.string()
    .trim()
    .min(5, "Game ID must be at least 5 characters")
    .max(20, "Game ID must be less than 20 characters"),
});

export const bgmiSquadSchema = bgmiDuoSchema.extend({
  player3Name: z.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),
  player3Id: z.string()
    .trim()
    .min(5, "Game ID must be at least 5 characters")
    .max(20, "Game ID must be less than 20 characters"),
  player4Name: z.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),
  player4Id: z.string()
    .trim()
    .min(5, "Game ID must be at least 5 characters")
    .max(20, "Game ID must be less than 20 characters"),
});

// Free Fire Schemas
export const freeFireSoloSchema = basePlayerSchema;

export const freeFireDuoSchema = basePlayerSchema.extend({
  teamName: z.string()
    .trim()
    .min(3, "Team name must be at least 3 characters")
    .max(30, "Team name must be less than 30 characters")
    .regex(/^[a-zA-Z0-9\s]+$/, "Team name should only contain letters and numbers"),
  player2Name: z.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),
  player2Id: z.string()
    .trim()
    .min(5, "Game ID must be at least 5 characters")
    .max(20, "Game ID must be less than 20 characters"),
});

export const freeFireSquadSchema = freeFireDuoSchema.extend({
  player3Name: z.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),
  player3Id: z.string()
    .trim()
    .min(5, "Game ID must be at least 5 characters")
    .max(20, "Game ID must be less than 20 characters"),
  player4Name: z.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),
  player4Id: z.string()
    .trim()
    .min(5, "Game ID must be at least 5 characters")
    .max(20, "Game ID must be less than 20 characters"),
});
