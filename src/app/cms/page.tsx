import type { Metadata } from "next";
import { CmsView } from "@/features/cms/CmsView";

export const metadata: Metadata = { title: "CMS" };

export default function Page() {
  return <CmsView />;
}
