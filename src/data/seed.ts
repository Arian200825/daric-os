import type { Lead, Project, Proposal, InboxMessage } from "@/lib/models";

/**
 * Seed data — realistic placeholder records so Daric OS is fully usable before a
 * database is connected. Replace with Supabase queries in src/lib/db.ts to go live.
 * Dates are fixed ISO strings (no Date.now) so static builds stay deterministic.
 */

export const NOW = "2026-07-02";

const leads: Lead[] = [
  { id: "l1", company: "Lumière", industry: "restaurant", contact: "Élodie Marchand", email: "elodie@lumiere.example", phone: "+1 212 555 0190", website: "lumiere.example", country: "United States", status: "won", notes: "Signed for the Professional package. Kickoff next week.", value: 9950, createdAt: "2026-06-18" },
  { id: "l2", company: "Aurelia Resort & Spa", industry: "hotel", contact: "James Poole", email: "james@aurelia.example", phone: "+1 305 555 0180", website: "aurelia.example", country: "United States", status: "negotiating", notes: "Wants a custom booking integration — scoping the add-on.", value: 18500, createdAt: "2026-06-22" },
  { id: "l3", company: "Brightwell Dental", industry: "medical", contact: "Dr. Sarah Chen", email: "sarah@brightwell.example", phone: "+1 415 555 0147", website: "brightwell.example", country: "United States", status: "proposal_sent", notes: "Proposal PRO-0007 sent. Following up Thursday.", value: 5995, createdAt: "2026-06-25" },
  { id: "l4", company: "Cedar & Sage", industry: "restaurant", contact: "Ana Gutierrez", email: "ana@cedarsage.example", phone: "+1 503 555 0122", website: "", country: "United States", status: "contacted", notes: "Replied to intro email — booking a discovery call.", value: 2995, createdAt: "2026-06-28" },
  { id: "l5", company: "Harbor View Hotel", industry: "hotel", contact: "Tom Lindqvist", email: "tom@harborview.example", phone: "+46 8 555 0101", website: "harborview.example", country: "Sweden", status: "discovery", notes: "Discovery call done. Needs multi-language site.", value: 12000, createdAt: "2026-06-29" },
  { id: "l6", company: "Northside Diner", industry: "restaurant", contact: "Mike Rossi", email: "mike@northside.example", phone: "+1 312 555 0166", website: "", country: "United States", status: "new", notes: "Inbound from the restaurant demo. Small budget.", value: 1495, createdAt: "2026-07-01" },
  { id: "l7", company: "Smile Studio", industry: "medical", contact: "Dr. Priya Nair", email: "priya@smilestudio.example", phone: "+44 20 555 0173", website: "smilestudio.example", country: "United Kingdom", status: "new", notes: "Inbound from the medical demo. Wants booking + insurance.", value: 2995, createdAt: "2026-07-02" },
  { id: "l8", company: "Metro Physio", industry: "medical", contact: "Daniel Okafor", email: "daniel@metrophysio.example", phone: "+1 646 555 0119", website: "", country: "United States", status: "lost", notes: "Went with a cheaper template builder.", value: 0, createdAt: "2026-06-15" },
];

