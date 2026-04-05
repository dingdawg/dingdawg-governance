import { z } from "zod";
import { governanceClient, DegradedResponse } from "../api/client.js";

/** Input schema for the validate_action tool. */
export const ValidateActionInputSchema = z.object({
  /** Category of the action being validated (e.g. "file_write", "api_call", "database_delete"). */
  action_type: z.string().min(1, "action_type is required"),

  /** The resource the action targets (e.g. a file path, table name, or service URL). */
  resource: z.string().min(1, "resource is required"),

  /**
   * Scope or environment in which the action will execute.
   * Examples: "production", "staging", "development".
   */
  scope: z.string().min(1, "scope is required"),

  /**
   * Optional metadata providing additional context for the governance policy evaluation.
   * Use this to pass caller identity, session IDs, or risk signals.
   */
  metadata: z.record(z.unknown()).optional().default({}),
});

export type ValidateActionInput = z.infer<typeof ValidateActionInputSchema>;

/** Response shape returned by the Governance API for a validation request. */
export interface ValidateActionResponse {
  /** Whether the action is permitted under the current governance policy. */
  allowed: boolean;
  /** Human-readable explanation of the decision. */
  reason: string;
  /** Opaque identifier for this validation event; pass to generate_receipt on completion. */
  receipt_id: string;
  /** Non-blocking advisory messages (policy suggestions, risk signals). */
  warnings: string[];
}

/**
 * Validates a proposed action against DingDawg Governance policies.
 *
 * Call this tool BEFORE executing any consequential action (file writes,
 * API calls, database mutations). The returned `receipt_id` must be passed
 * to `generate_receipt` after the action completes to close the audit loop.
 *
 * In degraded mode (API unreachable), the action is allowed without a receipt
 * so that developer workflows are never blocked.
 *
 * @param input - Validated input conforming to ValidateActionInputSchema
 * @returns Governance decision including allowed flag, reason, receipt_id, and warnings
 */
export async function validateAction(
  input: ValidateActionInput
): Promise<ValidateActionResponse | DegradedResponse> {
  const response = await governanceClient.post<ValidateActionResponse>(
    "/v1/validate",
    {
      action_type: input.action_type,
      resource: input.resource,
      scope: input.scope,
      metadata: input.metadata,
    }
  );

  return response;
}
