import { z } from "zod";
import { governanceClient, DegradedResponse } from "../api/client.js";

/** Input schema for the check_status tool. No inputs required. */
export const CheckStatusInputSchema = z.object({});

export type CheckStatusInput = z.infer<typeof CheckStatusInputSchema>;

/** Response shape returned by the Governance API for status checks. */
export interface CheckStatusResponse {
  /** The account's current subscription plan name (e.g. "Free", "Pro", "Enterprise"). */
  plan: string;
  /** Number of governance API calls consumed in the current billing period. */
  usage: number;
  /** Maximum governance API calls allowed in the current billing period. */
  limit: number;
  /** Total number of receipts generated across all time for this account. */
  receipts_generated: number;
  /** Number of rollback snapshots currently stored and available for restore. */
  rollbacks_available: number;
  /**
   * Overall system health indicator.
   * - "healthy": all systems operational
   * - "degraded": partial outage, some features unavailable
   * - "down": major outage in progress
   */
  system_health: "healthy" | "degraded" | "down";
}

/**
 * Retrieves the current governance account status and system health.
 *
 * Use this tool to check your plan limits before kicking off high-volume
 * operations, verify that the Governance API is reachable, or surface
 * account usage metrics in dashboards and monitoring tooling.
 *
 * No input parameters are required; authentication is read from the
 * configured API key.
 *
 * @param _input - Empty input (no parameters required)
 * @returns Account status including plan, usage counters, and system health
 */
export async function checkStatus(
  _input: CheckStatusInput
): Promise<CheckStatusResponse | DegradedResponse> {
  const response = await governanceClient.get<CheckStatusResponse>("/v1/status");
  return response;
}