const projects: Project[] = [
  {
    id: "p1", name: "Lumière — Website", client: "Lumière", industry: "restaurant", progress: 100, deadline: "2026-06-30", status: "launched",
    tasks: [
      { id: "t1", title: "Design approved", done: true },
      { id: "t2", title: "Build & content", done: true },
      { id: "t3", title: "Launch", done: true },
    ],
  },
  {
    id: "p2", name: "Aurelia — Resort Site", client: "Aurelia Resort & Spa", industry: "hotel", progress: 65, deadline: "2026-07-24", status: "in_progress",
    tasks: [
      { id: "t4", title: "Design system", done: true },
      { id: "t5", title: "Room explorer build", done: true },
      { id: "t6", title: "Booking integration", done: false },
      { id: "t7", title: "Content load", done: false },
    ],
  },
  {
    id: "p3", name: "Brightwell — Clinic Site", client: "Brightwell Dental", industry: "medical", progress: 40, deadline: "2026-07-31", status: "in_progress",
    tasks: [
      { id: "t8", title: "Discovery & sitemap", done: true },
      { id: "t9", title: "Design", done: false },
      { id: "t10", title: "Appointment form", done: false },
    ],
  },
  {
    id: "p4", name: "Cedar & Sage — Website", client: "Cedar & Sage", industry: "restaurant", progress: 15, deadline: "2026-08-14", status: "planning",
    tasks: [
      { id: "t11", title: "Kickoff", done: true },
      { id: "t12", title: "Moodboard", done: false },
    ],
  },
];

const proposals: Proposal[] = [
  {
    id: "pr1", number: "PRO-0007", client: "Brightwell Dental", title: "Dental website + online booking", status: "sent", currency: "USD", createdAt: "2026-06-25",
    items: [
      { description: "Premium dental website (Professional)", quantity: 1, unitPrice: 2995 },
      { description: "Online appointment booking", quantity: 1, unitPrice: 1500 },
      { description: "Before/after gallery + reviews", quantity: 1, unitPrice: 1500 },
    ],
  },
  {
    id: "pr2", number: "PRO-0006", client: "Harbor View Hotel", title: "Multi-language resort website", status: "draft", currency: "USD", createdAt: "2026-06-29",
    items: [
      { description: "Hotel website (Premium)", quantity: 1, unitPrice: 5995 },
      { description: "Second language", quantity: 1, unitPrice: 1200 },
    ],
  },
  {
    id: "pr3", number: "PRO-0005", client: "Cedar & Sage", title: "Restaurant website", status: "accepted", currency: "USD", createdAt: "2026-06-20",
    items: [{ description: "Restaurant website (Professional)", quantity: 1, unitPrice: 2995 }],
  },
  {
    id: "pr4", number: "PRO-0004", client: "Metro Physio", title: "Physiotherapy clinic site", status: "declined", currency: "USD", createdAt: "2026-06-10",
    items: [{ description: "Clinic website (Starter)", quantity: 1, unitPrice: 1495 }],
  },
];

const inbox: InboxMessage[] = [
  { id: "m1", source: "medical", name: "Dr. Priya Nair", email: "priya@smilestudio.example", subject: "Website enquiry", message: "Hi — I run a dental practice in London and loved your medical demo. We'd like booking and insurance pages. Can we talk this week?", read: false, createdAt: "2026-07-02" },
  { id: "m2", source: "restaurant", name: "Mike Rossi", email: "mike@northside.example", subject: "Quote request", message: "Looking for a simple site for our diner. What's the cheapest option that still looks great?", read: false, createdAt: "2026-07-01" },
  { id: "m3", source: "hotel", name: "Tom Lindqvist", email: "tom@harborview.example", subject: "Multi-language site", message: "We need Swedish + English. Does the hotel template support that out of the box?", read: true, createdAt: "2026-06-29" },
  { id: "m4", source: "agency", name: "Rachel Adeyemi", email: "rachel@apexlaw.example", subject: "Law firm website", message: "Do you build for professional services too? We're a boutique law firm.", read: true, createdAt: "2026-06-28" },
  { id: "m5", source: "restaurant", name: "Ana Gutierrez", email: "ana@cedarsage.example", subject: "Discovery call", message: "Thanks for the reply — Tuesday at 2pm works for the call.", read: true, createdAt: "2026-06-28" },
  { id: "m6", source: "medical", name: "Daniel Okafor", email: "daniel@metrophysio.example", subject: "Pricing", message: "What's included in the Starter package for a physio clinic?", read: true, createdAt: "2026-06-15" },
];

export const seed = { leads, projects, proposals, inbox };
