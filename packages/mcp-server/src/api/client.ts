/**
 * Thin HTTP client for the DingDawg Governance API.
 *
 * All governance decisioning, policy evaluation, and receipt chaining happen
 * server-side at governance.dingdawg.com. This module only handles request
 * plumbing (auth, base URL, error-to-DegradedResponse mapping) — no policy
 * logic lives here.
 *
 * Environment variables:
 *   DINGDAWG_API_KEY       — Bearer token for the Governance API
 *   DINGDAWG_API_ENDPOINT  — Override the API base URL (default: https://governance.dingdawg.com)
 */

const API_BASE = process.env["DINGDAWG_API_ENDPOINT"] || "https://governance.dingdawg.com";
const API_KEY = process.env["DINGDAWG_API_KEY"] || "";

/**
 * Returned in place of the expected response type when the Governance API
 * is unreachable or returns an error. Callers treat this as a fail-open
 * signal so local developer workflows are never blocked by an API outage.
 */
export interface DegradedResponse {
  degraded: true;
  reason: string;
  status?: number;
}

async function request<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  params?: Record<string, string>
): Promise<T | DegradedResponse> {
  try {
    let url = `${API_BASE}${path}`;
    if (params && Object.keys(params).length > 0) {
      url += `?${new URLSearchParams(params).toString()}`;
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        degraded: true,
        reason: `Governance API returned ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`,
        status: res.status,
      };
    }

    return (await res.json()) as T;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { degraded: true, reason: `Governance API request failed: ${message}` };
  }
}

export const governanceClient = {
  get: <T>(path: string, params?: Record<string, string>): Promise<T | DegradedResponse> =>
    request<T>("GET", path, undefined, params),
  post: <T>(path: string, body?: unknown): Promise<T | DegradedResponse> =>
    request<T>("POST", path, body),
};
