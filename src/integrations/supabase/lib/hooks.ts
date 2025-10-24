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
 * @param tournamentType - 'solo', 'duo', or 'squad'
 */
export function useUpdateRegistrationStatus(
  game: GameType,
  tournamentType: TournamentType
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      registrationId,
      newStatus,
    }: {
      registrationId: string;
      newStatus: 'approved' | 'rejected';
    }) => {
      await updateRegistrationStatus(game, registrationId, newStatus);
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries to refresh data with proper query key matching
      queryClient.invalidateQueries({ 
        queryKey: [`${game}-${tournamentType}-registrations`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`${game}-${tournamentType}-count`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`${game}-${tournamentType}-slots-available`] 
      });
      
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

      // Create registration with screenshot URL
      await createBGMIRegistration({
        ...registration,
        payment_screenshot_url: fileName,
      });
    },
    onSuccess: (_, variables) => {
      const tournamentType = variables.registration.tournament_type;
      
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({ 
        queryKey: [`bgmi-${tournamentType}-count`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`bgmi-${tournamentType}-registrations`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`bgmi-${tournamentType}-slots-available`] 
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

      // Create registration with screenshot URL
      await createFreeFireRegistration({
        ...registration,
        payment_screenshot_url: fileName,
      });
    },
    onSuccess: (_, variables) => {
      const tournamentType = variables.registration.tournament_type;
      
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({ 
        queryKey: [`freefire-${tournamentType}-count`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`freefire-${tournamentType}-registrations`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`freefire-${tournamentType}-slots-available`] 
      });
      
      toast.success('Registration submitted successfully! Awaiting admin approval');
    },
    onError: (error) => {
      toast.error(`Registration failed: ${error.message}`);
    },
  });
}
