import { ContactPage, contactMetadata } from "@/components/pages/ContactPage";

export const metadata = contactMetadata("hi");

export default function Page() {
  return <ContactPage locale="hi" />;
}
