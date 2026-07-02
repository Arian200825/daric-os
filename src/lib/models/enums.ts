/**
 * Enumerations shared across Daric OS — the single source of truth for
 * statuses, industries, and form sources, with display labels and badge tones.
 */

export type Tone = "neutral" | "blue" | "amber" | "violet" | "green" | "red";

/* --------------------------------- Leads ------------------------------------ */

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "discovery",
  "proposal_sent",
  "negotiating",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_META: Record<LeadStatus, { label: string; tone: Tone }> = {
  new: { label: "New", tone: "blue" },
  contacted: { label: "Contacted", tone: "violet" },
  discovery: { label: "Discovery", tone: "amber" },
  proposal_sent: { label: "Proposal Sent", tone: "amber" },
  negotiating: { label: "Negotiating", tone: "amber" },
  won: { label: "Won", tone: "green" },
  lost: { label: "Lost", tone: "red" },
};

/* ------------------------------- Industries --------------------------------- */

export const INDUSTRIES = ["agency", "restaurant", "hotel", "medical"] as const;
export type Industry = (typeof INDUSTRIES)[number];

export const INDUSTRY_META: Record<Industry, { label: string }> = {
  agency: { label: "Agency" },
  restaurant: { label: "Restaurant" },
  hotel: { label: "Hotel" },
  medical: { label: "Dental / Medical" },
};

/* -------------------------------- Projects ---------------------------------- */

export const PROJECT_STATUSES = [
  "planning",
  "in_progress",
  "review",
  "launched",
  "on_hold",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; tone: Tone }> = {
  planning: { label: "Planning", tone: "blue" },
  in_progress: { label: "In Progress", tone: "amber" },
  review: { label: "In Review", tone: "violet" },
  launched: { label: "Launched", tone: "green" },
  on_hold: { label: "On Hold", tone: "neutral" },
};

/* -------------------------------- Proposals --------------------------------- */

export const PROPOSAL_STATUSES = ["draft", "sent", "accepted", "declined"] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

export const PROPOSAL_STATUS_META: Record<ProposalStatus, { label: string; tone: Tone }> = {
  draft: { label: "Draft", tone: "neutral" },
  sent: { label: "Sent", tone: "blue" },
  accepted: { label: "Accepted", tone: "green" },
  declined: { label: "Declined", tone: "red" },
};

/* ------------------------------- Form sources ------------------------------- */

/** Where an inbox message originated — one per public Daric site/template. */
export const FORM_SOURCES = ["agency", "restaurant", "hotel", "medical"] as const;
export type FormSource = (typeof FORM_SOURCES)[number];

export const FORM_SOURCE_META: Record<FormSource, { label: string; tone: Tone }> = {
  agency: { label: "Agency", tone: "neutral" },
  restaurant: { label: "Restaurant", tone: "amber" },
  hotel: { label: "Hotel", tone: "blue" },
  medical: { label: "Medical", tone: "green" },
};
