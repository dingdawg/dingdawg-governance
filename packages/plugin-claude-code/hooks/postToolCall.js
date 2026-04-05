#!/usr/bin/env node

/**
 * DingDawg Governance — PostToolUse Hook
 *
 * After every governed tool call completes, this hook sends the result to
 * the governance server so a tamper-evident receipt can be generated and
 * stored. The receipt ID is printed as a subtle comment. If the governance
 * server is unreachable the hook exits silently — it never interrupts the
 * developer's flow.
 */

"use strict";

const GOVERNANCE_SERVER_URL =
  process.env.DINGDAWG_API_ENDPOINT ||
  process.env.DINGDAWG_GOVERNANCE_URL ||
  "https://governance.dingdawg.com";
const API_KEY = process.env.DINGDAWG_API_KEY || "";

// Mirror of the preToolCall read-only set — no receipts for read operations.
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
 * POST to the governance server. Resolves to parsed JSON or null on failure.
 * Hard timeout matches the preToolCall budget to keep total overhead low.
 */
async function callGovernance(endpoint, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40);

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
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  let input = "";

  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  let hook;
  try {
    hook = JSON.parse(input);
  } catch {
    process.exit(0);
  }

  const toolName = hook?.tool_name || hook?.tool || "";

  // Skip receipts for read-only operations.
  if (READ_ONLY_TOOLS.has(toolName)) {
    process.exit(0);
  }

  // Determine whether the tool call succeeded.
  const succeeded =
    hook?.error == null &&
    (hook?.exit_code === undefined || hook?.exit_code === 0);

  const result = await callGovernance("/v1/receipt", {
    tool: toolName,
    input: hook?.tool_input ?? hook?.input ?? {},
    output: hook?.tool_response ?? hook?.output ?? null,
    succeeded,
    session_id: hook?.session_id ?? null,
    timestamp: Date.now(),
  });

  // Server unreachable — silent exit.
  if (result === null) {
    process.exit(0);
  }

  if (result.receipt_id) {
    // Subtle one-liner so developers see the receipt without interruption.
    process.stderr.write(
      `# [DingDawg Governance] receipt: ${result.receipt_id}\n`
    );
  }

  process.exit(0);
}

main().catch(() => {
  process.exit(0);
});
