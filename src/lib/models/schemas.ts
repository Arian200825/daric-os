import { z } from "zod";
import {
  LEAD_STATUSES,
  PROJECT_STATUSES,
  PROPOSAL_STATUSES,
  INDUSTRIES,
  FORM_SOURCES,
} from "./enums";

/**
 * Zod schemas = the typed data model for Daric OS. Types are inferred from these
 * (single source of truth), and the same schemas validate form input and any
 * data coming from Supabase.
 */

const iso = z.string(); // ISO date string (kept as string for portability)

/* --------------------------------- Lead ------------------------------------- */

export const LeadSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  industry: z.enum(INDUSTRIES),
  contact: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  website: z.string().optional().default(""),
  country: z.string().optional().default(""),
  status: z.enum(LEAD_STATUSES),
  notes: z.string().optional().default(""),
  /** Estimated deal value (USD). */
  value: z.number().nonnegative().default(0),
  createdAt: iso,
});
export type Lead = z.infer<typeof LeadSchema>;

/** Input schema for creating a lead (server generates id/createdAt). */
export const NewLeadSchema = LeadSchema.omit({ id: true, createdAt: true }).extend({
  status: z.enum(LEAD_STATUSES).default("new"),
});
export type NewLead = z.infer<typeof NewLeadSchema>;

/* -------------------------------- Project ----------------------------------- */

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  done: z.boolean().default(false),
});
export type Task = z.infer<typeof TaskSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  client: z.string().min(1),
  industry: z.enum(INDUSTRIES),
  progress: z.number().min(0).max(100),
  deadline: iso,
  status: z.enum(PROJECT_STATUSES),
  tasks: z.array(TaskSchema).default([]),
});
export type Project = z.infer<typeof ProjectSchema>;

/* -------------------------------- Proposal ---------------------------------- */

export const LineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive().default(1),
  unitPrice: z.number().nonnegative(),
});
export type LineItem = z.infer<typeof LineItemSchema>;

export const ProposalSchema = z.object({
  id: z.string(),
  number: z.string(), // e.g. "PRO-0007"
  client: z.string().min(1),
  title: z.string().min(1),
  status: z.enum(PROPOSAL_STATUSES),
  currency: z.string().default("USD"),
  items: z.array(LineItemSchema).min(1),
  createdAt: iso,
});
export type Proposal = z.infer<typeof ProposalSchema>;

export const NewProposalSchema = ProposalSchema.omit({
  id: true,
  number: true,
  createdAt: true,
}).extend({ status: z.enum(PROPOSAL_STATUSES).default("draft") });
export type NewProposal = z.infer<typeof NewProposalSchema>;

/** Sum of line items — the basis for a future PDF export. */
export function proposalTotal(p: Pick<Proposal, "items">): number {
  return p.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
}

/* ------------------------------ Inbox message ------------------------------- */

export const InboxMessageSchema = z.object({
  id: z.string(),
  source: z.enum(FORM_SOURCES),
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional().default(""),
  message: z.string().min(1),
  read: z.boolean().default(false),
  createdAt: iso,
});
export type InboxMessage = z.infer<typeof InboxMessageSchema>;
