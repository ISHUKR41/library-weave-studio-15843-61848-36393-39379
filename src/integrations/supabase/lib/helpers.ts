/**
 * Supabase Helper Functions
 * 
 * This file contains utility functions for common Supabase operations
 * to make database interactions easier and more consistent across the app.
 */

import { supabase } from '../client';
import type { Database } from '../types';

// Type aliases for easier usage
export type BGMIRegistration = Database['public']['Tables']['bgmi_registrations']['Row'];
export type BGMIRegistrationInsert = Database['public']['Tables']['bgmi_registrations']['Insert'];
export type BGMIRegistrationUpdate = Database['public']['Tables']['bgmi_registrations']['Update'];

export type FreeFireRegistration = Database['public']['Tables']['freefire_registrations']['Row'];
export type FreeFireRegistrationInsert = Database['public']['Tables']['freefire_registrations']['Insert'];
export type FreeFireRegistrationUpdate = Database['public']['Tables']['freefire_registrations']['Update'];

export type TournamentType = 'solo' | 'duo' | 'squad';
export type RegistrationStatus = 'pending' | 'approved' | 'rejected';
export type GameType = 'bgmi' | 'freefire';

/**
 * Get registration count for a specific game and tournament type
 * @param game - 'bgmi' or 'freefire'
 * @param tournamentType - 'solo', 'duo', or 'squad'
 * @param status - Optional: filter by status (default: 'approved')
 * @returns Promise<number> - Count of registrations
 * @throws Error if database query fails
 */
export async function getRegistrationCount(
  game: GameType,
  tournamentType: TournamentType,
  status: RegistrationStatus = 'approved'
): Promise<number> {
  const table = game === 'bgmi' ? 'bgmi_registrations' : 'freefire_registrations';
  
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq('tournament_type', tournamentType)
    .eq('status', status);

  if (error) {
    console.error('Error fetching registration count:', error);
    throw new Error(`Failed to fetch registration count: ${error.message}`);
  }

  return count || 0;
}

/**
 * Get all registrations for a specific game and tournament type
 * @param game - 'bgmi' or 'freefire'
 * @param tournamentType - 'solo', 'duo', or 'squad'
 * @param status - Optional: filter by status
 * @returns Promise with registrations array
 * @throws Error if database query fails
 */
export async function getRegistrations(
  game: GameType,
  tournamentType: TournamentType,
  status?: RegistrationStatus
) {
  const table = game === 'bgmi' ? 'bgmi_registrations' : 'freefire_registrations';
  
  let query = supabase
    .from(table)
    .select('*')
    .eq('tournament_type', tournamentType)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching registrations:', error);
    throw new Error(`Failed to fetch registrations: ${error.message}`);
  }

  return data || [];
}

/**
 * Update registration status (approve/reject)
 * @param game - 'bgmi' or 'freefire'
 * @param registrationId - The ID of the registration to update
 * @param newStatus - 'approved' or 'rejected'
 * @returns Promise<void>
 * @throws Error if update fails
 */
export async function updateRegistrationStatus(
  game: GameType,
  registrationId: string,
  newStatus: 'approved' | 'rejected'
): Promise<void> {
  const table = game === 'bgmi' ? 'bgmi_registrations' : 'freefire_registrations';
  
  const { error } = await supabase
    .from(table)
    .update({ status: newStatus })
    .eq('id', registrationId);

  if (error) {
    console.error('Error updating registration status:', error);
    throw new Error(`Failed to update registration status: ${error.message}`);
  }
}

/**
 * Upload payment screenshot to Supabase Storage
 * @param file - The image file to upload
 * @returns Promise<string> - File path
 * @throws Error if upload fails
 */
export async function uploadPaymentScreenshot(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('payment-screenshots')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading screenshot:', error);
    throw new Error(`Failed to upload payment screenshot: ${error.message}`);
  }

  return fileName;
}

/**
 * Get public URL for a payment screenshot
 * @param fileName - The file name in storage
 * @returns string - Public URL
 */
export function getPaymentScreenshotUrl(fileName: string): string {
  const { data } = supabase.storage
    .from('payment-screenshots')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Create a new BGMI registration
 * @param registration - Registration data
 * @returns Promise<void>
 * @throws Error if registration creation fails
 */
export async function createBGMIRegistration(
  registration: BGMIRegistrationInsert
): Promise<void> {
  const { error } = await supabase
    .from('bgmi_registrations')
    .insert(registration);

  if (error) {
    console.error('Error creating BGMI registration:', error);
    throw new Error(`Failed to create BGMI registration: ${error.message}`);
  }
}

/**
 * Create a new Free Fire registration
 * @param registration - Registration data
 * @returns Promise<void>
 * @throws Error if registration creation fails
 */
export async function createFreeFireRegistration(
  registration: FreeFireRegistrationInsert
): Promise<void> {
  const { error } = await supabase
    .from('freefire_registrations')
    .insert(registration);

  if (error) {
    console.error('Error creating Free Fire registration:', error);
    throw new Error(`Failed to create Free Fire registration: ${error.message}`);
  }
}

/**
 * Get tournament slot limits based on game and type
 * @param game - 'bgmi' or 'freefire'
 * @param tournamentType - 'solo', 'duo', or 'squad'
 * @returns number - Maximum slots allowed
 */
export function getTournamentSlotLimit(
  game: GameType,
  tournamentType: TournamentType
): number {
  const limits = {
    bgmi: {
      solo: 100,
      duo: 50,
      squad: 25,
    },
    freefire: {
      solo: 48,
      duo: 24,
      squad: 12,
    },
  };

  return limits[game][tournamentType];
}

/**
 * Check if tournament has available slots
 * @param game - 'bgmi' or 'freefire'
 * @param tournamentType - 'solo', 'duo', or 'squad'
 * @returns Promise<boolean> - True if slots available
 */
export async function hasSlotsAvailable(
  game: GameType,
  tournamentType: TournamentType
): Promise<boolean> {
  const currentCount = await getRegistrationCount(game, tournamentType, 'approved');
  const maxSlots = getTournamentSlotLimit(game, tournamentType);
  
  return currentCount < maxSlots;
}
