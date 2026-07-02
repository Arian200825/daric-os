import type { Metadata } from "next";
import { CrmView } from "@/features/crm/CrmView";

export const metadata: Metadata = { title: "CRM" };

export default function Page() {
  return <CrmView />;
}
