#!/usr/bin/env node
/**
 * DingDawg Governance MCP Server
 *
 * A thin-client MCP server that exposes governance tooling by delegating all
 * logic to the Governance API at governance.dingdawg.com. No governance
 * business logic lives in this package.
 *
 * Transports:
 *   - stdio  (default): suitable for Claude Desktop, Cursor, and other local MCP hosts
 *   - HTTP   (MCP_TRANSPORT=http): suitable for remote / hosted MCP integrations
 *
 * Environment variables:
 *   DINGDAWG_API_KEY       — API key for the Governance API (required for receipts)
 *   DINGDAWG_API_ENDPOINT  — Override the API base URL (default: https://governance.dingdawg.com)
 *   MCP_TRANSPORT          — "stdio" (default) or "http"
 *   MCP_HTTP_PORT          — Port for HTTP transport (default: 3456)
 *   MCP_HTTP_HOST          — Bind address for HTTP transport (default: 127.0.0.1)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { validateAction, ValidateActionInputSchema } from "./tools/validate.js";
import { generateReceipt, GenerateReceiptInputSchema } from "./tools/receipt.js";
import { captureRollbackState, CaptureRollbackStateInputSchema } from "./tools/rollback.js";
import { rollbackAction, RollbackActionInputSchema } from "./tools/rollback_action.js";
import { queryReceipts, QueryReceiptsInputSchema } from "./tools/query.js";
import { checkStatus, CheckStatusInputSchema } from "./tools/status.js";
import { generateAuditReport, GenerateAuditReportInputSchema } from "./tools/audit.js";

// ---------------------------------------------------------------------------
// Server instantiation
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "dingdawg-governance",
  version: "0.1.0",
});

// ---------------------------------------------------------------------------
// Tool: validate_action
// ---------------------------------------------------------------------------

server.tool(
  "validate_action",
  "Validate a proposed action against DingDawg Governance policies before executing it. " +
    "Returns an allowed/denied decision, a receipt_id for audit chaining, and any advisory warnings. " +
    "Always call this before consequential operations (file writes, API calls, database mutations).",
  {
    action_type: z
      .string()
      .min(1)
      .describe(
        'Category of the action (e.g. "file_write", "api_call", "database_delete")'
      ),
    resource: z
      .string()
      .min(1)
      .describe(
        "The resource the action targets (e.g. file path, table name, service URL)"
      ),
    scope: z
      .string()
      .min(1)
      .describe(
        'Execution environment (e.g. "production", "staging", "development")'
      ),
    metadata: z
      .record(z.unknown())
      .optional()
      .describe(
        "Optional key-value metadata for policy evaluation (caller identity, session ID, risk signals)"
      ),
  },
  async (input) => {
    const parsed = ValidateActionInputSchema.parse(input);
    const result = await validateAction(parsed);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: generate_receipt
// ---------------------------------------------------------------------------

server.tool(
  "generate_receipt",
  "Generate a tamper-evident audit receipt after an action completes. " +
    "Pass the validation_receipt_id from a prior validate_action call to close the audit loop. " +
    "The returned receipt_chain_hash cryptographically links this record to all prior receipts.",
  {
    validation_receipt_id: z
      .string()
      .min(1)
      .describe("The receipt_id returned by the preceding validate_action call"),
    outcome: z
      .enum(["success", "failure", "partial"])
      .describe("Outcome of the action"),
    output_hash: z
      .string()
      .default("")
      .describe("SHA-256 hex digest of the action output for tamper-evident chaining"),
    duration_ms: z
      .number()
      .int()
      .min(0)
      .default(0)
      .describe("Wall-clock duration of the action in milliseconds"),
    metadata: z
      .record(z.unknown())
      .optional()
      .describe("Optional metadata to attach to the receipt (error messages, output summaries)"),
  },
  async (input) => {
    const parsed = GenerateReceiptInputSchema.parse(input);
    const result = await generateReceipt(parsed);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: capture_rollback_state
// ---------------------------------------------------------------------------

server.tool(
  "capture_rollback_state",
  "Capture a point-in-time snapshot of a resource for rollback purposes. " +
    "Call this before any destructive or hard-to-reverse action. " +
    "The returned snapshot_id can be used to restore the resource to its pre-action state.",
  {
    resource: z
      .string()
      .min(1)
      .describe(
        "Resource identifier to snapshot (file path, table name, S3 key, API resource ID)"
      ),
    resource_type: z
      .string()
      .min(1)
      .describe(
        'Resource category for snapshot strategy selection (e.g. "file", "database_table", "api_resource")'
      ),
  },
  async (input) => {
    const parsed = CaptureRollbackStateInputSchema.parse(input);
    const result = await captureRollbackState(parsed);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: query_receipts
// ---------------------------------------------------------------------------

server.tool(
  "query_receipts",
  "Query the governance audit receipt history. " +
    "Filter by action type and time window to review past decisions, identify violation patterns, " +
    "or verify that an action was properly receipted.",
  {
    limit: z
      .number()
      .int()
      .min(1)
      .max(500)
      .default(50)
      .describe("Maximum number of receipts to return (default 50, max 500)"),
    filter_type: z
      .string()
      .optional()
      .describe(
        "Filter to receipts of a specific action_type; omit to return all types"
      ),
    since: z
      .string()
      .optional()
      .describe(
        "ISO 8601 datetime; only return receipts at or after this time"
      ),
  },
  async (input) => {
    const parsed = QueryReceiptsInputSchema.parse(input);
    const result = await queryReceipts(parsed);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: check_status
// ---------------------------------------------------------------------------

server.tool(
  "check_status",
  "Check the current governance account status and system health. " +
    "Returns plan details, usage against limits, receipt and rollback counts, " +
    "and overall API health. No input parameters required.",
  {},
  async (input) => {
    const parsed = CheckStatusInputSchema.parse(input);
    const result = await checkStatus(parsed);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: generate_audit_report
// ---------------------------------------------------------------------------

server.tool(
  "generate_audit_report",
  "Generate a governance audit report for a specified time period. " +
    "Produces compliance evidence for internal reviews, regulatory audits, or transparency reports. " +
    "Supports JSON, Markdown, and PDF (pre-signed URL) output formats.",
  {
    period_start: z
      .string()
      .min(1)
      .describe('ISO 8601 start of the audit period (e.g. "2026-01-01T00:00:00Z")'),
    period_end: z
      .string()
      .min(1)
      .describe('ISO 8601 end of the audit period (e.g. "2026-03-31T23:59:59Z")'),
    format: z
      .enum(["json", "markdown", "pdf_url"])
      .default("json")
      .describe(
        '"json" for structured data, "markdown" for human-readable text, "pdf_url" for a pre-signed download URL'
      ),
  },
  async (input) => {
    const parsed = GenerateAuditReportInputSchema.parse(input);
    const result = await generateAuditReport(parsed);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: rollback_action
// ---------------------------------------------------------------------------

server.tool(
  "rollback_action",
  "Restore a resource to its state prior to a governed action by supplying the action's receipt ID. " +
    "Locates the rollback snapshot associated with the receipt and reverts the resource to its captured state. " +
    "Returns a new rollback receipt that records the restore event. " +
    "Set execute=false for a dry-run that shows what would be restored without making any changes.",
  {
    receipt_id: z
      .string()
      .min(1)
      .describe(
        'Receipt ID of the action to roll back (e.g. "ddgr_01HXYZ9K3M2P7Q8R4T6V")'
      ),
    execute: z
      .boolean()
      .default(true)
      .describe(
        "Set to true (default) to execute the rollback immediately. Set to false for a dry-run preview."
      ),
  },
  async (input) => {
    const parsed = RollbackActionInputSchema.parse(input);
    const result = await rollbackAction(parsed);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Transport selection and startup
// ---------------------------------------------------------------------------

/**
 * Starts the MCP server using the transport configured via MCP_TRANSPORT.
 * Defaults to stdio if the variable is absent or set to "stdio".
 */
