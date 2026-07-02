import { seed } from "@/data/seed";
import type { Lead, Project, Proposal, InboxMessage } from "@/lib/models";

/**
 * Data-access layer — the ONLY place the app reads data from.
 *
 * Today it returns in-memory seed data, so Daric OS runs with zero setup. To go
 * live, implement each method against Supabase (client ready in ./supabase);
 * nothing else in the app changes because every feature imports from here.
 *
 *   async leads() {
 *     const sb = getSupabase();
 *     if (!sb) return seed.leads;
 *     const { data } = await sb.from("leads").select("*").order("created_at");
 *     return (data ?? []).map((r) => LeadSchema.parse(r));
 *   }
 */
export const db = {
  leads(): Lead[] {
    return seed.leads;
  },
  projects(): Project[] {
    return seed.projects;
  },
  proposals(): Proposal[] {
    return seed.proposals;
  },
  inbox(): InboxMessage[] {
    return seed.inbox;
  },
};
