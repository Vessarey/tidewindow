/**
 * Programmatic page rollout control (staged per the operating playbook:
 * 10–20 pages, verify indexing, then 50–100, then weekly batches).
 * The daily agent appends months as batches are approved — edit
 * published-months.json, the single source of truth shared with the data
 * pipeline (scripts/pipeline/run.mjs backfills window data to the earliest
 * month listed there so published month pages always render complete data).
 */
import PUBLISHED_MONTHS_JSON from "./published-months.json";

export const PUBLISHED_MONTHS: string[] = PUBLISHED_MONTHS_JSON;
