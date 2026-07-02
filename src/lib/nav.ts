import { LayoutDashboard, Users, FolderKanban, FileText, Inbox, Database, Settings, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Primary navigation — the feature areas of Daric OS. */
export const NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "CRM", href: "/crm", icon: Users },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Proposals", href: "/proposals", icon: FileText },
  { label: "Inbox", href: "/inbox", icon: Inbox },
  { label: "CMS", href: "/cms", icon: Database },
  { label: "Settings", href: "/settings", icon: Settings },
];
