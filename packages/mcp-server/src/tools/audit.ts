import { z } from "zod";
import { governanceClient, DegradedResponse } from "../api/client.js";

/** Input schema for the generate_audit_report tool. */
export const GenerateAuditReportInputSchema = z.object({
  /**
   * ISO 8601 start datetime for the audit period (inclusive).
   * Example: "2026-01-01T00:00:00Z"
   */
  period_start: z.string().min(1, "period_start is required"),

  /**
   * ISO 8601 end datetime for the audit period (inclusive).
   * Example: "2026-03-31T23:59:59Z"
   */
  period_end: z.string().min(1, "period_end is required"),

  /**
   * Output format for the report.
   * - "json": machine-readable structured data
   * - "markdown": human-readable formatted report
   * - "pdf_url": pre-signed URL to a PDF report (stored on governance servers)
   */
  format: z.enum(["json", "markdown", "pdf_url"]).default("json"),
});

export type GenerateAuditReportInput = z.infer<typeof GenerateAuditReportInputSchema>;

/** Response shape returned by the Governance API for audit report generation. */
export interface GenerateAuditReportResponse {
  /**
   * The audit report content. Format depends on the requested `format`:
   * - "json": stringified JSON object
   * - "markdown": Markdown-formatted report text
   * - "pdf_url": pre-signed HTTPS URL valid for 24 hours
   */
  report: string;
  /** Total number of receipts included in the audit period. */
  receipt_count: number;
  /** Number of policy violations detected during the period. */
  violations: number;
  /** Number of rollback operations executed during the period. */
  rollbacks_used: number;
}

/**
 * Generates a governance audit report for a specified time period.
 *
 * Use this tool to produce compliance evidence for internal reviews,
 * regulatory audits, or customer-facing transparency reports. The report
 * includes a full summary of actions taken, policy decisions, violations
 * flagged, and rollbacks executed within the requested period.
 *
 * For PDF output, the returned URL is pre-signed and expires after 24 hours.
 * Download and store it before sharing externally.
 *
 * @param input - Validated input conforming to GenerateAuditReportInputSchema
 * @returns Audit report in the requested format plus summary statistics
 */
export async function generateAuditReport(
  input: GenerateAuditReportInput
): Promise<GenerateAuditReportResponse | DegradedResponse> {
  const params: Record<string, string> = {
    period_start: input.period_start,
    period_end: input.period_end,
    format: input.format,
  };

  const response = await governanceClient.get<GenerateAuditReportResponse>(
    "/v1/audit",
    params
  );

  return response;
}
