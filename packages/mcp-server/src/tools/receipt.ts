import { z } from "zod";
import { governanceClient, DegradedResponse } from "../api/client.js";

/** Input schema for the generate_receipt tool. */
export const GenerateReceiptInputSchema = z.object({
  /**
   * The receipt_id returned by a prior validate_action call.
   * Links this outcome record to the original governance decision.
   */
  validation_receipt_id: z.string().min(1, "validation_receipt_id is required"),

  /**
   * The outcome of the action.
   * - "success": action completed without error
   * - "failure": action failed or was aborted
   * - "partial": action completed with partial results
   */
  outcome: z.enum(["success", "failure", "partial"]),

  /**
   * SHA-256 hex digest of the action's output for tamper-evident chaining.
   * Leave empty string if the action produced no output.
   */
  output_hash: z.string().default(""),

  /** Wall-clock duration of the action in milliseconds. */
  duration_ms: z.number().int().min(0).default(0),

  /**
   * Optional metadata to attach to the receipt (e.g. error messages,
   * output summaries, agent identifiers).
   */
  metadata: z.record(z.unknown()).optional().default({}),
});

export type GenerateReceiptInput = z.infer<typeof GenerateReceiptInputSchema>;

/** Response shape returned by the Governance API when a receipt is created. */
export interface GenerateReceiptResponse {
  /** Permanent identifier for this receipt in the audit chain. */
  receipt_id: string;
  /**
   * Cryptographic hash linking this receipt to all prior receipts in the chain.
   * Enables tamper detection across the full audit history.
   */
  receipt_chain_hash: string;
  /** ISO 8601 timestamp when the receipt was committed server-side. */
  timestamp: string;
  /** Whether a rollback snapshot is available for this action. */
  rollback_available: boolean;
}

/**
 * Generates a tamper-evident audit receipt after an action completes.
 *
 * Call this tool immediately after any action that was pre-approved by
 * `validate_action`. Passing the original `validation_receipt_id` links
 * the outcome to the governance decision, completing the audit loop.
 *
 * The returned `receipt_chain_hash` cryptographically chains this receipt
 * to all prior receipts, enabling tamper detection.
 *
 * @param input - Validated input conforming to GenerateReceiptInputSchema
 * @returns Receipt record with chain hash, timestamp, and rollback availability
 */
export async function generateReceipt(
  input: GenerateReceiptInput
): Promise<GenerateReceiptResponse | DegradedResponse> {
  const response = await governanceClient.post<GenerateReceiptResponse>(
    "/v1/receipt",
    {
      validation_receipt_id: input.validation_receipt_id,
      outcome: input.outcome,
      output_hash: input.output_hash,
      duration_ms: input.duration_ms,
      metadata: input.metadata,
    }
  );

  return response;
}
