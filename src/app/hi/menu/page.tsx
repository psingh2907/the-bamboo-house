import { MenuPage, menuMetadata } from "@/components/pages/MenuPage";

export const metadata = menuMetadata("hi");

export default function Page() {
  return <MenuPage locale="hi" />;
}
