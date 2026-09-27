import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { fontVariables } from "./fonts";
import "./globals.css";

// Unmatched URLs in either language land here (the site has two root
// layouts, so there is no single layout to build a 404 from).

export const metadata: Metadata = {
  title: "Page not found | The Bamboo House",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en-IN" className={`${fontVariables} antialiased`}>
      <body className="min-h-svh bg-smoke">
        <PageHero
          eyebrow="404"
          title={
            <>
              This table is <em className="text-bamboo">empty</em>.
            </>
          }
          intro="The page you were looking for isn't here. The food, happily, still is."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/">Back to home</Button>
            <Button href="/hi" variant="outline">
              हिंदी होम
            </Button>
            <Button href="/menu" variant="outline" icon="book">
              See the menu
            </Button>
          </div>
        </PageHero>
      </body>
    </html>
  );
}
