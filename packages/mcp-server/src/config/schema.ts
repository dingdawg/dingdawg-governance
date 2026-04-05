import { z } from "zod";

/**
 * Zod schema for DingDawg Governance MCP server configuration.
 * Values are read from environment variables or a .governance.yaml file.
 */
export const GovernanceConfigSchema = z.object({
  /** API key for authenticating with the Governance API. Required. */
  api_key: z.string().min(1, "api_key is required"),

  /** Base URL of the Governance API. Defaults to production endpoint. */
  api_endpoint: z
    .string()
    .url()
    .default("https://governance.dingdawg.com"),

  /**
   * Governance enforcement level.
   * - strict: block on any policy violation
   * - standard: warn on violations, block only critical ones
   * - permissive: log violations, never block
   */
  governance_level: z
    .enum(["strict", "standard", "permissive"])
    .default("standard"),

  /**
   * When true, the client automatically captures a rollback snapshot
   * before every validated action.
   */
  auto_rollback_capture: z.boolean().default(true),

  /**
   * Controls how receipt data is surfaced to the caller.
   * - verbose: full receipt object with all fields
   * - minimal: receipt_id and status only
   * - silent: receipt stored server-side, nothing returned to caller
   */
  receipt_display: z
    .enum(["verbose", "minimal", "silent"])
    .default("verbose"),
});

export type GovernanceConfig = z.infer<typeof GovernanceConfigSchema>;
