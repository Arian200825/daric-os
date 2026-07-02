/**
 * Reusable business templates — the documents & checklists an agency needs to
 * accept, manage, and deliver work professionally. Typed and content-driven so
 * they can seed real proposals/invoices or be edited per client.
 */

export interface DocSection {
  heading: string;
  body: string;
}

export interface ProposalTemplateT {
  key: "proposal";
  title: string;
  description: string;
  intro: string;
  sections: DocSection[];
  defaultItems: { description: string; unitPrice: number }[];
  terms: string[];
}

export interface InvoiceTemplateT {
  key: "invoice";
  title: string;
  description: string;
  fields: string[];
  defaultItems: { description: string; unitPrice: number }[];
  terms: string[];
  notes: string;
}

export interface ChecklistTemplateT {
  key: "welcome" | "kickoff";
  title: string;
  description: string;
  items: string[];
}

export const PROPOSAL_TEMPLATE: ProposalTemplateT = {
  key: "proposal",
  title: "Website Proposal",
  description: "A clean, persuasive proposal structure for a new website engagement.",
  intro:
    "Thank you for considering Daric. This proposal outlines how we'll design and build a premium website for your business — the scope, timeline, and investment.",
  sections: [
    { heading: "Overview", body: "A short summary of your goals and how a new website moves the business forward." },
    { heading: "Scope of work", body: "Design, development, content integration, SEO, accessibility, and launch — tailored to the selected package." },
    { heading: "Timeline", body: "Typical delivery: Starter ~2 weeks, Professional ~4 weeks. Milestones agreed at kickoff." },
    { heading: "Investment", body: "See the itemized costs below. Projects are split 50% to start, 50% on launch." },
    { heading: "Next steps", body: "Approve this proposal, we send the agreement and welcome pack, and book your kickoff call." },
  ],
  defaultItems: [
    { description: "Premium website design (custom, no templates)", unitPrice: 1800 },
    { description: "Development, build & launch", unitPrice: 900 },
    { description: "Content integration & SEO setup", unitPrice: 500 },
  ],
  terms: [
    "50% deposit to begin, 50% on launch.",
    "Two rounds of revisions included per milestone.",
    "Client provides content and brand assets by the agreed date.",
    "Proposal valid for 30 days.",
  ],
};

export const INVOICE_TEMPLATE: InvoiceTemplateT = {
  key: "invoice",
  title: "Invoice",
  description: "A professional invoice layout, ready for any client and project.",
  fields: ["Bill to (client)", "Invoice number", "Issue date", "Due date", "Project reference"],
  defaultItems: [
    { description: "Website project — deposit (50%)", unitPrice: 1497 },
    { description: "Website project — balance on launch (50%)", unitPrice: 1498 },
  ],
  terms: [
    "Payment due within 14 days of the issue date.",
    "Accepted methods: bank transfer, card.",
    "Late payments may incur a 5% fee.",
  ],
  notes: "Thank you for your business. Please reference the invoice number with your payment.",
};

export const WELCOME_CHECKLIST: ChecklistTemplateT = {
  key: "welcome",
  title: "Client Welcome Checklist",
  description: "Onboard a new client smoothly the moment they say yes.",
  items: [
    "Send welcome email + signed agreement",
    "Collect deposit invoice payment",
    "Gather brand assets (logo, colors, fonts, photos)",
    "Set up shared drive & communication channel",
    "Send intake questionnaire",
    "Add client + project to Daric OS (CRM → Projects)",
    "Confirm billing details and schedule",
    "Book the kickoff call",
  ],
};

export const KICKOFF_CHECKLIST: ChecklistTemplateT = {
  key: "kickoff",
  title: "Project Kickoff Checklist",
  description: "Start every project aligned, so delivery stays on time.",
  items: [
    "Confirm scope, deliverables & package",
    "Agree timeline and milestones",
    "Collect all content, copy & images",
    "Confirm domain, hosting & DNS access",
    "Choose the industry template & visual direction",
    "Set up the staging environment",
    "Define success metrics (bookings, enquiries…)",
    "Schedule weekly check-ins",
  ],
};

export type BusinessTemplate = ProposalTemplateT | InvoiceTemplateT | ChecklistTemplateT;

export const BUSINESS_TEMPLATES: BusinessTemplate[] = [
  PROPOSAL_TEMPLATE,
  INVOICE_TEMPLATE,
  WELCOME_CHECKLIST,
  KICKOFF_CHECKLIST,
];
