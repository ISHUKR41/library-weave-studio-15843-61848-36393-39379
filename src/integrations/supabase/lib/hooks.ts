/**
 * React Query Hooks for Supabase
 * 
 * Custom hooks that integrate Supabase with React Query
 * for efficient data fetching and caching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getRegistrationCount,
  getRegistrations,
  updateRegistrationStatus,
  createBGMIRegistration,
  createFreeFireRegistration,
  uploadPaymentScreenshot,
  hasSlotsAvailable,
  type GameType,
  type TournamentType,
  type RegistrationStatus,
  type BGMIRegistrationInsert,
  type FreeFireRegistrationInsert,
} from './helpers';

/**
 * Hook to fetch registration count with auto-refetch
 * @param game - 'bgmi' or 'freefire'
 * @param tournamentType - 'solo', 'duo', or 'squad'
 * @param status - Optional: filter by status (default: 'approved')
 */
export function useRegistrationCount(
  game: GameType,
  tournamentType: TournamentType,
  status: RegistrationStatus = 'approved'
) {
  return useQuery({
    queryKey: [`${game}-${tournamentType}-count`, status],
    queryFn: () => getRegistrationCount(game, tournamentType, status),
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    staleTime: 3000, // Consider data stale after 3 seconds
  });
}

/**
 * Hook to fetch all registrations
 * @param game - 'bgmi' or 'freefire'
 * @param tournamentType - 'solo', 'duo', or 'squad'
 * @param status - Optional: filter by status
 */
export function useRegistrations(
  game: GameType,
  tournamentType: TournamentType,
  status?: RegistrationStatus
) {
  return useQuery({
    queryKey: [`${game}-${tournamentType}-registrations`, status],
    queryFn: () => getRegistrations(game, tournamentType, status),
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

/**
 * Hook to check slot availability
 * @param game - 'bgmi' or 'freefire'
 * @param tournamentType - 'solo', 'duo', or 'squad'
 */
export function useSlotAvailability(
  game: GameType,
  tournamentType: TournamentType
) {
  return useQuery({
    queryKey: [`${game}-${tournamentType}-slots-available`],
    queryFn: () => hasSlotsAvailable(game, tournamentType),
    refetchInterval: 5000,
  });
}

/**
 * Hook to update registration status (approve/reject)
 * @param game - 'bgmi' or 'freefire'
 */
export function useUpdateRegistrationStatus(game: GameType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      registrationId,
      newStatus,
    }: {
      registrationId: string;
      newStatus: 'approved' | 'rejected';
    }) => {
      const success = await updateRegistrationStatus(game, registrationId, newStatus);
      if (!success) {
        throw new Error('Failed to update registration status');
      }
      return success;
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`${game}`] });
      
      const statusText = variables.newStatus === 'approved' ? 'approved' : 'rejected';
      toast.success(`Registration ${statusText} successfully!`);
    },
    onError: (error) => {
      toast.error(`Failed to update registration: ${error.message}`);
    },
  });
}

/**
 * Hook to submit BGMI registration
 */
export function useSubmitBGMIRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      registration,
      screenshot,
    }: {
      registration: Omit<BGMIRegistrationInsert, 'payment_screenshot_url'>;
      screenshot: File;
    }) => {
      // Upload screenshot first
      const fileName = await uploadPaymentScreenshot(screenshot);
      if (!fileName) {
        throw new Error('Failed to upload payment screenshot');
      }

      // Create registration with screenshot URL
      const success = await createBGMIRegistration({
        ...registration,
        payment_screenshot_url: fileName,
      });

      if (!success) {
        throw new Error('Failed to create registration');
      }

      return success;
    },
    onSuccess: (_, variables) => {
      // Invalidate count queries to update slot availability
      queryClient.invalidateQueries({ 
        queryKey: [`bgmi-${variables.registration.tournament_type}-count`] 
      });
      
      toast.success('Registration submitted successfully! Awaiting admin approval');
    },
    onError: (error) => {
      toast.error(`Registration failed: ${error.message}`);
    },
  });
}

/**
 * Hook to submit Free Fire registration
 */
export function useSubmitFreeFireRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      registration,
      screenshot,
    }: {
      registration: Omit<FreeFireRegistrationInsert, 'payment_screenshot_url'>;
      screenshot: File;
    }) => {
      // Upload screenshot first
      const fileName = await uploadPaymentScreenshot(screenshot);
      if (!fileName) {
        throw new Error('Failed to upload payment screenshot');
      }

      // Create registration with screenshot URL
      const success = await createFreeFireRegistration({
        ...registration,
        payment_screenshot_url: fileName,
      });

      if (!success) {
        throw new Error('Failed to create registration');
      }

      return success;
    },
    onSuccess: (_, variables) => {
      // Invalidate count queries to update slot availability
      queryClient.invalidateQueries({ 
        queryKey: [`freefire-${variables.registration.tournament_type}-count`] 
      });
      
      toast.success('Registration submitted successfully! Awaiting admin approval');
    },
    onError: (error) => {
      toast.error(`Registration failed: ${error.message}`);
    },
  });
}
