import type { Metadata } from "next";
import { LabsPage } from "@/features/labs";
import { siteConfig } from "@/config/site";

const { labs } = siteConfig;

export const metadata: Metadata = {
  title: labs.page.title,
  description: labs.page.description,
  alternates: { canonical: labs.href },
  openGraph: {
    title: labs.page.title,
    description: labs.page.description,
    url: labs.href,
  },
};

export default function Page() {
  return <LabsPage />;
}
