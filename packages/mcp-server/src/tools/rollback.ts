import { z } from "zod";
import { governanceClient, DegradedResponse } from "../api/client.js";

/** Input schema for the capture_rollback_state tool. */
export const CaptureRollbackStateInputSchema = z.object({
  /**
   * Identifier for the resource whose state should be snapshotted.
   * Examples: a file path, database table name, S3 object key, or API resource ID.
   */
  resource: z.string().min(1, "resource is required"),

  /**
   * The category of resource being snapshotted. Used to select the correct
   * snapshot strategy server-side.
   * Examples: "file", "database_table", "api_resource", "environment_config".
   */
  resource_type: z.string().min(1, "resource_type is required"),
});

export type CaptureRollbackStateInput = z.infer<typeof CaptureRollbackStateInputSchema>;

/** Response shape returned by the Governance API after capturing a rollback snapshot. */
export interface CaptureRollbackStateResponse {
  /** Opaque identifier for the captured snapshot. Use this ID to trigger a rollback. */
  snapshot_id: string;
  /** Whether the snapshot was successfully captured. */
  captured: boolean;
  /**
   * ISO 8601 timestamp after which the snapshot will be automatically purged.
   * Snapshots are retained for a period determined by the account plan.
   */
  expiry: string;
}

/**
 * Captures a point-in-time snapshot of a resource's state for rollback purposes.
 *
 * Call this tool before executing any destructive or hard-to-reverse action.
 * The returned `snapshot_id` can later be passed to the Governance API to
 * restore the resource to its pre-action state.
 *
 * When `auto_rollback_capture` is enabled in the config, this is called
 * automatically as part of the validate_action flow.
 *
 * @param input - Validated input conforming to CaptureRollbackStateInputSchema
 * @returns Snapshot record including ID, capture status, and expiry time
 */
export async function captureRollbackState(
  input: CaptureRollbackStateInput
): Promise<CaptureRollbackStateResponse | DegradedResponse> {
  const response = await governanceClient.post<CaptureRollbackStateResponse>(
    "/v1/rollback",
    {
      resource: input.resource,
      resource_type: input.resource_type,
    }
  );

  return response;
}
