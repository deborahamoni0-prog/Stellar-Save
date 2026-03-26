/**
 * API utilities for group operations.
 * TODO: replace stubs with actual Soroban contract invocations.
 */

import type { GroupDetail, PublicGroup, GroupFilters } from '../types/group';

// Re-export so existing imports keep working
export type { PublicGroup, GroupDetail };

export interface GroupData {
  name: string;
  description: string;
  contribution_amount: number; // stroops = XLM * 10_000_000
  cycle_duration: number;      // seconds
  max_members: number;
  min_members: number;
}

export async function createGroup(data: GroupData): Promise<string> {
  // stub — returns a mock group ID
  void data;
  return Promise.resolve('mock-group-id');
}

/**
 * Fetch all public groups from the contract.
 * The `filters` param is accepted now so the signature is ready for the real
 * Soroban call; the stub ignores it and returns an empty list.
 */
export async function fetchGroups(_filters?: Partial<GroupFilters>): Promise<PublicGroup[]> {
  // stub — TODO: replace with actual Soroban contract invocation
  return Promise.resolve([]);
}

/**
 * Fetch a single group by ID from the contract.
 * Stub returns null (not found); replace with actual Soroban `get_group` call.
 */
export async function fetchGroup(_groupId: string): Promise<GroupDetail | null> {
  // stub — TODO: replace with actual Soroban contract invocation (get_group)
  return Promise.resolve(null);
}