async function main(): Promise<void> {
  const transport = (process.env["MCP_TRANSPORT"] ?? "stdio").toLowerCase();

  if (transport === "http") {
    await startHttpTransport();
  } else {
    await startStdioTransport();
  }
}

/**
 * Starts the server using stdio transport.
 * Suitable for local MCP host integrations (Claude Desktop, Cursor, etc.).
 */
async function startStdioTransport(): Promise<void> {
  const stdioTransport = new StdioServerTransport();
  await server.connect(stdioTransport);

  // Log to stderr so it does not contaminate the stdio MCP stream.
  process.stderr.write(
    "[DingDawg Governance] MCP server started (stdio transport)\n"
  );

  // Keep the process alive until stdin closes (host disconnects).
  process.stdin.on("close", () => {
    process.stderr.write("[DingDawg Governance] stdin closed — shutting down\n");
    process.exit(0);
  });
}

/**
 * Starts the server using HTTP transport.
 *
 * The MCP SDK StreamableHTTP transport is used when available. Each POST
 * to the configured endpoint initiates an MCP session. SSE streaming is
 * supported for tools that return progressive results.
 *
 * Environment variables:
 *   MCP_HTTP_PORT  — Listen port (default: 3456)
 *   MCP_HTTP_HOST  — Bind address (default: 127.0.0.1)
 */
async function startHttpTransport(): Promise<void> {
  // Dynamic import so that stdio-only deployments do not pay the cost of
  // loading the HTTP transport dependencies.
  const { StreamableHTTPServerTransport } = await import(
    "@modelcontextprotocol/sdk/server/streamableHttp.js"
  );

  const http = await import("http");

  const port = parseInt(process.env["MCP_HTTP_PORT"] ?? "3456", 10);
  const host = process.env["MCP_HTTP_HOST"] ?? "127.0.0.1";

  // One transport instance per server (stateless sessions per MCP spec).
  const httpTransport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode
  });

  await server.connect(httpTransport);

  const httpServer = http.createServer((req, res) => {
    httpTransport.handleRequest(req, res).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      process.stderr.write(
        `[DingDawg Governance] HTTP request error: ${message}\n`
      );
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    });
  });

  httpServer.listen(port, host, () => {
    process.stderr.write(
      `[DingDawg Governance] MCP server started (HTTP transport) on http://${host}:${port}\n`
    );
  });

  // Graceful shutdown on SIGINT / SIGTERM.
  const shutdown = (): void => {
    process.stderr.write("[DingDawg Governance] Shutting down HTTP server...\n");
    httpServer.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`[DingDawg Governance] Fatal error: ${message}\n`);
  process.exit(1);
});
