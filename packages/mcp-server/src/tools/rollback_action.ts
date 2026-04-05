import { z } from "zod";
import { governanceClient, DegradedResponse } from "../api/client.js";

/** Input schema for the rollback_action tool. */
export const RollbackActionInputSchema = z.object({
  /**
   * The receipt ID of the action to roll back.
   * Obtained from a prior generate_receipt response (e.g. "ddgr_01HXYZ...").
   */
  receipt_id: z.string().min(1, "receipt_id is required"),

  /**
   * Whether to execute the rollback immediately.
   * Set to false to perform a dry-run that shows what would be restored
   * without actually executing the rollback.
   * Defaults to true.
   */
  execute: z.boolean().default(true),
});

export type RollbackActionInput = z.infer<typeof RollbackActionInputSchema>;

/** Response shape returned after a rollback attempt. */
export interface RollbackActionResponse {
  /** Whether the rollback was executed (false if dry_run). */
  executed: boolean;
  /** Whether the rollback completed successfully. */
  success: boolean;
  /** The receipt ID that was rolled back. */
  receipt_id: string;
  /** A new receipt ID created to record this rollback event. */
  rollback_receipt_id: string;
  /** Human-readable summary of what was restored. */
  summary: string;
  /** ISO 8601 timestamp when the rollback completed. */
  completed_at: string;
  /** Optional list of resources that were restored. */
  restored_resources?: string[];
}

/**
 * Executes a rollback for a previously governed action.
 *
 * Calls POST /v1/rollback with the receipt_id and execute flag.
 * The server locates the rollback snapshot associated with the receipt,
 * restores the captured state, and returns a new rollback receipt.
 *
 * If execute=false, performs a dry-run: returns what would be restored
 * without modifying any resources.
 *
 * @param input - Validated input conforming to RollbackActionInputSchema
 * @returns Rollback result including success status and new receipt ID
 */
export async function rollbackAction(
  input: RollbackActionInput
): Promise<RollbackActionResponse | DegradedResponse> {
  const response = await governanceClient.post<RollbackActionResponse>(
    "/v1/rollback",
    {
      action_id: input.receipt_id,
      reason: "User-initiated rollback via MCP",
      dry_run: !input.execute,
    }
  );

  return response;
}
