#!/usr/bin/env node

/**
 * DingDawg Governance — PreToolUse Hook
 *
 * Intercepts every tool call that modifies state and validates it against
 * the governance server before execution. Read-only operations pass through
 * immediately.
 *
 * Offline policy (DINGDAWG_OFFLINE_POLICY env var):
 *   "block"  (default in production) — fail-closed: block if server unreachable
 *   "allow"  (default in development) — fail-open: allow with stderr warning
 *
 * Target overhead: < 50ms on the hot path.
 */

"use strict";

const GOVERNANCE_SERVER_URL =
  process.env.DINGDAWG_API_ENDPOINT ||
  process.env.DINGDAWG_GOVERNANCE_URL ||
  "https://governance.dingdawg.com";
const API_KEY = process.env.DINGDAWG_API_KEY || "";

// Offline policy: default to "block" in production, "allow" in development.
const _env = process.env.DINGDAWG_ENV || "development";
const _defaultOfflinePolicy = _env === "production" ? "block" : "allow";
const OFFLINE_POLICY =
  (process.env.DINGDAWG_OFFLINE_POLICY || _defaultOfflinePolicy).toLowerCase();

// Tools that only read state — no governance check required.
const READ_ONLY_TOOLS = new Set([
  "Read",
  "Glob",
  "Grep",
  "LS",
  "WebFetch",
  "WebSearch",
  "ListMcpResourcesTool",
  "ReadMcpResourceTool",
  "TaskGet",
  "TaskList",
  "CronList",
]);

/**
 * Returns true when the tool modifies files, runs commands, or sends
 * messages — anything that has external side-effects.
 */
function requiresGovernance(toolName) {
  return !READ_ONLY_TOOLS.has(toolName);
}

/**
 * POST to the governance server with a hard timeout.
 * Resolves to the parsed JSON body or null on any network/timeout error.
 */
async function callGovernance(endpoint, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40); // 40 ms budget

  try {
    const res = await fetch(`${GOVERNANCE_SERVER_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    // Network error, timeout, or server not running — graceful degradation.
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  let input = "";

  // Read the hook payload from stdin.
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  let hook;
  try {
    hook = JSON.parse(input);
  } catch {
    // Malformed input — allow and exit cleanly.
    process.exit(0);
  }

  const toolName = hook?.tool_name || hook?.tool || "";

  // Fast path: read-only tools skip governance entirely.
  if (!requiresGovernance(toolName)) {
    process.exit(0);
  }

  const result = await callGovernance("/v1/validate", {
    action: toolName,
    context: hook?.tool_input ?? hook?.input ?? {},
    session_id: hook?.session_id ?? null,
    timestamp: Date.now(),
  });

  // Server unreachable or returned null — apply offline policy.
  if (result === null) {
    if (OFFLINE_POLICY === "block") {
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: { decision: "block" },
          reason:
            "Governance server unreachable — action blocked for safety.",
        })
      );
      process.exit(2);
    } else {
      // "allow" — warn to stderr and proceed.
      process.stderr.write(
        "[DingDawg Governance] WARNING: governance server unreachable — " +
          "action allowed because DINGDAWG_OFFLINE_POLICY=allow\n"
      );
      process.exit(0);
    }
  }

  if (result.allowed === false) {
    // Server denied the action — block execution.
    const violations = (result.violations || []).map(v => v.rule || v).join(", ");
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: { decision: "block" },
        reason: violations || result.reason || "Action blocked by DingDawg Governance.",
      })
    );
    process.exit(2);
  }

  // Allowed — exit with no output so execution proceeds.
  process.exit(0);
}

main().catch(() => {
  // Unhandled error: apply offline policy for safety.
  if (OFFLINE_POLICY === "block") {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: { decision: "block" },
        reason:
          "Governance hook encountered an unhandled error — action blocked for safety.",
      })
    );
    process.exit(2);
  } else {
    process.stderr.write(
      "[DingDawg Governance] WARNING: hook unhandled error — " +
        "action allowed because DINGDAWG_OFFLINE_POLICY=allow\n"
    );
    process.exit(0);
  }
});
