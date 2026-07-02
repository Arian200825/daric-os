import type { Metadata } from "next";
import { InboxView } from "@/features/inbox/InboxView";

export const metadata: Metadata = { title: "Inbox" };

export default function Page() {
  return <InboxView />;
}
