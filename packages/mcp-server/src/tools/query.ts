import { z } from "zod";
import { governanceClient, DegradedResponse } from "../api/client.js";

/** Input schema for the query_receipts tool. */
export const QueryReceiptsInputSchema = z.object({
  /** Maximum number of receipts to return. Defaults to 50, max 500. */
  limit: z.number().int().min(1).max(500).default(50),

  /**
   * Optional filter to return only receipts of a specific action type.
   * Matches the `action_type` field set during validate_action.
   * Omit to return all action types.
   */
  filter_type: z.string().optional(),

  /**
   * ISO 8601 datetime string. Only receipts generated at or after this
   * time will be returned. Omit to return the most recent receipts.
   */
  since: z.string().optional(),
});

export type QueryReceiptsInput = z.infer<typeof QueryReceiptsInputSchema>;

/** A single receipt entry as returned by the query endpoint. */
export interface ReceiptEntry {
  receipt_id: string;
  validation_receipt_id: string;
  action_type: string;
  resource: string;
  scope: string;
  outcome: "success" | "failure" | "partial";
  timestamp: string;
  duration_ms: number;
  receipt_chain_hash: string;
  rollback_available: boolean;
}

/** Response shape returned by the Governance API for receipt queries. */
export interface QueryReceiptsResponse {
  /** List of matching receipt records, newest first. */
  receipts: ReceiptEntry[];
  /** Total number of receipts matching the filter (may exceed `limit`). */
  total_count: number;
  /** Human-readable description of the time window covered by the results. */
  period: string;
}

/**
 * Queries the audit receipt history from the Governance API.
 *
 * Use this tool to review past governance decisions and their outcomes,
 * identify patterns in policy violations, or verify that an action was
 * properly receipted before referencing it in downstream tooling.
 *
 * Results are ordered newest-first. Use `limit` and `since` to paginate
 * through large receipt histories.
 *
 * @param input - Validated input conforming to QueryReceiptsInputSchema
 * @returns Paginated list of receipt records with total count and period description
 */
export async function queryReceipts(
  input: QueryReceiptsInput
): Promise<QueryReceiptsResponse | DegradedResponse> {
  const params: Record<string, string> = {
    limit: String(input.limit),
  };

  if (input.filter_type) {
    params["filter_type"] = input.filter_type;
  }
  if (input.since) {
    params["since"] = input.since;
  }

  const response = await governanceClient.get<QueryReceiptsResponse>(
    "/v1/receipts",
    params
  );

  return response;
}
