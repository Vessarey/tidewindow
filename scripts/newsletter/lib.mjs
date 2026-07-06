/**
 * Shared helpers for the newsletter scripts (sync-audience.mjs,
 * send-weekly.mjs). Zero dependencies, same conventions as gsc-query.mjs.
 *
 * Secrets (gitignored):
 *   docs-internal/posthog-api-key.txt  — line 1 personal API key, line 2 project id
 *   docs-internal/resend-api-key.txt   — line 1 API key
 */
import fs from "node:fs";
import path from "node:path";

export const ROOT = path.join(import.meta.dirname, "..", "..");

/** The one list we ever send to (BACKLOG P0). */
export const AUDIENCE_NAME = "Minus Tide Alert";
/** Verified sending identity (playbook section 1). */
export const FROM = "Tidewindow <alerts@updates.thetidewindow.com>";
/** updates.thetidewindow.com in Resend (id recorded in BACKLOG 2026-07-03). */
export const RESEND_DOMAIN_ID = "b06d98e7-4963-4e74-9cf3-7f73823194e2";

function secretLines(file) {
  const p = path.join(ROOT, "docs-internal", file);
  if (!fs.existsSync(p)) {
    throw new Error(`missing credential file ${p} (gitignored — see AGENT_PLAYBOOK.md section 1)`);
  }
  return fs
    .readFileSync(p, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function posthogCreds() {
  const [apiKey, projectId] = secretLines("posthog-api-key.txt");
  if (!apiKey || !projectId) throw new Error("posthog-api-key.txt must have the key on line 1 and project id on line 2");
  return { apiKey, projectId };
}

export function resendKey() {
  return secretLines("resend-api-key.txt")[0];
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Minimal Resend REST wrapper. Throws on any non-2xx. */
export async function resend(key, method, apiPath, body) {
  const res = await fetch(`https://api.resend.com${apiPath}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend ${method} ${apiPath} -> HTTP ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

/** Find the newsletter audience by name; returns null if it does not exist. */
export async function findAudience(key) {
  const list = await resend(key, "GET", "/audiences");
  const items = list?.data ?? [];
  return items.find((a) => a.name === AUDIENCE_NAME) ?? null;
}

/** All contacts in an audience (subscribed and unsubscribed). */
export async function listContacts(key, audienceId) {
  const list = await resend(key, "GET", `/audiences/${audienceId}/contacts`);
  return list?.data ?? [];
}

/** Run a HogQL query against the PostHog project; returns result rows. */
export async function hogql(query) {
  const { apiKey, projectId } = posthogCreds();
  const res = await fetch(`https://us.posthog.com/api/projects/${projectId}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`PostHog query -> HTTP ${res.status}: ${JSON.stringify(data)}`);
  return data.results ?? [];
}
